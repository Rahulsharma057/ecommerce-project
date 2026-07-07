"use client";

import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useDispatch } from "react-redux";
import { addToWishlist } from "@/redux/slices/wishlistSlice";
import { API_URL } from "@/lib/api";

export default function ProductCard({ product, wishlistMap, setWishlistMap }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const [loginOpen, setLoginOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  // const [wishlistMap, setWishlistMap] = useState({});
  const isWishlisted = !!wishlistMap[product._id];

  const handleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const token = localStorage.getItem("token");
    if (!token) return setLoginOpen(true);

    const wishlistId = wishlistMap[product._id];

    try {
      if (wishlistId) {
        // REMOVE
        await fetch(`${API_URL}/wishlist/${wishlistId}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });

        setWishlistMap((prev) => {
          const updated = { ...prev };
          delete updated[product._id];
          return updated;
        });
      } else {
        // ADD
        const res = await fetch(`${API_URL}/wishlist/add`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            productId: product._id,
          }),
        });

        const data = await res.json();

        setWishlistMap((prev) => ({
          ...prev,
          [product._id]: data._id, // IMPORTANT
        }));
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      setLoginOpen(true);
      return;
    }
    await fetch(`${API_URL}/cart/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        productId: product._id || product.id,
        quantity: 1,
      }),
    });

    alert("Added to cart 🚀");
  };

  return (
    <Card
      component={Link}
      href={`/products/${product._id}`}
      sx={{
        textDecoration: "none",
        color: "inherit",
        borderRadius: 1,
        overflow: "hidden",
        transition: "0.3s",
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: 6,
        },
      }}
    >
      {/* IMAGE */}
      <Box sx={{ position: "relative" }}>
        <CardMedia
          component="img"
          image={product.images?.[0] || product.image}
          alt={product.name}
          sx={{
            height: {
              xs: 220, // Mobile
              sm: 240, // Small tablets
              md: 280, // Desktop (same as current)
            },
            objectFit: "cover",
          }}
        />

        {/* WISHLIST */}
        <IconButton
          onClick={handleWishlist}
          sx={{
            position: "absolute",
            top: 10,
            right: 10,
            bgcolor: "#fff",
          }}
        >
          {isWishlisted ? (
            <FavoriteIcon sx={{ color: "red" }} />
          ) : (
            <FavoriteBorderIcon />
          )}
        </IconButton>
      </Box>

      {/* CONTENT */}
      <CardContent>
        <Typography variant="h6" fontWeight={600} noWrap>
          {product.name}
        </Typography>

        <Typography
          sx={{
            mt: 1,
            fontWeight: 700,
            color: "primary.main",
          }}
        >
          ₹{product.price.toLocaleString()}
        </Typography>

        {/* ADD TO CART */}
        <Button
          fullWidth
          variant="contained"
          sx={{ mt: 2, bgcolor: "#111" }}
          onClick={handleAddToCart}
        >
          Add To Cart
        </Button>
      </CardContent>
      <Dialog open={loginOpen} onClose={() => setLoginOpen(false)}>
        <DialogTitle>Login Required</DialogTitle>

        <DialogContent>
          You need to login first to add items to cart.
        </DialogContent>

        <DialogActions>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              setLoginOpen(false);
            }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={(e) => {
              e.stopPropagation();
              router.push("/login");
            }}
          >
            Login
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}
