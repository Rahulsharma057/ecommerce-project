const express = require("express");
const router = express.Router();

const {
  generateInvoice,
  downloadInvoice,viewInvoice,sendInvoiceEmailAPI
} = require("../controllers/invoiceController");

router.post("/generate/:orderId", generateInvoice);

router.get("/download/:orderId", downloadInvoice);

router.get("/view/:orderId", viewInvoice);

router.post("/email/:orderId", sendInvoiceEmailAPI);
module.exports = router;