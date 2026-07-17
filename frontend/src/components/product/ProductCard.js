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
  DialogActions,
  Chip,
} from "@mui/material";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { API_URL } from "@/lib/api";
import { toast } from "react-toastify";

export default function ProductCard({ product, wishlistMap, setWishlistMap }) {
  const router = useRouter();
  const [loginOpen, setLoginOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const isWishlisted = !!wishlistMap[product._id];

  // MRP / discount — only show strike-through MRP when it's actually higher than price
  const mrp = Number(product.originalPrice) || 0;
  const price = Number(product.price) || 0;
  const hasMrp = mrp > price;
  const discountPercent = hasMrp ? Math.round(((mrp - price) / mrp) * 100) : 0;

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

        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
          toast.error(data.message || "Failed to remove from wishlist");
          return;
        }

        setWishlistMap((prev) => {
          const updated = { ...prev };
          delete updated[product._id];
          return updated;
        });

        // Header wishlist badge refresh
        window.dispatchEvent(new Event("wishlist-update"));

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

        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
          toast.error(data.message || "Failed to add to wishlist");
          return;
        }

        setWishlistMap((prev) => ({
          ...prev,
          [product._id]: data._id,
        }));

        // Header wishlist badge refresh
        window.dispatchEvent(new Event("wishlist-update"));

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

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        toast.error(data.message || "Failed to add to cart");
        return;
      }

      toast.success("Product added to cart 🛒");

      // Header cart refresh
      window.dispatchEvent(new Event("cart-update"));
    } catch (err) {
      console.error(err);
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
        height: "100%",
        display: "flex",
        py:0,
        flexDirection: "column",
        "&:hover": {
          transform: { xs: "none", sm: "translateY(-5px)" },
          boxShadow: { xs: 1, sm: 6 },
        },
      }}
    >
      {/* IMAGE */}
      <Box sx={{ position: "relative", overflow: "hidden" }}>
        <CardMedia
          component="img"
          image={product.images?.[0] || product.image}
          alt={product.name}
          sx={{
            height: {
              xs: 150, // Mobile
              sm: 190, // Small tablets
              md: 200, // Desktop
            },
            objectFit: "cover",
          }}
        />
        {product.stock <= 0 ? (
          <Box
            sx={{
              position: "absolute",
              top: { xs: 6, sm: 10 },
              left: { xs: 0, sm: -10 },
              bgcolor: "#a70000",
              color: "#fff",
              px: { xs: 1, sm: 1.5 },
              py: 0.5,
              borderRadius: 1,
              fontSize: { xs: "0.6rem", sm: "0.75rem" },
              fontWeight: 500,
              textTransform: "uppercase",
            }}
          >
            Out of Stock
          </Box>
        ) : product.isSale || discountPercent > 0 ? (
          <Chip
            label={discountPercent > 0 ? `${discountPercent}% OFF` : "Sale"}
            size="small"
            sx={{
              position: "absolute",
              top: { xs: 8, sm: 14 },
              left: { xs: 8, sm: 14 },
              bgcolor: "#ef4444",
              color: "#fff",
              fontWeight: 700,
              fontSize: { xs: 9, sm: 11 },
              letterSpacing: 0.5,
              height: { xs: 18, sm: 22 },
            }}
          />
        ) : null}

        {/* WISHLIST */}
        <IconButton
          onClick={handleWishlist}
          sx={{
            position: "absolute",
            top: { xs: 6, sm: 10 },
            right: { xs: 6, sm: 10 },
            width: { xs: 28, sm: 35 },
            height: { xs: 28, sm: 35 },
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
                fontSize: { xs: 16, sm: 22 },
              }}
            />
          ) : (
            <FavoriteBorderIcon
              sx={{
                color: "#555",
                fontSize: { xs: 16, sm: 22 },
              }}
            />
          )}
        </IconButton>
      </Box>

      {/* CONTENT */}
      <CardContent
        sx={{
          px: { xs: 1, sm: 1.5 },
          pt: { xs: 0.75, sm: 1 },
          pb: 0,
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography
          sx={{
            fontSize: { xs: "0.8rem", sm: "0.95rem", md: "1.05rem" },
            fontWeight: 700,
            fontFamily: "'Poppins', sans-serif",
            color: "#111827",
            lineHeight: 1.4,
            letterSpacing: "0.2px",
            minHeight: { xs: 16, sm: 20 },

            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {product.name}
        </Typography>

        {/* RATING */}
        <Box
          sx={{
            mt: 0.25,
            display: "flex",
            alignItems: "center",
            gap: 0.5,
          }}
        >
          <Rating
            value={product.ratings || 0}
            precision={0.5}
            readOnly
            sx={{ fontSize: { xs: ".7rem", sm: ".9rem" } }}
            size="small"
          />

          <Typography
            variant="caption"
            sx={{
              color: "#666",
              fontWeight: 500,
              whiteSpace: "nowrap",
              fontSize: { xs: "0.65rem", sm: "0.8rem" },
            }}
          >
            ({product.numReviews || 0})
          </Typography>
        </Box>

        {/* PRICE + MRP */}
        <Box
          sx={{
            mt: 0.5,
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: { xs: 0.5, sm: 0.75 },
          }}
        >
          <Box>
            {hasMrp && (
              <>
                <Typography
                  sx={{
                    fontSize: { xs: "0.7rem", sm: "0.85rem" },
                    color: "text.secondary",
                    textDecoration: "line-through",
                  }}
                >
                  ₹{mrp.toLocaleString()}
                </Typography>
                <Typography
                  sx={{
                    fontSize: { xs: "0.68rem", sm: "0.8rem" },
                    color: "#0F6E56",
                    fontWeight: 600,
                  }}
                >
                  {discountPercent}% off
                </Typography>
              </>
            )}
          </Box>
          <Typography
            sx={{
              fontSize: { xs: "0.85rem", sm: "1rem" },
              fontWeight: 700,
              color: "#2f3b33",
            }}
          >
            ₹{price.toLocaleString()}
          </Typography>
        </Box>
        <Typography
          variant="body2"
          sx={{
            mt: 0.5,
            color: "text.secondary",
            fontSize: { xs: "0.7rem", sm: "0.85rem" },
            minHeight: { xs: 0, sm: 30 },
            display: { xs: "none", sm: "-webkit-box" },
            WebkitLineClamp: 2,
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
            mt: { xs: 1, sm: 2 },
            mb: { xs: 0, sm: 0 },
            bgcolor: product.stock === 0 ? "#bb0000" : "#111",
            color: "#fff",
            textTransform: "none",
            fontWeight: 600,
            fontSize: { xs: "0.7rem", sm: "0.85rem" },
            borderRadius: 1,
            py: { xs: 0.6, sm: 1 },
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
            sx={{ color: "rgb(15, 16, 17)" }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            sx={{ bgcolor: "rgb(15, 16, 17)" }}
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
