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
import { toast } from "react-toastify";
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
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    otp: "",
  });

  const validate = () => {
    const newErrors = {};

    // Name
    if (!form.name.trim()) {
      newErrors.name = "Full name is required";
    } else if (form.name.trim().length < 3) {
      newErrors.name = "Name must be at least 3 characters";
    }

    // Email
    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(form.email)) {
      newErrors.email = "Enter a valid email address";
    }

    // Phone
    if (!form.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[6-9]\d{9}$/.test(form.phone)) {
      newErrors.phone = "Enter a valid 10-digit mobile number";
    }

    // Password
    if (!form.password.trim()) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const registerUser = async () => {
    if (!validate()) return;

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
        toast.success(
          "An OTP has been sent to your email address. Please verify your account.",
        );
        setOpenOtp(true);
      }
    } catch (err) {
      alert("Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    // Clear previous OTP error
    setErrors((prev) => ({
      ...prev,
      otp: "",
    }));

    if (!otp.trim()) {
      setErrors((prev) => ({
        ...prev,
        otp: "OTP is required",
      }));
      return;
    }

    if (!/^\d{6}$/.test(otp)) {
      setErrors((prev) => ({
        ...prev,
        otp: "OTP must be exactly 6 digits",
      }));
      return;
    }

    try {
      setOtpLoading(true);

      const res = await fetch(`${API_URL}/auth/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: form.email,
          otp,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert(data.message);
        setOpenOtp(false);
        router.push("/login");
      } else {
        setErrors((prev) => ({
          ...prev,
          otp: data.message || "Invalid OTP",
        }));
      }
    } catch (err) {
      setErrors((prev) => ({
        ...prev,
        otp: "OTP verification failed",
      }));
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
        background: "linear-gradient(135deg, #f7f7f7 0%, #e9e9e9 100%)",
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
          <Typography variant="h4" fontWeight={800} letterSpacing={4}>
            VELOURA
          </Typography>

          <Typography variant="body2" color="text.secondary" mt={1}>
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
            error={Boolean(errors.name)}
            helperText={errors.name}
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
            error={Boolean(errors.email)}
            helperText={errors.email}
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
            error={Boolean(errors.phone)}
            helperText={errors.phone}
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
            error={Boolean(errors.password)}
            helperText={errors.password}
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
              bgcolor: "black",
            }}
          >
            {loading ? (
              <CircularProgress size={22} color="inherit" />
            ) : (
              "Create Account"
            )}
          </Button>

          <Typography textAlign="center" color="text.secondary" fontSize={14}>
            Already have an account?{" "}
            <span
              style={{
                fontWeight: 700,
                cursor: "pointer",
                color: "blue",
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
          <Typography textAlign="center" color="text.secondary" mb={2}>
            Enter the OTP sent to <b>{form.email}</b>
          </Typography>
          <TextField
            label="Enter OTP"
            value={otp}
            onChange={(e) => {
              setOtp(e.target.value);

              setErrors((prev) => ({
                ...prev,
                otp: "",
              }));
            }}
            error={Boolean(errors.otp)}
            helperText={errors.otp}
            fullWidth
            inputProps={{
              maxLength: 6,
              style: {
                textAlign: "center",
                letterSpacing: 8,
                fontSize: 20,
                fontWeight: 700,
              },
            }}
          />
        </DialogContent>

        <DialogActions sx={{ px: 5, pb: 2 }}>
          <Button onClick={() => setOpenOtp(false)}>Cancel</Button>

          <Button
            onClick={verifyOtp}
            variant="contained"
            disabled={otpLoading}
            sx={{ bgcolor: "black" }}
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
