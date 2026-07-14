"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  Stack,
  CircularProgress,
} from "@mui/material";

import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";

import { getLuxuryStory } from "@/services/luxuryStory";

export default function LuxuryStorySection() {
  const [story, setStory] = useState(null);
  const [show,setShow] = useState(true);
  const [loading, setLoading] = useState(true);

  const fetchStory = async () => {
    try {
      const res = await getLuxuryStory();

      if (res.data.success) {
        const data = res.data.data;
        setShow(data);
        if (data.status) {
          setStory(data);
        } else {
          setStory(null);
        }
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStory();
  }, []);

if (loading) {
 return null;
}

  if (!story) return null;

  return (
    <Box
      sx={{
        py: { xs: 7, md: 12 },
        bgcolor: "#F8F6F3",
      }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={5} alignItems="center">
          {/* IMAGE */}
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                position: "relative",
                height: { xs: 420, md: 600 },
                borderRadius: 6,
                overflow: "hidden",
                boxShadow: "0 20px 60px rgba(0,0,0,.12)",
              }}
            >
              <Image
             src={story?.image || "/placeholder.jpg"}
  alt={story?.title || "Luxury Story"}
                fill
                style={{
                  objectFit: "cover",
                }}
              />

              {/* Floating Card */}

              <Box
                sx={{
                  position: "absolute",
                  bottom: 30,
                  left: 30,
                  bgcolor: "rgba(255,255,255,.93)",
                  backdropFilter: "blur(12px)",
                  p: 3,
                  borderRadius: 4,
                  width: 260,
                }}
              >
                <Typography
                  sx={{
                    fontSize: 12,
                    color: "#888",
                    letterSpacing: 2,
                    mb: 1,
                  }}
                >
                  {story?.established}
                </Typography>

                <Typography variant="h6" fontWeight={700}>
                  {story?.floatingTitle}
                </Typography>

                <Typography
                  sx={{
                    mt: 1,
                    color: "#666",
                    fontSize: 14,
                    lineHeight: 1.7,
                  }}
                >
                  {story?.floatingDescription}
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* CONTENT */}

          <Grid item xs={12} md={6}>
            <Typography
              sx={{
                color: "#C8A15A",
                fontWeight: 700,
                letterSpacing: 3,
                mb: 2,
              }}
            >
              {story?.tagline}
            </Typography>

            <Typography
              sx={{
                fontSize: {
                  xs: 38,
                  md: 60,
                },
                fontWeight: 800,
                lineHeight: 1.05,
                mb: 3,
              }}
            >
              {story?.title}
            </Typography>

            <Typography
              sx={{
                color: "#666",
                fontSize: 17,
                lineHeight: 2,
                maxWidth: 520,
                mb: 5,
              }}
            >
              {story?.description}
            </Typography>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={4} mb={5}>
              {[story?.statOne, story?.statTwo, story?.statThree].map(
                (item, index) => (
                  <Box key={index}>
                    <Typography
                      sx={{
                        fontSize: 42,
                        fontWeight: 800,
                      }}
                    >
                      {item?.number}
                    </Typography>

                    <Typography color="text.secondary">{item?.title}</Typography>
                  </Box>
                ),
              )}
            </Stack>

            <Button
              component={Link}
           href={story?.buttonLink || "/products"}
              variant="contained"
              endIcon={<ArrowForwardRoundedIcon />}
              sx={{
                bgcolor: "#111",
                color: "#fff",
                px: 5,
                py: 1.8,
                borderRadius: 10,
                textTransform: "none",
                fontSize: 16,
                "&:hover": {
                  bgcolor: "#000",
                },
              }}
            >
              {story?.buttonText}
            </Button>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
