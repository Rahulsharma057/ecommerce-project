"use client";

import axios from "axios";

import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Stack,
  Button,
} from "@mui/material";

import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import { API_URL } from "@/lib/api";
import InquiryForm from "@/components/common/InquiryForm";

export default function ContactPage() {
  return (
    <Box sx={{ bgcolor: "#f8f9fb", py: { xs: 6, md: 10 } }}>
      <Container maxWidth="lg">
        <Typography
          variant="h3"
          fontWeight={800}
          textAlign="center"
          gutterBottom
        >
          Contact Us
        </Typography>

        <Typography
          textAlign="center"
          color="text.secondary"
          sx={{
            maxWidth: 650,
            mx: "auto",
            mb: 6,
          }}
        >
          We'd love to hear from you. Whether you have a question about an
          order, products, sizing, or anything else, our team is ready to help.
        </Typography>

        <Grid container spacing={4}>
          {/* LEFT SECTION */}

          <Grid item xs={12} md={5}>
            <Stack spacing={3}>
              <Card elevation={0} sx={{ borderRadius: 3 }}>
                <CardContent>
                  <Stack direction="row" spacing={2}>
                    <EmailOutlinedIcon />

                    <Box>
                      <Typography fontWeight={700}>Business Email</Typography>

                      <Typography color="text.secondary">
                        velouraclothingclubkrj@gmail.com
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>

              <Card elevation={0} sx={{ borderRadius: 3 }}>
                <CardContent>
                  <Stack direction="row" spacing={2}>
                    <PhoneOutlinedIcon />

                    <Box>
                      <Typography fontWeight={700}>Customer Care</Typography>

                      <Typography color="text.secondary">
                        +91 9761709408
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>

              <Card elevation={0} sx={{ borderRadius: 3 }}>
                <CardContent>
                  <Stack direction="row" spacing={2}>
                    <WhatsAppIcon />

                    <Box>
                      <Typography fontWeight={700}>WhatsApp</Typography>

                      <Typography color="text.secondary">
                        +91 9761709422
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>

              <Card elevation={0} sx={{ borderRadius: 3 }}>
                <CardContent>
                  <Stack direction="row" spacing={2}>
                    <LocationOnOutlinedIcon />

                    <Box>
                      <Typography fontWeight={700}>Address</Typography>

                      <Typography color="text.secondary">
                        VELOURA
                        <br />
                        Khurja City
                        <br />
                        Bulandshahr - 203131
                        <br />
                        Uttar Pradesh, India
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>

              <Card elevation={0} sx={{ borderRadius: 3 }}>
                <CardContent>
                  <Stack direction="row" spacing={2}>
                    <AccessTimeOutlinedIcon />

                    <Box>
                      <Typography fontWeight={700}>Working Hours</Typography>

                      <Typography color="text.secondary">
                        Monday - Saturday
                        <br />
                        10:00 AM - 7:00 PM
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Stack>
          </Grid>

          {/* FORM SECTION */}

         <Grid item xs={12} md={7}>
  <Card elevation={0} sx={{ borderRadius: 3 }}>
    <CardContent sx={{ p: { xs: 3, md: 4 } }}>
      <InquiryForm
        title="Send us a Message"
        buttonText="Send Message"
        fields={["name", "email", "phone", "message"]}
        onSubmit={async (data) => {
          try {
            await axios.post(`${API_URL}/contact`, data);

            alert("Message sent successfully");
          } catch (error) {
            console.error(error);
            alert("Failed to send message");
          }
        }}
      />
    </CardContent>
  </Card>
</Grid>
        </Grid>
      </Container>
    </Box>
  );
}
