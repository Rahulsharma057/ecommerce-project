"use client";

import { useEffect, useState } from "react";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Switch,
  FormControlLabel,
} from "@mui/material";

import { createModel, updateModel } from "@/services/modelShowcase";

export default function FormDialog({ open, setOpen, editData, refresh }) {
  const initialState = {
    title: "",
    subtitle: "",
    description: "",
    buttonText: "Shop Now",
    buttonLink: "",
    order: 1,
    visible: true,
    image: null,
  };

  const [form, setForm] = useState(initialState);

  const [preview, setPreview] = useState("");

  useEffect(() => {
    if (editData) {
      setForm({
        title: editData.title || "",

        subtitle: editData.subtitle || "",

        description: editData.description || "",

        buttonText: editData.buttonText || "Shop Now",

        buttonLink: editData.buttonLink || "",

        order: editData.order || 1,

        visible: editData.visible,

        image: null,
      });

      setPreview(editData.image || "");
    } else {
      setForm(initialState);

      setPreview("");
    }
  }, [editData, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,

      [name]: value,
    }));
  };

  const handleImage = (e) => {
    const file = e.target.files[0];

    if (file) {
      setForm((prev) => ({
        ...prev,

        image: file,
      }));

      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    try {
      const data = new FormData();

      data.append("title", form.title);

      data.append("subtitle", form.subtitle);

      data.append("description", form.description);

      data.append("buttonText", form.buttonText);

      data.append("buttonLink", form.buttonLink);

      data.append("order", form.order);

      data.append("visible", form.visible);

      if (form.image) {
        data.append("image", form.image);
      }

      if (editData) {
        await updateModel(editData._id, data);
      } else {
        await createModel(data);
      }

      setOpen(false);

      refresh();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
      <DialogTitle>{editData ? "Edit Model" : "Add Model"}</DialogTitle>

      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2} mt={2}>
          <Button variant="outlined" component="label">
            Upload Image
            <input hidden type="file" accept="image/*" onChange={handleImage} />
          </Button>

          {preview && (
            <Box
              component="img"
              src={preview}
              sx={{
                width: 120,

                height: 120,

                objectFit: "cover",

                borderRadius: 2,
              }}
            />
          )}

          <TextField
            label="Title"
            name="title"
            value={form.title}
            onChange={handleChange}
          />

          <TextField
            label="Subtitle"
            name="subtitle"
            value={form.subtitle}
            onChange={handleChange}
          />

          <TextField
            label="Description"
            name="description"
            multiline
            rows={3}
            value={form.description}
            onChange={handleChange}
          />

          <TextField
            label="Button Text"
            name="buttonText"
            value={form.buttonText}
            onChange={handleChange}
          />

          <TextField
            label="Button Link"
            name="buttonLink"
            value={form.buttonLink}
            onChange={handleChange}
          />

          <TextField
            label="Order"
            type="number"
            name="order"
            value={form.order}
            onChange={handleChange}
          />

          <FormControlLabel
            control={
              <Switch
                checked={form.visible}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,

                    visible: e.target.checked,
                  }))
                }
              />
            }
            label="Visible"
          />
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={() => setOpen(false)}>Cancel</Button>

        <Button variant="contained" onClick={handleSubmit}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
