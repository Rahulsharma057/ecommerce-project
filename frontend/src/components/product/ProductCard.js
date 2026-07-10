"use client";

import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Rating,
  Button,
  Box,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,Chip
} from "@mui/material";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useDispatch } from "react-redux";
import { addToWishlist } from "@/redux/slices/wishlistSlice";
import { API_URL } from "@/lib/api";
import { toast } from "react-toastify";

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

    if (loading) return;

    const token = localStorage.getItem("token");

    if (!token) {
      toast.info("Please login to use wishlist");
      setLoginOpen(true);
      return;
    }

    setLoading(true);

    try {
      const wishlistId = wishlistMap[product._id];

      // REMOVE FROM WISHLIST
      if (wishlistId) {
        const res = await fetch(`${API_URL}/wishlist/${wishlistId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          toast.error(data.message || "Failed to remove from wishlist");
          return;
        }

        setWishlistMap((prev) => {
          const updated = { ...prev };
          delete updated[product._id];
          return updated;
        });

        toast.success("Removed from wishlist ");
      }

      // ADD TO WISHLIST
      else {
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

        if (!res.ok) {
          toast.error(data.message || "Failed to add to wishlist");
          return;
        }

        setWishlistMap((prev) => ({
          ...prev,
          [product._id]: data._id,
        }));

        toast.success("Added to wishlist ");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const token = localStorage.getItem("token");

    if (!token) {
      toast.info("Please login to continue");
      setLoginOpen(true);
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/cart/add`, {
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

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to add to cart");
        return;
      }

      toast.success("Product added to cart 🛒");

      // Header cart refresh
      window.dispatchEvent(new Event("cart-update"));
    } catch (err) {
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
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
      <Box sx={{ position: "relative",  overflow:"hidden", }}>
        <CardMedia
          component="img"
          image={product.images?.[0] || product.image}
          alt={product.name}
          sx={{
          
            height: {
              xs: 180, // Mobile
              sm: 180, // Small tablets
              md: 220, // Desktop (same as curarent)
            },
            objectFit: "cover",
          }}
        />
        {product.stock <= 0 ? (
   <Box
            sx={{
              position: "absolute",
              top: 10,
              left: -10,
              bgcolor: "#a70000",
              color: "#fff",
              px: 1.5,
              py: 0.5,
              borderRadius: 1,
              fontSize: "0.75rem",
              fontWeight: 500,
              textTransform: "uppercase",
            }}
          >
            Out of Stock
          </Box>
) : product.isSale ? (
  <Chip
    label="Sale"
    size="small"
    sx={{
      position: "absolute",
      top: 14,
      left: 14,
      bgcolor: "#ef4444",
      color: "#fff",
      fontWeight: 700,
      fontSize: 11,
      letterSpacing: 0.5,
    }}
  />
  ) : null}
    {/*     {product.stock === 0 && (
         
        )} */}
        {/* WISHLIST */}
        <IconButton
          onClick={handleWishlist}
          sx={{
            position: "absolute",
            top: 10,
            right: 10,
            width: 35,
            height: 35,
            bgcolor: "#fff",
            boxShadow: "0 4px 12px rgba(0,0,0,.12)",
            transition: "0.3s",

            "&:hover": {
              bgcolor: isWishlisted ? "#ffe5e5" : "#f5f5f5",
              transform: "scale(1.08)",
            },
          }}
        >
          {isWishlisted ? (
            <FavoriteIcon
              sx={{
                color: "#ef4444",
              }}
            />
          ) : (
            <FavoriteBorderIcon
              sx={{
                color: "#555",
              }}
            />
          )}
        </IconButton>
      </Box>

      {/* CONTENT */}
      <CardContent sx={{ px: 1.5, pt: 1, pb: 0 }}>
        <Typography
          sx={{
            fontSize: "1.05rem",
            fontWeight: 700,
            fontFamily: "'Poppins', sans-serif",
            color: "#111827",
            lineHeight: 1.4,
            letterSpacing: "0.2px",
            minHeight: 20,

            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {product.name}
        </Typography>

        <Box
          sx={{
            mt: 0,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* RATING */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
            }}
          >
            <Rating
              value={product.ratings || 0}
              precision={0.5}
              readOnly
              sx={{ fontSize: ".9rem" }}
              size="small"
            />

            <Typography
              variant="caption"
              sx={{
                color: "#666",
                fontWeight: 500,
                whiteSpace: "nowrap",
                fontSize: "0.9rem",
              }}
            >
              ({product.numReviews || 0})
            </Typography>
          </Box>
          {/* PRICE */}
          <Typography
            sx={{
              fontSize: "1.1rem",
              fontWeight: 700,
              color: "#2f3b33",
              fontSize: "0.9rem",
            }}
          >
            ₹{product.price.toLocaleString()}
          </Typography>
        </Box>
        <Typography
          variant="body2"
          sx={{
            mt: 0,
            color: "text.secondary",
            minHeight: 30, // sab cards ki same height rahegi
            display: "-webkit-box",
            WebkitLineClamp: 2, // 2 lines ke baad ...
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
            lineHeight: 1.5,
          }}
        >
          {product.description || "No description available."}
        </Typography>
        {/* ADD TO CART */}
        <Button
          fullWidth
          variant="contained"
          disabled={loading || product.stock === 0}
          sx={{
            mt: 2,
            bgcolor: product.stock === 0 ? "#bb0000" : "#111",
            color: "#fff",
            textTransform: "none",
            fontWeight: 600,
            borderRadius: 1,
            transition: "0.3s",
            "&:hover": {
              bgcolor: product.stock === 0 ? "#560b0b" : "#333",
              boxShadow:
                product.stock === 0 ? "none" : "0 8px 20px rgba(0,0,0,.18)",
            },
            "&.Mui-disabled": {
              bgcolor: product.stock === 0 ? "#bb0000" : "#bdbdbd",
              color: "#fff",
            },
          }}
          onClick={handleAddToCart}
        >
          {product.stock === 0
            ? "Out of Stock"
            : loading
              ? "Adding..."
              : "Add To Cart"}
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
