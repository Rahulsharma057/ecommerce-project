"use client";

import { useState } from "react";
import {
  Box,
  Stack,
  TextField,
  Button,
  Typography,
  Paper,
  InputAdornment,
  CircularProgress,
} from "@mui/material";

import LockResetIcon from "@mui/icons-material/LockReset";

import { useRouter } from "next/navigation";
import { API_URL } from "@/lib/api";

export default function ResetPasswordForm() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const value = localStorage.getItem("resetValue");
    const otp = localStorage.getItem("resetOtp");

    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: value.includes("@") ? value : "",
          phone: !value.includes("@") ? value : "",
          otp,
          password,
        }),
      });

      const data = await res.json();
      alert(data.message);

      if (res.ok) {
        localStorage.removeItem("resetValue");
        localStorage.removeItem("resetOtp");
        router.push("/login");
      }
    } catch (err) {
      alert("Something went wrong");
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
          "linear-gradient(135deg, #f6f6f6 0%, #e9e9e9 100%)",
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
            Set your new secure password
          </Typography>
        </Box>

        <Stack spacing={3}>
          <TextField
            label="New Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockResetIcon />
                </InputAdornment>
              ),
            }}
          />

          <Button
            type="submit"
            variant="contained"
            size="large"
            onClick={handleSubmit}
            disabled={loading}
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
              "Reset Password"
            )}
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}