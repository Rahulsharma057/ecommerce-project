"use client";

import { useEffect, useRef, useState } from "react";

import {
  Box,
  Container,
  Typography,
  IconButton,
  Paper,
  Stack,
  Button,
  Skeleton,
} from "@mui/material";
import Link from "next/link";
import EastRoundedIcon from "@mui/icons-material/EastRounded";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useHomeLoading } from "@/context/HomeLoadingContext";
import ProductCard from "@/components/product/ProductCard";
import EmptyState from "@/components/common/EmptyState";

import { API_URL } from "@/lib/api";

export default function NewArrivals() {
  const [products, setProducts] = useState([]);
  const [wishlistMap, setWishlistMap] = useState({});
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);
  const { markReady } = useHomeLoading();
  const fetchNewArrivals = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/products/new-arrivals?limit=20`);
      const data = await res.json();

      setProducts(data.products || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
      markReady();
    }
  };
  useEffect(() => {
    fetchNewArrivals();
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(`${API_URL}/wishlist`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      const list = Array.isArray(data) ? data : data.products || [];

      const map = {};

      list.forEach((item) => {
        map[item.productId._id] = item._id;
      });

      setWishlistMap(map);
    } catch (err) {
      console.log(err);
    }
  };

  const scroll = (direction) => {
    if (!scrollRef.current) return;

    scrollRef.current.scrollBy({
      left: direction === "left" ? -400 : 400,

      behavior: "smooth",
    });
  };
const ProductSkeleton = () => (
  <Box
    sx={{
      display: "flex",
      gap: 2,
      overflow: "hidden",
    }}
  >
    {Array.from({ length: 5 }).map((_, index) => (
      <Paper
        key={index}
        elevation={0}
        sx={{
          flex: "0 0 auto",
          width: {
            xs: 160,
            sm: 200,
            md: 240,
            lg: 260,
          },
          borderRadius: 3,
          overflow: "hidden",
          border: "1px solid #eee",
        }}
      >
        <Skeleton variant="rectangular" height={320} />

        <Box p={2}>
          <Skeleton width="80%" height={24} />
          <Skeleton width="50%" />
          <Skeleton width="40%" height={30} />
        </Box>
      </Paper>
    ))}
  </Box>
);
  return (
    <Box
      sx={{
        bgcolor: "#f8f9fb",
        py: 4,
      }}
    >
      <Container maxWidth="xl">
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mb={4}
          sx={{
            px: {
              xs: "1",
              sm: "1",
              md: "2",
            },
          }}
        >
          <Typography
            variant="h4"
            fontWeight={700}
            sx={{
              fontSize: {
                xs: "2rem",
                sm: "1.7rem",
                md: "2.125rem",
              },
            }}
          >
            New Arrivals
          </Typography>

          <Button
            component={Link}
            endIcon={<EastRoundedIcon />}
            href="/products?section=new-arrivals"
            sx={{
              borderRadius: 0,
              bgcolor: "transparent",
              borderBottom: "1px solid #111",
              px: 3,
              color: "black",
              textTransform: "none",
              fontSize: {
                xs: "0.72rem",
                sm: "0.85rem",
                md: "0.95rem",
              },
              fontWeight: 500,
              "&:hover": {
                bgcolor: "#111",
                color: "#fff",
                borderColor: "#111",
              },
            }}
          >
            View All
          </Button>
        </Stack>
       {loading ? (
  <ProductSkeleton />
) : products.length > 0 ? (
          <Box
            sx={{
              position: "relative",

              bgcolor: "#fff",

              borderRadius: 3,

              p: 2,

              boxShadow: "0 6px 20px rgba(0,0,0,.05)",
            }}
          >
            <IconButton
              onClick={() => scroll("left")}
              sx={{
                position: "absolute",

                left: -15,

                top: "50%",

                zIndex: 5,

                bgcolor: "#fff",

                boxShadow: 2,
              }}
            >
              <ArrowBackIosNewIcon />
            </IconButton>

            <Box
              ref={scrollRef}
              sx={{
                display: "flex",

                gap: 2,

                overflowX: "auto",

                "&::-webkit-scrollbar": {
                  display: "none",
                },
              }}
            >
              {products.map((product) => (
                <Box
                  key={product._id}
                  sx={{
                    flex: "0 0 auto",

                    width: {
                      xs: 160,

                      sm: 200,

                      md: 240,

                      lg: 260,
                    },
                  }}
                >
                  <ProductCard
                    product={product}
                    wishlistMap={wishlistMap}
                    setWishlistMap={setWishlistMap}
                  />
                </Box>
              ))}
            </Box>

            <IconButton
              onClick={() => scroll("right")}
              sx={{
                position: "absolute",

                right: -15,

                top: "50%",

                zIndex: 5,

                bgcolor: "#fff",

                boxShadow: 2,
              }}
            >
              <ArrowForwardIosIcon />
            </IconButton>
          </Box>
        ) : (
          <Paper sx={{ py: 10 }}>
            <EmptyState title="No New Arrivals" />
          </Paper>
        )}
      </Container>
    </Box>
  );
}
