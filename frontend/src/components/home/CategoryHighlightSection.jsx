"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
} from "@mui/material";

import { getCategoryHighlights } from "@/services/categoryHighlight";

export default function CategoryHighlightSection() {
  const router = useRouter();

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await getCategoryHighlights();

      setCategories(res.data.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  const handleClick = (keyword) => {
    router.push(`/products?search=${encodeURIComponent(keyword)}`);
  };

  if (categories.length === 0) return null;

  return (
    <Box
      sx={{
        py: 10,
        bgcolor: "#fafafa",
      }}
    >
      <Container maxWidth="xl">

        <Typography
          variant="h3"
          fontWeight={700}
          align="center"
          mb={1}
        >
          Shop by Collection
        </Typography>

        <Typography
          align="center"
          color="text.secondary"
          mb={6}
        >
          Explore curated collections designed for every style.
        </Typography>

        <Grid container spacing={4}>

          {categories.map((item) => (

            <Grid
              item
              xs={12}
              sm={6}
              md={3}
              key={item._id}
            >

              <Card
                onClick={() =>
                  handleClick(item.searchKeyword)
                }
                sx={{
                  cursor: "pointer",
                  borderRadius: 5,
                  overflow: "hidden",
                  transition: ".3s",

                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: 8,
                  },
                }}
              >

                <CardMedia
                  component="img"
                  image={item.image}
                  height="340"
                />

                <CardContent>

                  <Typography
                    variant="h5"
                    fontWeight={700}
                  >
                    {item.title}
                  </Typography>

                  <Typography
                    color="text.secondary"
                    mt={1}
                  >
                    {item.description}
                  </Typography>

                </CardContent>

              </Card>

            </Grid>

          ))}

        </Grid>

      </Container>
    </Box>
  );
}