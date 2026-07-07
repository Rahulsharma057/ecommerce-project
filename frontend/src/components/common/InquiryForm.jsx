"use client";

import { useState } from "react";
import {
  Stack,
  TextField,
  Button,
  Typography,
} from "@mui/material";

export default function InquiryForm({
  title = "Send Message",
  buttonText = "Submit",
  fields = ["name", "email", "phone", "message"],
  onSubmit,
}) {
  const [form, setForm] = useState({});

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (onSubmit) {
      onSubmit(form);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={3}>
        <Typography variant="h5" fontWeight={700}>
          {title}
        </Typography>

        {fields.includes("name") && (
          <TextField
            label="Full Name"
            name="name"
            value={form.name || ""}
            onChange={handleChange}
            fullWidth
          />
        )}

        {fields.includes("email") && (
          <TextField
            label="Email"
            name="email"
            value={form.email || ""}
            onChange={handleChange}
            fullWidth
          />
        )}

        {fields.includes("phone") && (
          <TextField
            label="Phone Number"
            name="phone"
            value={form.phone || ""}
            onChange={handleChange}
            fullWidth
          />
        )}

        {fields.includes("organization") && (
          <TextField
            label="Organization / Company"
            name="organization"
            value={form.organization || ""}
            onChange={handleChange}
            fullWidth
          />
        )}

        {fields.includes("instagram") && (
          <TextField
            label="Instagram Profile"
            name="instagram"
            value={form.instagram || ""}
            onChange={handleChange}
            fullWidth
          />
        )}

        {fields.includes("followers") && (
          <TextField
            label="Followers"
            name="followers"
            value={form.followers || ""}
            onChange={handleChange}
            fullWidth
          />
        )}

        {fields.includes("message") && (
          <TextField
            label="Message"
            name="message"
            value={form.message || ""}
            multiline
            rows={4}
            onChange={handleChange}
            fullWidth
          />
        )}

        <Button
          type="submit"
          variant="contained"
          sx={{
            bgcolor: "#111",
            py: 1.5,
            borderRadius: 3,
            fontWeight: 700,
          }}
        >
          {buttonText}
        </Button>
      </Stack>
    </form>
  );
}