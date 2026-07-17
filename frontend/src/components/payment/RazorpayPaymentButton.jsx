"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import LoadingButton from "@mui/lab/LoadingButton";
import QrCode2Icon from "@mui/icons-material/QrCode2";
import { Typography } from "@mui/material";
import { API_URL } from "@/lib/api";

// Loads the Razorpay checkout.js script once and reuses it on repeat clicks.
let razorpayPromise;

function loadRazorpayScript() {
  if (window.Razorpay) {
    return Promise.resolve(true);
  }

  if (razorpayPromise) {
    return razorpayPromise;
  }

  razorpayPromise = new Promise((resolve) => {
    const script = document.createElement("script");

    script.src = "https://checkout.razorpay.com/v1/checkout.js";

    script.onload = () => {
      resolve(true);
    };

    script.onerror = () => {
      razorpayPromise = null;
      resolve(false);
    };

    document.body.appendChild(script);
  });

  return razorpayPromise;
}

// Drop this in on the checkout page in place of / alongside the COD button.
// `items`, `shippingAddress`, `coupon`, `discount` are exactly what you'd
// already be sending to the existing place-order endpoint.
export default function RazorpayPaymentButton({
  gatewayEnabled,
  items,
  shippingAddress,
  coupon,
  discount,
  onSuccess,
}) {
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handlePay = async () => {
    console.log("handlePay called");
    setLoading(true);
    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        toast.error("Unable to load payment gateway. Check your connection.");
        return;
      }

      const token = localStorage.getItem("token");

      // STEP 1 — ask our backend to create the Razorpay order + a Pending
      // order record in our own DB.
      const res = await fetch(`${API_URL}/payment/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ items, shippingAddress, coupon, discount }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || "Could not start payment");
        return;
      }

      const { orderId, razorpayOrderId, amount, currency, keyId } = data;

      // STEP 2 — open Razorpay's checkout restricted to UPI only.
      const options = {
        key: keyId,
        amount,
        currency,
        order_id: razorpayOrderId,
        name: "Veloura",
        description: "Order Payment",
        // Restrict the checkout to UPI only — no cards/netbanking/wallets
        // shown, since we're specifically testing the UPI flow first.
       method: {
  upi: true,
  card: true,
  netbanking: true,
  wallet: true,
},
        prefill: {
          name: shippingAddress?.fullName || "",
          contact: shippingAddress?.phone || "",
        },
        theme: { color: "#111111" },

        // Called automatically the instant Razorpay confirms success —
        // Razorpay's own modal already closes itself right before this
        // fires, so there's nothing extra to do on the UI side for that.
        handler: async function (response) {
          try {
            const verifyRes = await fetch(`${API_URL}/payment/verify`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                orderId,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyRes.json();

            if (!verifyRes.ok) {
              toast.error(verifyData.message || "Payment verification failed");
              router.push(`/profile/orders/${orderId}`);
              return;
            }

            toast.success("Payment successful!");
            window.dispatchEvent(new Event("cart-update"));

            if (onSuccess) {
              onSuccess(verifyData.order);
            } else {
              router.push(`/profile/orders/${orderId}`);
            }
          } catch (err) {
            toast.error(
              "Payment succeeded but verification failed — contact support with your order ID.",
            );
          }
        },

        // User closed the UPI screen without paying — mark it Failed so it
        // doesn't sit as a silent "Pending" forever.
        modal: {
          ondismiss: async function () {
            await fetch(`${API_URL}/payment/failed`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ orderId }),
            });
            toast.info("Payment cancelled");
          },
        },
      };

      const razorpayInstance = new window.Razorpay(options);

      razorpayInstance.on("payment.failed", async function (response) {
        toast.error(response.error?.description || "Payment failed");
        await fetch(`${API_URL}/payment/failed`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ orderId }),
        });
      });

      razorpayInstance.open();
    } catch (err) {
      toast.error("Something went wrong starting the payment");
    } finally {
      setLoading(false);
    }
  };
 if (gatewayEnabled === null) {
  return null;
}

if (!gatewayEnabled) {
  return (
    <Typography
      sx={{
        textAlign: "center",
        color: "text.secondary",
      }}
    >
      Online payment is currently unavailable.
    </Typography>
  );
}
  return (
    <LoadingButton
      loading={loading}
      variant="contained"
      fullWidth
      size="large"
      startIcon={<QrCode2Icon />}
      onClick={handlePay}
      sx={{
        bgcolor: "#111",
        textTransform: "none",
        fontWeight: 700,
        borderRadius: 2.5,
        py: 1.4,
        boxShadow: "none",
        "&:hover": { bgcolor: "#000", boxShadow: "none" },
      }}
    >
Pay Securely
    </LoadingButton>
  );
}
