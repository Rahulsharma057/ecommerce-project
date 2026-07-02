"use client";

import {
  Box,
  Button,
  MenuItem,
  TextField,
  Grid,
  Paper,
  Stack,
  Typography,
  Divider,
} from "@mui/material";

export default function CouponForm({
  form,
  setForm,
  onSubmit,
  loading,
  errors = {},
  title = "Coupon Form",
  subtitle = "",
  submitText = "Save Coupon",
  router,
}) {
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f6f7fb",

        display: "grid",
        //   gridTemplateColumns: { xs: "1fr", md: "1.2fr 0.8fr" },
      }}
    >
      {/* ================= FORM ================= */}
      <Paper sx={{ p: 4, borderRadius: 3, border: "1px solid #e5e7eb" }}>
        {/* HEADER */}
        <Stack direction="row" spacing={1.5} alignItems="flex-start" mb={3}>
          {/* BACK BUTTON */}
          <Button
            onClick={() => router.back()}
            sx={{
              minWidth: 42,
              height: 30,
              borderRadius: "10px",
      color: "#111827",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              "&:hover": {
                bgcolor: "#f3f4f6",
                borderColor: "#d1d5db",
              },
            }}
          >
            <span style={{ fontSize: 25, fontWeight: 800 }}>←</span>
          </Button>

          {/* TITLE */}
          <Box sx={{ mt: 0.3 }}>
            <Typography fontSize={22} fontWeight={700}>
              {title}
            </Typography>

            <Typography fontSize={13} color="text.secondary">
              {subtitle}
            </Typography>
          </Box>
        </Stack>
        <Divider sx={{ mb: 3 }} />

        {/* GRID FORM */}
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Coupon Code"
              name="code"
              value={form.code}
              onChange={handleChange}
              error={!!errors.code}
              helperText={errors.code}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              select
              fullWidth
              label="Discount Type"
              name="discountType"
              value={form.discountType}
              onChange={handleChange}
            >
              <MenuItem value="percentage">Percentage</MenuItem>
              <MenuItem value="fixed">Fixed</MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Discount Value"
              name="discountValue"
              value={form.discountValue}
              onChange={handleChange}
              error={!!errors.discountValue}
              helperText={errors.discountValue}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Usage Limit"
              name="usageLimit"
              value={form.usageLimit}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Min Order"
              name="minOrderAmount"
              value={form.minOrderAmount}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Max Discount"
              name="maxDiscount"
              value={form.maxDiscount}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              type="date"
              fullWidth
              name="expiryDate"
              value={form.expiryDate}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={form.description}
              onChange={handleChange}
              multiline
              rows={2}
            />
          </Grid>

          {/* BUTTON */}
          <Grid item xs={12}>
            <Button
              fullWidth
              variant="contained"
              color="success"
              onClick={onSubmit}
              disabled={loading}
            >
              {loading ? "Saving..." : submitText}
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}
