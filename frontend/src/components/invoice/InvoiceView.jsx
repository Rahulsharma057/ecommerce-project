"use client";

import { Box, Typography, Paper } from "@mui/material";

export default function InvoiceView({ order }) {
  if (!order) return null;

  return (
    <Paper sx={{ p: 4 }}>
      <Typography variant="h5" fontWeight={700}>
        INVOICE
      </Typography>

      <Typography mt={2}>
        Order ID: {order._id}
      </Typography>

      <Typography>
        Status: {order.status}
      </Typography>

      <Typography>
        Payment: {order.paymentMethod}
      </Typography>

      <Typography mt={2}>
        Name: {order.shippingAddress?.fullName}
      </Typography>

      <Typography>
        Phone: {order.shippingAddress?.phone}
      </Typography>

      <Typography mt={2} fontWeight={600}>
        Total: ₹{order.totalAmount}
      </Typography>
    </Paper>
  );
}