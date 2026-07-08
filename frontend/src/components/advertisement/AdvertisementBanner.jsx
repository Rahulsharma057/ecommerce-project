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
      const res = await axios.get(
        `${API_URL}/advertisements/active`
      );
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
    return (
      <Box
        py={6}
        display="flex"
        justifyContent="center"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!ads.length) return null;

  const ad = ads[current];

  return (
    <Container maxWidth="xl" sx={{ my: 5, }}>
      <Paper
        elevation={0}
        sx={{
          overflow: "hidden",
          borderRadius: 2,
          bgcolor: "#111827",
          color: "#fff",
        }}
      >
        <Stack
          direction={{
            xs: "column",
            md: "row",
          }}
          alignItems="center"
        >
          {/* LEFT */}
          <Box
            flex={1}
            p={{
              xs: 4,
              md: 7,
            }}
          >
            <Typography
              variant="h3"
              fontWeight={800}
              gutterBottom
            >
              {ad.title}
            </Typography>

            <Typography
              sx={{
                opacity: 0.9,
                mb: 4,
                lineHeight: 1.8,
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
                  bgcolor: "#fff",
                  color: "#111",
                  px: 4,
                  py: 1.4,
                  fontWeight: 700,
                  borderRadius: 3,
                  "&:hover": {
                    bgcolor: "#f3f4f6",
                  },
                }}
              >
                {ad.buttonText}
              </Button>
            )}
          </Box>

       
          <Box
            sx={{
              position: "relative",
              width: {
                xs: "100%",
                md: 500,
              },
              height: {
                xs: 260,
                md: 420,
              },
            }}
          >
            <Image
              src={ad.image}
              alt={ad.title}
              fill
              style={{
                objectFit: "cover",
              }}
            />
          </Box>
        </Stack>
      </Paper>

 
      {ads.length > 1 && (
        <Stack
          direction="row"
          justifyContent="center"
          spacing={1}
          mt={2}
        >
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
                bgcolor:
                  current === index
                    ? "#111827"
                    : "#d1d5db",
              }}
            />
          ))}
        </Stack>
      )}
    </Container>
  );
}