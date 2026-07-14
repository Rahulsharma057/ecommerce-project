const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "142.250.4.108",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    servername: "smtp.gmail.com",
  },
});

transporter.verify((err) => {
  if (err) {
    console.log("SMTP ERROR", err);
  } else {
    console.log("SMTP READY");
  }
});

module.exports = transporter;