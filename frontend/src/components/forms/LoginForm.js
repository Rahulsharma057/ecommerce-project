"use client";

import { useState } from "react";
import {
  Box,
  Stack,
  TextField,
  Button,
  Typography,
  InputAdornment,
  Paper,
  Divider,
} from "@mui/material";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import LoginRoundedIcon from "@mui/icons-material/LoginRounded";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { API_URL } from "@/lib/api";

export default function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        window.dispatchEvent(new Event("userChanged"));
        toast.success("Login Successful");

        setTimeout(() => {
          router.push(data.user.role === "admin" ? "/admin/products" : "/");
        }, 800);
      } else {
        toast.error(data.message || "Login failed");
      }
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper
      elevation={10}
      sx={{
        maxWidth: 470,
        mx: "auto",
        p: 5,
        borderRadius: 5,
        bgcolor: "background.paper",
      }}
    >
      <Stack spacing={3}>
        <Box textAlign="center">
          <Typography variant="h4" fontWeight={800} letterSpacing={2}>
            VELOURA
          </Typography>

          <Typography color="text.secondary" sx={{ mt: 1 }}>
            Welcome back to your premium fashion destination.
          </Typography>
        </Box>

        <Divider />

        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <TextField
              fullWidth
              label="Email Address"
              name="email"
              value={form.email}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailOutlinedIcon />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              type="password"
              label="Password"
              name="password"
              value={form.password}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlinedIcon />
                  </InputAdornment>
                ),
              }}
            />

            <Box textAlign="right">
              <Typography
                component={Link}
                href="/forgot-password"
                sx={{
                  textDecoration: "none",
                  color: "text.secondary",
                  fontWeight: 600,
                  "&:hover": {
                    color: "primary.main",
                  },
                }}
              >
                Forgot Password?
              </Typography>
            </Box>

            <Button
              type="submit"
              size="large"
              variant="contained"
              startIcon={<LoginRoundedIcon />}
              sx={{
                py: 1.6,
                borderRadius: 3,
                fontWeight: 700,
                textTransform: "none",
                fontSize: 16,
                bgcolor: "black",
              }}
            >
              {loading ? "Signing In..." : "Sign In"}
            </Button>

            <Typography textAlign="center" color="text.secondary">
              New to Veloura?{" "}
              <Typography
                component={Link}
                href="/register"
                sx={{
                  textDecoration: "none",
                  fontWeight: 700,
                  color: "primary.main",
                }}
              >
                Create Account
              </Typography>
            </Typography>
          </Stack>
        </Box>
      </Stack>
    </Paper>
  );
}
