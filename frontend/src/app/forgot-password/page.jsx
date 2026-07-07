import {
  Container,
  Paper,
  Typography,
} from "@mui/material";

import ForgotPasswordForm from "@/components/forms/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <Container maxWidth="sm">
      <Paper >
       

        <ForgotPasswordForm />
      </Paper>
    </Container>
  );
}