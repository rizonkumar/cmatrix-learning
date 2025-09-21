import nodemailer from "nodemailer";

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || "smtp.gmail.com",
      port: process.env.EMAIL_PORT || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  // Send password reset email
  async sendPasswordResetEmail(email, resetToken) {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    const mailOptions = {
      from: {
        name: "C-Matrix Learning",
        address: process.env.EMAIL_USER,
      },
      to: email,
      subject: "Password Reset Request - C-Matrix Learning",
      html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Reset Your Password</title>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
                        .container { background: #f9f9f9; padding: 30px; border-radius: 10px; }
                        .header { text-align: center; margin-bottom: 30px; }
                        .logo { font-size: 24px; font-weight: bold; color: #3B82F6; }
                        .content { margin-bottom: 30px; }
                        .button { display: inline-block; background: #3B82F6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; }
                        .footer { text-align: center; font-size: 12px; color: #666; margin-top: 30px; }
                        .warning { background: #fff3cd; border: 1px solid #ffeeba; color: #856404; padding: 15px; border-radius: 5px; margin: 20px 0; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <div class="logo">C-Matrix Learning</div>
                            <h2>Reset Your Password</h2>
                        </div>

                        <div class="content">
                            <p>Hello,</p>
                            <p>We received a request to reset your password for your C-Matrix Learning account. Click the button below to reset your password:</p>

                            <div style="text-align: center; margin: 30px 0;">
                                <a href="${resetUrl}" class="button">Reset Password</a>
                            </div>

                            <p>If the button doesn't work, you can also copy and paste this link into your browser:</p>
                            <p><a href="${resetUrl}">${resetUrl}</a></p>

                            <div class="warning">
                                <strong>Important:</strong> This password reset link will expire in 15 minutes for security reasons. If you didn't request this reset, please ignore this email.
                            </div>

                            <p>If you have any questions or need help, feel free to contact our support team.</p>

                            <p>Best regards,<br>The C-Matrix Learning Team</p>
                        </div>

                        <div class="footer">
                            <p>This email was sent to you because a password reset was requested for your account.</p>
                            <p>© 2024 C-Matrix Learning. All rights reserved.</p>
                        </div>
                    </div>
                </body>
                </html>
            `,
      text: `
                C-Matrix Learning - Password Reset

                Hello,

                We received a request to reset your password for your C-Matrix Learning account.

                To reset your password, please visit: ${resetUrl}

                This password reset link will expire in 15 minutes for security reasons.

                If you didn't request this reset, please ignore this email.

                Best regards,
                The C-Matrix Learning Team
            `,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error("Error sending password reset email:", error);
      throw new Error("Failed to send password reset email");
    }
  }

  // Send welcome email
  async sendWelcomeEmail(email, username, fullName) {
    const mailOptions = {
      from: {
        name: "C-Matrix Learning",
        address: process.env.EMAIL_USER,
      },
      to: email,
      subject: "Welcome to C-Matrix Learning! 🎉",
      html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Welcome to C-Matrix Learning</title>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
                        .container { background: #f9f9f9; padding: 30px; border-radius: 10px; }
                        .header { text-align: center; margin-bottom: 30px; }
                        .logo { font-size: 24px; font-weight: bold; color: #3B82F6; }
                        .content { margin-bottom: 30px; }
                        .features { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; }
                        .feature { margin: 10px 0; }
                        .button { display: inline-block; background: #3B82F6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; }
                        .footer { text-align: center; font-size: 12px; color: #666; margin-top: 30px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <div class="logo">C-Matrix Learning</div>
                            <h2>Welcome aboard, ${fullName}! 🎉</h2>
                        </div>

                        <div class="content">
                            <p>Hello ${fullName},</p>
                            <p>Welcome to C-Matrix Learning! We're excited to have you join our community of learners.</p>

                            <p>Your account has been successfully created with the username: <strong>${username}</strong></p>

                            <div class="features">
                                <h3>🚀 What you can do:</h3>
                                <div class="feature">📚 Browse and enroll in courses</div>
                                <div class="feature">🔥 Track your learning streaks</div>
                                <div class="feature">✅ Manage your tasks with our TODO feature</div>
                                <div class="feature">📋 Organize your studies with Kanban boards</div>
                                <div class="feature">👤 Customize your profile and avatar</div>
                            </div>

                            <div style="text-align: center; margin: 30px 0;">
                                <a href="${process.env.FRONTEND_URL}/dashboard" class="button">Start Learning</a>
                            </div>

                            <p>If you have any questions or need help getting started, don't hesitate to reach out to our support team.</p>

                            <p>Happy learning! 📖✨</p>

                            <p>Best regards,<br>The C-Matrix Learning Team</p>
                        </div>

                        <div class="footer">
                            <p>© 2024 C-Matrix Learning. All rights reserved.</p>
                        </div>
                    </div>
                </body>
                </html>
            `,
      text: `
                Welcome to C-Matrix Learning!

                Hello ${fullName},

                Welcome to C-Matrix Learning! We're excited to have you join our community of learners.

                Your account has been successfully created with the username: ${username}

                Start your learning journey: ${process.env.FRONTEND_URL}/dashboard

                Happy learning!

                Best regards,
                The C-Matrix Learning Team
            `,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error("Error sending welcome email:", error);
      throw new Error("Failed to send welcome email");
    }
  }

  // Test email connection
  async testConnection() {
    try {
      await this.transporter.verify();
      return { success: true, message: "Email service connected" };
    } catch (error) {
      console.error("Email service connection failed:", error);
      return { success: false, error: error.message };
    }
  }
}

export const emailService = new EmailService();
