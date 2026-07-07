"use client";

import {
  Box,
  Typography,
  Button,
  MenuItem,
  TextField,
  Paper,
  Grid,
  Divider,
  Chip,
  CircularProgress,
} from "@mui/material";

import {
  getApplication,
  updateApplication,
} from "@/services/careerService";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

const statusColor = {
  Pending: "warning",
  Reviewed: "info",
  Shortlisted: "success",
  Rejected: "error",
};

export default function CareerDetail() {
  const { id } = useParams();
  const router = useRouter();

  const [data, setData] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      const res = await getApplication(id);
      setData(res.data?.data || res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (id) load();
  }, [id]);

  const save = async () => {
    try {
      setSaving(true);

      await updateApplication(id, {
        status: data.status,
      });

      alert("Application Updated Successfully");
    } catch (err) {
      alert("Update Failed");
    } finally {
      setSaving(false);
    }
  };

  if (!data) {
    return (
      <Box
        sx={{
          height: "80vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: 4,
        bgcolor: "#f5f6fa",
        minHeight: "100vh",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          maxWidth: 1000,
          mx: "auto",
          p: 4,
          borderRadius: 3,
        }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Typography
            variant="h4"
            fontWeight={700}
          >
            Job Application
          </Typography>

          <Chip
            label={data.status}
            color={
              statusColor[data.status] || "default"
            }
          />
        </Box>

        <Divider sx={{ mb: 4 }} />

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography color="text.secondary">
              Full Name
            </Typography>

            <Typography fontWeight={600}>
              {data.fullName}
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography color="text.secondary">
              Email
            </Typography>

            <Typography fontWeight={600}>
              {data.email}
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography color="text.secondary">
              Phone
            </Typography>

            <Typography fontWeight={600}>
              {data.phone}
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography color="text.secondary">
              Job Title
            </Typography>

            <Typography fontWeight={600}>
              {data.jobTitle}
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography color="text.secondary">
              Experience
            </Typography>

            <Typography fontWeight={600}>
              {data.experience || "-"}
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography color="text.secondary">
              Qualification
            </Typography>

            <Typography fontWeight={600}>
              {data.qualification || "-"}
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography color="text.secondary">
              Current Location
            </Typography>

            <Typography fontWeight={600}>
              {data.currentLocation || "-"}
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography color="text.secondary">
              Expected Salary
            </Typography>

            <Typography fontWeight={600}>
              {data.expectedSalary || "-"}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography
              color="text.secondary"
              mb={1}
            >
              Cover Letter
            </Typography>

            <Paper
              variant="outlined"
              sx={{
                p: 2,
                bgcolor: "#fafafa",
              }}
            >
              <Typography>
                {data.coverLetter || "-"}
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              select
              label="Update Status"
              value={data.status}
              onChange={(e) =>
                setData({
                  ...data,
                  status: e.target.value,
                })
              }
            >
              <MenuItem value="Pending">
                Pending
              </MenuItem>

              <MenuItem value="Reviewed">
                Reviewed
              </MenuItem>

              <MenuItem value="Shortlisted">
                Shortlisted
              </MenuItem>

              <MenuItem value="Rejected">
                Rejected
              </MenuItem>
            </TextField>
          </Grid>
        </Grid>

        <Box
          mt={4}
          display="flex"
          justifyContent="flex-end"
          gap={2}
        >
          <Button
            variant="outlined"
            onClick={() => router.back()}
          >
            Back
          </Button>

          <Button
            variant="contained"
            onClick={save}
            disabled={saving}
            sx={{
              bgcolor: "#111827",
              "&:hover": {
                bgcolor: "#000",
              },
            }}
          >
            {saving
              ? "Updating..."
              : "Update Status"}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}