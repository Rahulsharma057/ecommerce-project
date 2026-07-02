"use client";

import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Stack,
} from "@mui/material";
import LoginForm from "@/components/forms/LoginForm";
export default function LoginPage() {
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
          Login
        </Typography>

  <LoginForm />
      </Paper>
    </Container>
  );
}