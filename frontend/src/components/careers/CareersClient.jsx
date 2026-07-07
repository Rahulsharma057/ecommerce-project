"use client";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import ApplyJobDialog from "./ApplyJobDialog";
import { useState } from "react";

const jobs = [
  {
    title: "Fashion Designer",
    type: "Full Time",
    location: "Khurja, Uttar Pradesh",
    description:
      "Design modern men's and women's clothing collections with creativity and attention to detail.",
  },
  {
    title: "Tailor / Stitching Expert",
    type: "Full Time",
    location: "Khurja, Uttar Pradesh",
    description:
      "Work with our production team to create premium quality garments with perfect finishing.",
  },
  {
    title: "Quality Checker",
    type: "Full Time",
    location: "Khurja, Uttar Pradesh",
    description:
      "Inspect garments and ensure every product meets Veloura's quality standards.",
  },
  {
    title: "Customer Support Executive",
    type: "Full Time",
    location: "Remote / Khurja",
    description:
      "Help customers with orders, returns, and product-related queries.",
  },
  {
    title: "Social Media Executive",
    type: "Full Time",
    location: "Remote",
    description:
      "Create engaging content and grow Veloura across Instagram, Facebook and other platforms.",
  },
  {
    title: "Warehouse Executive",
    type: "Full Time",
    location: "Khurja",
    description:
      "Manage inventory, packing, dispatch and order fulfillment efficiently.",
  },
];

const benefits = [
  "Competitive Salary",
  "Friendly Work Environment",
  "Career Growth Opportunities",
  "Employee Discounts",
  "Learning & Development",
  "Performance Bonuses",
];

export default function CareersClient() {
    const [open, setOpen] = useState(false);
  return (
    <Box sx={{ bgcolor: "#fafafa", py: { xs: 6, md: 10 } }}>
      <Container maxWidth="lg">

        {/* Hero */}
        <Box textAlign="center" mb={8}>
          <Typography variant="h3" fontWeight={700} gutterBottom>
            Join Team Veloura
          </Typography>

          <Typography
            color="text.secondary"
            sx={{
              maxWidth: 700,
              mx: "auto",
              lineHeight: 1.8,
            }}
          >
            At Veloura, we're building a premium fashion brand that values
            creativity, quality and innovation. If you're passionate about
            fashion, we'd love to have you on our team.
          </Typography>
        </Box>

        {/* Benefits */}
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 4,
            border: "1px solid #e5e7eb",
            mb: 6,
          }}
        >
          <Typography variant="h5" fontWeight={700} mb={3}>
            Why Work With Us?
          </Typography>

          <Grid container spacing={2}>
            {benefits.map((item) => (
              <Grid item xs={12} sm={6} md={4} key={item}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2.5,
                    textAlign: "center",
                    borderRadius: 3,
                    bgcolor: "#f8f8f8",
                    border: "1px solid #ececec",
                  }}
                >
                  <Typography fontWeight={600}>{item}</Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Paper>

        {/* Open Positions */}
        <Typography
          variant="h4"
          fontWeight={700}
          mb={4}
        >
          Current Openings
        </Typography>

        <Grid container spacing={3}>
          {jobs.map((job) => (
            <Grid item xs={12} md={6} key={job.title}>
              <Card
                elevation={0}
                sx={{
                  height: "100%",
                  borderRadius: 4,
                  border: "1px solid #e5e7eb",
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={2}
                  >
                    <Typography
                      variant="h6"
                      fontWeight={700}
                    >
                      {job.title}
                    </Typography>

                    <Chip
                      label={job.type}
                      size="small"
                      color="success"
                    />
                  </Stack>

                  <Typography
                    color="text.secondary"
                    mb={1}
                  >
                    📍 {job.location}
                  </Typography>

                  <Typography
                    color="text.secondary"
                    sx={{ lineHeight: 1.8 }}
                  >
                    {job.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Apply Section */}
        <Paper
          elevation={0}
          sx={{
            mt: 8,
            p: 5,
            borderRadius: 4,
            bgcolor: "#111",
            color: "#fff",
            textAlign: "center",
          }}
        >
          <Typography variant="h4" fontWeight={700}>
            Ready to Join Veloura?
          </Typography>

          <Typography
            sx={{
              mt: 2,
              opacity: 0.85,
              maxWidth: 700,
              mx: "auto",
            }}
          >
            Send your resume with your portfolio (if applicable). Our hiring
            team will review your application and contact shortlisted
            candidates.
          </Typography>

          <Stack spacing={1} mt={4}>
            <Typography>
              📧 velouraclothingclubkrj@gmail.com
            </Typography>

            <Typography>
              📞 +91 9761709422
            </Typography>

            <Typography>
              📍 Khurja City, Bulandshahr, Uttar Pradesh - 203131
            </Typography>
          </Stack>
<Button
  variant="contained"
  sx={{
    mt: 4,
    bgcolor: "#fff",
    color: "#111",
    px: 4,
    py: 1.3,
    fontWeight: 700,
    borderRadius: 3,
    "&:hover": {
      bgcolor: "#f2f2f2",
    },
  }}
  onClick={() => setOpen(true)}
>
  Apply Now
</Button>
        </Paper>

      </Container>
      <ApplyJobDialog
  open={open}
  onClose={() => setOpen(false)}
  jobs={jobs}
/>
    </Box>
  );
}