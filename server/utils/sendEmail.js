import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
  // Create transporter using SMTP credentials from environment
  const transporter = nodemailer.createTransport({
    host: process.env.BREVO_SMTP_HOST || 'smtp-relay.brevo.com',
    port: parseInt(process.env.BREVO_SMTP_PORT || '587', 10),
    secure: (process.env.BREVO_SMTP_PORT === '465'), // true for 465 (SSL), false for other ports (TLS)
    auth: {
      user: process.env.BREVO_SMTP_USER || 'a1cf09001@smtp-brevo.com',
      pass: process.env.BREVO_SMTP_PASS,
    },
  });

  const mailOptions = {
    from: `"TechMart Support" <${process.env.BREVO_FROM_EMAIL || 'a1cf09001@smtp-brevo.com'}>`,
    to: options.email,
    subject: options.subject,
    html: options.html || `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff; color: #1e293b;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h1 style="color: #4f46e5; margin: 0; font-size: 28px; font-weight: 800;">TechMart</h1>
          <p style="color: #64748b; font-size: 14px; margin-top: 4px;">Construct Your Ultimate Workspace</p>
        </div>
        
        <div style="padding: 10px 0; border-top: 1px solid #f1f5f9; border-bottom: 1px solid #f1f5f9;">
          <h2 style="font-size: 20px; font-weight: 700; margin-top: 0; color: #0f172a;">Verify Your Account</h2>
          <p style="line-height: 1.6; font-size: 15px; color: #334155;">
            Thank you for registering an account on TechMart! To verify your email address, please use the following 6-digit one-time password (OTP):
          </p>
          
          <div style="background-color: #f8fafc; border: 2px dashed #cbd5e1; border-radius: 12px; padding: 20px; text-align: center; margin: 24px 0;">
            <span style="font-family: monospace; font-size: 36px; font-weight: 900; letter-spacing: 6px; color: #4f46e5;">${options.otp}</span>
          </div>
          
          <p style="font-size: 13px; color: #64748b; line-height: 1.6;">
            This OTP is confidential and valid for <strong>10 minutes</strong>. If you did not request this email, you can safely ignore it.
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 24px; font-size: 12px; color: #94a3b8;">
          &copy; ${new Date().getFullYear()} TechMart Inc. All rights reserved.
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

export default sendEmail;
