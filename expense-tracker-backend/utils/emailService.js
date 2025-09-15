const nodemailer = require("nodemailer");

class AlternativeEmailService  {

    constructor() {
        this.services  = [
            // 1. SendGrid (Most reliable on Render)
            {
                name: "SendGrid",
                host: "smtp.sendgrid.net",
                port: 587,
                secure: false,
                auth: {
                    user: "apikey", // Always "apikey" for SendGrid
                    pass: process.env.SENDGRID_API_KEY, // Your SendGrid API key
                },
                tls: { rejectUnauthorized: false }
            },
            {
                name: "Gmail",
                host: "smtp.gmail.com",
                port: 465,
                secure: true,
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASSWORD,
                }
            },
        ];
    }


    // Tries each config until one works
    async sendEmail(mailOptions , maxRetries = 2) {
        let lastError;
        const startTime = Date.now();

        console.log(`🚀 Starting email send process...`);

        for(let attempt = 0; attempt < maxRetries && attempt < this.services.length; attempt++) {
            const config = this.services[attempt];
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

                const endTime = Date.now();
                console.log(`✅ Email sent successfully via ${config.name} in ${endTime - startTime}ms`);
                console.log(`📧 Message ID: ${info.messageId}`);
                
                // Close the transporter to free resources
                transporter.close();
                
                return {
                    success: true,
                    messageId: info.messageId,
                    service: config.name,
                    attempt: attempt + 1,
                    duration: endTime - startTime
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
            from: `"Expense Tracker" <${this.getFromEmail()}>`,
            to: email,
            subject: "Your OTP Code - Expense Tracker",
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <h1 style="color: #2c3e50; margin: 0;">Expense Tracker</h1>
                    </div>
                    
                    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; color: white; text-align: center; margin-bottom: 20px;">
                        <h2 style="margin: 0 0 10px 0;">Hi ${userName}! 👋</h2>
                        <p style="margin: 0; opacity: 0.9;">Your verification code is ready</p>
                    </div>

                    <div style="background-color: #f8f9fa; padding: 30px; text-align: center; border-radius: 10px; margin: 20px 0;">
                        <p style="margin: 0 0 15px 0; color: #666; font-size: 16px;">Your OTP Code:</p>
                        <div style="font-size: 36px; font-weight: bold; color: #2c3e50; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                            ${otp}
                        </div>
                        <p style="margin: 15px 0 0 0; color: #e74c3c; font-weight: bold;">⏰ Expires in 5 minutes</p>
                    </div>

                    <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 8px; margin: 20px 0;">
                        <p style="margin: 0; color: #856404;">
                            🔒 <strong>Security Note:</strong> Never share this code with anyone. We'll never ask for it over phone or email.
                        </p>
                    </div>

                    <div style="text-align: center; color: #6c757d; font-size: 14px; margin-top: 30px;">
                        <p>If you didn't request this code, please ignore this email.</p>
                        <p style="margin: 0;">© 2025 Expense Tracker. All rights reserved.</p>
                    </div>
                </div>
            `,
            text: `Hi ${userName}!\n\nYour OTP for Expense Tracker is: ${otp}\n\nThis code expires in 5 minutes.\n\nIf you didn't request this, please ignore this email.\n\n© 2025 Expense Tracker`,
        };

        return await this.sendEmail(mailOptions);
    }


    getFromEmail() {
        if (process.env.SENDGRID_FROM_EMAIL) return process.env.SENDGRID_FROM_EMAIL;
        if (process.env.OUTLOOK_EMAIL) return process.env.OUTLOOK_EMAIL;
        if (process.env.YAHOO_EMAIL) return process.env.YAHOO_EMAIL;
        return process.env.EMAIL_USER || 'noreply@example.com';
    }


    async sendPasswordReset(email , userName , resetToken) {
        const resetUrl = `https://expense-tracker-frontend-71kl.onrender.com/#/reset-password?token=${resetToken}`;

        const mailOptions = {
            from: `"Expense Tracker" <${this.getFromEmail()}>`,
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
module.exports = new AlternativeEmailService();