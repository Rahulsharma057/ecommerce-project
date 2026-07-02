const path = require("path");
const fs = require("fs");
const Order = require("../models/Order");
const { createInvoice } = require("../services/invoiceService");

const { sendInvoiceEmail } = require("../services/emailService");

exports.generateInvoice = async (req, res) => {
  try {
    const { orderId } = req.params;

    const result = await createInvoice(orderId);

    await sendInvoiceEmail(result.order, result.filePath);

    res.json({
      success: true,
      message: "Invoice generated & sent",
      invoiceNumber: result.order.invoiceNumber,
    });
    console.log("🚀 GENERATE INVOICE HIT");
    console.log("PARAM ORDER ID:", req.params.orderId);
  } catch (err) {
    console.error("INVOICE ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

exports.downloadInvoice = async (req, res) => {
  const order = await Order.findById(req.params.orderId);

  if (!order || !order.invoiceNumber) {
    return res.status(400).json({
      message: "Invoice not generated yet. Please generate first (email/generate API)"
    });
  }

  const filePath = path.join(
    __dirname,
    "../invoices",
    `invoice-${order.invoiceNumber}.pdf`
  );

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: "PDF not found" });
  }

  res.download(filePath);
};

exports.viewInvoice = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });
if (!order.invoiceNumber) {
  const result = await createInvoice(orderId);
  order = result.order;
}
    const fileName = `invoice-${order.invoiceNumber}.pdf`;
    const filePath = path.join(__dirname, "../invoices", fileName);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "inline");

    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.sendInvoiceEmailAPI = async (req, res) => {
  try {
    const { orderId } = req.params;

    console.log("EMAIL API HIT:", orderId);

    const result = await createInvoice(orderId);

    console.log("Invoice ready:", result.filePath);

    await sendInvoiceEmail(result.order, result.filePath);

    res.json({ message: "Email sent successfully" });

  } catch (err) {
    console.error("EMAIL ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};