"use client";

import { useEffect, useRef, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  IconButton,
  Button,
  Stack,
} from "@mui/material";
import { Skeleton } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import Link from "next/link";
import EastRoundedIcon from "@mui/icons-material/EastRounded";
import ProductCard from "@/components/product/ProductCard";
import EmptyState from "@/components/common/EmptyState";
import { API_URL } from "@/lib/api";
import { useHomeLoading } from "@/context/HomeLoadingContext";

export default function FeaturedProducts() {
  const [productList, setProductList] = useState([]);
  const [wishlistMap, setWishlistMap] = useState({});
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);
  const { markReady } = useHomeLoading();
  const limit = 20; // slider ke liye ek hi baar zyada products le lo

  const fetchFeaturedProducts = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        `${API_URL}/products/featured?page=1&limit=${limit}`,
      );

      const data = await res.json();

      if (Array.isArray(data)) {
        setProductList(data);
      } else {
        setProductList(data.products || []);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
      markReady();
    }
  };

  useEffect(() => {
    fetchFeaturedProducts();
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
      console.log("Wishlist Response:", data);
      const map = {};

      (data || []).forEach((item) => {
        map[item.productId._id] = item._id;
      });

      setWishlistMap(map);
    } catch (err) {
      console.log(err);
    }
  };

  const scrollByAmount = (direction) => {
    if (!scrollRef.current) return;
    const { clientWidth } = scrollRef.current;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -clientWidth * 0.9 : clientWidth * 0.9,
      behavior: "smooth",
    });
  };
  const FeaturedProductsSkeleton = () => (
    <Box
      sx={{
        bgcolor: "#fff",
        borderRadius: 3,
        p: { xs: 1.5, md: 2 },
        boxShadow: "0 6px 20px rgba(0,0,0,0.04)",
      }}
    >
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
              <Skeleton width="55%" />
              <Skeleton width="40%" height={28} />
            </Box>
          </Paper>
        ))}
      </Box>
    </Box>
  );
  return (
    <Box
      sx={{
        bgcolor: "#f8f9fb",
        minHeight: "auto",
        /* minHeight: "100vh",  */ py: 4,
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
                xs: "1.70rem",
                sm: "1.7rem",
                md: "2.125rem",
              },
            }}
          >
            Featured Products
          </Typography>

          <Button
            component={Link}
            endIcon={<EastRoundedIcon />}
            href="/products?section=new-arrivals"
            sx={{
              borderRadius: 0,
              bgcolor: "transparent",
              borderBottom: "1px solid #111",
              px: {
                xs: 0,
                sm: 1,
                md: 2,
              },
              mx: 1,
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
          <FeaturedProductsSkeleton />
        ) : productList.length > 0 ? (
          <Box
            sx={{
              position: "relative",
              bgcolor: "#fff",
              borderRadius: 3,
              p: { xs: 1.5, md: 2 },
              boxShadow: "0 6px 20px rgba(0,0,0,0.04)",
            }}
          >
            {/* LEFT ARROW */}
            <IconButton
              onClick={() => scrollByAmount("left")}
              sx={{
                position: "absolute",
                left: -12,
                top: "50%",
                transform: "translateY(-50%)",
                zIndex: 5,
                bgcolor: "#fff",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                width: 40,
                height: 40,
                "&:hover": {
                  bgcolor: "#f5f5f5",
                  transform: "translateY(-50%) scale(1.05)",
                },
              }}
            >
              <ArrowBackIosNewIcon sx={{ fontSize: 16 }} />
            </IconButton>

            {/* TRACK */}
            <Box
              ref={scrollRef}
              sx={{
                display: "flex",
                gap: 2,
                overflowX: "auto",
                scrollBehavior: "smooth",
                py: 1,
                px: 1,
                "&::-webkit-scrollbar": { display: "none" },
              }}
            >
              {productList.map((product) => (
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

            {/* RIGHT ARROW */}
            <IconButton
              onClick={() => scrollByAmount("right")}
              sx={{
                position: "absolute",
                right: -12,
                top: "50%",
                transform: "translateY(-50%)",
                zIndex: 5,
                bgcolor: "#fff",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                width: 40,
                height: 40,
                "&:hover": {
                  bgcolor: "#f5f5f5",
                  transform: "translateY(-50%) scale(1.05)",
                },
              }}
            >
              <ArrowForwardIosIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Box>
        ) : (
          <Paper sx={{ py: 10, borderRadius: 4 }}>
            <EmptyState title="No featured products found" />
          </Paper>
        )}
      </Container>
    </Box>
  );
}
