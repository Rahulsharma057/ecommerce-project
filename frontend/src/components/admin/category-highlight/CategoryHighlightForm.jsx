"use client";

import { useEffect, useState } from "react";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  TextField,
  Button,
  FormControlLabel,
  Switch,
  Stack,
  Box,
} from "@mui/material";

import { uploadImage } from "@/services/upload";

export default function CategoryHighlightForm({
  open,
  onClose,
  onSubmit,
  initialData,
}) {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    image: "",
    title: "",
    description: "",
    searchKeyword: "",
    isVisible: true,
  });

  useEffect(() => {
    if (initialData) {
      setForm(initialData);
    } else {
      setForm({
        image: "",
        title: "",
        description: "",
        searchKeyword: "",
        isVisible: true,
      });
    }
  }, [initialData]);

  const handleImage = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    try {
      setLoading(true);

      const data = new FormData();

      data.append("image", file);

      const res = await uploadImage(data);

      setForm((prev) => ({
        ...prev,
        image: res.data.url,
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    onSubmit(form);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
    >
      <DialogTitle>
        {initialData ? "Edit Collection" : "Add Collection"}
      </DialogTitle>

      <DialogContent>

        <Grid
          container
          spacing={3}
          mt={1}
        >

          <Grid item xs={12}>

            <Button
              variant="outlined"
              component="label"
            >
              Upload Image

              <input
                hidden
                type="file"
                onChange={handleImage}
              />
            </Button>

            {form.image && (
              <Box mt={2}>
                <img
                  src={form.image}
                  width={180}
                  style={{
                    borderRadius: 12,
                  }}
                />
              </Box>
            )}

          </Grid>

          <Grid item xs={12}>

            <TextField
              fullWidth
              label="Category Name"
              value={form.title}
              onChange={(e) =>
                setForm({
                  ...form,
                  title: e.target.value,
                })
              }
            />

          </Grid>

          <Grid item xs={12}>

            <TextField
              fullWidth
              multiline
              rows={3}
              label="Short Description"
              value={form.description}
              onChange={(e) =>
                setForm({
                  ...form,
                  description: e.target.value,
                })
              }
            />

          </Grid>

          <Grid item xs={12}>

            <TextField
              fullWidth
              label="Search Keyword"
              helperText="Example : suit, tshirt, hoodie"
              value={form.searchKeyword}
              onChange={(e) =>
                setForm({
                  ...form,
                  searchKeyword: e.target.value,
                })
              }
            />

          </Grid>

          <Grid item xs={12}>

            <FormControlLabel
              control={
                <Switch
                  checked={form.isVisible}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      isVisible: e.target.checked,
                    })
                  }
                />
              }
              label="Visible on Home Page"
            />

          </Grid>

        </Grid>

      </DialogContent>

      <DialogActions>

        <Button onClick={onClose}>
          Cancel
        </Button>

        <Button
          variant="contained"
          disabled={loading}
          onClick={handleSave}
        >
          {loading ? "Uploading..." : "Save"}
        </Button>

      </DialogActions>
    </Dialog>
  );
}