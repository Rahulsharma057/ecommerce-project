const company = require("../config/company");

const invoiceTemplate = (order) => {
  return `
  <html>
  <head>
    <style>
      body { font-family: Arial; padding: 20px; }
      .header { text-align: center; }
      .box { margin-bottom: 20px; }
      table { width: 100%; border-collapse: collapse; }
      table, th, td { border: 1px solid #ddd; }
      th, td { padding: 8px; text-align: left; }
      .total { font-size: 18px; font-weight: bold; }
    </style>
  </head>

  <body>

    <div class="header">
      <h2>${company.name}</h2>
      <p>${company.address}</p>
      <p>${company.phone} | ${company.email}</p>
      <hr/>
    </div>

    <div class="box">
      <h3>Invoice: ${order.invoiceNumber}</h3>
      <p>Order ID: ${order._id}</p>
      <p>Date: ${new Date(order.createdAt).toLocaleDateString()}</p>
    </div>

    <div class="box">
      <h4>Customer Details</h4>
      <p>${order.shippingAddress.fullName}</p>
      <p>${order.shippingAddress.phone}</p>
      <p>${order.shippingAddress.city}, ${order.shippingAddress.state}</p>
    </div>

    <table>
      <thead>
        <tr>
          <th>Product</th>
          <th>Qty</th>
          <th>Price</th>
          <th>Total</th>
        </tr>
      </thead>

      <tbody>
        ${order.items
          .map(
            (item) => `
          <tr>
            <td>${item.name}</td>
            <td>${item.quantity}</td>
            <td>₹${item.price}</td>
            <td>₹${item.price * item.quantity}</td>
          </tr>
        `
          )
          .join("")}
      </tbody>
    </table>

    <h3 class="total">Grand Total: ₹${order.totalAmount}</h3>

  </body>
  </html>
  `;
};

module.exports = invoiceTemplate;