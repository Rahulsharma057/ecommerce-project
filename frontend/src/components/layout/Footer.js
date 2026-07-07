"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Stack,
  Divider,
  IconButton,
} from "@mui/material";
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";
import XIcon from "@mui/icons-material/X";
import PinterestIcon from "@mui/icons-material/Pinterest";
import { subscribeNewsletter } from "@/services/newsletter";
const FOOTER_LINKS = {
  Shop: [
    { label: "Women", href: "/products?category=Women" },
    { label: "Men", href: "/products?category=Men" },
    { label: "New Arrivals", href: "/products?type=new-arrivals" },
    { label: "Sale", href: "/products?type=sale" },
    { label: "All Products", href: "/products" },
  ],
  Help: [
    { label: "FAQs", href: "/faqs" },
    { label: "Shipping & Returns", href: "/profile/orders" },
    { label: "Size Guide", href: "/size-guide" },
    { label: "Track Order", href: "/profile/orders" },
    { label: "Contact Us", href: "/contact" },
  ],
  Company: [
    { label: "About Us", href: "/about" },
    { label: "Careers", href: "/careers" },
    { label: "Sustainability", href: "/sustainability" },
    { label: "Press", href: "/press" },
    { label: "Affiliates", href: "/affiliates" },
  ],
};

const SOCIALS = [
  {
    icon: <InstagramIcon fontSize="small" />,
    href: "https://instagram.com",
    label: "Instagram",
  },
  {
    icon: <FacebookIcon fontSize="small" />,
    href: "https://facebook.com",
    label: "Facebook",
  },
  { icon: <XIcon fontSize="small" />, href: "https://x.com", label: "X" },
  {
    icon: <PinterestIcon fontSize="small" />,
    href: "https://pinterest.com",
    label: "Pinterest",
  },
];

const linkSx = {
  component: Link,
  sx: {
    color: "#999",
    textDecoration: "none",
    fontSize: 13,
    lineHeight: 1,
    transition: "color 0.15s",
    "&:hover": { color: "#fff" },
  },
};

export default function Footer() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

