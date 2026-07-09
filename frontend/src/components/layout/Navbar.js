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
  ListItemText,
  Divider,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import { useSelector } from "react-redux";
import SearchBar from "./SearchBar";
import Tooltip from "@mui/material/Tooltip";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Women", href: "/products?category=Women" },
  { label: "Men", href: "/products?category=Men" },
  { label: "New Arrivals", href: "/products?type=new-arrivals" },
  { label: "Sale", href: "/products?type=sale" },
  { label: "Products", href: "/products" },
];

export default function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const router = useRouter();
  const cartItems = useSelector((state) => state.cart.items);
  const wishlistItems = useSelector((state) => state.wishlist.items);

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
      const storedUser = localStorage.getItem("user");
      setUser(storedUser ? JSON.parse(storedUser) : null);
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
    localStorage.removeItem("token");
    localStorage.removeItem("user");
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
          <FavoriteBorderOutlinedIcon fontSize="small" />
        </Badge>
      </IconButton>

      <IconButton
        component={Link}
        href="/profile"
        size="small"
        aria-label="Profile"
      >
        <PersonOutlineOutlinedIcon fontSize="small" />
      </IconButton>

      <IconButton component={Link} href="/cart" size="small" aria-label="Cart">
        <Badge badgeContent={cartItems.length} color="error">
          <ShoppingBagOutlinedIcon fontSize="small" />
        </Badge>
      </IconButton>

      {user && (
        <IconButton
          component={Link}
          href="/profile"
          size="small"
          aria-label="Profile"
          sx={{ display: { xs: "inline-flex", md: "none" } }}
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
              "&:hover": {
                backgroundColor: "black", // ya "transparent"
                boxShadow: "none",
                color: "#ffffff",
                border: "1px solid black",
                // transform: "translateY(-2px)",

                "&::after": {
                  width: "70%",
                },
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
          overflowX: "hidden", // 🔥 IMPORTANT
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
                    flexWrap: "nowrap",
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
                      variant="outlined"
                      sx={{
                        display: { xs: "none", md: "inline-flex" },
                        borderRadius: "50%", // 🔥 circle
                        minWidth: 36,
                        width: 36,
                        border: "none",
                        height: 36,
                        p: 0,
                        color: "white",
                        fontWeight: 700,
                        bgcolor: "#858282",
                        "&:hover": {
                          backgroundColor: "black", // ya "transparent"
                          boxShadow: "none",
                          color: "#ffffff",
                          border: "1px solid black",
                          // transform: "translateY(-2px)",

                          "&::after": {
                            width: "70%",
                          },
                        },
                      }}
                    >
                      {getInitial(user.name)}
                      {/*    {user.name} */}
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
                <Button
                  component={Link}
                  href="/login"
                  size="small"
                  variant="outlined"
                  sx={{
                    display: { xs: "none", md: "inline-flex" },
                    ml: 1,
                    fontSize: 13,
                    fontWeight: 500,
                    borderRadius: 2,
                    px: 2,
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
        PaperProps={{
          sx: {
            width: 280,
            pt: 2,
            borderRight: "0.5px solid",
            borderColor: "divider",
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
            pb: 2,
            mt: {
              xs: 4,
              md: 0,
            },
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

        <Divider sx={{ mx: 2, borderColor: "divider", opacity: 0.6, mt: 1 }} />

        {/* Login in drawer */}
        <Box sx={{ px: 2.5, pt: 2 }}>
          {user ? (
            <>
              {user.role === "admin" && (
                <Button
                  fullWidth
                  component={Link}
                  href="/admin/products"
                  onClick={() => setDrawerOpen(false)}
                >
                  Admin Panel
                </Button>
              )}

              <Button
                fullWidth
                component={Link}
                href="/profile"
                onClick={() => setDrawerOpen(false)}
              >
                Profile
              </Button>

              <Button
                fullWidth
                color="error"
                onClick={() => setLogoutOpen(true)}
                sx={{ mt: 1 }}
              >
                Logout
              </Button>
            </>
          ) : (
            <Button
              fullWidth
              component={Link}
              href="/login"
              variant="outlined"
              onClick={() => setDrawerOpen(false)}
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
