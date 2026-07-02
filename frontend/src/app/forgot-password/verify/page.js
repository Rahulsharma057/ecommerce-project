import {
  Container,
  Paper,
  Typography,
} from "@mui/material";

import VerifyOtpForm from "@/components/forms/VerifyOtpForm";

export default function VerifyPage() {
  return (
    <Container maxWidth="sm">
      <Paper sx={{ p: 4, mt: 5 }}>
        <Typography
          variant="h5"
          mb={3}
        >
          Verify OTP
        </Typography>

        <VerifyOtpForm />
      </Paper>
    </Container>
  );
}