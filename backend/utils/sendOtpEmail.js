const transporter = require("../config/email");

const sendOtpEmail = async (email, otp) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your OTP Code",
    html: `
      <div style="font-family: Arial">
        <h2>OTP Verification</h2>
        <p>Your OTP is:</p>
        <h1 style="color:#2b6cb0">${otp}</h1>
        <p>This OTP is valid for 5 minutes.</p>
      </div>
    `,
  });
};

module.exports = sendOtpEmail;