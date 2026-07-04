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