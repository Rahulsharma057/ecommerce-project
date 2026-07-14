"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { toast } from "react-toastify";
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
import StarIcon from "@mui/icons-material/Star";
import PersonIcon from "@mui/icons-material/Person";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CloseIcon from "@mui/icons-material/Close";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import ReplayOutlinedIcon from "@mui/icons-material/ReplayOutlined";
import RateReviewOutlinedIcon from "@mui/icons-material/RateReviewOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useSelector, useDispatch } from "react-redux";
import {
  addToWishlist,
  removeFromWishlist,
} from "@/redux/slices/wishlistSlice";
import { addToCart } from "@/redux/slices/cartSlice";
import ProductGrid from "@/components/product/ProductGrid";
import { API_URL } from "@/lib/api";
import LoadingButton from "@mui/lab/LoadingButton";
import ConfirmationDialog from "@/components/common/ConfirmationDialog";

// Simple label/value row for the "Product Details" panel — skips itself
// entirely if there's no value, so the panel never shows empty rows.
function DetailRow({ label, value }) {
  if (value === undefined || value === null || value === "") return null;
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        gap: 2,
        py: 1,
        borderBottom: "1px solid #f1f5f9",
        "&:last-child": { borderBottom: "none" },
      }}
    >
      <Typography sx={{ fontSize: 13.5, color: "#64748b" }}>{label}</Typography>
      <Typography sx={{ fontSize: 13.5, fontWeight: 600, color: "#1e293b", textAlign: "right" }}>
        {value}
      </Typography>
    </Box>
  );
}

