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

export default function ForgotPasswordForm() {
  const router = useRouter();

  const [value, setValue] =
    useState("");

  const handleSubmit =
    async (e) => {
      e.preventDefault();

      const res =
        await fetch(
          `${API_URL}/auth/forgot-password`,
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
            }),
          }
        );

      const data =
        await res.json();

      alert(data.message);

      if (res.ok) {
        localStorage.setItem(
          "resetValue",
          value
        );

        router.push(
          "/forgot-password/verify"
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
          label="Email or Phone"
          value={value}
          onChange={(e) =>
            setValue(
              e.target.value
            )
          }
          required
        />

        <Button
          type="submit"
          variant="contained"
        >
          Send OTP
        </Button>
      </Stack>
    </Box>
  );
}