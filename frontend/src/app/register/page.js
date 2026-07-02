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
      <Paper
        elevation={0}
        sx={{
          p: 4,
          border: "1px solid #e5e7eb",
          borderRadius: 3,
        }}
      >
        <Typography
          variant="h4"
          fontWeight={700}
          mb={3}
        >
          Create Account
        </Typography>

      <RegisterForm />
      </Paper>
    </Container>
  );
}   