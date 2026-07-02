"use client";

import { API_URL } from "@/lib/api";
import { Button } from "@mui/material";

export default function DownloadInvoiceButton({ orderId }) {
  const handleDownload = async () => {
    const res = await fetch(
      `${API_URL}/invoice/download/${orderId}`
    );

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `invoice-${orderId}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  return (
    <Button variant="contained" onClick={handleDownload}>
      Download Invoice
    </Button>
  );
}