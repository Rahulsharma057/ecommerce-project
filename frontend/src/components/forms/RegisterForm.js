"use client";

import { useState } from "react";
import {
  Box,
  Stack,
  TextField,
  Button,  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { API_URL } from "@/lib/api";

export default function RegisterForm() {
  const router = useRouter();

  const [form, setForm] =
    useState({
      name: "",
      email: "",
      phone: "",
      password: "",
    });
    const [openOtp, setOpenOtp] = useState(false);
const [otp, setOtp] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.value,
    });
  };

  const sendOtp = async () => {
    if (
  !form.name ||
  !form.email ||
  !form.phone ||
  !form.password
) {
  return alert(
    "Please fill all fields"
  );
}
  const res = await fetch(
    `${API_URL}/auth/send-otp`,
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify({
        phone: form.phone,
      }),
    }
  );

  const data = await res.json();

  alert(data.message);

  if (res.ok) {
    setOpenOtp(true);
  }
};

const verifyOtp = async () => {
  const res = await fetch(
    `${API_URL}/auth/verify-otp`,
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify({
        phone: form.phone,
        otp,
      }),
    }
  );

  const data = await res.json();

  alert(data.message);

if (res.ok) {
  setOtp("");
  setOpenOtp(false);
  registerUser();
}
};


  const registerUser = async () => {
  const res = await fetch(
    `${API_URL}/auth/register`,
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify(form),
    }
  );

  const data = await res.json();

  if (res.ok) {
    alert("Registration Successful");
    router.push("/login");
  } else {
    alert(data.message);
  }
};

  return (
    <Box
      component="form"
     
    >
      <Stack spacing={3}>
        <TextField
          label="Name"
          name="name"
          value={form.name}
          onChange={
            handleChange
          }
          required
        />

        <TextField
          label="Email"
          name="email"
          value={form.email}
          onChange={
            handleChange
          }
          required
        />

        <TextField
          label="Phone"
          name="phone"
          value={form.phone}
          onChange={
            handleChange
          }
        />

        <TextField
          label="Password"
          type="password"
          name="password"
          value={form.password}
          onChange={
            handleChange
          }
          required
        />

   <Button
  variant="contained"
  onClick={sendOtp}
>
  Send OTP
</Button>
        <Dialog
  open={openOtp}
  onClose={() =>
    setOpenOtp(false)
  }
>
  <DialogTitle>
    Verify OTP
  </DialogTitle>

  <DialogContent>
    <TextField
      label="Enter OTP"
      value={otp}
      onChange={(e) =>
        setOtp(
          e.target.value
        )
      }
      fullWidth
    />
  </DialogContent>

  <DialogActions>
    <Button
      onClick={() =>
        setOpenOtp(false)
      }
    >
      Cancel
    </Button>

    <Button
      onClick={verifyOtp}
      variant="contained"
    >
      Verify
    </Button>
  </DialogActions>
</Dialog>
      </Stack>
    </Box>
  );
}