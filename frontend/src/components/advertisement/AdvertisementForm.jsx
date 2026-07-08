"use client";

import { useState } from "react";

import {
  Box,
  Card,
  CardContent,
  Stack,
  Typography,
  TextField,
  Button,
  FormControlLabel,
  Switch,
} from "@mui/material";

export default function AdvertisementForm({
  initialData,

  onSubmit,

  loading,
}) {
  const [title, setTitle] = useState(initialData?.title || "");

  const [description, setDescription] = useState(
    initialData?.description || "",
  );

  const [buttonText, setButtonText] = useState(initialData?.buttonText || "");

  const [buttonLink, setButtonLink] = useState(initialData?.buttonLink || "");

  const [status, setStatus] = useState(initialData?.status ?? true);

  const [image, setImage] = useState(null);

  const submit = () => {
    const form = new FormData();

    form.append("title", title);
    form.append("description", description);
    form.append("buttonText", buttonText);
    form.append("buttonLink", buttonLink);
    form.append("status", status);

    if (image) {
      form.append("image", image);
    }

    onSubmit(form);
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" mb={3} fontWeight={700}>
          Advertisement
        </Typography>

        <Stack spacing={3}>
          <TextField
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
          />

          <TextField
            label="Description"
            multiline
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
          />

          <TextField
            label="Button Text"
            value={buttonText}
            onChange={(e) => setButtonText(e.target.value)}
            fullWidth
          />

          <TextField
            label="Button Link"
            value={buttonLink}
            onChange={(e) => setButtonLink(e.target.value)}
            fullWidth
          />

          <Button variant="outlined" component="label">
            Upload Banner
            <input
              hidden
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
            />
          </Button>

          <FormControlLabel
            control={
              <Switch
                checked={status}
                onChange={(e) => setStatus(e.target.checked)}
              />
            }
            label="Active"
          />

          <Button variant="contained" onClick={submit} disabled={loading}>
            {loading ? "Saving..." : "Save Advertisement"}
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}
