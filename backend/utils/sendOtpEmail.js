const transporter = require("../config/nodemailer");

const sendOtpEmail = async (email, otp) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP is ${otp}`,
  });
};

module.exports = sendOtpEmail;