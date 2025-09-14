const nodemailer = require("nodemailer");

class RenderEmailService {

    constructor() {
        this.configurations = [
            // Configuration 1: Gmail service with extended timeouts
            {
                name: "Gmail Service",
                service: "gmail",
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASSWORD,
                },
            },
            // Configuration 2: SMTP with port 587 (TLS)
            {
                name: "SMTP Port 587",
                host: "smtp.gmail.com",
                port: 587,
                secure: false,
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASSWORD,
                },
                requireTLS: true,
            },
            // Configuration 3: SMTP with port 465 (SSL)
            {
                name: "SMTP Port 465",
                host: "smtp.gmail.com",
                port: 465,
                secure: true,
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASSWORD,
                },
            },
            // Configuration 4: Alternative with different settings
            {
                name: "Gmail Alt Config",
                host: "smtp.gmail.com",
                port: 25,
                secure: false,
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASSWORD,
                },
                requireTLS: true,
            }
        ];
    }


    // Tries each config until one works
    async sendEmail(mailOptions , maxRetries = 4) {
        let lastError;

        for(let attempt = 0; attempt < maxRetries && attempt < this.configurations.length; attempt++) {
            const config = this.configurations[attempt];
            console.log(`🔄 Attempting email send with ${config.name} (Attempt ${attempt + 1}/${maxRetries})`);

            try {
                const transporter = nodemailer.createTransport(config);

                 // Test the connection first
                console.log(`🔍 Verifying connection for ${config.name}...`);
                await Promise.race([
                    transporter.verify(),
                    new Promise((_ , reject) => 
                        setTimeout(() => reject(new Error("Verification Timeout")) , 30000)    //after 30 sec
                    )
                ]);

                console.log(`✅ Connection verified for ${config.name}`);

                // Send the email
                console.log(`📧 Sending email via ${config.name}...`);
                const info = await Promise.race([
                    transporter.sendMail(mailOptions),
                    new Promise((_ , reject) => 
                        setTimeout(() => reject(new Error("Send Timeout")) , 60000)    //after 60 sec
                    )
                ]);

                console.log(`✅ Email sent successfully via ${config.name}:`, info.messageId);
                
                // Close the transporter to free resources
                transporter.close();
                
                return {
                    success: true,
                    messageId: info.messageId,
                    configUsed: config.name,
                    attempt: attempt + 1
                };
            } catch (error) {
                console.error(`❌ ${config.name} failed:`, error.message);
                lastError = error;

                // If it's not a connection timeout, don't try other configs
                if (error.code !== 'ETIMEDOUT' && 
                    error.code !== 'ECONNECTION' && 
                    error.code !== 'ENOTFOUND' &&
                    !error.message.includes('timeout')) {
                    console.log(`🚫 Non-connection error, stopping retries: ${error.message}`);
                    break;
                }

                // Wait a bit before trying the next configuration
                if (attempt < maxRetries - 1) {
                    console.log(`⏳ Waiting 2 seconds before next attempt...`);
                    await new Promise(resolve => setTimeout(resolve, 2000));
                }
            }
        }

        console.error(`❌ All email configurations failed. Last error:`, lastError);
        throw new Error(`Email sending failed after ${maxRetries} attempts. Last error: ${lastError.message}`);
    }


    async sendOTP(email , otp , userName) {
        const mailOptions = {
            from: `"Expense Tracker" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Your OTP Code - Expense Tracker",
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <p>Hi ${userName},</p>
                    <h2 style="color: #333;">Your OTP Code</h2>
                    <p>Your OTP for Expense Tracker is:</p>
                    <div style="background-color: #f5f5f5; padding: 20px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 3px; margin: 20px 0;">
                        ${otp}
                    </div>
                    <p><strong>This OTP expires in 5 minutes.</strong></p>
                    <p>If you didn't request this OTP, please ignore this email.</p>
                </div>
            `,
            text: `Hi ${userName},\nYour OTP is ${otp}. It expires in 5 minutes.`,
        };

        return await this.sendEmail(mailOptions);
    }



    async sendPasswordReset(email , userName , resetToken) {
        const resetUrl = `https://expense-tracker-frontend-71kl.onrender.com/#/reset-password?token=${resetToken}`;

        const mailOptions = {
            from: `"Expense Tracker" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Reset your Expense Tracker password",
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #333;">Password Reset Request</h2>
                    <p>Hi ${userName},</p>
                    <p>We received a request to reset your Expense Tracker password.</p>
                    <p>Click the button below to reset it. This link is valid for <strong>15 minutes</strong>.</p>
                    <div style="margin: 20px 0; text-align: center;">
                        <a href="${resetUrl}"
                           style="background-color: #4CAF50; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                            Reset Password
                        </a>
                    </div>
                    <p>If you didn't request this, you can safely ignore this email.</p>
                    <p style="color: #888; font-size: 12px;">This link will expire in 15 minutes.</p>
                </div>
            `,
            text: `Hi ${userName},\nClick the link below to reset your password. This link is valid for 15 minutes:\n${resetUrl}\nIf you didn't request this, you can ignore this email.`,
        };

        return await this.sendEmail(mailOptions);
    }
}



// Export singleton instance
module.exports = new RenderEmailService();