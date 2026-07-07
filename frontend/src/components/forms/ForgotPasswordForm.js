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

import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";

import { useRouter } from "next/navigation";
import { API_URL } from "@/lib/api";

export default function ForgotPasswordForm() {
  const router = useRouter();

  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: value.includes("@") ? value : "",
          phone: !value.includes("@") ? value : "",
        }),
      });

      const data = await res.json();
      alert(data.message);

      if (res.ok) {
        localStorage.setItem("resetValue", value);
        router.push("/forgot-password/verify");
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
            Recover your account securely
          </Typography>
        </Box>

        <Stack spacing={3}>
          <TextField
            label="Email or Phone"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AlternateEmailIcon />
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
              "Send OTP"
            )}
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}