import {
  Container,
  Paper,
  Typography,
} from "@mui/material";

import ResetPasswordForm from "@/components/forms/ResetPasswordForm";

export default function ResetPage() {
  return (
    <Container maxWidth="sm">
      <Paper sx={{ p: 4, mt: 5 }}>


        <ResetPasswordForm />
      </Paper>
    </Container>
  );
}