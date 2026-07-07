"use client";

import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Stack,
} from "@mui/material";
import RegisterForm from "@/components/forms/RegisterForm";
export default function RegisterPage() {
  return (
    <Container maxWidth="sm" sx={{ py: 10 }}>
      <Paper elevation={0}>
        <RegisterForm />
      </Paper>
    </Container>
  );
}
