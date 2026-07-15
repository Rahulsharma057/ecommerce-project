"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  IconButton,
  Container,
  Badge,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import NewReleasesOutlinedIcon from "@mui/icons-material/NewReleasesOutlined";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import LoginOutlinedIcon from "@mui/icons-material/LoginOutlined";
import { useSelector } from "react-redux";
import SearchBar from "./SearchBar";
import Tooltip from "@mui/material/Tooltip";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const NAV_LINKS = [
  { label: "Home", href: "/", icon: <HomeOutlinedIcon fontSize="small" /> },
  {
    label: "Women",
    href: "/products?category=Women",
    icon: <Inventory2OutlinedIcon fontSize="small" />,
  },
  {
    label: "Men",
    href: "/products?category=Men",
    icon: <Inventory2OutlinedIcon fontSize="small" />,
  },
  {
    label: "New Arrivals",
    href: "/products?type=new-arrivals",
    icon: <NewReleasesOutlinedIcon fontSize="small" />,
  },
  {
    label: "Sale",
    href: "/products?type=sale",
    icon: <LocalOfferOutlinedIcon fontSize="small" />,
  },
  {
    label: "Products",
    href: "/products",
    icon: <Inventory2OutlinedIcon fontSize="small" />,
  },
];

const safeGetItem = (key) => {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(key);
  } catch (err) {
    console.error("localStorage read error:", err);
    return null;
  }
};

const safeJsonParse = (value, fallback = null) => {
  if (!value) return fallback;
  try {
    return JSON.parse(value);
  } catch (err) {
    console.error("JSON parse error:", err);
    return fallback;
  }
};

