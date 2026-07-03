// import nodemailer from 'nodemailer';

// const sendEmail = async (options) => {
//   const transporter = nodemailer.createTransport({
//     host: process.env.BREVO_SMTP_HOST,
//     port: 465,
//     secure: true,
//     auth: {
//       user: process.env.BREVO_SMTP_USER,
//       pass: process.env.BREVO_SMTP_PASS,
//     },
//   });

//   const mailOptions = {
//     from: `"TechMart Support" <${process.env.BREVO_FROM_EMAIL}>`,
//     to: options.email,
//     subject: options.subject,
//     html:
//       options.html ||
//       `
//       <div style="font-family:Segoe UI,sans-serif">
//         <h2>Verify Your Account</h2>
//         <p>Your OTP is:</p>
//         <h1>${options.otp}</h1>
//         <p>This OTP is valid for 10 minutes.</p>
//       </div>
//       `,
//   };

//   try {
//     await transporter.verify();
//     console.log("SMTP Connected Successfully");

//     const info = await transporter.sendMail(mailOptions);

//     console.log("Email Sent");
//     console.log(info);

//     return info;
//   } catch (err) {
//     console.error("SMTP ERROR");
//     console.error(err);
//     throw err;
//   }
// };

// export default sendEmail;

import axios from "axios";

const sendEmail = async ({ email, subject, otp }) => {
  await axios.post(
    "https://api.brevo.com/v3/smtp/email",
    {
      sender: {
        name: "TechMart Support",
        email: process.env.BREVO_FROM_EMAIL,
      },
      to: [
        {
          email,
        },
      ],
      subject,
      htmlContent: `
        <h2>Verify Your Account</h2>
        <p>Your OTP is:</p>
        <h1>${otp}</h1>
        <p>This OTP expires in 10 minutes.</p>
      `,
    },
    {
      headers: {
        accept: "application/json",
        "api-key": process.env.BREVO_API_KEY,
        "content-type": "application/json",
      },
    }
  );

  console.log(" OTP email sent successfully");
};

export default sendEmail;