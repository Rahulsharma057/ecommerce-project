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
  Box,
} from "@mui/material";

import { uploadImage } from "@/services/upload";

export default function HomeCollectionForm({
  open,
  onClose,
  onSubmit,
  editData,
}) {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    image: "",
    imageFile: null,
    title: "",
    description: "",
    searchKeyword: "",
    visible: true,
    order: 1,
  });

  useEffect(() => {
    if (editData) {
      setForm({
        image: editData.image || "",
        imageFile: null,
        title: editData.title || "",
        description: editData.description || "",
        searchKeyword: editData.searchKeyword || "",
        visible: editData.visible ?? true,
        order: editData.order || 1,
      });
    } else {
      setForm({
        image: "",
        imageFile: null,
        title: "",
        description: "",
        searchKeyword: "",
        visible: true,
        order: 1,
      });
    }
  }, [open, editData]);

  const handleImage = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert("Image must be less than 2 MB.");
      return;
    }

    setForm((prev) => ({
      ...prev,
      imageFile: file,
      image: URL.createObjectURL(file),
    }));
  };
  const handleSave = async () => {
    try {
      setLoading(true);

      const data = new FormData();

      data.append("title", form.title);
      data.append("description", form.description);
      data.append("searchKeyword", form.searchKeyword);
      data.append("visible", form.visible);
      data.append("order", form.order);

      if (form.imageFile) {
        data.append("image", form.imageFile);
      }
      console.log(data);
      await onSubmit(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      if (form.image.startsWith("blob:")) {
        URL.revokeObjectURL(form.image);
      }
    };
  }, [form.image]);
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>
        {editData ? "Edit Collection" : "Add Collection"}
      </DialogTitle>

      <DialogContent>
        <Grid container spacing={3} mt={1}>
          <Grid item xs={12}>
            <Button component="label" variant="outlined">
              Upload Image
              <input
                hidden
                type="file"
                accept="image/*"
                onChange={handleImage}
              />
            </Button>

            {form.image && (
              <Box mt={2}>
                <img
                  src={form.image}
                  width={220}
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
              label="Collection Name"
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
              rows={4}
              label="Description"
              value={form.description}
              onChange={(e) =>
                setForm({
                  ...form,
                  description: e.target.value,
                })
              }
            />
          </Grid>

          {/*     <Grid item md={6} xs={12}>
            <TextField
              fullWidth
              label="Button Text"
              value={form.buttonText}
              onChange={(e) =>
                setForm({
                  ...form,
                  buttonText: e.target.value,
                })
              }
            />
          </Grid>

          <Grid item md={6} xs={12}>
            <TextField
              fullWidth
              label="Button Link"
              value={form.buttonLink}
              onChange={(e) =>
                setForm({
                  ...form,
                  buttonLink: e.target.value,
                })
              }
            />
          </Grid> */}

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Search Keyword"
              helperText="Example : shirt, hoodie, sneaker"
              value={form.searchKeyword}
              onChange={(e) =>
                setForm({
                  ...form,
                  searchKeyword: e.target.value,
                })
              }
            />
          </Grid>
          <Grid item md={6} xs={12}>
            <TextField
              fullWidth
              type="number"
              label="Display Order"
              value={form.order}
              onChange={(e) =>
                setForm({
                  ...form,
                  order: Number(e.target.value),
                })
              }
              inputProps={{
                min: 1,
              }}
              helperText="Smaller number will appear first"
            />
          </Grid>

          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={form.visible}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      visible: e.target.checked,
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
        <Button onClick={onClose}>Cancel</Button>

        <Button variant="contained" disabled={loading} onClick={handleSave}>
          {loading ? "Uploading..." : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
