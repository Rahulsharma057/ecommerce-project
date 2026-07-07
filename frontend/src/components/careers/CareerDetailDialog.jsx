"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Grid,
  Chip,
  Divider,
  Link,
  MenuItem,
  TextField,
  Stack,
} from "@mui/material";
import { useState, useEffect } from "react";
import { updateApplication } from "@/services/career";
import { toast } from "react-toastify";

const statusColors = {
  Pending: "warning",
  Reviewed: "info",
  Shortlisted: "success",
  Rejected: "error",
};

export default function CareerDetailDialog({
  open,
  onClose,
  application,
  onUpdated,
}) {
  const [status, setStatus] = useState("Pending");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (application) {
      setStatus(application.status || "Pending");
    }
  }, [application]);

  if (!application) return null;

  const handleUpdate = async () => {
    try {
      setLoading(true);

      await updateApplication(application._id, {
        status,
      });

      toast.success("Status updated successfully");

      onUpdated?.();

      onClose();
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        Job Application Details
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={2}>

          <Grid item xs={12} md={6}>
            <Typography fontWeight={600}>
              Full Name
            </Typography>

            <Typography>
              {application.fullName}
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography fontWeight={600}>
              Email
            </Typography>

            <Typography>
              {application.email}
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography fontWeight={600}>
              Phone
            </Typography>

            <Typography>
              {application.phone}
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography fontWeight={600}>
              Applying For
            </Typography>

            <Typography>
              {application.jobTitle}
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography fontWeight={600}>
              Experience
            </Typography>

            <Typography>
              {application.experience || "-"}
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography fontWeight={600}>
              Qualification
            </Typography>

            <Typography>
              {application.qualification || "-"}
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography fontWeight={600}>
              Current Location
            </Typography>

            <Typography>
              {application.currentLocation || "-"}
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography fontWeight={600}>
              Expected Salary
            </Typography>

            <Typography>
              {application.expectedSalary || "-"}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography fontWeight={600}>
              Cover Letter
            </Typography>

            <Typography sx={{ whiteSpace: "pre-wrap" }}>
              {application.coverLetter || "-"}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 1 }} />
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography fontWeight={600} mb={1}>
              Current Status
            </Typography>

            <Chip
              label={application.status}
              color={
                statusColors[application.status] || "default"
              }
            />
          </Grid>

          {application.resume && (
            <Grid item xs={12} md={6}>
              <Typography fontWeight={600}>
                Resume
              </Typography>

              <Link
                href={`http://localhost:5000/${application.resume}`}
                target="_blank"
              >
                View Resume
              </Link>
            </Grid>
          )}

          <Grid item xs={12}>
            <TextField
              select
              fullWidth
              label="Update Status"
              value={status}
              onChange={(e) =>
                setStatus(e.target.value)
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
      </DialogContent>

      <DialogActions>

        <Button onClick={onClose}>
          Close
        </Button>

        <Button
          variant="contained"
          onClick={handleUpdate}
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Status"}
        </Button>

      </DialogActions>
    </Dialog>
  );
}