const fs = require("fs");
const transporter = require("../config/email");
const company = require("../config/company");

const User = require("../models/User");

const sendInvoiceEmail = async (order, filePath) => {
  const user = await User.findById(order.userId); // 👈 FIX

  if (!user || !user.email) {
    throw new Error("User email not found");
  }

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: user.email,   // 👈 FIXED
    subject: "Your Invoice",
    text: "Please find attached invoice",
    attachments: [
      {
        filename: `invoice-${order.invoiceNumber}.pdf`,
        path: filePath,
      },
    ],
  });
};

module.exports = {
  sendInvoiceEmail,
};