"use client";

import { useEffect, useState } from "react";

import Image from "next/image";
import Link from "next/link";
import axios from "axios";

import {
  Box,
  Button,
  CircularProgress,
  Container,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

import { API_URL } from "@/lib/api";

export default function AdvertisementBanner() {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);

  const fetchAdvertisements = async () => {
    try {
      const res = await axios.get(`${API_URL}/advertisements/active`);
      console.log(res.data.data);

      setAds(res.data.data || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdvertisements();
  }, []);

  // Auto Slider
  useEffect(() => {
    if (ads.length <= 1) return;

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % ads.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [ads]);

if (loading) {
 return null;
}

  if (!ads.length) return null;

  const ad = ads[current];

  return (
    <Container maxWidth="xl" sx={{ my: 5 }}>
      <Paper
        elevation={0}
        sx={{
          position: "relative",
          overflow: "hidden",
          borderRadius: 2,
          minHeight: {
            xs: 280,
            md: 500,
          },
          display: "flex",
          alignItems: "center",
        }}
      >
        {/* Background Image */}
        <Image
          src={ad.image}
          alt={ad.title}
          fill
          priority
          style={{
            objectFit: "cover",
          }}
        />

        {/* Dark Overlay */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(90deg, rgba(0,0,0,0.7) 20%, rgba(0,0,0,0.35) 60%, rgba(0,0,0,0.15) 100%)",
          }}
        />

        {/* Content */}
        <Box
          sx={{
            position: "relative",
            zIndex: 2,
            color: "#fff",
            maxWidth: {
              xs: "100%",
              md: "55%",
            },
            px: {
              xs: 3,
              md: 8,
            },
            py: {
              xs: 3,
              md: 8,
            },
          }}
        >
          {ad.discount && (
            <Box
              sx={{
                display: "inline-block",
                bgcolor: "#e53935",
                color: "#fff",
                px:  {
                  xs: 1.5,
                  md: "0.95rem",
                },
                py: 0.4,
                borderRadius: "50px",
                fontWeight: 700,
                fontSize: {
                  xs: "0.5rem",
                  md: "0.95rem",
                },
                mb: {
                xs: 1,
                md: 2,
              },
                boxShadow: "0 6px 20px rgba(229,57,53,.35)",
              }}
            >
               {ad.discount} OFF
            </Box>
          )}
          <Typography
            variant="h3"
            fontWeight={800}
            gutterBottom
            sx={{
              fontSize: {
                xs: "1.5rem",
                md: "3.5rem",
              },
            }}
          >
            {ad.title}
          </Typography>

          <Typography
            sx={{
              opacity: 0.95,
              mb:{
                xs: 2,
                md: 4,
              },
              lineHeight: {
                xs: 1,
                md: 1.5,
              },
              fontSize: {
                xs: "0.85rem",
                md: "1.1rem",
              },
              fontFamily:"ui-serif",
            }}
          >
            {ad.description}
          </Typography>

          {ad.buttonText && (
            <Button
              component={Link}
              href={ad.buttonLink || "/products"}
              variant="contained"
              sx={{
                bgcolor: "#36ba60",
                color: "#ffffff",
                px: {
                xs: 2,
                md: 4,
              },
                py:{
                xs: .5,
                md: 1,
              },
              fontSize:"0.70rem",
                fontWeight: 600,
                borderRadius: "50px",
                "&:hover": {
                  bgcolor: "#6eec3c",
                },
              }}
            >
              {ad.buttonText}
            </Button>
          )}
        </Box>
      </Paper>

      {ads.length > 1 && (
        <Stack direction="row" justifyContent="center" spacing={1} mt={2}>
          {ads.map((_, index) => (
            <Box
              key={index}
              onClick={() => setCurrent(index)}
              sx={{
                width: current === index ? 28 : 10,
                height: 10,
                borderRadius: 10,
                cursor: "pointer",
                transition: ".3s",
                bgcolor: current === index ? "#111827" : "#d1d5db",
              }}
            />
          ))}
        </Stack>
      )}
    </Container>
  );
}
