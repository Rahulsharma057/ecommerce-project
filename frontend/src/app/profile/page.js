"use client";

import {
  Container,
  Paper,
  Avatar,
  Typography,
  Stack,
  Button,
  Divider,
  Grid,
  Box,
  Card,
  CardContent,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import {
  Person,
  LocationOn,
  ShoppingBag,
  Logout,
  Email,
  Phone,
  Cake,
} from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { API_URL } from "@/lib/api";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const res = await fetch(
          `${API_URL}/users/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchProfile();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    router.push("/login");
  };

  if (!user) {
    return (
      <Container sx={{ py: 8 }}>
        <Typography>Loading...</Typography>
      </Container>
    );
  }
function InfoItem({ icon, label, value, iconBg, iconColor, muted }) {
  return (
    <Grid item xs={12} sm={6}>
      <Stack direction="row" alignItems="center" gap={2}>
        <Box
          sx={{
            width: 42,
            height: 42,
            borderRadius: 2.5,
            bgcolor: iconBg,
            color: iconColor,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          {icon}
        </Box>

        <Box sx={{ minWidth: 0 }}>
          <Typography
            variant="body2"
            sx={{ color: "#94a3b8", fontSize: 12, fontWeight: 500 }}
          >
            {label}
          </Typography>
          <Typography
            fontWeight={600}
            noWrap
            sx={{ color: muted ? "#cbd5e1" : "#1e293b", fontSize: 14.5 }}
          >
            {value}
          </Typography>
        </Box>
      </Stack>
    </Grid>
  );
}
  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Stack
  direction="row"
  justifyContent="space-between"
  alignItems="center"
  mb={4}
>
  <Box display="flex" alignItems="center" gap={1}>
    <Button
      onClick={() => router.back()}
      sx={{
        minWidth: 42,
        width: 42,
        height: 42,
        borderRadius: 2,
        color: "#111827",
        mb:3
      }}
    >
      <ArrowBackIcon />
    </Button>

    <Box>
      <Typography
        sx={{
          fontSize: 24,
          fontWeight: 700,
          color: "#111827",
          lineHeight: 1.2,
        }}
      >
        My Profile
      </Typography>

      <Typography
        sx={{
          fontSize: 14,
          color: "text.secondary",
          mt: 0.3,
        }}
      >
        Manage your account settings
      </Typography>
    </Box>
  </Box>
</Stack>
  <Grid container spacing={3}>
        {/* Sidebar */}
       <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 4,
              borderRadius: 4,
              textAlign: "center",
            }}
          >
            <Avatar
              src={user.profilePic}
              sx={{
                width: 120,
                height: 120,
                mx: "auto",
                mb: 2,
              }}
            >
              {user.name?.charAt(0)}
            </Avatar>

            <Typography variant="h5" fontWeight={700}>
              {user.name}
            </Typography>

            <Typography color="text.secondary">
              {user.email}
            </Typography>

          <Stack spacing={1.5} mt={4}>
              <Button
                fullWidth
                variant="contained"
                startIcon={<Person />}
                onClick={() =>
                  router.push("/profile/edit")
                }
                  sx={{
    bgcolor: "#2563eb",
    "&:hover": {
      bgcolor: "#1d4ed8",
    },
  }}
              >
                Edit Profile
              </Button>

              <Button
                fullWidth
                color="success"
                variant="outlined"
                startIcon={<LocationOn />}
                onClick={() =>
                  router.push("/profile/address")
                }  sx={{
  
    "&:hover": {
      bgcolor: "#15803d",color:"white"
    },
  }}
              >
                My Addresses
              </Button>

              <Button
                fullWidth
                variant="outlined"
                startIcon={<ShoppingBag />}
                onClick={() =>
                  router.push("/profile/orders")
                }
                color="secondary"
                  sx={{

    "&:hover": {
      bgcolor: "#6d28d9",color:"white"
    },
  }}
              >
                My Orders
              </Button>

              <Button
                fullWidth
                color="error"
                variant="outlined"
                startIcon={<Logout />}
                onClick={handleLogout}
                 sx={{

    "&:hover": {
      bgcolor: "#b91c1c",color:'white'
    },
  }}
              >
                Logout
              </Button>
            </Stack>
          </Paper>
        </Grid>

        {/* Details */}
  <Grid item xs={12} md={8}>
<Card
  sx={{
    borderRadius: 4,
    boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
    border: "1px solid #f1f5f9",
  }}
>
  <CardContent sx={{ p: 4 }}>
    <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3}>
      <Box>
        <Typography variant="h5" fontWeight={700} sx={{ color: "#0f172a" }}>
          Personal Information
        </Typography>
        <Typography variant="body2" sx={{ color: "#94a3b8", mt: 0.3 }}>
          Your basic account details
        </Typography>
      </Box>
    </Stack>

    <Divider sx={{ mb: 3.5, borderColor: "#f1f5f9" }} />

    <Grid container rowSpacing={3.5} columnSpacing={3}>
      <InfoItem
        icon={<Person sx={{ fontSize: 19 }} />}
        label="Full Name"
        value={user.name}
        iconBg="#eef2ff"
        iconColor="#4f46e5"
      />

      <InfoItem
        icon={<Email sx={{ fontSize: 19 }} />}
        label="Email"
        value={user.email}
        iconBg="#f0fdf4"
        iconColor="#16a34a"
      />

      <InfoItem
        icon={<Phone sx={{ fontSize: 19 }} />}
        label="Phone"
        value={user.phone || "Not Added"}
        muted={!user.phone}
        iconBg="#fff7ed"
        iconColor="#ea580c"
      />

      <InfoItem
        icon={<Person sx={{ fontSize: 19 }} />}
        label="Gender"
        value={user.gender || "Not Added"}
        muted={!user.gender}
        iconBg="#f5f3ff"
        iconColor="#7c3aed"
      />

      <InfoItem
        icon={<Cake sx={{ fontSize: 19 }} />}
        label="Date of Birth"
        value={user.dob ? new Date(user.dob).toLocaleDateString() : "Not Added"}
        muted={!user.dob}
        iconBg="#fef2f2"
        iconColor="#dc2626"
      />
    </Grid>
  </CardContent>
</Card>
        </Grid>
      </Grid>
    </Container>
  );
}