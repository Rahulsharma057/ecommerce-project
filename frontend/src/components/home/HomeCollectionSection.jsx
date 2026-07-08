"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  Card,
  CardMedia,
  CardContent,
} from "@mui/material";

import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import { getHomeCollections } from "@/services/homeCollection";

export default function HomeCollectionSection() {
  const router = useRouter();

  const [collections, setCollections] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await getHomeCollections();

      setCollections(res.data.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  const handleClick = (item) => {
    if (item.buttonLink) {
      router.push(item.buttonLink);
    } else {
      router.push(`/products?search=${encodeURIComponent(item.searchKeyword)}`);
    }
  };

  if (!collections.length) return null;

  return (
    <Box
      id="lookbook"
      sx={{
        py: 5,
        bgcolor: "#fafafa",
      }}
    >
      <Container maxWidth="xl">
        <Typography variant="h3" fontWeight={700} align="center" mb={1}>
          Explore Collections
        </Typography>

        <Typography align="center" color="text.secondary" mb={6}>
          Discover timeless pieces curated for every occasion.
        </Typography>

        <Grid container spacing={{ xs: 2, sm: 3, md: 3 }}>
          {collections.map((item) => (
            <Grid item xs={6} sm={6} md={4} key={item._id}>
              <Card
                sx={{
                  borderRadius: 0,
                  overflow: "hidden",
                  boxShadow: "0 8px 25px rgba(0,0,0,.08)",
                  transition: "0.3s",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  "&:hover": {
                    transform: "translateY(-6px)",
                    boxShadow: "0 18px 35px rgba(0,0,0,.15)",
                  },
                }}
              >
                <CardMedia
                  component="img"
                  image={item.image}
                  alt={item.title}
                  sx={{
                    height: { xs: 160, sm: 200, md: 200, lg: 280 },
                    objectFit: "cover",
                  }}
                />

                <CardContent
                  sx={{
                    m: 0,
                    p: 0,

                    position: "relative",
                    // p: { xs: 1.5, sm: 2 },
                    flexGrow: 1,
                  }}
                >
                  <Typography
                    variant="h3"
                    fontWeight={600}
                    gutterBottom
                    sx={{
                      mb: 1,
                      p: 1,
                      fontSize: { xs: "1.05rem", sm: "1.2rem", md: "1.5rem" },
                    }}
                  >
                    {item.title}
                  </Typography>

                  {/* <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      fontSize: { xs: "0.8rem", sm: "0.875rem" },
                      minHeight: { xs: 36, sm: 50 },
                      // mb: { xs: 1.5, sm: 2 },
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {item.description}
                  </Typography> */}

                  <Button
                    // variant="contained"
                    variant="text"
                    endIcon={<ArrowForwardIcon />}
                    onClick={() => handleClick(item)}
                    //  fullWidth
                    sx={{
                      position: "absolute",
                      right: {
                        xs: 10,
                        sm: 0,
                        md: 25,
                      },
                      fontSize: {
                        xs: "12px",
                        sm: "14px",
                        md: "16px",
                      },
                      mb: 0,
                      bottom: 10,
                      border: "none",
                      borderRadius: 0,
                      borderBottom: "2px solid black",
                      bgcolor: "transparent",
                      boxShadow: "none",
                      color: "black",
                      textTransform: "none",

                      "&:hover": {
                        bgcolor: "#000",
                        color: "#fff",
                        borderBottom: "2px solid white",
                      },
                    }}
                  >
                    {item.buttonText || "Shop Now"}
                  </Button>
                  {/*  <Button
            variant="contained"
            endIcon={<ArrowForwardIcon />}
            onClick={() => handleClick(item)}
            fullWidth
            sx={{
              bgcolor: "#111",
              borderRadius: 10,
              px: { xs: 2, sm: 3 },
              py: { xs: 0.8, sm: 1.3 },
              fontSize: { xs: "0.8rem", sm: "0.9rem" },
              textTransform: "none",
              width: { xs: "100%", sm: "auto" },
              "&:hover": {
                bgcolor: "#000",
              },
            }}
          >
            {item.buttonText || "Shop Now"}
          </Button> */}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