export default function ProductDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const [buyNowLoading, setBuyNowLoading] = useState(false);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState("");
  const [wishlistMap, setWishlistMap] = useState({});
  const [cartLoading, setCartLoading] = useState(false);
  const isWishlisted = !!wishlistMap[product?._id];
  const [rating, setRating] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [selectedReviewId, setSelectedReviewId] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [comment, setComment] = useState("");
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [userId, setUserId] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const displayedReviews = showAllReviews
    ? product?.reviews || []
    : product?.reviews?.slice(0, 4) || [];
  const hasReviewed = product?.reviews?.some(
    (review) => review.userId === userId,
  );

  // ── Variant awareness ──
  // When a product has variants, addProduct/updateProduct force the
  // top-level `stock` to 0 and the real stock/price live per color+size
  // combination instead. Previously this page only ever read
  // product.stock/product.price directly, so any variant product would
  // show "Coming Soon" regardless of actual availability.
  const hasVariants = Array.isArray(product?.variants) && product.variants.length > 0;

  const matchedVariant = hasVariants
    ? product.variants.find(
        (v) =>
          (!product.colors?.length || v.color === selectedColor) &&
          (!product.sizes?.length || v.size === selectedSize),
      )
    : null;

  const activeStock = hasVariants ? matchedVariant?.stock ?? 0 : product?.stock ?? 0;
  const activePrice =
    hasVariants && matchedVariant?.price > 0 ? matchedVariant.price : product?.price ?? 0;
  const activeOriginalPrice =
    hasVariants && matchedVariant?.originalPrice > 0
      ? matchedVariant.originalPrice
      : product?.originalPrice ?? 0;
  const activeDiscount =
    activeOriginalPrice > activePrice
      ? Math.round(((activeOriginalPrice - activePrice) / activeOriginalPrice) * 100)
      : 0;

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?._id) {
      setUserId(user._id);
    }
  }, []);

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

  const fetchProduct = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/products/${id}`);
      const data = await res.json();

      setProduct(data);

      if (data.images?.length) {
        setSelectedImage(data.images[0]);
      }

      if (data.colors?.length) {
        setSelectedColor(data.colors[0]);
      }

      if (data.sizes?.length) {
        setSelectedSize(data.sizes[0]);
      }

      if (data.category) {
        fetchRelatedProducts(data.category, data._id);
      }
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  // If switching color/size drops the available stock below the currently
  // selected quantity, pull the quantity back down so it stays valid.
  useEffect(() => {
    if (activeStock > 0 && quantity > activeStock) {
      setQuantity(activeStock);
    }
  }, [selectedColor, selectedSize, activeStock]); // eslint-disable-line react-hooks/exhaustive-deps

  const updateReview = async () => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${API_URL}/products/${product._id}/review`, {
        method: "PUT",
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
        toast.error(data.message);
        return;
      }

      toast.success("Review Updated");

      await fetchProduct();

      setEditingReviewId(null);
      setComment("");
      setRating(0);
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  const deleteReview = async () => {
    const token = localStorage.getItem("token");

    setDeleteLoading(true);

    try {
      const res = await fetch(`${API_URL}/products/${product._id}/review`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message);
        return;
      }

      toast.success("Review deleted");

      setDeleteDialogOpen(false);
      setSelectedReviewId(null);

      await fetchProduct();
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setDeleteLoading(false);
    }
  };

  const fetchRelatedProducts = async (category, productId) => {
    try {
      const res = await fetch(
        `${API_URL}/products?category=${category}&limit=8`,
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

  const handleAddToCart = async () => {
    try {
      if (!product) return;

      if (activeStock === 0) {
        alert(
          hasVariants
            ? "This color/size combination is out of stock"
            : "Product is out of stock",
        );
        return;
      }

      if (quantity > activeStock) {
        alert(`Only ${activeStock} items available`);
        return;
      }

      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login first");
        router.push("/login");
        return;
      }
      setCartLoading(true);
      const res = await fetch(`${API_URL}/cart/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: product._id,
          quantity,
          color: selectedColor || undefined,
          size: selectedSize || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }
      toast.success("Product added to cart successfully.");
      window.dispatchEvent(new Event("cart-update"));
      setQuantity(1);
    } catch (err) {
      toast.error("Failed to add product to cart.");
    } finally {
      setCartLoading(false);
    }
  };

  const handleWishlist = async () => {
    const token = localStorage.getItem("token");
    if (!product) return;
    if (!token) {
      toast.info("Please login first.");
      return;
    }
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
      toast.success("Product removed from wishlist.");
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
      toast.success("Product added to wishlist.");
    }
  };

  const submitReview = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.info("Please login first.");
      return;
    }

    if (rating === 0) {
      toast.error("Please select a rating.");
      return;
    }

    if (!comment.trim()) {
      toast.error("Please write a review.");
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
        toast.error(data.message || "Failed to submit review");
        return;
      }

      toast.success(data.message || "Thank you for your valuable feedback ❤️");
      setComment("");
      setRating(0);

      fetchProduct();
    } catch (err) {
      console.log(err);
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleBuyNow = async () => {
    if (!product) return;

    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please login first");
      router.push("/login");
      return;
    }

    setBuyNowLoading(true);

    try {
      const res = await fetch(`${API_URL}/products/${product._id}`);
      const latestProduct = await res.json();

      if (!res.ok) {
        toast.error("Unable to verify product.");
        return;
      }

      // Re-check stock against the FRESH data, using the same
      // variant-aware logic as the page itself, so a stale page can't
      // let someone buy a combination that just sold out.
      const latestHasVariants =
        Array.isArray(latestProduct.variants) && latestProduct.variants.length > 0;
      const latestVariant = latestHasVariants
        ? latestProduct.variants.find(
            (v) =>
              (!product.colors?.length || v.color === selectedColor) &&
              (!product.sizes?.length || v.size === selectedSize),
          )
        : null;
      const latestStock = latestHasVariants
        ? latestVariant?.stock ?? 0
        : latestProduct.stock ?? 0;
      const latestPrice =
        latestHasVariants && latestVariant?.price > 0
          ? latestVariant.price
          : latestProduct.price ?? 0;

      if (latestStock === 0) {
        toast.warning(
          latestHasVariants
            ? "This color/size combination is out of stock"
            : "Product is out of stock",
        );
        return;
      }

      if (quantity > latestStock) {
        toast.info(
          `Only ${latestStock} item${latestStock > 1 ? "s" : ""} available.`,
        );
        return;
      }

      const safeProduct = {
        productId: latestProduct._id,
        name: latestProduct.name || "Product",
        image: latestProduct.images?.[0] || "",
        price: latestPrice,
        quantity,
        stock: latestStock,
        color: selectedColor || undefined,
        size: selectedSize || undefined,
      };

      localStorage.removeItem("buyNow");
      localStorage.setItem("buyNow", JSON.stringify([safeProduct]));

      router.push("/checkout");
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setBuyNowLoading(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Grid container spacing={6}>
          <Grid item xs={12} md={6}>
            <Skeleton variant="rounded" height={550} sx={{ borderRadius: 3 }} />
            <Stack direction="row" spacing={2} mt={2}>
              {[...Array(4)].map((_, i) => (
                <Skeleton
                  key={i}
                  variant="rounded"
                  width={90}
                  height={90}
                  sx={{ borderRadius: 1.5 }}
                />
              ))}
            </Stack>
          </Grid>
          <Grid item xs={12} md={6}>
            <Skeleton variant="text" width="70%" height={50} />
            <Skeleton variant="text" width="30%" height={30} sx={{ mt: 1 }} />
            <Skeleton variant="text" width="40%" height={60} sx={{ mt: 2 }} />
            <Skeleton
              variant="rounded"
              height={100}
              sx={{ mt: 3, borderRadius: 2 }}
            />
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

  const dimensions = product.dimensions || {};
  const hasDimensions = dimensions.length > 0 || dimensions.width > 0 || dimensions.height > 0;

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Grid container spacing={6}>
        {/* ================= IMAGES ================= */}
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            order: {
              xs: 1,
              md: 1,
            },
          }}
        >
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

              {activeStock <= 0 ? (
                <Chip
                  label="OUT OF STOCK"
                  size="small"
                  sx={{
                    position: "absolute",
                    top: 14,
                    left: 14,
                    bgcolor: "#111",
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: 11,
                    letterSpacing: 0.5,
                  }}
                />
              ) : activeDiscount > 0 ? (
                <Chip
                  label={`${activeDiscount}% OFF`}
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
                  "&::-webkit-scrollbar-thumb": {
                    bgcolor: "#e2e8f0",
                    borderRadius: 4,
                  },
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
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            order: {
              xs: 2,
              md: 2,
            },
          }}
        >
          <Stack direction="row" spacing={1} mb={1.5} flexWrap="wrap" useFlexGap>
            {product.brand && (
              <Chip
                label={product.brand}
                size="small"
                sx={{ bgcolor: "#111827", color: "#fff", fontWeight: 600 }}
              />
            )}
            <Chip
              label={product.category}
              size="small"
              sx={{ bgcolor: "#f1f5f9", color: "#475569", fontWeight: 600 }}
            />
            {product.subCategory && (
              <Chip
                label={product.subCategory}
                size="small"
                variant="outlined"
                sx={{ borderColor: "#e2e8f0", color: "#64748b", fontWeight: 600 }}
              />
            )}
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

          <Typography
            variant="h4"
            fontWeight={800}
            sx={{ color: "#0f172a", letterSpacing: -0.5 }}
          >
            {product.name}
          </Typography>

          <Stack direction="row" alignItems="center" spacing={1} mt={1.5}>
            <Rating
              value={product.ratings}
              precision={0.5}
              readOnly
              size="small"
            />
            <Typography variant="body2" sx={{ color: "#94a3b8" }}>
              ({product.numReviews || 0} reviews)
            </Typography>
          </Stack>

          {/* ================= PRICE (variant-aware: uses the matched
              color+size combination's price when the product has variants) ================= */}
          <Stack direction="row" alignItems="baseline" spacing={1.5} mt={2.5}>
            <Typography variant="h3" fontWeight={800} sx={{ color: "#0f172a" }}>
              ₹{activePrice?.toLocaleString()}
            </Typography>

            {activeOriginalPrice > activePrice && (
              <>
                <Typography
                  sx={{
                    fontSize: { xs: 16, sm: 20 },
                    color: "#94a3b8",
                    textDecoration: "line-through",
                  }}
                >
                  ₹{activeOriginalPrice.toLocaleString()}
                </Typography>
                <Typography sx={{ fontSize: 15, fontWeight: 700, color: "#16a34a" }}>
                  {activeDiscount}% off
                </Typography>
              </>
            )}
          </Stack>
          {product.taxPercent > 0 && (
            <Typography sx={{ fontSize: 12, color: "#94a3b8", mt: 0.5 }}>
              Inclusive of all taxes
            </Typography>
          )}

          <Typography
            sx={{
              mt: 2,
              lineHeight: 1.8,
              color: "#64748b",
              fontSize: 14.5,
            }}
          >
            {product.description ||
              "Premium quality fashion product with modern design, comfortable fitting and high-quality fabric."}
          </Typography>

          <Box sx={{ mt: 2 }}>
            <Chip
              label={
                activeStock === 0
                  ? hasVariants
                    ? "Out of Stock for this combination"
                    : "Coming Soon"
                  : activeStock <= 5
                    ? `🔥 Only ${activeStock} left`
                    : "✅ In Stock"
              }
              sx={{
                fontWeight: 600,
                bgcolor:
                  activeStock === 0
                    ? "#eef2ff"
                    : activeStock <= 5
                      ? "#fffbeb"
                      : "#f0fdf4",
                color:
                  activeStock === 0
                    ? "#4338ca"
                    : activeStock <= 5
                      ? "#a16207"
                      : "#15803d",
              }}
            />
          </Box>

          {/* ================= FABRIC ================= */}
          {product.fabric && (
            <Stack direction="row" alignItems="center" spacing={1} mt={2}>
              <Typography sx={{ fontWeight: 600, color: "#334155", fontSize: 14 }}>
                Fabric:
              </Typography>
              <Chip
                label={product.fabric}
                size="small"
                variant="outlined"
                sx={{ borderColor: "#e2e8f0", color: "#334155" }}
              />
            </Stack>
          )}

          {/* ================= COLORS ================= */}
          {product.colors?.length > 0 && (
            <Box mt={3}>
              <Typography sx={{ fontWeight: 600, color: "#334155", fontSize: 14, mb: 1 }}>
                Color: <Box component="span" sx={{ fontWeight: 400, color: "#64748b" }}>{selectedColor}</Box>
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {product.colors.map((color) => {
                  // If this product has variants, grey out colors that have
                  // no stock at all (across every size) — previously every
                  // color looked equally available even when sold out.
                  const colorHasStock = hasVariants
                    ? product.variants.some((v) => v.color === color && v.stock > 0)
                    : true;
                  return (
                    <Chip
                      key={color}
                      label={color}
                      onClick={() => setSelectedColor(color)}
                      variant={selectedColor === color ? "filled" : "outlined"}
                      sx={{
                        fontWeight: 600,
                        borderRadius: 2,
                        opacity: colorHasStock ? 1 : 0.4,
                        bgcolor: selectedColor === color ? "#111" : "transparent",
                        color: selectedColor === color ? "#fff" : "#334155",
                        borderColor: "#e2e8f0",
                        "&:hover": {
                          bgcolor: selectedColor === color ? "#000" : "#f8fafc",
                        },
                      }}
                    />
                  );
                })}
              </Stack>
            </Box>
          )}

          {/* ================= SIZES ================= */}
          {product.sizes?.length > 0 && (
            <Box mt={2.5}>
              <Typography sx={{ fontWeight: 600, color: "#334155", fontSize: 14, mb: 1 }}>
                Size: <Box component="span" sx={{ fontWeight: 400, color: "#64748b" }}>{selectedSize}</Box>
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {product.sizes.map((size) => {
                  const sizeHasStock = hasVariants
                    ? product.variants.some(
                        (v) =>
                          v.size === size &&
                          (!product.colors?.length || v.color === selectedColor) &&
                          v.stock > 0,
                      )
                    : true;
                  return (
                    <Box
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      sx={{
                        minWidth: 42,
                        height: 42,
                        px: 1.5,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: 2,
                        border: "1.5px solid",
                        borderColor: selectedSize === size ? "#111" : "#e2e8f0",
                        bgcolor: selectedSize === size ? "#111" : "#fff",
                        color: selectedSize === size ? "#fff" : "#334155",
                        fontWeight: 700,
                        fontSize: 13,
                        cursor: "pointer",
                        opacity: sizeHasStock ? 1 : 0.4,
                        transition: "all .15s ease",
                      }}
                    >
                      {size}
                    </Box>
                  );
                })}
              </Stack>
            </Box>
          )}

          {/* ================= QUANTITY ================= */}
          <Stack direction="row" spacing={2} alignItems="center" mt={4}>
            <Typography
              sx={{ fontWeight: 600, color: "#334155", fontSize: 14 }}
            >
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

              <Typography
                fontWeight={700}
                sx={{ width: 32, textAlign: "center" }}
              >
                {quantity}
              </Typography>

              <IconButton
                onClick={() => {
                  if (activeStock === 0) {
                    toast.warning(
                      hasVariants
                        ? "This color/size combination is out of stock."
                        : "This product is currently out of stock.",
                    );
                    return;
                  }

                  if (quantity >= activeStock) {
                    toast.info(
                      `Only ${activeStock} item${activeStock > 1 ? "s" : ""} available in stock.`,
                    );
                    return;
                  }

                  setQuantity((prev) => prev + 1);
                }}
                size="small"
                sx={{ borderRadius: 0, px: 1.3 }}
              >
                <AddIcon fontSize="small" />
              </IconButton>
            </Stack>
          </Stack>

          {/* ================= BUTTONS ================= */}
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mt={4}>
            <LoadingButton
              loading={cartLoading}
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
              disabled={activeStock === 0}
            >
              Add To Cart
            </LoadingButton>

            <LoadingButton
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
                "&:hover": {
                  borderWidth: 1.5,
                  borderColor: "#111",
                  bgcolor: "#f8fafc",
                },
              }}
              loading={buyNowLoading}
              onClick={handleBuyNow}
              disabled={activeStock === 0}
            >
              {activeStock === 0 ? "Out of Stock" : "Buy Now"}
            </LoadingButton>
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
              <Stack
                direction="column"
                spacing={1.2}
                alignItems="center"
                sx={{ flex: 1 }}
              >
                <Box
                  sx={{
                    width: 34,
                    height: 34,
                    borderRadius: 2,
                    bgcolor: "#eef2ff",
                    color: "#4f46e5",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <LocalShippingOutlinedIcon sx={{ fontSize: 18 }} />
                </Box>
                <Typography
                  sx={{ fontSize: 13.5, fontWeight: 500, color: "#334155", textAlign: "center" }}
                >
                  {product.freeShipping ? "Free Delivery" : "Fast Delivery"}
                </Typography>
                <Typography sx={{ fontSize: 11, color: "#94a3b8" }}>
                  in {product.estimatedDeliveryDays || 5} days
                </Typography>
              </Stack>

              <Stack
                direction="column"
                spacing={1.2}
                alignItems="center"
                sx={{ flex: 1 }}
              >
                <Box
                  sx={{
                    width: 34,
                    height: 34,
                    borderRadius: 2,
                    bgcolor: "#f0fdf4",
                    color: "#16a34a",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <VerifiedOutlinedIcon sx={{ fontSize: 18 }} />
                </Box>
                <Typography
                  sx={{ fontSize: 13.5, fontWeight: 500, color: "#334155" }}
                >
                  100% Original
                </Typography>
              </Stack>

              <Stack
                direction="column"
                spacing={1.2}
                alignItems="center"
                sx={{ flex: 1 }}
              >
                <Box
                  sx={{
                    width: 34,
                    height: 34,
                    borderRadius: 2,
                    bgcolor: "#fff7ed",
                    color: "#ea580c",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <ReplayOutlinedIcon sx={{ fontSize: 18 }} />
                </Box>
                <Typography
                  sx={{ fontSize: 13.5, fontWeight: 500, color: "#334155" }}
                >
                  7 Days Return
                </Typography>
              </Stack>
            </Stack>
          </Paper>

          {/* ================= PRODUCT DETAILS ================= */}
          {(product.brand ||
            product.fit ||
            product.pattern ||
            product.occasion ||
            product.neckType ||
            product.sleeveType ||
            product.countryOfOrigin ||
            product.collection ||
            product.careInstructions ||
            hasDimensions ||
            product.weight > 0) && (
            <Paper
              elevation={0}
              sx={{ mt: 3, p: { xs: 2, sm: 3 }, borderRadius: 3, border: "1px solid #eef0f3" }}
            >
              <Stack direction="row" alignItems="center" spacing={1.2} mb={1.5}>
                <InfoOutlinedIcon sx={{ fontSize: 19, color: "#4f46e5" }} />
                <Typography sx={{ fontWeight: 700, fontSize: 15, color: "#0f172a" }}>
                  Product Details
                </Typography>
              </Stack>

              <DetailRow label="Brand" value={product.brand} />
              <DetailRow label="Collection" value={product.collection} />
              <DetailRow label="Fit" value={product.fit} />
              <DetailRow label="Pattern" value={product.pattern} />
              <DetailRow label="Occasion" value={product.occasion} />
              <DetailRow label="Neck Type" value={product.neckType} />
              <DetailRow label="Sleeve Type" value={product.sleeveType} />
              <DetailRow label="Country of Origin" value={product.countryOfOrigin} />
              <DetailRow
                label="Weight"
                value={product.weight > 0 ? `${product.weight} g` : null}
              />
              <DetailRow
                label="Dimensions (L × W × H)"
                value={
                  hasDimensions
                    ? `${dimensions.length || 0} × ${dimensions.width || 0} × ${dimensions.height || 0} cm`
                    : null
                }
              />

              {product.careInstructions && (
                <Box sx={{ pt: 1.5, mt: 1, borderTop: "1px solid #f1f5f9" }}>
                  <Typography sx={{ fontSize: 12.5, fontWeight: 600, color: "#64748b", mb: 0.5 }}>
                    Care Instructions
                  </Typography>
                  <Typography sx={{ fontSize: 13.5, color: "#334155", lineHeight: 1.7 }}>
                    {product.careInstructions}
                  </Typography>
                </Box>
              )}
            </Paper>
          )}

          {/* ================= TAGS ================= */}
          {product.tags?.length > 0 && (
            <Box mt={2.5}>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {product.tags.map((tag) => (
                  <Chip
                    key={tag}
                    label={`#${tag}`}
                    size="small"
                    variant="outlined"
                    sx={{ borderColor: "#e2e8f0", color: "#94a3b8", fontSize: 11.5 }}
                  />
                ))}
              </Stack>
            </Box>
          )}

          {/* ================= WRITE A REVIEW ================= */}
          <Paper
            elevation={0}
            sx={{
              mt: 3,
              p: { xs: 2, sm: 3 },
              borderRadius: 3,
              border: "1px solid #eef0f3",
              background: hasReviewed && !editingReviewId ? "#fafafa" : "#fff",
            }}
          >
            <Stack direction="row" alignItems="center" spacing={1.2} mb={2.5}>
              <Box
                sx={{
                  width: 38,
                  height: 38,
                  borderRadius: 2,
                  bgcolor: "#f5f3ff",
                  color: "#7c3aed",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <RateReviewOutlinedIcon sx={{ fontSize: 19 }} />
              </Box>
              <Box>
                <Typography
                  sx={{
                    fontWeight: 700,
                    color: "#0f172a",
                    fontSize: { xs: 15, sm: 16.5 },
                    lineHeight: 1.3,
                  }}
                >
                  {editingReviewId ? "Edit Your Review" : "Write a Review"}
                </Typography>
                {!editingReviewId && (
                  <Typography
                    sx={{
                      fontSize: { xs: 12, sm: 12.5 },
                      color: "#94a3b8",
                      mt: 0.2,
                    }}
                  >
                    Share your honest experience with this product
                  </Typography>
                )}
              </Box>
            </Stack>

            {hasReviewed && !editingReviewId && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  bgcolor: "#f1f5f9",
                  border: "1px solid #e2e8f0",
                  borderRadius: 2,
                  px: 2,
                  py: 1.2,
                  mb: 2.5,
                }}
              >
                <CheckCircleOutlineIcon
                  sx={{ fontSize: 18, color: "#64748b" }}
                />
                <Typography sx={{ fontSize: 13, color: "#475569" }}>
                  You've already reviewed this product. Edit it from the list
                  below.
                </Typography>
              </Box>
            )}

            <Box
              sx={{
                opacity: !editingReviewId && hasReviewed ? 0.55 : 1,
                pointerEvents:
                  !editingReviewId && hasReviewed ? "none" : "auto",
                transition: "opacity 0.2s",
              }}
            >
              <Rating
                value={rating}
                onChange={(e, newValue) => setRating(newValue || 0)}
                sx={{
                  mb: 2.5,
                  fontSize: { xs: 20, sm: 24 },

                  color: "#f59e0b",
                }}
                disabled={!editingReviewId && hasReviewed}
              />

              <TextField
                fullWidth
                multiline
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="What did you like or dislike? How did you use this product?"
                disabled={submittingReview || (!editingReviewId && hasReviewed)}
                inputProps={{ maxLength: 500 }}
                helperText={`${comment?.length || 0}/500`}
                FormHelperTextProps={{
                  sx: {
                    textAlign: "right",
                    mx: 0,
                    fontSize: 11.5,
                    color: "#94a3b8",
                  },
                }}
                sx={{
                  mb: 1,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    fontSize: 14,
                    bgcolor: "#fff",
                    "& fieldset": { borderColor: "#e2e8f0" },
                    "&:hover fieldset": { borderColor: "#94a3b8" },
                    "&.Mui-focused fieldset": {
                      borderColor: "#4f46e5",
                      borderWidth: 1.5,
                    },
                  },
                }}
              />

              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={1.5}
                mt={0}
              >
                <Button
                  variant="contained"
                  fullWidth
                  onClick={editingReviewId ? updateReview : submitReview}
                  disabled={
                    submittingReview ||
                    (!editingReviewId && hasReviewed) ||
                    !rating ||
                    !comment?.trim()
                  }
                  sx={{
                    textTransform: "none",
                    fontWeight: 600,
                    fontSize: 14,
                    borderRadius: 2,
                    bgcolor: "#111827",
                    boxShadow: "none",
                    py: { xs: 1.1, sm: 1.2 },
                    width: { xs: "100%", sm: "auto" },
                    px: { sm: 4 },
                    "&:hover": { bgcolor: "#000", boxShadow: "none" },
                    "&.Mui-disabled": {
                      bgcolor: "#e2e8f0",
                      color: "#94a3b8",
                    },
                  }}
                >
                  {submittingReview
                    ? editingReviewId
                      ? "Updating..."
                      : "Submitting..."
                    : editingReviewId
                      ? "Update Review"
                      : "Submit Review"}
                </Button>

                {editingReviewId && (
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={() => {
                      setEditingReviewId(null);
                      setRating(0);
                      setComment("");
                    }}
                    sx={{
                      textTransform: "none",
                      fontWeight: 600,
                      fontSize: 14,
                      borderRadius: 2,
                      borderColor: "#e2e8f0",
                      color: "#475569",
                      width: { xs: "100%", sm: "auto" },
                      px: { sm: 3 },
                      "&:hover": {
                        borderColor: "#cbd5e1",
                        bgcolor: "#f8fafc",
                      },
                    }}
                  >
                    Cancel
                  </Button>
                )}
              </Stack>
            </Box>
          </Paper>

          {/* ================= REVIEWS LIST ================= */}
          <Box mt={5}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              justifyContent="space-between"
              alignItems={{ xs: "flex-start", sm: "center" }}
              spacing={1.5}
              mb={3}
            >
              <Typography
                variant="h5"
                fontWeight={700}
                sx={{
                  color: "#111827",
                  fontSize: { xs: "1.15rem", sm: "1.5rem" },
                }}
              >
                Customer Reviews ({product.reviews?.length || 0})
              </Typography>

              {product.reviews?.length > 0 && (
                <Box
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 0.6,
                    bgcolor: "#fff8e1",
                    border: "1px solid #ffe082",
                    borderRadius: 5,
                    px: 1.5,
                    py: 0.6,
                  }}
                >
                  <StarIcon sx={{ fontSize: 18, color: "#f59e0b" }} />
                  <Typography
                    sx={{ fontSize: 14, fontWeight: 700, color: "#78350f" }}
                  >
                    {(
                      product.reviews.reduce((sum, r) => sum + r.rating, 0) /
                      product.reviews.length
                    ).toFixed(1)}
                  </Typography>
                  <Typography sx={{ fontSize: 12.5, color: "#92700a" }}>
                    out of 5
                  </Typography>
                </Box>
              )}
            </Stack>

            {displayedReviews?.length === 0 ? (
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 3, sm: 5 },
                  textAlign: "center",
                  border: "1px dashed #d1d5db",
                  borderRadius: 3,
                  bgcolor: "#fafafa",
                }}
              >
                <RateReviewOutlinedIcon
                  sx={{ fontSize: 32, color: "#cbd5e1", mb: 1 }}
                />
                <Typography
                  color="text.secondary"
                  sx={{ fontSize: { xs: 13.5, sm: 14 } }}
                >
                  No reviews yet. Be the first to review this product ⭐
                </Typography>
              </Paper>
            ) : (
              <Stack spacing={{ xs: 2, sm: 2.5 }}>
                {displayedReviews?.map((review, index) => (
                  <Paper
                    key={review._id || index}
                    elevation={0}
                    sx={{
                      p: { xs: 2, sm: 3 },
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
                      spacing={{ xs: 1.2, sm: 2 }}
                      alignItems="flex-start"
                    >
                      <Avatar
                        sx={{
                          bgcolor: "#111",
                          width: { xs: 38, sm: 48 },
                          height: { xs: 38, sm: 48 },
                          fontWeight: 700,
                          fontSize: { xs: 14, sm: 16 },
                          flexShrink: 0,
                        }}
                      >
                        {review.name?.charAt(0).toUpperCase() || "U"}
                      </Avatar>

                      <Box flex={1} minWidth={0}>
                        <Stack
                          direction={{ xs: "row", sm: "row" }}
                          justifyContent="space-between"
                          alignItems={{ xs: "flex-start", sm: "flex-start" }}
                          spacing={1}
                        >
                          <Box>
                            <Stack
                              direction="row"
                              alignItems="center"
                              spacing={0.8}
                              flexWrap="wrap"
                            >
                              <Typography
                                sx={{
                                  fontSize: { xs: 14, sm: 16 },
                                  fontWeight: 700,
                                  color: "#111827",
                                  wordBreak: "break-word",
                                }}
                              >
                                {review.name || "Anonymous User"}
                              </Typography>

                              {review.userId === userId && (
                                <Box
                                  sx={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: 0.4,
                                    bgcolor: "#eef2ff",
                                    color: "#4f46e5",
                                    borderRadius: 4,
                                    px: 0.9,
                                    py: 0.15,
                                  }}
                                >
                                  <PersonIcon sx={{ fontSize: 12 }} />
                                  <Typography
                                    sx={{ fontSize: 10.5, fontWeight: 700 }}
                                  >
                                    You
                                  </Typography>
                                </Box>
                              )}
                            </Stack>

                            <Stack
                              direction="row"
                              alignItems="center"
                              spacing={0.5}
                              mt={0.4}
                            >
                              <CalendarTodayOutlinedIcon
                                sx={{ fontSize: 12, color: "#9ca3af" }}
                              />
                              <Typography
                                variant="caption"
                                sx={{
                                  color: "#9ca3af",
                                  fontSize: { xs: 11, sm: 12 },
                                }}
                              >
                                {new Date(review.createdAt).toLocaleDateString(
                                  "en-IN",
                                  {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                  },
                                )}
                              </Typography>
                            </Stack>
                          </Box>

                          <Box
                            sx={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 0.4,
                              bgcolor: "#fff8e1",
                              px: 1.2,
                              py: 0.5,
                              borderRadius: 5,
                              border: "1px solid #ffe082",
                              flexShrink: 0,
                            }}
                          >
                            <StarIcon sx={{ fontSize: 15, color: "#f59e0b" }} />
                            <Typography
                              sx={{
                                fontSize: 13,
                                fontWeight: 700,
                                color: "#78350f",
                              }}
                            >
                              {review.rating}
                            </Typography>
                          </Box>
                        </Stack>

                        <Typography
                          sx={{
                            mt: 1.5,
                            color: "#4b5563",
                            lineHeight: 1.7,
                            fontSize: { xs: 13, sm: 14 },
                            wordBreak: "break-word",
                          }}
                        >
                          {review.comment}
                        </Typography>

                        {review.userId === userId && (
                          <Stack
                            direction="row"
                            spacing={1}
                            mt={2}
                            alignItems="center"
                            flexWrap="wrap"
                          >
                            <Button
                              size="small"
                              startIcon={
                                <EditOutlinedIcon sx={{ fontSize: 15 }} />
                              }
                              sx={{
                                fontSize: { xs: 12, sm: 12.5 },
                                color: "#475569",
                                textTransform: "none",
                                fontWeight: 600,
                                "&:hover": { bgcolor: "#f1f5f9" },
                              }}
                              onClick={() => {
                                setEditingReviewId(review._id);
                                setRating(review.rating);
                                setComment(review.comment);
                              }}
                            >
                              Edit
                            </Button>

                            <Button
                              size="small"
                              startIcon={
                                <DeleteOutlineIcon sx={{ fontSize: 15 }} />
                              }
                              sx={{
                                fontSize: { xs: 12, sm: 12.5 },
                                color: "#dc2626",
                                textTransform: "none",
                                fontWeight: 600,
                                "&:hover": { bgcolor: "#fef2f2" },
                              }}
                              onClick={() => {
                                setSelectedReviewId(review._id);
                                setDeleteDialogOpen(true);
                              }}
                            >
                              Delete
                            </Button>

                            {editingReviewId === review._id && (
                              <Button
                                size="small"
                                startIcon={<CloseIcon sx={{ fontSize: 15 }} />}
                                sx={{
                                  fontSize: { xs: 12, sm: 12.5 },
                                  color: "#6b7280",
                                  textTransform: "none",
                                  fontWeight: 600,
                                  "&:hover": { bgcolor: "#f8fafc" },
                                }}
                                onClick={() => {
                                  setEditingReviewId(null);
                                  setRating(0);
                                  setComment("");
                                }}
                              >
                                Cancel
                              </Button>
                            )}
                          </Stack>
                        )}
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
                  endIcon={
                    showAllReviews ? (
                      <KeyboardArrowUpIcon />
                    ) : (
                      <KeyboardArrowDownIcon />
                    )
                  }
                  sx={{
                    borderRadius: 10,
                    px: { xs: 3, sm: 4 },
                    py: { xs: 1, sm: 1.2 },
                    fontSize: { xs: 13, sm: 14 },
                    bgcolor: "#111",
                    textTransform: "none",
                    fontWeight: 600,
                    width: { xs: "100%", sm: "auto" },
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

        {/* ================= RELATED PRODUCTS ================= */}
        {relatedProducts.length > 0 && (
          <Grid
            item
            xs={12}
            sx={{
              order: {
                xs: 3,
                md: 4,
              },
            }}
          >
            <Typography
              variant="h4"
              fontWeight={700}
              mb={4}
              textAlign="center"
              sx={{ color: "#0f172a" }}
            >
              You May Also Like
            </Typography>

            <ProductGrid
              products={relatedProducts}
              wishlistMap={wishlistMap}
              setWishlistMap={setWishlistMap}
            />
          </Grid>
        )}
      </Grid>

      <ConfirmationDialog
        open={deleteDialogOpen}
        title="Delete Review"
        message="Are you sure you want to delete this review? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        confirmColor="error"
        loading={deleteLoading}
        onConfirm={deleteReview}
        onCancel={() => {
          setDeleteDialogOpen(false);
          setSelectedReviewId(null);
        }}
      />
    </Container>
  );
}
