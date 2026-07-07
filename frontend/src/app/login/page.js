"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Container, Paper } from "@mui/material";
import LoginForm from "@/components/forms/LoginForm";

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (token) {
      if (user?.role === "admin") {
        router.replace("/admin/products");
      } else {
        router.replace("/");
      }
    }
  }, [router]);

  return (
    <Container maxWidth="sm" sx={{ py: 10 }}>
      <Paper elevation={0}>
        <LoginForm />
      </Paper>
    </Container>
  );
}