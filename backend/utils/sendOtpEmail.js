const transporter = require("../config/nodemailer");

const sendOtpEmail = async (email, otp) => {
 await transporter.sendMail({
  from: `"VELOURA" <${process.env.EMAIL_USER}>`, // yahan Gmail address rakh sakte ho display ke liye
  to: email,
  subject: "Your OTP Code",
  text: `Your OTP is ${otp}`,
});
};

module.exports = sendOtpEmail;