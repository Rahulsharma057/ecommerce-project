"use client";

import {
  Container,
  Paper,
  TextField,
  Stack,
  Button,
  MenuItem,
  Typography,
  Grid,
  Avatar,
  Box,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { toast } from "react-toastify";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import WcOutlinedIcon from "@mui/icons-material/WcOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { API_URL } from "@/lib/api";

export default function EditProfile() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    gender: "",
    dob: "",
    profilePic: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_URL}/users/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      setForm({
        name: data.name || "",
        phone: data.phone || "",
        gender: data.gender || "",
        dob: data.dob ? data.dob.slice(0, 10) : "",
        profilePic: data.profilePic || "",
      });
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  setLoading(true);

  try {
    const token = localStorage.getItem("token");

    const formData = new FormData();

    formData.append("name", form.name);
    formData.append("phone", form.phone);
    formData.append("gender", form.gender);
    formData.append("dob", form.dob);

    if (selectedFile) {
      formData.append("profilePic", selectedFile);
    }

    if (!form.profilePic) {
      formData.append("removeProfilePic", "true");
    }

    const res = await fetch(`${API_URL}/users/profile`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await res.json();

    if (!res.ok) {
      toast.error(data.message || "Failed to update profile.");
      return;
    }

    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (storedUser) {
      storedUser.name = data.name;
      storedUser.profilePic = data.profilePic || "";

      localStorage.setItem("user", JSON.stringify(storedUser));

      window.dispatchEvent(new Event("storage"));
    }

    toast.success("Profile updated successfully");

    router.push("/profile");
  } catch (err) {
    console.error(err);
    toast.error("Something went wrong.");
  } finally {
    setLoading(false);
  }
};
  useEffect(() => {
    return () => {
      if (form.profilePic?.startsWith("blob:")) {
        URL.revokeObjectURL(form.profilePic);
      }
    };
  }, [form.profilePic]);

  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      {/* Header */}
      <Stack direction="row" alignItems="center" mb={4}>
        <Button
          type="button"
          sx={{ color: "black", fontSize: "20px", mb: 3 }}
          onClick={() => router.back()}
        >
          <ArrowBackIcon />
        </Button>
        <Box>
          <Typography variant="h4" fontWeight={700}>
            Edit Profile
          </Typography>

          <Typography color="text.secondary">
            Update your personal information
          </Typography>
        </Box>
      </Stack>

      <Paper
        elevation={0}
        sx={{
          p: 4,
          borderRadius: 4,
          border: "1px solid #e5e7eb",
        }}
      >
        <form onSubmit={handleSubmit}>
          <Stack spacing={4}>
            {/* Avatar */}
            <Stack alignItems="center" spacing={2}>
              <Avatar
                src={form.profilePic}
                sx={{
                  width: 90,
                  height: 90,
                }}
              />

              {form.profilePic && (
                <Button
                  type="button"
                  color="error"
                  variant="text"
                  onClick={() => {
                    setSelectedFile(null);

                    if (form.profilePic?.startsWith("blob:")) {
                      URL.revokeObjectURL(form.profilePic);
                    }

                    setForm((prev) => ({
                      ...prev,
                      profilePic: "",
                    }));
                  }}
                >
                  Remove Photo
                </Button>
              )}
            </Stack>

            {/* Fields */}
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Full Name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonOutlineIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PhoneOutlinedIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  select
                  fullWidth
                  label="Gender"
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <WcOutlinedIcon />
                      </InputAdornment>
                    ),
                  }}
                >
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="Date of Birth"
                  name="dob"
                  value={form.dob}
                  onChange={handleChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CalendarMonthOutlinedIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <Button
                  type="button"
                  variant="outlined"
                  component="label"
                  startIcon={<ImageOutlinedIcon />}
                >
                  Upload Profile Image
                  <input
                    hidden
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];

                      if (!file) return;

                      if (file.size > 5 * 1024 * 1024) {
                        toast.error("Image must be less than 5 MB");
                        return;
                      }

                      setSelectedFile(file);

                      setForm((prev) => ({
                        ...prev,
                        profilePic: URL.createObjectURL(file),
                      }));
                    }}
                  />
                </Button>
                {selectedFile && (
                  <Typography variant="body2" color="text.secondary">
                    {selectedFile.name}
                  </Typography>
                )}
              </Grid>
            </Grid>

            {/* Buttons */}
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button
                type="button"
                variant="outlined"
                onClick={() => router.back()}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </Stack>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}
