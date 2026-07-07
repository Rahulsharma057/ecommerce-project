"use client";

import { useEffect, useRef, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  IconButton,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

import ProductCard from "@/components/product/ProductCard";
import EmptyState from "@/components/common/EmptyState";
import { API_URL } from "@/lib/api";

export default function FeaturedProducts() {
  const [productList, setProductList] = useState([]);
  const scrollRef = useRef(null);

  const limit = 20; // slider ke liye ek hi baar zyada products le lo

  const fetchFeaturedProducts = async () => {
    try {
      const res = await fetch(
        `${API_URL}/products/featured?page=1&limit=${limit}`
      );

      const data = await res.json();

      console.log("FEATURED RESPONSE:", data);

      if (Array.isArray(data)) {
        setProductList(data);
      } else {
        setProductList(data.products || []);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const scrollByAmount = (direction) => {
    if (!scrollRef.current) return;
    const { clientWidth } = scrollRef.current;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -clientWidth * 0.9 : clientWidth * 0.9,
      behavior: "smooth",
    });
  };

  return (
<Box sx={{ bgcolor: "#f8f9fb", minHeight: "100vh", py: 5 }}>
  <Container maxWidth="xl">

    {/* HEADER */}
    <Typography
      variant="h4"
      fontWeight={700}
      mb={4}
      sx={{
        letterSpacing: "-0.02em",
      }}
    >
      Featured Products
    </Typography>

    {productList.length > 0 ? (
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
                wishlistMap={{}}
                setWishlistMap={() => {}}
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