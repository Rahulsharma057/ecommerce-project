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
      <Stack direction="row" alignItems="center" gap={1.5} mb={4}>
        <Button
          type="button"
          onClick={() => router.back()}
          sx={{
            minWidth: 40,
            width: 40,
            height: 40,
            borderRadius: 2,
            color: "#18181b",
            border: "1px solid #e4e4e7",
          }}
        >
          <ArrowBackIcon fontSize="small" />
        </Button>
        <Box>
          <Typography sx={{ fontSize: 22, fontWeight: 700, color: "#18181b", lineHeight: 1.2 }}>
            Edit Profile
          </Typography>
          <Typography sx={{ fontSize: 13.5, color: "#71717a", mt: 0.3 }}>
            Update your personal information
          </Typography>
        </Box>
      </Stack>

      <Paper
        variant="outlined"
        sx={{
          p: 4,
          borderRadius: 3,
          borderColor: "#e4e4e7",
        }}
      >
        <form onSubmit={handleSubmit}>
          <Stack spacing={4}>
            {/* Avatar */}
            <Stack alignItems="center" spacing={1.5}>
              <Avatar
                src={form.profilePic}
                sx={{
                  width: 88,
                  height: 88,
                  bgcolor: "#18181b",
                  fontSize: 30,
                  fontWeight: 600,
                }}
              >
                {form.name?.charAt(0)}
              </Avatar>

              <Button
                type="button"
                variant="outlined"
                component="label"
                size="small"
                startIcon={<ImageOutlinedIcon sx={{ fontSize: 17 }} />}
                sx={{
                  borderRadius: 2,
                  borderColor: "#e4e4e7",
                  color: "#27272a",
                  textTransform: "none",
                  fontWeight: 500,
                  "&:hover": { borderColor: "#18181b", bgcolor: "#f4f4f5" },
                }}
              >
                Upload Photo
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
                <Typography variant="caption" sx={{ color: "#71717a" }}>
                  {selectedFile.name}
                </Typography>
              )}

              {form.profilePic && (
                <Button
                  type="button"
                  size="small"
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
                  sx={{
                    color: "#dc2626",
                    textTransform: "none",
                    fontWeight: 500,
                    "&:hover": { bgcolor: "#fef2f2" },
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
                        <PersonOutlineIcon sx={{ color: "#a1a1aa", fontSize: 20 }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      "& fieldset": { borderColor: "#e4e4e7" },
                      "&:hover fieldset": { borderColor: "#a1a1aa" },
                      "&.Mui-focused fieldset": { borderColor: "#18181b" },
                    },
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
                        <PhoneOutlinedIcon sx={{ color: "#a1a1aa", fontSize: 20 }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      "& fieldset": { borderColor: "#e4e4e7" },
                      "&:hover fieldset": { borderColor: "#a1a1aa" },
                      "&.Mui-focused fieldset": { borderColor: "#18181b" },
                    },
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
                        <WcOutlinedIcon sx={{ color: "#a1a1aa", fontSize: 20 }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      "& fieldset": { borderColor: "#e4e4e7" },
                      "&:hover fieldset": { borderColor: "#a1a1aa" },
                      "&.Mui-focused fieldset": { borderColor: "#18181b" },
                    },
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
                        <CalendarMonthOutlinedIcon sx={{ color: "#a1a1aa", fontSize: 20 }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      "& fieldset": { borderColor: "#e4e4e7" },
                      "&:hover fieldset": { borderColor: "#a1a1aa" },
                      "&.Mui-focused fieldset": { borderColor: "#18181b" },
                    },
                  }}
                />
              </Grid>
            </Grid>

            {/* Buttons */}
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button
                type="button"
                variant="outlined"
                onClick={() => router.back()}
                sx={{
                  borderRadius: 2,
                  borderColor: "#e4e4e7",
                  color: "#27272a",
                  textTransform: "none",
                  fontWeight: 500,
                  px: 3,
                  "&:hover": { borderColor: "#18181b", bgcolor: "#f4f4f5" },
                }}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                sx={{
                  borderRadius: 2,
                  bgcolor: "#18181b",
                  textTransform: "none",
                  fontWeight: 600,
                  px: 3,
                  boxShadow: "none",
                  "&:hover": { bgcolor: "#27272a", boxShadow: "none" },
                }}
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