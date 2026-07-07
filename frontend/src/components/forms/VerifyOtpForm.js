"use client";

import { useState } from "react";
import {
  Box,
  Stack,
  TextField,
  Button,
  Typography,
  Paper,
  CircularProgress,
} from "@mui/material";

import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";

import { useRouter } from "next/navigation";
import { API_URL } from "@/lib/api";

export default function VerifyOtpForm() {
  const router = useRouter();

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const value = localStorage.getItem("resetValue");

    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/auth/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: value.includes("@") ? value : "",
          phone: !value.includes("@") ? value : "",
          otp,
        }),
      });

      const data = await res.json();
      alert(data.message);

      if (res.ok) {
        localStorage.setItem("resetOtp", otp);
        router.push("/forgot-password/reset");
      }
    } catch (err) {
      alert("OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "linear-gradient(135deg, #f7f7f7 0%, #e9e9e9 100%)",
        p: 2,
      }}
    >
      <Paper
        elevation={12}
        sx={{
          width: 420,
          maxWidth: "100%",
          p: 5,
          borderRadius: 5,
        }}
      >
        {/* BRAND HEADER */}
        <Box textAlign="center" mb={3}>
          <Typography
            variant="h3"
            fontWeight={800}
            letterSpacing={4}
          >
            VELOURA
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            mt={1}
          >
            Verify your identity securely
          </Typography>
        </Box>

        <Stack spacing={3}>
          <TextField
            label="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            fullWidth
            inputProps={{
              style: {
                textAlign: "center",
                letterSpacing: 10,
                fontSize: 22,
                fontWeight: 700,
              },
              maxLength: 6,
            }}
          />

          <Button
            type="submit"
            variant="contained"
            size="large"
            onClick={handleSubmit}
            disabled={loading}
            startIcon={<VerifiedUserIcon />}
            sx={{
              py: 1.5,
              borderRadius: 3,
              fontWeight: 700,
              textTransform: "none",
              fontSize: 16,
              bgcolor:"black"
            }}
          >
            {loading ? (
              <CircularProgress size={22} color="inherit" />
            ) : (
              "Verify OTP"
            )}
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}