"use client";

import {
  Box,
  Button,
  MenuItem,
  TextField,
  Paper,
  Typography,
  Divider,
  Stack,Grid
} from "@mui/material";
import CouponForm from "@/components/coupon/CouponForm";
import { useState } from "react";
import { useRouter } from "next/navigation";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import IconButton from "@mui/material/IconButton";
import { API_URL } from "@/lib/api";
export default function CreateCoupon() {
  const router = useRouter();

  const [form, setForm] = useState({
    code: "",
    description: "",
    discountType: "percentage",
    discountValue: "",
    minOrderAmount: "",
    maxDiscount: "",
    expiryDate: "",
    usageLimit: "",
  });
  const [loading,
    setLoading] =
    useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });

    // clear error on change
    setErrors((prev) => ({
      ...prev,
      [e.target.name]: "",
    }));
  };

  /* ================= VALIDATION ================= */
  const validate = () => {
    let temp = {};

    if (!form.code.trim()) temp.code = "Coupon code is required";

    if (!form.discountValue)
      temp.discountValue = "Discount value is required";

    if (form.discountValue && Number(form.discountValue) <= 0)
      temp.discountValue = "Must be greater than 0";

    if (
      form.discountType === "percentage" &&
      Number(form.discountValue) > 100
    )
      temp.discountValue = "Cannot exceed 100%";

    if (
      form.minOrderAmount &&
      Number(form.minOrderAmount) < 0
    )
      temp.minOrderAmount = "Invalid amount";

    if (
      form.maxDiscount &&
      Number(form.maxDiscount) <= 0
    )
      temp.maxDiscount = "Invalid max discount";

    if (!form.expiryDate)
      temp.expiryDate = "Expiry date is required";

    setErrors(temp);

    return Object.keys(temp).length === 0;
  };

  const handleSubmit = async () => {
     setLoading(true);
    if (!validate()) return;

    const token = localStorage.getItem("token");

    await fetch(`${API_URL}/coupons`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });

    router.push("/admin/coupons");
  };

  /* ================= LIVE PREVIEW ================= */
  const discountText =
    form.discountType === "percentage"
      ? `${form.discountValue || 0}% OFF`
      : `₹${form.discountValue || 0} OFF`;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f6f7fb",
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "1.2fr 0.8fr" },
        gap: 3,
        p: 3,
      }}
    >
      {/* ================= FORM ================= */}
<CouponForm
  form={form}
  setForm={setForm}
  onSubmit={handleSubmit}
  loading={loading}
  title="Create Coupon"
  subtitle="Add a new discount coupon"
  submitText="Create Coupon"
  router={router}
/>

      {/* ================= LIVE PREVIEW ================= */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 3,
          border: "1px solid #e5e7eb",
          bgcolor: "#0f172a",
          color: "#fff",
          position: "sticky",
          top: 20,
          height: "fit-content",
        }}
      >
        <Typography fontSize={12} sx={{ opacity: 0.7 }}>
          LIVE PREVIEW
        </Typography>

        <Box
          sx={{
            mt: 2,
            p: 2,
            borderRadius: 2,
            bgcolor: "#111827",
            border: "1px solid #1f2937",
          }}
        >
          <Typography fontSize={20} fontWeight={800}>
            {form.code || "COUPON CODE"}
          </Typography>

          <Typography sx={{ mt: 0.5, color: "#a78bfa", fontWeight: 600 }}>
            {discountText}
          </Typography>

          <Typography fontSize={12} sx={{ mt: 1, color: "#9ca3af" }}>
            {form.description || "No description added"}
          </Typography>

          <Stack spacing={0.5} mt={2}>
            <Typography fontSize={11} color="#9ca3af">
              Min Order: ₹{form.minOrderAmount || 0}
            </Typography>

            <Typography fontSize={11} color="#9ca3af">
              Max Discount: ₹{form.maxDiscount || "∞"}
            </Typography>

            <Typography fontSize={11} color="#9ca3af">
              Usage Limit: {form.usageLimit || "Unlimited"}
            </Typography>

            <Typography fontSize={11} color="#9ca3af">
              Expiry: {form.expiryDate || "Not set"}
            </Typography>
          </Stack>
        </Box>

        <Box
          sx={{
            mt: 2,
            p: 1.5,
            borderRadius: 2,
            bgcolor: "#49544d",
            textAlign: "center",
            fontWeight: 700,
            fontSize: 13,
          }}
          disabled
        >
          Ready for checkout (Dummy)
        </Box>
      </Paper>
    </Box>
  );
}