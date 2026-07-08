"use client";

import { Box, Container, Typography, Button, Stack, Chip } from "@mui/material";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import CheckIcon from "@mui/icons-material/Check";
import StarIcon from "@mui/icons-material/Star";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import Link from "next/link";
    import Image from "next/image";
export default function HeroSection() {
  return (
    <Box
      sx={{
        bgcolor: "#fdfcfb",
        py: { xs: 8, md: 10 },
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1.1fr 0.9fr" },
            gap: { xs: 6, md: 5 },
            alignItems: "center",
          }}
        >
          {/* LEFT: content */}
          <Box>
            <Chip
              icon={<AutoAwesomeIcon sx={{ fontSize: 14 }} />}
              label="Autumn Edit 2026"
              sx={{
                mb: 2.5,
                bgcolor: "transparent",
                border: "1px solid rgba(0,0,0,0.12)",
                fontSize: "0.72rem",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                fontWeight: 600,
                color: "#8a7560",
                "& .MuiChip-icon": { color: "#8a7560" },
              }}
            />

            <Typography
              variant="h2"
              sx={{
                fontFamily: "Georgia, 'Times New Roman', serif",
                fontWeight: 600,
                lineHeight: 1.12,
                letterSpacing: "-0.02em",
                color: "#141414",
                fontSize: { xs: "2.2rem", sm: "2.8rem", md: "3.6rem" },
                mb: 2,
              }}
            >
              Elevate your style
              <br />
              with Veloura
            </Typography>

            <Typography
              sx={{
                fontSize: "1rem",
                color: "text.secondary",
                lineHeight: 1.75,
                maxWidth: 400,
                mb: 4,
              }}
            >
              Discover timeless fashion crafted for confidence, elegance and
              everyday luxury.
            </Typography>

            <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
              <Link href="/products" style={{ textDecoration: "none" }}>
                <Button
                  variant="contained"
                  size="large"
                  endIcon={<ArrowOutwardIcon sx={{ fontSize: 18 }} />}
                  sx={{
                    bgcolor: "#111",
                    color: "#fff",
                    px: 3.5,
                    py: 1.4,
                    borderRadius: "8px",
                    fontSize: "0.9rem",
                    fontWeight: 500,
                    textTransform: "none",
                    boxShadow: "none",
                    "&:hover": { bgcolor: "#2a2a2a", boxShadow: "none" },
                  }}
                >
                  Shop collection
                </Button>
              </Link>

              <Button
                component="a"
  href="#lookbook"
                variant="outlined"
                size="large"
                sx={{
                  color: "#111",
                  borderColor: "rgba(0,0,0,0.2)",
                  px: 3,
                  py: 1.4,
                  borderRadius: "8px",
                  fontSize: "0.9rem",
                  fontWeight: 500,
                  textTransform: "none",
                  "&:hover": {
                    borderColor: "rgba(0,0,0,0.4)",
                    bgcolor: "transparent",
                  },
                }}
              >
                View lookbook
              </Button>
            </Stack>

        {/*     <Stack
              direction="row"
              spacing={4}
              sx={{
                display:"flex",
                justifyContent:"center",
                mt: 5,
                pt: 3,
                borderTop: "1px solid rgba(0,0,0,0.08)",
              }}
            >
              {[
                { value: "12K+", label: "Customers" },
                { value: "4.9", label: "Rating" },
                { value: "150+", label: "Styles" },
              ].map((stat) => (
                <Box key={stat.label}>
                  <Typography
                    sx={{
                      fontFamily: "Georgia, 'Times New Roman', serif",
                      fontSize: "1.3rem",
                      fontWeight: 600,
                      color: "#141414",
                    }}
                  >
                    {stat.value}
                  </Typography>
                  <Typography
                    sx={{ fontSize: "0.72rem", color: "text.secondary", mt: 0.3 }}
                  >
                    {stat.label}
                  </Typography>
                </Box>
              ))}
            </Stack> */}
          </Box>



{/* RIGHT: visual card with floating badges */}
<Box
  sx={{
    position: "relative",
    height: { xs: 300, md: 380 },
    display: { xs: "none", md: "block" },
  }}
>
  <Box
    sx={{
      position: "absolute",
      inset: 0,
      borderRadius: "20px",
      overflow: "hidden",
      border: "1px solid rgba(0,0,0,0.06)",
      boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
    }}
  >
<Image
  src="https://cdn.prod.website-files.com/66902b0c958b1f38e1fdbb1c/67caf3563d41bd53cfd04811_shutterstock_2440733535.jpg"
  alt="Veloura autumn collection"
  fill
  priority
  style={{ objectFit: "cover" }}
  sizes="(max-width: 900px) 100vw, 45vw"
/>
  </Box>

  {/* floating badge 1 */}
  <Box
    sx={{
      position: "absolute",
      top: 28,
      right: -16,
      bgcolor: "#fff",
      borderRadius: "12px",
      boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
      px: 2,
      py: 1.2,
      display: "flex",
      alignItems: "center",
      gap: 1.2,
    }}
  >
    <Box
      sx={{
        width: 34,
        height: 34,
        borderRadius: "50%",
        bgcolor: "#e8f5e9",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <CheckIcon sx={{ fontSize: 18, color: "#2e7d32" }} />
    </Box>
    <Box>
      <Typography sx={{ fontSize: "0.78rem", fontWeight: 600 }}>
        Free shipping
      </Typography>
      <Typography sx={{ fontSize: "0.7rem", color: "text.secondary" }}>
        On orders over $50
      </Typography>
    </Box>
  </Box>

  {/* floating badge 2 */}
  <Box
    sx={{
      position: "absolute",
      bottom: 28,
      left: -16,
      bgcolor: "#fff",
      borderRadius: "12px",
      boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
      px: 2,
      py: 1.2,
      display: "flex",
      alignItems: "center",
      gap: 1.2,
    }}
  >
    <Box
      sx={{
        width: 34,
        height: 34,
        borderRadius: "50%",
        bgcolor: "#f3e5f5",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <StarIcon sx={{ fontSize: 18, color: "#8e24aa" }} />
    </Box>
    <Box>
      <Typography sx={{ fontSize: "0.78rem", fontWeight: 600 }}>
        New arrivals
      </Typography>
      <Typography sx={{ fontSize: "0.7rem", color: "text.secondary" }}>
        Fresh drops weekly
      </Typography>
    </Box>
  </Box>
</Box>
        </Box>
      </Container>
    </Box>
  );
}