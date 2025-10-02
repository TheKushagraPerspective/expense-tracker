const nodemailer = require("nodemailer");
const sgMail = require("@sendgrid/mail")

class AlternativeEmailService  {

    constructor() {

        // Set up SendGrid API
        if(process.env.SENDGRID_API_KEY) {
            sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        }

    }


    
    async sendEmail(mailOptions) {
        let lastError;
        const startTime = Date.now();

        console.log(`🚀 Starting email send process...`);

        if(process.env.SENDGRID_API_KEY) {
            console.log(`🔄 Attempting email send with SendGrid API`);

            try {
                console.log(`📧 Sending email via SendGrid API`);
                const result = await sgMail.send(mailOptions);

                const endTime = Date.now();
                console.log(`✅ Email sent successfully via SendGrid API in ${endTime - startTime}ms`);

                return {
                    success: true,
                    messageId: result[0].headers['x-message-id'] || 'sendgrid-api',
                    service: "SendGrid API",
                    attempt: 1,
                    duration: endTime - startTime
                }

            } catch (error) {
                console.error(`❌ SendGrid API failed:`, error.message);
                lastError = error;
                
                // If it's an auth error, don't try SMTP
                if (error.code === 401 || error.code === 403) {
                    throw new Error(`SendGrid authentication failed: ${error.message}`);
                }
            }
        }


        console.error(`❌ All email configurations failed. Last error:`);
        throw new Error(`Email sending failed after 1 attempt.`);
    }


    async sendOTP(email , otp , userName) {
        const mailOptions = {
            from: `"Expense Tracker" <${process.env.SENDGRID_FROM_EMAIL}>`,
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




    async sendPasswordReset(email , userName , resetToken) {
        const resetUrl = `${process.env.VITE_BASE_URL}/#/reset-password?token=${resetToken}`;

        const mailOptions = {
            from: `"Expense Tracker" <${process.env.SENDGRID_FROM_EMAIL}>`,
            to: email,
            subject: "Reset your Expense Tracker password",
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #333; margin-bottom: 20px;">Password Reset Request</h2>
                <p style="margin-bottom: 15px;">Hi ${userName},</p>
                <p style="margin-bottom: 15px;">We received a request to reset your Expense Tracker password.</p>
                <p style="margin-bottom: 20px;">Click the button below to reset it. This link is valid for <strong>15 minutes</strong>.</p>
                
                <!-- Button with better compatibility -->
                <div style="margin: 30px 0; text-align: center;">
                    <table role="presentation" style="margin: 0 auto;">
                        <tr>
                            <td style="background-color: #4CAF50; border-radius: 5px; padding: 0;">
                                <a href="${resetUrl}" 
                                   target="_blank"
                                   style="display: inline-block; background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px; line-height: 1.2;">
                                    Reset Password
                                </a>
                            </td>
                        </tr>
                    </table>
                </div>
                
                <!-- Fallback link -->
                <p style="margin: 20px 0; font-size: 14px; color: #666;">
                    If the button doesn't work, copy and paste this link into your browser:
                </p>
                <p style="word-break: break-all; background-color: #f5f5f5; padding: 10px; border-radius: 3px; font-family: monospace; font-size: 12px;">
                    <a href="${resetUrl}" target="_blank" style="color: #4CAF50; text-decoration: underline;">
                        ${resetUrl}
                    </a>
                </p>
                
                <p style="margin-top: 30px;">If you didn't request this, you can safely ignore this email.</p>
                <p style="color: #888; font-size: 12px; margin-top: 20px;">This link will expire in 15 minutes for security reasons.</p>
            </div>
            `,
            text: `Hi ${userName},
                    We received a request to reset your Expense Tracker password.
                    Click the link below to reset your password (valid for 15 minutes):
                    ${resetUrl}
                    If you didn't request this, you can safely ignore this email.
                    This link will expire in 15 minutes for security reasons.`,
        };

        return await this.sendEmail(mailOptions);
    }
}



// Export singleton instance
module.exports = new AlternativeEmailService();