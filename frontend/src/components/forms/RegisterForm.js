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
} from "@mui/material";
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

  // SEND OTP
  const sendOtp = async () => {
    if (!form.name || !form.email || !form.phone || !form.password) {
      return alert("Please fill all fields");
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          phone: form.phone,
        }),
      });

      const data = await res.json();
      alert(data.message);

      if (res.ok) setOpenOtp(true);
    } catch (err) {
      alert("Error sending OTP");
    } finally {
      setLoading(false);
    }
  };

  const registerUser = async () => {
  if (!form.name || !form.email || !form.phone || !form.password) {
    return alert("Please fill all fields");
  }

  //setLoading(true);

  try {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    alert(data.message);

    if (res.ok) {
      setOpenOtp(true); // OTP dialog open
    }
  } catch (err) {
    alert("Registration failed");
  }
};
  // VERIFY OTP
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
        bgcolor: "#f5f7fb",
        p: 2,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          width: 420,
          p: 4,
          borderRadius: 3,
        }}
      >
        <Typography variant="h5" fontWeight={600} mb={3} textAlign="center">
          Create Account
        </Typography>

        <Stack spacing={2.5}>
          <TextField
            label="Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            fullWidth
          />

          <TextField
            label="Email"
            name="email"
            value={form.email}
            onChange={handleChange}
            fullWidth
          />

          <TextField
            label="Phone"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            fullWidth
          />

          <TextField
            label="Password"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            fullWidth
          />
<Button
  variant="contained"
  onClick={registerUser}
  disabled={loading}
>
  {loading ? <CircularProgress size={22} /> : "Register"}
</Button>
      {/*     <Button
            variant="contained"
            onClick={sendOtp}
            disabled={loading}
            sx={{
              py: 1.2,
              fontWeight: 600,
              borderRadius: 2,
              textTransform: "none",
            }}
          >
            {loading ? <CircularProgress size={22} /> : "Send OTP"}
          </Button> */}
        </Stack>
      </Paper>

      {/* OTP DIALOG */}
      <Dialog open={openOtp} onClose={() => setOpenOtp(false)}>
        <DialogTitle>Verify OTP</DialogTitle>

        <DialogContent>
          <Typography variant="body2" mb={2}>
            OTP sent to <b>{form.email}</b>
          </Typography>

          <TextField
            label="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            fullWidth
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenOtp(false)}>Cancel</Button>

          <Button
            onClick={verifyOtp}
            variant="contained"
            disabled={otpLoading}
          >
            {otpLoading ? (
              <CircularProgress size={20} />
            ) : (
              "Verify"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}