export default function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const router = useRouter();

  // 🔐 crash-safe selectors: fall back to [] if slice/items is undefined
  // (e.g. store not rehydrated yet), so `.length` never throws.
  const cartItems = useSelector((state) => state.cart?.items) || [];
  const wishlistItems = useSelector((state) => state.wishlist?.items) || [];

  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState(null);
  const [logoutOpen, setLogoutOpen] = useState(false);

  const getInitial = (name) => {
    if (!name) return "U";
    return name.trim().charAt(0).toUpperCase();
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const syncUser = () => {
      const storedUser = safeGetItem("user");
      setUser(safeJsonParse(storedUser));
    };

    syncUser();

    window.addEventListener("storage", syncUser);
    window.addEventListener("focus", syncUser);
    window.addEventListener("userChanged", syncUser);

    return () => {
      window.removeEventListener("storage", syncUser);
      window.removeEventListener("focus", syncUser);
      window.removeEventListener("userChanged", syncUser);
    };
  }, []);

  const handleLogout = () => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    } catch (err) {
      console.error("localStorage clear error:", err);
    }
    window.dispatchEvent(new Event("userChanged"));
    setUser(null);
    setLogoutOpen(false);
    setDrawerOpen(false);
    toast.success("Logged out successfully !! ");

    setTimeout(() => {
      router.replace("/login");
    }, 800);
  };

  if (!mounted) {
    return (
      <AppBar position="sticky" sx={{ bgcolor: "#fff" }}>
        <Toolbar>
          <Typography>Loading...</Typography>
        </Toolbar>
      </AppBar>
    );
  }

  const iconButtons = (
    <>
      <IconButton
        component={Link}
        href="/wishlist"
        size="small"
        aria-label="Wishlist"
      >
        <Badge badgeContent={wishlistItems.length} color="error">
          <FavoriteBorderOutlinedIcon sx={{color:"rgba(36, 36, 36, 0.92)"}} fontSize="small" />
        </Badge>
      </IconButton>

      <IconButton
        component={Link}
        href="/profile/orders"
        size="small"
        aria-label="My Orders"
      >
        <LocalShippingOutlinedIcon  sx={{color:"rgba(42, 42, 42, 0.92)"}}  fontSize="small" />
      </IconButton>

      {/*   <IconButton
        component={Link}
        href="/profile"
        size="small"
        aria-label="Profile"
      >
        <PersonOutlineOutlinedIcon fontSize="small" />
      </IconButton> */}

      <IconButton component={Link} href="/cart" size="small" aria-label="Cart">
        <Badge badgeContent={cartItems.length} color="error">
          <ShoppingCartOutlinedIcon  sx={{color:"rgba(42, 42, 42, 0.92)"}}  fontSize="small" />
        </Badge>
      </IconButton>

      {user && (
        <IconButton
          component={Link}
          href="/profile"
          size="small"
          aria-label="Profile"
          sx={{ display: { xs: "inline-flex", md: "none" }, ml: 0.5 }}
        >
          <Box
            sx={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              bgcolor: "#858282",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 12,
              fontWeight: 700,
              transition: "all .2s ease",
              "&:hover": {
                backgroundColor: "black",
                boxShadow: "none",
                color: "#ffffff",
                border: "1px solid black",
              },
            }}
          >
            {getInitial(user.name)}
          </Box>
        </IconButton>
      )}
    </>
  );

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: "#fff",
          color: "#111",
          borderBottom: "1px solid #E5E7EB",
          overflowX: "hidden",
          zIndex: (theme) => theme.zIndex.drawer + 2,
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ minHeight: { xs: 56, md: 64 } }}>
            {/* ── Mobile: hamburger ── */}
            <IconButton
              edge="start"
              onClick={() => setDrawerOpen(true)}
              aria-label="Open menu"
              sx={{ display: { xs: "flex", md: "none" }, mr: 1, flexShrink: 0 }}
            >
              <MenuIcon />
            </IconButton>

            {/* ── Logo ── */}
            <Typography
              component={Link}
              href="/"
              variant="h6"
              sx={{
                textDecoration: "none",
                color: "inherit",
                fontWeight: 800,
                letterSpacing: "0.15em",
                fontSize: { xs: "1rem", md: "1.2rem" },
                flexShrink: 0,
                "&::after": {
                  content: '""',
                  display: "block",
                  height: "2px",
                  width: "24px",
                  bgcolor: "#C9A96E",
                  mt: "2px",
                  borderRadius: "1px",
                },
              }}
            >
              VELOURA
            </Typography>

            {/* ── Desktop nav links ── */}
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                gap: 0.5,
                ml: 4,
                flexWrap: "nowrap",
              }}
            >
              {NAV_LINKS.map((link) => (
                <Button
                  key={link.href}
                  color="inherit"
                  component={Link}
                  href={link.href}
                  sx={{
                    position: "relative",
                    fontSize: "10.5px",
                    fontWeight: 600,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "#555",
                    px: 1,
                    py: 1,
                    borderRadius: 2,
                    transition: "all .3s ease",

                    "&::after": {
                      content: '""',
                      position: "absolute",
                      left: "50%",
                      bottom: 6,
                      width: 0,
                      height: "2px",
                      bgcolor: "#111",
                      transition: "all .3s ease",
                      transform: "translateX(-50%)",
                      borderRadius: "10px",
                    },

                    "&:hover": {
                      bgcolor: "transparent",
                      color: "#111",
                      transform: "translateY(-2px)",

                      "&::after": {
                        width: "70%",
                      },
                    },

                    ...(link.label === "Sale" && {
                      color: "#D85A30",

                      "&::after": {
                        bgcolor: "#D85A30",
                      },

                      "&:hover": {
                        color: "#B63E15",
                        bgcolor: "transparent",
                      },
                    }),
                  }}
                >
                  {link.label}
                </Button>
              ))}
            </Box>

            {/* ── Spacer ── */}
            <Box sx={{ flexGrow: 1 }} />

            {/* ── Search bar (hidden on xs) ── */}
            <Box sx={{ display: { xs: "none", sm: "block" }, mr: 1.2 }}>
              <SearchBar fullWidth />
            </Box>

            {/* ── Icon buttons ── */}
            <Stack
              direction="row"
              alignItems="center"
              spacing={0.1}
              sx={{
                flexShrink: 0,
                maxWidth: "100%",
              }}
            >
              {iconButtons}

              {user ? (
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{
                    alignItems: "center",
                    flexShrink: 0,
                    ml: 0.5,
                  }}
                >
                  {user.role === "admin" && (
                    <Button
                      component={Link}
                      href="/admin/products"
                      size="small"
                      variant="contained"
                      sx={{
                        display: { xs: "none", md: "inline-flex" },
                        borderRadius: 2,
                        bgcolor: "#111",
                      }}
                    >
                      Admin
                    </Button>
                  )}

                  <Tooltip title={user.name}>
                    <Button
                      component={Link}
                      href="/profile"
                      size="small"
                      sx={{
                        display: { xs: "none", md: "inline-flex" },
                        minWidth: 36,
                        width: 36,
                        height: 36,
                        borderRadius: "50%",
                        p: 0,
                        bgcolor: "#858282",
                        color: "#fff",
                        fontWeight: 700,

                        "&:hover": {
                          bgcolor: "#000",
                        },
                      }}
                    >
                      {getInitial(user.name)}
                    </Button>
                  </Tooltip>

                  <Button
                    size="small"
                    color="error"
                    variant="outlined"
                    onClick={() => setLogoutOpen(true)}
                    sx={{
                      display: { xs: "none", md: "inline-flex" },
                      borderRadius: 2,
                    }}
                  >
                    Logout
                  </Button>
                </Stack>
              ) : (
                // 🔥 USER NOT LOGIN
                <Button
                  component={Link}
                  href="/login"
                  size="small"
                  variant="contained"
                  sx={{
                    display: "inline-flex",
                    ml: 1,
                    px: 1,
                    py: 0.5,
                    bgcolor: "#262626",
                    color: "#fff",
                    fontSize: 11,
                    fontWeight: 600,
                    borderRadius: 1,

                    "&:hover": {
                      bgcolor: "#000",
                    },
                  }}
                >
                  Login
                </Button>
              )}
            </Stack>
          </Toolbar>

          {/* ── Mobile search bar ── */}
          <Box
            sx={{
              display: { xs: "block", sm: "none" },
              pb: 1.5,
              px: 0.5,
            }}
          >
            <SearchBar fullWidth />
          </Box>
        </Container>
      </AppBar>

      {/* ── Mobile Drawer ── */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 3, // 🔥 keep above the AppBar
        }}
        PaperProps={{
          sx: {
            width: 290,
            borderRight: "0.5px solid",
            borderColor: "divider",
            display: "flex",
            flexDirection: "column",
            zIndex: (theme) => theme.zIndex.drawer + 3,
          },
        }}
      >
        {/* Drawer header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: 2.5,
            py: 2,
          }}
        >
          <Typography
            variant="h6"
            fontWeight={800}
            letterSpacing="0.15em"
            sx={{
              "&::after": {
                content: '""',
                display: "block",
                height: "2px",
                width: "24px",
                bgcolor: "#C9A96E",
                mt: "2px",
                borderRadius: "1px",
              },
            }}
          >
            VELOURA
          </Typography>
          <IconButton
            size="small"
            onClick={() => setDrawerOpen(false)}
            aria-label="Close menu"
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        <Divider sx={{ borderColor: "divider", opacity: 0.6 }} />

        {/* User info card (only when logged in) */}
        {user && (
          <>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                px: 2.5,
                py: 2,
              }}
            >
              <Avatar
                sx={{
                  bgcolor: "#858282",
                  width: 42,
                  height: 42,
                  fontWeight: 700,
                  fontSize: 16,
                }}
              >
                {getInitial(user.name)}
              </Avatar>
              <Box sx={{ minWidth: 0 }}>
                <Typography
                  fontWeight={700}
                  fontSize={14}
                  noWrap
                  sx={{ maxWidth: 170 }}
                >
                  {user.name}
                </Typography>
                {user.email && (
                  <Typography
                    fontSize={12}
                    color="text.secondary"
                    noWrap
                    sx={{ maxWidth: 170 }}
                  >
                    {user.email}
                  </Typography>
                )}
              </Box>
            </Box>
            <Divider sx={{ borderColor: "divider", opacity: 0.6 }} />
          </>
        )}

        {/* Scrollable content */}
        <Box sx={{ flex: 1, overflowY: "auto" }}>
          {/* Nav links */}
          <List sx={{ px: 1.5, pt: 1.5 }}>
            {NAV_LINKS.map((link) => (
              <ListItemButton
                key={link.href}
                component={Link}
                href={link.href}
                onClick={() => setDrawerOpen(false)}
                sx={{
                  borderRadius: 2,
                  mb: 0.25,
                  py: 1,
                  px: 1.5,
                  "&:hover": { bgcolor: "grey.100" },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 34,
                    color: link.label === "Sale" ? "#D85A30" : "text.secondary",
                  }}
                >
                  {link.icon}
                </ListItemIcon>
                <ListItemText
                  primary={link.label}
                  primaryTypographyProps={{
                    fontSize: 14,
                    fontWeight: 500,
                    color: link.label === "Sale" ? "#D85A30" : "text.primary",
                  }}
                />
              </ListItemButton>
            ))}
          </List>

          <Divider
            sx={{ mx: 2, borderColor: "divider", opacity: 0.6, my: 1 }}
          />

          {/* Account section */}
          <List sx={{ px: 1.5 }}>
            {user && (
              <ListItemButton
                component={Link}
                href="/profile"
                onClick={() => setDrawerOpen(false)}
                sx={{ borderRadius: 2, mb: 0.25, py: 1, px: 1.5 }}
              >
                <ListItemIcon sx={{ minWidth: 34, color: "text.secondary" }}>
                  <PersonOutlineOutlinedIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText
                  primary="Profile"
                  primaryTypographyProps={{ fontSize: 14, fontWeight: 500 }}
                />
              </ListItemButton>
            )}
            <ListItemButton
              component={Link}
              href="/profile/orders"
              onClick={() => setDrawerOpen(false)}
              sx={{ borderRadius: 2, mb: 0.25, py: 1, px: 1.5 }}
            >
              <ListItemIcon sx={{ minWidth: 34, color: "text.secondary" }}>
                <LocalShippingOutlinedIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary="My Orders"
                primaryTypographyProps={{ fontSize: 14, fontWeight: 500 }}
              />
            </ListItemButton>

            <ListItemButton
              component={Link}
              href="/wishlist"
              onClick={() => setDrawerOpen(false)}
              sx={{ borderRadius: 2, mb: 0.25, py: 1, px: 1.5 }}
            >
              <ListItemIcon sx={{ minWidth: 34, color: "text.secondary" }}>
                <Badge badgeContent={wishlistItems.length} color="error">
                  <FavoriteBorderOutlinedIcon fontSize="small" />
                </Badge>
              </ListItemIcon>
              <ListItemText
                primary="Wishlist"
                primaryTypographyProps={{ fontSize: 14, fontWeight: 500 }}
              />
            </ListItemButton>

            <ListItemButton
              component={Link}
              href="/cart"
              onClick={() => setDrawerOpen(false)}
              sx={{ borderRadius: 2, mb: 0.25, py: 1, px: 1.5 }}
            >
              <ListItemIcon sx={{ minWidth: 34, color: "text.secondary" }}>
                <Badge badgeContent={cartItems.length} color="error">
                  <ShoppingCartOutlinedIcon fontSize="small" />
                </Badge>
              </ListItemIcon>
              <ListItemText
                primary="Cart"
                primaryTypographyProps={{ fontSize: 14, fontWeight: 500 }}
              />
            </ListItemButton>

            {user?.role === "admin" && (
              <ListItemButton
                component={Link}
                href="/admin/products"
                onClick={() => setDrawerOpen(false)}
                sx={{ borderRadius: 2, mb: 0.25, py: 1, px: 1.5 }}
              >
                <ListItemIcon sx={{ minWidth: 34, color: "text.secondary" }}>
                  <AdminPanelSettingsOutlinedIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText
                  primary="Admin Panel"
                  primaryTypographyProps={{ fontSize: 14, fontWeight: 500 }}
                />
              </ListItemButton>
            )}
          </List>
        </Box>

        {/* Footer: Login / Logout — pinned to bottom */}
        <Box sx={{ px: 2, py: 2 }}>
          <Divider sx={{ mb: 2, borderColor: "divider", opacity: 0.6 }} />
          {user ? (
            <Button
              fullWidth
              color="error"
              variant="outlined"
              startIcon={<LogoutOutlinedIcon fontSize="small" />}
              onClick={() => setLogoutOpen(true)}
              sx={{ borderRadius: 2, py: 1 }}
            >
              Logout
            </Button>
          ) : (
            <Button
              fullWidth
              component={Link}
              href="/login"
              variant="contained"
              startIcon={<LoginOutlinedIcon fontSize="small" />}
              onClick={() => setDrawerOpen(false)}
              sx={{ borderRadius: 2, py: 1, bgcolor: "#111" }}
            >
              Login
            </Button>
          )}
        </Box>
      </Drawer>

      <Dialog open={logoutOpen} onClose={() => setLogoutOpen(false)}>
        <DialogTitle>Logout</DialogTitle>

        <DialogContent>
          <Typography>Are you sure you want to logout?</Typography>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setLogoutOpen(false)}>Cancel</Button>

          <Button color="error" variant="contained" onClick={handleLogout}>
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
