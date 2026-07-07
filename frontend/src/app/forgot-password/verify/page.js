import {
  Container,
  Paper,
  Typography,
} from "@mui/material";

import VerifyOtpForm from "@/components/forms/VerifyOtpForm";

export default function VerifyPage() {
  return (
    <Container maxWidth="sm">
      <Paper >
      

        <VerifyOtpForm />
      </Paper>
    </Container>
  );
}