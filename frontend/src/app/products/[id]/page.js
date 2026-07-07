"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import {
  Container,
  Grid,
  Box,
  Typography,
  Rating,
  TextField,
  Button,
  Paper,
  Stack,
  Chip,
  IconButton,
  Divider,
  Avatar,
  Skeleton,
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import ReplayOutlinedIcon from "@mui/icons-material/ReplayOutlined";
import RateReviewOutlinedIcon from "@mui/icons-material/RateReviewOutlined";
import { useSelector, useDispatch } from "react-redux";
import {
  addToWishlist,
  removeFromWishlist,
} from "@/redux/slices/wishlistSlice";
import { addToCart } from "@/redux/slices/cartSlice";
import ProductGrid from "@/components/product/ProductGrid";
import { API_URL } from "@/lib/api";

export default function ProductDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState("");
  const [wishlistMap, setWishlistMap] = useState({});

  const isWishlisted = !!wishlistMap[product?._id];
  const [rating, setRating] = useState(5);
  const [relatedProducts, setRelatedProducts] = useState([]);
const [submittingReview, setSubmittingReview] = useState(false);
  const [comment, setComment] = useState("");
  const [showAllReviews, setShowAllReviews] = useState(false);
  const displayedReviews = showAllReviews
    ? product?.reviews || []
    : product?.reviews?.slice(0, 4) || [];

  useEffect(() => {
    const fetchWishlist = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch(`${API_URL}/wishlist`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      const map = {};

      data.forEach((item) => {
        if (item.productId?._id) {
          map[item.productId._id] = item._id;
        }
      });

      setWishlistMap(map);
    };

    fetchWishlist();
  }, []);

  const fetchProduct = async () => {
    try {
      const res = await fetch(`${API_URL}/products/${id}`);

      const data = await res.json();

      setProduct(data);

      if (data.images?.length > 0) {
        setSelectedImage(data.images[0]);
      }

      if (data.category) {
        fetchRelatedProducts(data.category, data._id);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedProducts = async (category, productId) => {
    try {
      const res = await fetch(
        `${API_URL}/products?category=${category}&limit=8`
      );

      const data = await res.json();

      const products = Array.isArray(data.products)
        ? data.products.filter((p) => p._id !== productId)
        : [];

      setRelatedProducts(products.slice(0, 4));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleAddToCart = async () => {
    try {
      if (!product) return;

      if (product.stock === 0) {
        alert("Product is out of stock");
        return;
      }

      if (quantity > product.stock) {
        alert(`Only ${product.stock} items available`);
        return;
      }

      const token = localStorage.getItem("token");

      const res = await fetch(`${API_URL}/cart/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: product._id,
          quantity,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      window.dispatchEvent(new Event("cart-update"));
    } catch (err) {
      console.log(err);
    }
  };

  const handleWishlist = async () => {
    const token = localStorage.getItem("token");
    if (!product) return;
    if (!token) return;

    const wishlistId = wishlistMap[product?._id];

    if (wishlistId) {
      await fetch(`${API_URL}/wishlist/${wishlistId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setWishlistMap((prev) => {
        const updated = { ...prev };
        delete updated[product._id];
        return updated;
      });
    } else {
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
        [product._id]: data._id,
      }));
    }
  };



const submitReview = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Please login to submit a review");
    return;
  }

  if (!comment.trim()) {
    alert("Please write a comment before submitting");
    return;
  }

  setSubmittingReview(true);

  try {
    const res = await fetch(`${API_URL}/products/${product._id}/review`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        rating,
        comment,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Failed to submit review");
      return;
    }

    alert(data.message || "Review submitted");

    // reset form
    setComment("");
    setRating(5);

    fetchProduct();
  } catch (err) {
    console.log(err);
    alert("Something went wrong. Please try again.");
  } finally {
    setSubmittingReview(false);
  }
};

  const handleBuyNow = () => {
    if (!product) return;

    if (product.stock === 0) {
      alert("Out of stock");
      return;
    }

    if (quantity > product.stock) {
      alert(`Only ${product.stock} items available`);
      return;
    }

    const safeProduct = {
      productId: product._id,
      name: product.name || "Product",
      image: product.images?.[0] || "",
      price: product.price || 0,
      quantity: quantity || 1,
      stock: product.stock,
    };

    localStorage.setItem("buyNow", JSON.stringify([safeProduct]));
    router.push("/checkout");
  };

  /* ================= LOADING STATE ================= */
  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Grid container spacing={6}>
<Grid item xs={12} md={6}>
            <Skeleton variant="rounded" height={550} sx={{ borderRadius: 3 }} />
            <Stack direction="row" spacing={2} mt={2}>
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} variant="rounded" width={90} height={90} sx={{ borderRadius: 1.5 }} />
              ))}
            </Stack>
          </Grid>
     <Grid item xs={12} md={6}>
            <Skeleton variant="text" width="70%" height={50} />
            <Skeleton variant="text" width="30%" height={30} sx={{ mt: 1 }} />
            <Skeleton variant="text" width="40%" height={60} sx={{ mt: 2 }} />
            <Skeleton variant="rounded" height={100} sx={{ mt: 3, borderRadius: 2 }} />
          </Grid>
        </Grid>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container sx={{ py: 10, textAlign: "center" }}>
        <Typography variant="h4" fontWeight={700} sx={{ color: "#0f172a" }}>
          Product Not Found
        </Typography>
        <Typography sx={{ color: "#94a3b8", mt: 1 }}>
          The product you're looking for doesn't exist or was removed.
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Grid container spacing={6}>
        {/* ================= IMAGES ================= */}
