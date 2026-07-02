import {
  Container,
  Paper,
  Typography,
} from "@mui/material";

import ForgotPasswordForm from "@/components/forms/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <Container maxWidth="sm">
      <Paper sx={{ p: 4, mt: 5 }}>
        <Typography
          variant="h5"
          mb={3}
        >
          Forgot Password
        </Typography>

        <ForgotPasswordForm />
      </Paper>
    </Container>
  );
}