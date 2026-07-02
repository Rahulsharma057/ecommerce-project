"use client";

import { useEffect, useState } from "react";
import { Box, Typography, Paper } from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import CouponForm from "@/components/coupon/CouponForm";

export default function EditCoupon() {
  const { id } = useParams();

  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    code: "",
    description: "",
    discountType: "percentage",
    discountValue: "",
    minOrderAmount: "",
    maxDiscount: "",
    usageLimit: "",
    expiryDate: "",
  });

  useEffect(() => {
    fetchCoupon();
  }, []);

  const fetchCoupon = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API_URL}/coupons/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    setForm({
      ...data,
      expiryDate: data.expiryDate?.split("T")[0],
    });
  };

  const handleUpdate = async () => {
    setLoading(true);

    const token = localStorage.getItem("token");

    await fetch(`${API_URL}/coupons/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });

    router.push("/admin/coupons");
  };

  return (
    <Paper sx={{ p: 2, bgcolor: "transparent" }}>
      <Box>
        <CouponForm
          form={form}
          setForm={setForm}
          onSubmit={handleUpdate}
          loading={loading}
          title="Edit Coupon"
          subtitle="Update coupon details"
          submitText="Update Coupon"
          router={router}
        />
      </Box>
    </Paper>
  );
}
