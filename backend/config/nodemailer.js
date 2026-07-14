const nodemailer = require("nodemailer");
console.log("SMTP USER:", process.env.SMTP_USER);
console.log("SMTP PASS:", process.env.SMTP_PASS?.slice(0,10));
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

transporter.verify((err, success) => {
  console.log(err || success);
});