<Grid item xs={12} md={6}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: 4,
              border: "1px solid #eef0f3",
              position: "sticky",
              top: 16,
            }}
          >
            <Box sx={{ position: "relative" }}>
              <Box
                component="img"
                src={selectedImage || product.images?.[0] || "/placeholder.png"}
                alt={product.name}
                sx={{
                  width: "100%",
                  height: { xs: 350, md: 550 },
                  objectFit: "cover",
                  borderRadius: 3,
                  bgcolor: "#f8fafc",
                }}
              />

              <IconButton
                onClick={handleWishlist}
                sx={{
                  position: "absolute",
                  top: 14,
                  right: 14,
                  bgcolor: "#fff",
                  boxShadow: "0 4px 14px rgba(0,0,0,0.12)",
                  width: 42,
                  height: 42,
                  "&:hover": { bgcolor: "#fff" },
                }}
              >
                {isWishlisted ? (
                  <FavoriteIcon sx={{ color: "#ef4444" }} />
                ) : (
                  <FavoriteBorderIcon sx={{ color: "#334155" }} />
                )}
              </IconButton>

              {product.isSale && (
                <Chip
                  label="SALE"
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
              )}
            </Box>

            {product.images?.length > 1 && (
              <Stack
                direction="row"
                spacing={1.5}
                sx={{
                  mt: 2,
                  overflowX: "auto",
                  pb: 0.5,
                  "&::-webkit-scrollbar": { height: 5 },
                  "&::-webkit-scrollbar-thumb": { bgcolor: "#e2e8f0", borderRadius: 4 },
                }}
              >
                {product.images?.map((img, index) => (
                  <Box
                    key={index}
                    component="img"
                    src={img}
                    onClick={() => setSelectedImage(img)}
                    sx={{
                      width: 78,
                      height: 78,
                      objectFit: "cover",
                      borderRadius: 2,
                      cursor: "pointer",
                      flexShrink: 0,
                      transition: "border 0.15s ease",
                      border:
                        selectedImage === img
                          ? "2px solid #111"
                          : "1.5px solid #e2e8f0",
                    }}
                  />
                ))}
              </Stack>
            )}
          </Paper>
        </Grid>

        {/* ================= PRODUCT INFO ================= */}
 <Grid item xs={12} md={6}>
          <Stack direction="row" spacing={1} mb={1.5}>
            <Chip
              label={product.category}
              size="small"
              sx={{ bgcolor: "#f1f5f9", color: "#475569", fontWeight: 600 }}
            />
            {product.isNewArrival && (
              <Chip
                label="New"
                size="small"
                sx={{ bgcolor: "#f0fdf4", color: "#15803d", fontWeight: 600 }}
              />
            )}
            {product.isSale && (
              <Chip
                label="Sale"
                size="small"
                sx={{ bgcolor: "#fef2f2", color: "#b91c1c", fontWeight: 600 }}
              />
            )}
          </Stack>

          <Typography variant="h4" fontWeight={800} sx={{ color: "#0f172a", letterSpacing: -0.5 }}>
            {product.name}
          </Typography>

          <Stack direction="row" alignItems="center" spacing={1} mt={1.5}>
            <Rating value={product.ratings} precision={0.5} readOnly size="small" />
            <Typography variant="body2" sx={{ color: "#94a3b8" }}>
              ({product.numReviews || 0} reviews)
            </Typography>
          </Stack>

          <Typography variant="h3" fontWeight={800} sx={{ mt: 2.5, color: "#0f172a" }}>
            ₹{product?.price?.toLocaleString()}
          </Typography>

          <Typography
            sx={{
              mt: 2,
              lineHeight: 1.8,
              color: "#64748b",
              fontSize: 14.5,
            }}
          >
            Premium quality fashion product with modern design, comfortable
            fitting and high-quality fabric.
          </Typography>

          <Box sx={{ mt: 2 }}>
            <Chip
              label={
                product.stock === 0
                  ? "Coming Soon"
                  : product.stock <= 5
                  ? `🔥 Only ${product.stock} left`
                  : "✅ In Stock"
              }
              sx={{
                fontWeight: 600,
                bgcolor:
                  product.stock === 0
                    ? "#eef2ff"
                    : product.stock <= 5
                    ? "#fffbeb"
                    : "#f0fdf4",
                color:
                  product.stock === 0
                    ? "#4338ca"
                    : product.stock <= 5
                    ? "#a16207"
                    : "#15803d",
              }}
            />
          </Box>

          {/* ================= QUANTITY ================= */}
          <Stack direction="row" spacing={2} alignItems="center" mt={4}>
            <Typography sx={{ fontWeight: 600, color: "#334155", fontSize: 14 }}>
              Quantity
            </Typography>

            <Stack
              direction="row"
              alignItems="center"
              sx={{
                border: "1.5px solid #e2e8f0",
                borderRadius: 2.5,
                overflow: "hidden",
              }}
            >
              <IconButton
                onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                size="small"
                sx={{ borderRadius: 0, px: 1.3 }}
              >
                <RemoveIcon fontSize="small" />
              </IconButton>

              <Typography fontWeight={700} sx={{ width: 32, textAlign: "center" }}>
                {quantity}
              </Typography>

              <IconButton
                onClick={() =>
                  setQuantity((prev) => (prev < product.stock ? prev + 1 : prev))
                }
                disabled={quantity >= product.stock}
                size="small"
                sx={{ borderRadius: 0, px: 1.3 }}
              >
                <AddIcon fontSize="small" />
              </IconButton>
            </Stack>
          </Stack>

          {/* ================= BUTTONS ================= */}
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mt={4}>
            <Button
              variant="contained"
              size="large"
              sx={{
                flex: 1,
                bgcolor: "#111",
                textTransform: "none",
                fontWeight: 700,
                borderRadius: 2.5,
                py: 1.4,
                boxShadow: "none",
                "&:hover": { bgcolor: "#000", boxShadow: "none" },
              }}
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              {product.stock === 0 ? "Out of Stock" : "Add To Cart"}
            </Button>

            <Button
              variant="outlined"
              size="large"
              sx={{
                flex: 1,
                textTransform: "none",
                fontWeight: 700,
                borderRadius: 2.5,
                py: 1.4,
                borderColor: "#111",
                color: "#111",
                borderWidth: 1.5,
                "&:hover": { borderWidth: 1.5, borderColor: "#111", bgcolor: "#f8fafc" },
              }}
              onClick={handleBuyNow}
              disabled={product.stock === 0}
            >
              Buy Now
            </Button>
          </Stack>

          {/* ================= TRUST BADGES ================= */}
          <Paper
            elevation={0}
            sx={{
              mt: 4,
              p: 2.5,
              borderRadius: 3,
              bgcolor: "#f8fafc",
              border: "1px solid #f1f5f9",
            }}
          >
            <Stack direction={{ xs: "row", sm: "row" }} spacing={2.5}>
              <Stack direction="column" spacing={1.2} alignItems="center" sx={{ flex: 1 }}>
                <Box sx={{ width: 34, height: 34, borderRadius: 2, bgcolor: "#eef2ff", color: "#4f46e5", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <LocalShippingOutlinedIcon sx={{ fontSize: 18 }} />
                </Box>
                <Typography sx={{ fontSize: 13.5, fontWeight: 500, color: "#334155" }}>
                  Free Delivery
                </Typography>
              </Stack>

              <Stack direction="column" spacing={1.2} alignItems="center" sx={{ flex: 1 }}>
                <Box sx={{ width: 34, height: 34, borderRadius: 2, bgcolor: "#f0fdf4", color: "#16a34a", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <VerifiedOutlinedIcon sx={{ fontSize: 18 }} />
                </Box>
                <Typography sx={{ fontSize: 13.5, fontWeight: 500, color: "#334155" }}>
                  100% Original
                </Typography>
              </Stack>

              <Stack direction="column" spacing={1.2} alignItems="center" sx={{ flex: 1 }}>
                <Box sx={{ width: 34, height: 34, borderRadius: 2, bgcolor: "#fff7ed", color: "#ea580c", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <ReplayOutlinedIcon sx={{ fontSize: 18 }} />
                </Box>
                <Typography sx={{ fontSize: 13.5, fontWeight: 500, color: "#334155" }}>
                  Easy Returns
                </Typography>
              </Stack>
            </Stack>
          </Paper>

          {/* ================= WRITE A REVIEW ================= */}
          <Paper
            elevation={0}
            sx={{
              mt: 3,
              p: 3,
              borderRadius: 3,
              border: "1px solid #eef0f3",
            }}
          >
            <Stack direction="row" alignItems="center" spacing={1.2} mb={2}>
              <Box sx={{ width: 34, height: 34, borderRadius: 2, bgcolor: "#f5f3ff", color: "#7c3aed", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <RateReviewOutlinedIcon sx={{ fontSize: 18 }} />
              </Box>
              <Typography sx={{ fontWeight: 700, color: "#0f172a" }}>
                Write a Review
              </Typography>
            </Stack>

          <Rating
  value={rating}
  onChange={(e, newValue) => setRating(newValue || 1)}
  sx={{ mb: 2 }}
/>

<TextField
  fullWidth
  multiline
  rows={3}
  value={comment}
  onChange={(e) => setComment(e.target.value)}
  placeholder="Share your experience with this product..."
  disabled={submittingReview}
  sx={{
    mb: 2,
    "& .MuiOutlinedInput-root": {
      borderRadius: 2,
      fontSize: 14,
      "& fieldset": { borderColor: "#e2e8f0" },
      "&:hover fieldset": { borderColor: "#94a3b8" },
      "&.Mui-focused fieldset": { borderColor: "#4f46e5" },
    },
  }}
/>

<Button
  variant="contained"
  onClick={submitReview}
  disabled={submittingReview}
  sx={{
    textTransform: "none",
    fontWeight: 600,
    borderRadius: 2,
    bgcolor: "#4f46e5",
    boxShadow: "none",
    "&:hover": { bgcolor: "#4338ca", boxShadow: "none" },
  }}
>
  {submittingReview ? "Submitting..." : "Submit Review"}
</Button>

          </Paper>

          {/* ================= REVIEWS LIST ================= */}
  <Box mt={5}>
  <Typography
    variant="h5"
    fontWeight={700}
    mb={3}
    sx={{ color: "#111827" }}
  >
    Customer Reviews ({product.reviews?.length || 0})
  </Typography>

  {displayedReviews?.length === 0 ? (
    <Paper
      elevation={0}
      sx={{
        p: 5,
        textAlign: "center",
        border: "1px dashed #d1d5db",
        borderRadius: 3,
        bgcolor: "#fafafa",
      }}
    >
      <Typography color="text.secondary">
        No reviews yet. Be the first to review this product ⭐
      </Typography>
    </Paper>
  ) : (
    <Stack spacing={2.5}>
      {displayedReviews?.map((review, index) => (
        <Paper
          key={review._id || index}
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 3,
            border: "1px solid #e5e7eb",
            transition: "0.3s",
            "&:hover": {
              boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
            },
          }}
        >
          <Stack
            direction="row"
            spacing={2}
            alignItems="flex-start"
          >
            <Avatar
              sx={{
                bgcolor: "#111",
                width: 48,
                height: 48,
                fontWeight: 700,
                fontSize: 16,
              }}
            >
              {review.name?.charAt(0).toUpperCase() || "U"}
            </Avatar>

      <Box flex={1}>
  <Stack
    direction={{ xs: "column", sm: "row" }}
    justifyContent="space-between"
    alignItems={{ xs: "flex-start", sm: "center" }}
    spacing={1}
  >
    <Box>
      {/* User Name */}
      <Typography
        sx={{
          fontSize: 16,
          fontWeight: 700,
          color: "#111827",
        }}
      >
        {review.name || "Anonymous User"}
      </Typography>

      {/* Review Date */}
      <Typography
        variant="caption"
        sx={{
          color: "#9ca3af",
          display: "block",
          mt: 0.3,
        }}
      >
        {new Date(review.createdAt).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })}
      </Typography>
    </Box>

    {/* Rating */}
   {/* Rating - cleaned up */}
<Box
  sx={{
    display: "inline-flex",
    alignItems: "center",
    bgcolor: "#fff8e1",
    px: 1,
    py: 0.4,
    borderRadius: 5,
    border: "1px solid #ffe082",
    flexShrink: 0,
  }}
>
  <Rating value={review.rating} precision={0.5} readOnly size="small" />
</Box>
  </Stack>

  <Typography
    sx={{
      mt: 2,
      color: "#4b5563",
      lineHeight: 1.8,
      fontSize: 14,
    }}
  >
    {review.comment}
  </Typography>
</Box>
          </Stack>
        </Paper>
      ))}
    </Stack>
  )}

  {product.reviews?.length > 4 && (
    <Box textAlign="center" mt={4}>
      <Button
        variant="contained"
        onClick={() => setShowAllReviews((prev) => !prev)}
        sx={{
          borderRadius: 10,
          px: 4,
          py: 1.2,
          bgcolor: "#111",
          textTransform: "none",
          fontWeight: 600,
          "&:hover": {
            bgcolor: "#333",
          },
        }}
      >
        {showAllReviews ? "Show Less Reviews" : "View All Reviews"}
      </Button>
    </Box>
  )}
</Box>
        </Grid>
      </Grid>

      {/* ================= RELATED PRODUCTS ================= */}
      {relatedProducts.length > 0 && (
        <Box mt={10}>
          <Typography variant="h4" fontWeight={700} mb={4} textAlign="center" sx={{ color: "#0f172a" }}>
            You May Also Like
          </Typography>

          <ProductGrid
            products={relatedProducts}
            wishlistMap={wishlistMap}
            setWishlistMap={setWishlistMap}
          />
        </Box>
      )}
    </Container>
  );
}