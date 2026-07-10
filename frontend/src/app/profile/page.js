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
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

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
        const res = await fetch(`${API_URL}/users/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

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

  function InfoItem({ icon, label, value, muted }) {
    return (
      <Grid item xs={12} sm={6}>
        <Stack direction="row" alignItems="center" gap={1.75}>
          <Box
            sx={{
              width: 38,
              height: 38,
              borderRadius: 2,
              bgcolor: "#f4f4f5",
              color: "#52525b",
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
              sx={{ color: "#a1a1aa", fontSize: 11.5, fontWeight: 500, textTransform: "uppercase", letterSpacing: 0.3 }}
            >
              {label}
            </Typography>
            <Typography
              fontWeight={600}
              noWrap
              sx={{ color: muted ? "#a1a1aa" : "#18181b", fontSize: 14.5 }}
            >
              {value}
            </Typography>
          </Box>
        </Stack>
      </Grid>
    );
  }

  const menuItems = [
    { label: "Edit Profile", icon: <Person />, action: () => router.push("/profile/edit") },
    { label: "My Addresses", icon: <LocationOn />, action: () => router.push("/profile/address") },
    { label: "My Orders", icon: <ShoppingBag />, action: () => router.push("/profile/orders") },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Stack direction="row" alignItems="center" gap={1.5} mb={4}>
        <Button
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
            My Account
          </Typography>
          <Typography sx={{ fontSize: 13.5, color: "#71717a", mt: 0.3 }}>
            Manage your profile, orders and addresses
          </Typography>
        </Box>
      </Stack>

      <Grid container spacing={3}>
        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          <Paper
            variant="outlined"
            sx={{
              borderRadius: 3,
              borderColor: "#e4e4e7",
              overflow: "hidden",
            }}
          >
            {/* Profile summary */}
            <Box sx={{ p: 3, textAlign: "center", borderBottom: "1px solid #f4f4f5" }}>
              <Avatar
                src={user.profilePic}
                sx={{
                  width: 76,
                  height: 76,
                  mx: "auto",
                  mb: 1.5,
                  bgcolor: "#18181b",
                  fontSize: 28,
                  fontWeight: 600,
                }}
              >
                {user.name?.charAt(0)}
              </Avatar>

              <Typography fontWeight={700} sx={{ color: "#18181b" }}>
                {user.name}
              </Typography>
              <Typography sx={{ color: "#71717a", fontSize: 13.5 }}>
                {user.email}
              </Typography>
            </Box>

            {/* Menu */}
            <List sx={{ p: 1 }}>
              {menuItems.map((item) => (
                <ListItemButton
                  key={item.label}
                  onClick={item.action}
                  sx={{
                    borderRadius: 2,
                    mb: 0.5,
                    py: 1.1,
                    "&:hover": { bgcolor: "#f4f4f5" },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 38, color: "#52525b" }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{ fontSize: 14.5, fontWeight: 500, color: "#27272a" }}
                  />
                  <ChevronRightIcon sx={{ fontSize: 18, color: "#d4d4d8" }} />
                </ListItemButton>
              ))}

              <Divider sx={{ my: 1, borderColor: "#f4f4f5" }} />

              <ListItemButton
                onClick={handleLogout}
                sx={{
                  borderRadius: 2,
                  py: 1.1,
                  "&:hover": { bgcolor: "#fef2f2" },
                }}
              >
                <ListItemIcon sx={{ minWidth: 38, color: "#dc2626" }}>
                  <Logout />
                </ListItemIcon>
                <ListItemText
                  primary="Logout"
                  primaryTypographyProps={{ fontSize: 14.5, fontWeight: 500, color: "#dc2626" }}
                />
              </ListItemButton>
            </List>
          </Paper>
        </Grid>

        {/* Details */}
        <Grid item xs={12} md={8}>
          <Card
            variant="outlined"
            sx={{
              borderRadius: 3,
              borderColor: "#e4e4e7",
              boxShadow: "none",
            }}
          >
            <CardContent sx={{ p: 3.5 }}>
              <Typography variant="h6" fontWeight={700} sx={{ color: "#18181b" }}>
                Personal Information
              </Typography>
              <Typography variant="body2" sx={{ color: "#71717a", mt: 0.3 }}>
                Your basic account details
              </Typography>

              <Divider sx={{ my: 3, borderColor: "#f4f4f5" }} />

              <Grid container rowSpacing={3} columnSpacing={3}>
                <InfoItem
                  icon={<Person sx={{ fontSize: 18 }} />}
                  label="Full Name"
                  value={user.name}
                />

                <InfoItem
                  icon={<Email sx={{ fontSize: 18 }} />}
                  label="Email"
                  value={user.email}
                />

                <InfoItem
                  icon={<Phone sx={{ fontSize: 18 }} />}
                  label="Phone"
                  value={user.phone || "Not Added"}
                  muted={!user.phone}
                />

                <InfoItem
                  icon={<Person sx={{ fontSize: 18 }} />}
                  label="Gender"
                  value={user.gender || "Not Added"}
                  muted={!user.gender}
                />

                <InfoItem
                  icon={<Cake sx={{ fontSize: 18 }} />}
                  label="Date of Birth"
                  value={user.dob ? new Date(user.dob).toLocaleDateString() : "Not Added"}
                  muted={!user.dob}
                />
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}