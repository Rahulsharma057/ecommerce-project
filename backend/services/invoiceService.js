const fs = require("fs");
const path = require("path");

const Order = require("../models/Order");
const User = require("../models/User");
const generateInvoiceNumber = require("../utils/invoiceNumber");
const invoiceTemplate = require("../templates/invoiceTemplate");
const generatePDF = require("../utils/pdfGenerator");
const { sendInvoiceEmail } = require("./emailService");

const createInvoice = async (orderId) => {
  let order = await Order.findById(orderId);

  if (!order) throw new Error("Order not found");

  // 👉 generate only once
  if (!order.invoiceNumber) {
    order.invoiceNumber = generateInvoiceNumber();
    order.invoiceDate = new Date();

    await order.save();
  }

  const fileName = `invoice-${order.invoiceNumber}.pdf`;
  const filePath = path.join(__dirname, "../invoices", fileName);

  const html = invoiceTemplate(order);

  await generatePDF(html, filePath);

  return { order, filePath };
};

module.exports = {
  createInvoice,
};