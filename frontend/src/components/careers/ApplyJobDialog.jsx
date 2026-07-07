import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  MenuItem,
  Stack,
  Typography,
  Divider,
  Box,
} from "@mui/material";
import { useState } from "react";
import { applyJob } from "@/services/careerService";
import { showMessage } from "@/utils/toast";

export default function ApplyJobDialog({ open, onClose, jobs }) {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    jobTitle: "",
    experience: "",
    qualification: "",
    currentLocation: "",
    expectedSalary: "",
    coverLetter: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      await applyJob(form);

      showMessage({
        variant: "success",
        message: "Application submitted successfully!",
      });

      setForm({
        fullName: "",
        email: "",
        phone: "",
        jobTitle: "",
        experience: "",
        qualification: "",
        currentLocation: "",
        expectedSalary: "",
        coverLetter: "",
      });

      onClose();
    } catch (err) {
      showMessage({
        variant: "error",
        message: err?.response?.data?.message || err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      scroll="paper"
    >
      {/* HEADER */}
      <DialogTitle sx={{ fontWeight: 700 }}>
        Job Application Form
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ pt: 2 }}>
        <Box component="form">
          <Stack spacing={2.5}>
            <Typography variant="subtitle1" fontWeight={600}>
              Personal Details
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Full Name"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  fullWidth
                  label="Applying For"
                  name="jobTitle"
                  value={form.jobTitle}
                  onChange={handleChange}
                >
                  {jobs.map((job) => (
                    <MenuItem key={job.title} value={job.title}>
                      {job.title}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>

            <Divider />

            <Typography variant="subtitle1" fontWeight={600}>
              Professional Details
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Experience"
                  name="experience"
                  value={form.experience}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Qualification"
                  name="qualification"
                  value={form.qualification}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Current Location"
                  name="currentLocation"
                  value={form.currentLocation}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Expected Salary"
                  name="expectedSalary"
                  value={form.expectedSalary}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>

            <Divider />

            <Typography variant="subtitle1" fontWeight={600}>
              Cover Letter
            </Typography>

            <TextField
              fullWidth
              multiline
              rows={4}
              label="Write something about yourself"
              name="coverLetter"
              value={form.coverLetter}
              onChange={handleChange}
            />
          </Stack>
        </Box>
      </DialogContent>

      <Divider />

      {/* ACTIONS */}
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} disabled={loading}   sx={{color:"black"}}>
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading}
          sx={{bgcolor:"black"}}
        >
          {loading ? "Submitting..." : "Submit Application"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}