const handleSubscribe = async () => {
  if (!email.trim()) {
    alert("Please enter email");
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    alert("Please enter a valid email");
    return;
  }

  try {
    setLoading(true);

    const res = await subscribeNewsletter({
      email,
    });

    alert(res.data.message);

    setEmail("");
  } catch (err) {
    alert(err.response?.data?.message || "Something went wrong");
  } finally {
    setLoading(false);
  }
};
  return (
    <Box
      sx={{ bgcolor: "#0D0D0D", color: "#fff", pt: { xs: 6, md: 8 }, pb: 4 }}
    >
      <Container maxWidth="xl">
        {/* ── Top row ── */}
        <Grid container spacing={{ xs: 5, md: 4 }}>
          {/* Brand column */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography
              variant="h6"
              fontWeight={800}
              letterSpacing="0.15em"
              sx={{
                mb: 1.5,
                position: "relative",
                display: "inline-block",
                "&::after": {
                  content: '""',
                  display: "block",
                  height: "2px",
                  width: "28px",
                  bgcolor: "#C9A96E",
                  mt: "6px",
                  borderRadius: "1px",
                },
              }}
            >
              VELOURA
            </Typography>

            <Typography
              sx={{
                color: "#777",
                fontSize: 13,
                lineHeight: 1.7,
                maxWidth: 220,
                mb: 3,
              }}
            >
              Premium fashion & lifestyle. Crafted for those who move with
              intention.
            </Typography>

            {/* Social icons */}
            <Stack direction="row" spacing={0.5}>
              {SOCIALS.map((s) => (
                <IconButton
                  key={s.label}
                  component="a"
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  size="small"
                  sx={{
                    color: "#666",
                    border: "0.5px solid #2a2a2a",
                    borderRadius: 2,
                    width: 32,
                    height: 32,
                    transition: "all 0.15s",
                    "&:hover": {
                      color: "#fff",
                      borderColor: "#555",
                      bgcolor: "#1a1a1a",
                    },
                  }}
                >
                  {s.icon}
                </IconButton>
              ))}
            </Stack>
          </Grid>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
            <Grid item xs={6} sm={3} md={2} key={heading}>
              <Typography
                variant="overline"
                sx={{
                  fontSize: 10,
                  letterSpacing: "0.12em",
                  color: "#555",
                  display: "block",
                  mb: 2,
                }}
              >
                {heading}
              </Typography>
              <Stack spacing={1.5}>
                {links.map((link) => (
                  <Typography
                    key={link.href}
                    component={Link}
                    href={link.href}
                    {...linkSx}
                  >
                    {link.label}
                  </Typography>
                ))}
              </Stack>
            </Grid>
          ))}

          {/* Newsletter column */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography
              variant="overline"
              sx={{
                fontSize: 10,
                letterSpacing: "0.12em",
                color: "#555",
                display: "block",
                mb: 2,
              }}
            >
              Stay in the loop
            </Typography>
            <Typography
              sx={{ color: "#777", fontSize: 13, lineHeight: 1.6, mb: 2 }}
            >
              Early access to drops, exclusive offers, and style notes.
            </Typography>

            {/* Email input row */}
            <Box
              sx={{
                display: "flex",
                border: "0.5px solid #2a2a2a",
                borderRadius: 2,
                overflow: "hidden",
                "&:focus-within": { borderColor: "#555" },
              }}
            >
              <Box
                component="input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => {
    if (e.key === "Enter") {
      handleSubscribe();
    }
  }}
                placeholder="your@email.com"
                sx={{
                  flex: 1,
                  bgcolor: "transparent",
                  border: "none",
                  outline: "none",
                  color: "#fff",
                  fontSize: 13,
                  px: 1.5,
                  py: 1,
                  fontFamily: "inherit",
                  "::placeholder": {
                    color: "#444",
                  },
                }}
              />
              <Box
                component="button"
                type="button"
                onClick={handleSubscribe}
                /*   onKeyDown={(e) => {
  if (e.key === "Enter") {
    handleSubscribe();
  }
}} */
                disabled={loading}
                sx={{
                  bgcolor: "#C9A96E",
                  color: "#111",
                  border: "none",
                  px: 2,
                  cursor: "pointer",
                  fontWeight: 700,
                  "&:hover": {
                    bgcolor: "#b8945a",
                  },
                  "&:disabled": {
                    opacity: 0.6,
                    cursor: "not-allowed",
                  },
                }}
              >
                {loading ? "Joining..." : "JOIN"}
              </Box>
            </Box>

            <Typography
              sx={{ color: "#444", fontSize: 11, mt: 1.5, lineHeight: 1.5 }}
            >
              By subscribing you agree to our{" "}
              <Typography
                component={Link}
                href="/privacy"
                sx={{
                  color: "#666",
                  fontSize: 11,
                  "&:hover": { color: "#999" },
                }}
              >
                Privacy Policy
              </Typography>
              .
            </Typography>
          </Grid>
        </Grid>

        {/* ── Divider ── */}
        <Divider sx={{ borderColor: "#1e1e1e", my: { xs: 4, md: 5 } }} />

        {/* ── Bottom row ── */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          alignItems={{ xs: "flex-start", sm: "center" }}
          justifyContent="space-between"
          spacing={2}
        >
          <Typography sx={{ color: "#444", fontSize: 12 }}>
            © 2026 Veloura. All rights reserved.
          </Typography>

          <Stack direction="row" spacing={2.5}>
            {["Privacy Policy", "Terms of Use", "Cookie Settings"].map(
              (label) => (
                <Typography
                  key={label}
                  component={Link}
                  href={`/${label.toLowerCase().replace(/ /g, "-")}`}
                  sx={{
                    color: "#444",
                    fontSize: 12,
                    textDecoration: "none",
                    "&:hover": { color: "#888" },
                  }}
                >
                  {label}
                </Typography>
              ),
            )}
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
