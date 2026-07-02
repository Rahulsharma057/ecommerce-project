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

export default function ResetPasswordForm() {
  const router =
    useRouter();

  const [password,
    setPassword] =
    useState("");

  const handleSubmit =
    async (e) => {
      e.preventDefault();

      const value =
        localStorage.getItem(
          "resetValue"
        );

      const otp =
        localStorage.getItem(
          "resetOtp"
        );

      const res =
        await fetch(
          `${API_URL}/auth/reset-password`,
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
              password,
            }),
          }
        );

      const data =
        await res.json();

      alert(data.message);

      if (res.ok) {
        localStorage.removeItem(
          "resetValue"
        );
        localStorage.removeItem(
          "resetOtp"
        );

        router.push(
          "/login"
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
          label="New Password"
          type="password"
          value={password}
          onChange={(e) =>
            setPassword(
              e.target.value
            )
          }
          required
        />

        <Button
          type="submit"
          variant="contained"
        >
          Reset Password
        </Button>
      </Stack>
    </Box>
  );
}