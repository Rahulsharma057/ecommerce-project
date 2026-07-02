"use client";

import { Box, Container, Typography, Button, Stack } from "@mui/material";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import Link from "next/link";
export default function HeroSection() {
  return (
    <Box
      sx={{
        minHeight: { xs: "auto", md: "88vh" },
        display: "flex",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
        py: { xs: 10, md: 0 },
        background:
          "radial-gradient(circle at 85% 30%, #f3ece4 0%, #faf8f5 45%, #ffffff 100%)",
      }}
    >
      {/* Signature element: oversized serif numeral watermark */}
      <Typography
        aria-hidden
        sx={{
          position: "absolute",
          right: { xs: -40, md: -20 },
          top: { xs: -20, md: "50%" },
          transform: { xs: "none", md: "translateY(-50%)" },
          fontFamily: "Georgia, 'Times New Roman', serif",
          fontSize: { xs: "13rem", sm: "18rem", md: "26rem" },
          lineHeight: 1,
          fontWeight: 400,
          color: "#111",
          opacity: 0.05,
          userSelect: "none",
          pointerEvents: "none",
          letterSpacing: "-0.05em",
        }}
      >
        V
      </Typography>

      <Container sx={{ position: "relative", zIndex: 1 }}>
        <Typography
          sx={{
            fontSize: { xs: "0.75rem", md: "0.85rem" },
            fontWeight: 600,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#8a7560",
            mb: { xs: 2, md: 3 },
          }}
        >
          The Autumn Edit — 2026
        </Typography>

        <Typography
          variant="h2"
          sx={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontWeight: 600,
            maxWidth: 760,
            letterSpacing: "-0.02em",
            lineHeight: { xs: 1.15, md: 1.1 },
            fontSize: {
              xs: "2.5rem",
              sm: "3.2rem",
              md: "4.2rem",
            },
          }}
        >
          Elevate Your Style
          <br />
          With Veloura
        </Typography>

        <Typography
          sx={{
            mt: { xs: 2.5, md: 3 },
            maxWidth: 480,
            fontSize: { xs: "1rem", md: "1.1rem" },
            color: "text.secondary",
            lineHeight: 1.7,
          }}
        >
          Discover timeless fashion crafted for confidence,
          elegance and everyday luxury.
        </Typography>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          sx={{ mt: { xs: 4, md: 5 } }}
        >
    <Link href="/products" style={{ textDecoration: "none" }}>
  <Button
    variant="contained"
    size="large"
    endIcon={<ArrowOutwardIcon sx={{ fontSize: 18 }} />}
    sx={{
      bgcolor: "#111",
      color: "#fff",
      px: 4,
      py: 1.6,
      borderRadius: "2px",
      fontSize: "0.95rem",
      letterSpacing: "0.03em",
      boxShadow: "none",
      "&:hover": {
        bgcolor: "#2a2a2a",
        boxShadow: "none",
      },
    }}
  >
    Shop Collection
  </Button>
</Link>

          <Button
            variant="text"
            size="large"
            sx={{
              color: "#111",
              px: 2,
              py: 1.6,
              fontSize: "0.95rem",
              letterSpacing: "0.03em",
              borderBottom: "1px solid #111",
              borderRadius: 0,
              alignSelf: { xs: "flex-start", sm: "center" },
              "&:hover": {
                bgcolor: "transparent",
                opacity: 0.6,
              },
            }}
          >
            View Lookbook
          </Button>
        </Stack>
      </Container>
    </Box>
  );
}