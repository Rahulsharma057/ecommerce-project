const generateInvoiceNumber = () => {
  const date = new Date();
  const random = Math.floor(1000 + Math.random() * 9000);

  const invoiceNo =
    "INV" +
    date.getFullYear() +
    (date.getMonth() + 1) +
    date.getDate() +
    random;

  return invoiceNo;
};

module.exports = generateInvoiceNumber;