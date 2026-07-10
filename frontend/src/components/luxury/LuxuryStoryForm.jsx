import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Card,
  CardContent,
  Button,
  Typography,
  Grid,
  Box,
  TextField,
  Input,
  Stack,
} from "@mui/material";
import { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
const LuxuryStoryForm = ({ initialData, onClose, onSave }) => {
  const [loading, setLoading] = useState(false);

  const [imageFile, setImageFile] = useState(null);

  const [form, setForm] = useState(
    initialData || {
      image: "",

      tagline: "",

      title: "",

      description: "",

      established: "",

      floatingTitle: "",

      floatingDescription: "",

      statOne: {
        number: "",
        title: "",
      },

      statTwo: {
        number: "",
        title: "",
      },

      statThree: {
        number: "",
        title: "",
      },

      buttonText: "",

      buttonLink: "",
    },
  );
  useEffect(() => {
    if (initialData) {
      setForm(initialData);
    }
  }, [initialData]);
  const handleImage = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setImageFile(file);

    setForm((prev) => ({
      ...prev,
      image: URL.createObjectURL(file),
    }));
  };
  const handleSubmit = async () => {
    try {
      setLoading(true);

      const data = new FormData();

      Object.keys(form).forEach((key) => {
        if (key === "statOne" || key === "statTwo" || key === "statThree") {
          data.append(key, JSON.stringify(form[key]));
        } else if (key !== "image") {
          data.append(key, form[key]);
        }
      });

      if (imageFile) {
        data.append("image", imageFile);
      }
for (const [key, value] of data.entries()) {
  console.log(key, value);
}
console.log(form);
console.log(form.statOne);
console.log(form.statTwo);
console.log(form.statThree);
      console.log("data", data);

      await onSave(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Dialog open maxWidth="md" fullWidth>
      <DialogTitle>
        {initialData ? "Update Luxury Story" : "Add Luxury Story"}

        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 10,
            top: 10,
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Card>
          <CardContent>
            <Typography variant="h5" fontWeight={700} mb={3}>
              Luxury Story
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Button component="label" variant="outlined">
                  Upload Image
                  <input hidden type="file" onChange={handleImage} />
                </Button>

                {form.image && (
                  <Box mt={2}>
                    <img
                      src={form.image}
                      width={220}
                      style={{
                        borderRadius: 15,
                      }}
                    />
                  </Box>
                )}
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Tagline"
                  name="tagline"
                  value={form.tagline}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      tagline: e.target.value,
                    })
                  }
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Title"
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
                  rows={5}
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

              <Grid item xs={12}>
                <Typography variant="h6" mb={2}>
                  Floating Card
                </Typography>
              </Grid>

              <Grid item md={6} xs={12}>
                <TextField
                  fullWidth
                  label="Established"
                  value={form.established}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      established: e.target.value,
                    })
                  }
                />
              </Grid>

              <Grid item md={6} xs={12}>
                <TextField
                  fullWidth
                  label="Floating Title"
                  value={form.floatingTitle}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      floatingTitle: e.target.value,
                    })
                  }
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Floating Description"
                  value={form.floatingDescription}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      floatingDescription: e.target.value,
                    })
                  }
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h6" mb={2}>
                  Statistics
                </Typography>
              </Grid>

              {[1, 2, 3].map((item) => (
                <Grid item xs={12} md={4} key={item}>
                  <Stack spacing={2}>
                    <TextField
                      label={`Stat ${item} Number`}
                      value={
                        form[
                          `stat${item === 1 ? "One" : item === 2 ? "Two" : "Three"}`
                        ].number
                      }
                      onChange={(e) => {
                        const key =
                          item === 1
                            ? "statOne"
                            : item === 2
                              ? "statTwo"
                              : "statThree";

                        setForm({
                          ...form,
                          [key]: {
                            ...form[key],
                            number: e.target.value,
                          },
                        });
                      }}
                    />

                    <TextField
                      label={`Stat ${item} Title`}
                      value={
                        form[
                          `stat${item === 1 ? "One" : item === 2 ? "Two" : "Three"}`
                        ].title
                      }
                      onChange={(e) => {
                        const key =
                          item === 1
                            ? "statOne"
                            : item === 2
                              ? "statTwo"
                              : "statThree";

                        setForm({
                          ...form,
                          [key]: {
                            ...form[key],
                            title: e.target.value,
                          },
                        });
                      }}
                    />
                  </Stack>
                </Grid>
              ))}

              <Grid item md={6} xs={12}>
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
              </Grid>
            </Grid>

            <Button
              sx={{
                mt: 4,
              }}
              variant="contained"
              size="large"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default LuxuryStoryForm;
