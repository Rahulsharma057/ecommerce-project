"use client";

import { useState } from "react";
import {
  Box,
  Stack,
  TextField,
  Button,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { API_URL } from "@/lib/api";

export default function VerifyOtpForm() {
  const router =
    useRouter();

  const [otp, setOtp] =
    useState("");

  const handleSubmit =
    async (e) => {
      e.preventDefault();

      const value =
        localStorage.getItem(
          "resetValue"
        );

      const res =
        await fetch(
          `${API_URL}/auth/verify-otp`,
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              email:
                value.includes("@")
                  ? value
                  : "",
              phone:
                !value.includes("@")
                  ? value
                  : "",
              otp,
            }),
          }
        );

      const data =
        await res.json();

      alert(data.message);

      if (res.ok) {
        localStorage.setItem(
          "resetOtp",
          otp
        );

        router.push(
          "/forgot-password/reset"
        );
      }
    };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
    >
      <Stack spacing={3}>
        <TextField
          label="OTP"
          value={otp}
          onChange={(e) =>
            setOtp(
              e.target.value
            )
          }
          required
        />

        <Button
          type="submit"
          variant="contained"
        >
          Verify OTP
        </Button>
      </Stack>
    </Box>
  );
}