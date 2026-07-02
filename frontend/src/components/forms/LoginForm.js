"use client";

import { useState } from "react";
import {
  Box,
  Stack,
  TextField,
  Button,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { API_URL } from "@/lib/api";

export default function LoginForm() {
  const router = useRouter();

  const [form, setForm] =
    useState({
      email: "",
      password: "",
    });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.value,
    });
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await fetch(
      `${API_URL}/auth/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      }
    );

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem(
        "token",
        data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      alert("Login Success");

      if (data.user.role === "admin") {
        router.push("/admin/products");
      } else {
        router.push("/");
      }
    } else {
      alert(data.message);
    }
  } catch (err) {
    console.log(err);
  }
};

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
    >
      <Stack spacing={3}>
        <TextField
          label="Email"
          name="email"
          value={form.email}
          onChange={
            handleChange
          }
          fullWidth
          required
        />

        <TextField
          label="Password"
          type="password"
          name="password"
          value={form.password}
          onChange={
            handleChange
          }
          fullWidth
          required
        />

        <Typography>
          <Link href="/forgot-password">
            Forgot Password?
          </Link>
        </Typography>

        <Button
          type="submit"
          variant="contained"
        >
          Login
        </Button>

        <Typography>
          Don't have an account?{" "}
          <Link href="/register">
            Register
          </Link>
        </Typography>
      </Stack>
    </Box>
  );
}