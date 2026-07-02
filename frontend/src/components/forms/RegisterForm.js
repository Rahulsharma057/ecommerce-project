"use client";

import { useState } from "react";
import { Box, Stack, TextField, Button } from "@mui/material";
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

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const registerUser = async () => {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    alert(data.message);

    if (res.ok) {
      router.push(`/verify-otp?email=${form.email}`);
    }
  };

  return (
    <Box component="form">
      <Stack spacing={3}>
        <TextField label="Name" name="name" value={form.name} onChange={handleChange} />
        <TextField label="Email" name="email" value={form.email} onChange={handleChange} />
        <TextField label="Phone" name="phone" value={form.phone} onChange={handleChange} />
        <TextField label="Password" type="password" name="password" value={form.password} onChange={handleChange} />

        <Button variant="contained" onClick={registerUser}>
          Register
        </Button>
      </Stack>
    </Box>
  );
}