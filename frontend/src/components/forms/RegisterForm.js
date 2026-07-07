"use client";

import { useState } from "react";
import {
  Box,
  Stack,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Paper,
  CircularProgress,
  InputAdornment,
  Divider,
} from "@mui/material";

import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PhoneAndroidOutlinedIcon from "@mui/icons-material/PhoneAndroidOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

import { useRouter } from "next/navigation";
import { API_URL } from "@/lib/api";

export default function RegisterForm() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [otp, setOtp] = useState("");
  const [openOtp, setOpenOtp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const registerUser = async () => {
    if (!form.name || !form.email || !form.phone || !form.password) {
      return alert("Please fill all fields");
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      alert(data.message);

      if (res.ok) {
        setOpenOtp(true);
      }
    } catch (err) {
      alert("Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    try {
      setOtpLoading(true);

      const res = await fetch(`${API_URL}/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          otp,
        }),
      });

      const data = await res.json();
      alert(data.message);

      if (res.ok) {
        setOpenOtp(false);
        router.push("/login");
      }
    } catch (err) {
      alert("OTP verification failed");
    } finally {
      setOtpLoading(false);
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
          width: 460,
          maxWidth: "100%",
          p: 5,
          borderRadius: 5,
          backdropFilter: "blur(10px)",
        }}
      >
        {/* BRAND HEADER */}
        <Box textAlign="center" mb={3}>
          <Typography
            variant="h4"
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
            Create your premium fashion account
          </Typography>
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Stack spacing={2.5}>
          <TextField
            label="Full Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonOutlineIcon />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            label="Email Address"
            name="email"
            value={form.email}
            onChange={handleChange}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailOutlinedIcon />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            label="Phone Number"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PhoneAndroidOutlinedIcon />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            label="Password"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockOutlinedIcon />
                </InputAdornment>
              ),
            }}
          />

          <Button
            variant="contained"
            size="large"
            onClick={registerUser}
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
              "Create Account"
            )}
          </Button>

          <Typography
            textAlign="center"
            color="text.secondary"
            fontSize={14}
          >
            Already have an account?{" "}
            <span
              style={{
                fontWeight: 700,
                cursor: "pointer",
                color:"blue"
              }}
              onClick={() => router.push("/login")}
            >
              Sign in
            </span>
          </Typography>
        </Stack>
      </Paper>

      {/* OTP DIALOG */}
      <Dialog
        open={openOtp}
        onClose={() => setOpenOtp(false)}
        PaperProps={{
          sx: {
            borderRadius: 4,
            p: 2,
            width: 420,
          },
        }}
      >
        <DialogTitle textAlign="center" fontWeight={700}>
          Verify Your Email
        </DialogTitle>

        <DialogContent>
          <Typography
            textAlign="center"
            color="text.secondary"
            mb={2}
          >
            Enter the OTP sent to <b>{form.email}</b>
          </Typography>

          <TextField
            label="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            fullWidth
            inputProps={{
              style: {
                textAlign: "center",
                letterSpacing: 8,
                fontSize: 20,
                fontWeight: 700,
              },
              maxLength: 6,
            }}
          />
        </DialogContent>

        <DialogActions sx={{ px: 5, pb: 2 }}>
          <Button onClick={() => setOpenOtp(false)}>
            Cancel
          </Button>

          <Button
            onClick={verifyOtp}
            variant="contained"
            disabled={otpLoading}
            sx={{bgcolor:"black"}}
            fullWidth
          >
            {otpLoading ? (
              <CircularProgress size={16} color="inherit" />
            ) : (
              "Verify Account"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}