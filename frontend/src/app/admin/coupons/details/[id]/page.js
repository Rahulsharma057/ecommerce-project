"use client";

import {
  Box,
  Paper,
  Typography,
  Stack,
} from "@mui/material";
import {
  useEffect,
  useState,
} from "react";
import { useParams }
  from "next/navigation";
import { API_URL } from "@/lib/api";

export default function CouponDetails() {
  const { id } =
    useParams();

  const [coupon,
    setCoupon] =
    useState(null);

  useEffect(() => {
    fetchCoupon();
  }, []);

  const fetchCoupon =
    async () => {
      const token =
        localStorage.getItem(
          "token"
        );

      const res =
        await fetch(
          `${API_URL}/coupons/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

      const data =
        await res.json();

      setCoupon(data);
    };

  if (!coupon)
    return null;

  return (
    <Box p={3}>
      <Paper sx={{ p: 3 }}>
        <Stack spacing={2}>
          <Typography>
            Code:
            {coupon.code}
          </Typography>

          <Typography>
            Type:
            {
              coupon.discountType
            }
          </Typography>

          <Typography>
            Value:
            {
              coupon.discountValue
            }
          </Typography>

          <Typography>
            Min Order:
            ₹
            {
              coupon.minOrderAmount
            }
          </Typography>

          <Typography>
            Max Discount:
            ₹
            {
              coupon.maxDiscount
            }
          </Typography>

          <Typography>
            Usage:
            {
              coupon.usedCount
            }
            /
            {
              coupon.usageLimit
            }
          </Typography>

          <Typography>
            Status:
            {coupon.isActive
              ? "Active"
              : "Inactive"}
          </Typography>
        </Stack>
      </Paper>
    </Box>
  );
}