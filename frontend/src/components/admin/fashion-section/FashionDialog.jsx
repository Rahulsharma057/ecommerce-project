"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  TextField,
  Button,
  Stack,
  Typography,
  Switch,
  FormControlLabel,
  MenuItem,
  Box,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  createFashionSection,
  updateFashionSection,deleteFashionSection
} from "@/services/fashionSection";

export default function FashionFormDialog({
  open,
  setOpen,
  editData,
  refresh,
}) {
  const [loading, setLoading] = useState(false);
const [deleting, setDeleting] = useState(false);
  const [form, setForm] = useState({
    category: "",
    title: "",
    subtitle: "",
    description: "",
    buttonText: "",
    buttonLink: "",
    order: 1,
    visible: true,
  });

  const [image, setImage] = useState(null);

  const [video, setVideo] = useState(null);

  const [imagePreview, setImagePreview] = useState("");

  const [videoPreview, setVideoPreview] = useState("");

  useEffect(() => {
    if (editData) {
      setForm({
        category: editData.category || "",
        title: editData.title || "",
        subtitle: editData.subtitle || "",
        description: editData.description || "",
        buttonText: editData.buttonText || "",
        buttonLink: editData.buttonLink || "",
        order: editData.order || 1,
        visible: editData.visible,
      });

      setImagePreview(editData.image);

      setVideoPreview(editData.video);
    } else {
      resetForm();
    }
  }, [editData, open]);

  const resetForm = () => {
    setForm({
      category: "",
      title: "",
      subtitle: "",
      description: "",
      buttonText: "",
      buttonLink: "",
      order: 1,
      visible: true,
    });

    setImage(null);

    setVideo(null);

    setImagePreview("");

    setVideoPreview("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSwitch = (e) => {
    setForm((prev) => ({
      ...prev,
      visible: e.target.checked,
    }));
  };

  const handleImage = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setImage(file);

    setImagePreview(URL.createObjectURL(file));
  };

  const handleVideo = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setVideo(file);

    setVideoPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("category", form.category);
      formData.append("title", form.title);
      formData.append("subtitle", form.subtitle);
      formData.append("description", form.description);
      formData.append("buttonText", form.buttonText);
      formData.append("buttonLink", form.buttonLink);
      formData.append("order", form.order);
      formData.append("visible", form.visible);

      if (image) {
        formData.append("image", image);
      }

      if (video) {
        formData.append("video", video);
      }

      if (editData) {
        await updateFashionSection(editData._id, formData);
      } else {
        await createFashionSection(formData);
      }

      refresh();

      setOpen(false);

      resetForm();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
const handleDelete = async () => {
  if (!editData?._id) return;

  const confirmDelete = window.confirm(
    "Are you sure you want to delete this fashion section?"
  );

  if (!confirmDelete) return;

  try {
    setDeleting(true);

    await deleteFashionSection(editData._id);

    toast.success("Fashion section deleted successfully");

    refresh();
    setOpen(false);
    resetForm();

  } catch (error) {
    console.log(error);

    toast.error(
      error.response?.data?.message || "Delete failed"
    );
  } finally {
    setDeleting(false);
  }
};

  return (
    <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="md">
      <DialogTitle>
        {editData ? "Update Fashion Section" : "Add Fashion Section"}
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={3} mt={0.5}>
          <Grid item xs={12} md={6}>
            <TextField
              select
              fullWidth
              label="Category"
              name="category"
              value={form.category}
              onChange={handleChange}
            >
              {["Women", "Men", "Kids", "Beauty", "Accessories"].map((item) => (
                <MenuItem key={item} value={item}>
                  {item}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              type="number"
              label="Display Order"
              name="order"
              value={form.order}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Title"
              name="title"
              value={form.title}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Subtitle"
              name="subtitle"
              value={form.subtitle}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              multiline
              rows={4}
              fullWidth
              label="Description"
              name="description"
              value={form.description}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Button Text"
              name="buttonText"
              value={form.buttonText}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Button Link"
              name="buttonLink"
              value={form.buttonLink}
              onChange={handleChange}
            />
          </Grid>

          {/* IMAGE */}

          <Grid item xs={12} md={6}>
            <Typography fontWeight={600} mb={1}>
              Upload Image
            </Typography>

            <Box
              sx={{
                border: "2px dashed #d1d5db",
                borderRadius: 3,
                p: 3,
                textAlign: "center",
                cursor: "pointer",
                transition: ".3s",
                "&:hover": {
                  borderColor: "#1976d2",
                },
              }}
              component="label"
            >
              <input
                hidden
                type="file"
                accept="image/*"
                onChange={handleImage}
              />

              <Typography>Click to Upload Image</Typography>
            </Box>

            {imagePreview && (
              <Box
                component="img"
                src={imagePreview}
                loading="lazy"
                sx={{
                  mt: 2,
                  width: "100%",
                  height: 220,
                  objectFit: "cover",
                  borderRadius: 3,
                }}
              />
            )}
          </Grid>

          {/* VIDEO */}

          <Grid item xs={12} md={6}>
            <Typography fontWeight={600} mb={1}>
              Upload Video
            </Typography>

            <Box
              sx={{
                border: "2px dashed #d1d5db",
                borderRadius: 3,
                p: 3,
                textAlign: "center",
                cursor: "pointer",
                transition: ".3s",
                "&:hover": {
                  borderColor: "#1976d2",
                },
              }}
              component="label"
            >
              <input
                hidden
                type="file"
                accept="video/*"
                onChange={handleVideo}
              />

              <Typography>Click to Upload Video</Typography>
            </Box>

            {videoPreview && (
              <Box
                component="video"
                src={videoPreview}
                controls
                autoPlay
                muted
                loop
                playsInline
                sx={{
                  mt: 2,
                  width: "100%",
                  height: 220,
                  borderRadius: 3,
                }}
              />
            )}
          </Grid>

          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch checked={form.visible} onChange={handleSwitch} />
              }
              label="Show On Website"
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        {editData && (
  <Button
    color="error"
    variant="outlined"
    startIcon={<DeleteIcon />}
    onClick={handleDelete}
    disabled={deleting}
    sx={{ mr: "auto" }}
  >
    {deleting ? "Deleting..." : "Delete"}
  </Button>
)}
        <Button
          onClick={() => {
            setOpen(false);
            resetForm();
          }}
        >
          Cancel
        </Button>

        <Button variant="contained" onClick={handleSubmit} disabled={loading}>
          {loading ? "Saving..." : editData ? "Update" : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
