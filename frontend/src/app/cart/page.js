"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import AppliedCoupon from "@/components/coupon/AppliedCoupon";
import {
  Box,
  Button,
  Container,
  Divider,
  Grid,
  Paper,
  Stack,
  Typography,
  Chip,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useRouter } from "next/navigation";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CartItem from "@/components/cart/CartItem";
import { API_URL } from "@/lib/api";

const FREE_SHIPPING_THRESHOLD = 2000;

// small safe helpers ---------------------------------------------------
const safeGetItem = (key) => {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(key);
  } catch (err) {
    console.error("localStorage read error:", err);
    return null;
  }
};

const safeSetItem = (key, value) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, value);
  } catch (err) {
    console.error("localStorage write error:", err);
  }
};

const safeRemoveItem = (key) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(key);
  } catch (err) {
    console.error("localStorage remove error:", err);
  }
};

const safeJsonParse = (value, fallback = null) => {
  if (!value) return fallback;
  try {
    return JSON.parse(value);
  } catch (err) {
    console.error("JSON parse error:", err);
    return fallback;
  }
};
// -----------------------------------------------------------------------

export default function CartPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAuthed, setIsAuthed] = useState(true);
  const [stockDialog, setStockDialog] = useState({
    open: false,
    adjustedCart: [],
  });
  const [outOfStockDialog, setOutOfStockDialog] = useState({
    open: false,
    items: [],
  });
  const [couponCode, setCouponCode] = useState("");
  const [couponData, setCouponData] = useState(null);
  const [discount, setDiscount] = useState(0);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.productId?.price || 0) * (item.quantity || 1),
    0,
  );

  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 99;
  const tax = Math.round(subtotal * 0.05);
  const total = Math.max(subtotal + shipping + tax - discount, 0);

  const totalItems = cartItems.reduce(
    (sum, item) => sum + (item.quantity || 0),
    0,
  );

  const shippingProgress = Math.min(
    (subtotal / FREE_SHIPPING_THRESHOLD) * 100,
    100,
  );

  const amountLeft = FREE_SHIPPING_THRESHOLD - subtotal;

  // 🔥 FETCH CART
  const fetchCart = async () => {
    const token = safeGetItem("token");

    // agar login hi nahi hai to API call try mat karo, seedha empty state dikhao
    if (!token) {
      setIsAuthed(false);
      setCartItems([]);
      setLoading(false);
      return;
    }

    setIsAuthed(true);

    try {
      const res = await fetch(`${API_URL}/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401) {
        // token expired / invalid
        setIsAuthed(false);
        setCartItems([]);
        safeRemoveItem("token");
        return;
      }

      if (!res.ok) {
        throw new Error(`Cart fetch failed with status ${res.status}`);
      }

      const data = await res.json();
      const items = Array.isArray(data)
        ? data
        : data?.items || data?.cart?.items || [];

      setCartItems(items);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load cart.");
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (couponData && subtotal < couponData.minOrderAmount) {
      setCouponData(null);
      setDiscount(0);

      safeRemoveItem("appliedCoupon");

      toast.info(
        "Coupon removed because minimum order value is no longer met.",
      );
    }
  }, [subtotal, couponData]);

  const handleCheckout = async () => {
    const token = safeGetItem("token");

    if (!token) {
      toast.error("Please log in to continue checkout.");
      router.push("/login");
      return;
    }

    try {
      if (couponData) {
        const res = await fetch(`${API_URL}/coupons/apply`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            code: couponData.code,
            subtotal,
          }),
        });

        if (!res.ok) {
          toast.error("Coupon expired or invalid.");

          setCouponData(null);
          setDiscount(0);
          safeRemoveItem("appliedCoupon");
          safeRemoveItem("checkoutCoupon");

          return;
        }
      }

      const res = await fetch(`${API_URL}/cart/validate-stock`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401) {
        toast.error("Session expired. Please log in again.");
        safeRemoveItem("token");
        router.push("/login");
        return;
      }

      if (!res.ok) {
        throw new Error(`Stock validation failed with status ${res.status}`);
      }

      const data = await res.json();

      // ❌ OUT OF STOCK
      if (data.outOfStockItems?.length > 0) {
        setOutOfStockDialog({
          open: true,
          items: data.outOfStockItems,
        });

        return;
      }

      // ⚠️ STOCK ADJUSTMENT
      if (data.adjustedCart?.length > 0) {
        const results = await Promise.allSettled(
          data.adjustedCart.map((item) =>
            fetch(`${API_URL}/cart/update/${item.cartId}`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                type: "set",
                quantity: item.available,
              }),
            }),
          ),
        );

        const failed = results.some((r) => r.status === "rejected");
        if (failed) {
          toast.error("Some items could not be updated. Please retry.");
        }

        // 🔄 refresh cart UI
        await fetchCart();

        setStockDialog({
          open: true,
          adjustedCart: data.adjustedCart,
        });
        return;
      }

      // 🔄 refresh cart UI
      await fetchCart();

      // 📦 save address
      const defaultAddress = safeGetItem("selectedAddress");

      if (defaultAddress) {
        safeSetItem("checkoutAddress", defaultAddress);
      }
      if (couponData) {
        safeSetItem(
          "checkoutCoupon",
          JSON.stringify({
            coupon: couponData,
            discount,
          }),
        );
      } else {
        safeRemoveItem("checkoutCoupon");
      }
      // 🚀 navigate AFTER all updates
      router.push("/checkout");
    } catch (err) {
      console.error(err);
      toast.error("Unable to verify stock. Please try again.");
    }
  };

  const handleApplyCoupon = async () => {
    const token = safeGetItem("token");

    if (!token) {
      toast.error("Please log in to apply a coupon.");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/coupons/apply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          code: couponCode,
          subtotal,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        toast.error(data.message || "Invalid coupon.");
        return;
      }

      setCouponData(data.coupon);
      setDiscount(data.discount);

      safeSetItem(
        "appliedCoupon",
        JSON.stringify({
          coupon: data.coupon,
          discount: data.discount,
        }),
      );

      toast.success("Coupon applied successfully.");
    } catch (err) {
      console.error(err);
      toast.error("Unable to apply coupon. Please try again.");
    }
  };

  useEffect(() => {
    fetchCart();

    const savedCoupon = safeGetItem("appliedCoupon");
    const data = safeJsonParse(savedCoupon);

    if (data?.coupon) {
      setCouponData(data.coupon);
      setDiscount(data.discount || 0);
    }

    const handleCartUpdate = () => {
      fetchCart();
    };

    window.addEventListener("cart-update", handleCartUpdate);

    return () => {
      window.removeEventListener("cart-update", handleCartUpdate);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (cartItems.length === 0) {
      setCouponData(null);
      setDiscount(0);

      safeRemoveItem("appliedCoupon");
      safeRemoveItem("checkoutCoupon");
    }
  }, [cartItems]);

  const handleRemove = async (id) => {
    const token = safeGetItem("token");
    if (!token) {
      toast.error("Please log in.");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/cart/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error(`Remove failed with status ${res.status}`);
      }

      await fetchCart();
      // Header cart badge refresh — removing a line changes the count,
      // and this happens entirely within CartPage, so nothing else was
      // telling the Navbar about it.
      window.dispatchEvent(new Event("cart-update"));
      toast.success("Item removed from cart.");
    } catch (err) {
      console.error("Remove error:", err);
      toast.error("Could not remove item. Please try again.");
    }
  };

  // ➕ INCREASE
  const handleIncrease = async (id) => {
    const token = safeGetItem("token");
    if (!token) {
      toast.error("Please log in.");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/cart/update/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ type: "inc" }),
      });

      if (!res.ok) {
        throw new Error(`Increase failed with status ${res.status}`);
      }

      await fetchCart();
      window.dispatchEvent(new Event("cart-update"));
    } catch (err) {
      console.error("Increase error:", err);
      toast.error("Could not update quantity. Please try again.");
    }
  };

  // ➖ DECREASE
  const handleDecrease = async (id) => {
    const token = safeGetItem("token");
    if (!token) {
      toast.error("Please log in.");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/cart/update/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ type: "dec" }),
      });

      if (!res.ok) {
        throw new Error(`Decrease failed with status ${res.status}`);
      }

      await fetchCart();
      // Decreasing past 1 deletes the cart line on the backend, so the
      // count can change here too — keep the Navbar badge in sync.
      window.dispatchEvent(new Event("cart-update"));
    } catch (err) {
      console.error("Decrease error:", err);
      toast.error("Could not update quantity. Please try again.");
    }
  };

  // renamed to avoid clashing with anything imported from redux slices
  const handleRemoveCoupon = () => {
    setCouponData(null);
    setDiscount(0);
    setCouponCode("");

    safeRemoveItem("appliedCoupon");
    safeRemoveItem("checkoutCoupon");

    window.dispatchEvent(new Event("coupon-update"));
  };

  useEffect(() => {
    const handleCouponUpdate = () => {
      const saved = safeGetItem("appliedCoupon");
      const data = safeJsonParse(saved);

      if (!data?.coupon) {
        setCouponData(null);
        setDiscount(0);
        setCouponCode("");
        return;
      }

      setCouponData(data.coupon);
      setDiscount(data.discount || 0);
    };

    window.addEventListener("coupon-update", handleCouponUpdate);

    return () =>
      window.removeEventListener("coupon-update", handleCouponUpdate);
  }, []);

  if (loading) {
    return (
      <Box sx={{ p: 5, textAlign: "center" }}>
        <Typography>Loading cart...</Typography>
      </Box>
    );
  }

  // 🔐 NOT LOGGED IN — friendly state instead of a crash
  if (!isAuthed) {
    return (
      <Box
        sx={{
          bgcolor: "grey.50",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Container maxWidth="sm">
          <Box sx={{ textAlign: "center", py: 10 }}>
            <Box
              sx={{
                width: 88,
                height: 88,
                borderRadius: "50%",
                bgcolor: "grey.100",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mx: "auto",
                mb: 3,
              }}
            >
              <ShoppingBagOutlinedIcon
                sx={{ fontSize: 40, color: "text.disabled" }}
              />
            </Box>
            <Typography
              variant="h5"
              fontWeight={700}
              letterSpacing="-0.02em"
              mb={1}
            >
              Please log in to view your cart
            </Typography>
            <Typography color="text.secondary" fontSize={14} mb={4}>
              You need to be signed in to see and manage your cart items.
            </Typography>
            <Button
              component={Link}
              href="/login"
              variant="contained"
              endIcon={<ArrowForwardIcon sx={{ fontSize: 16 }} />}
              sx={{
                bgcolor: "#111",
                color: "#fff",
                borderRadius: 2,
                px: 3,
                py: 1.25,
                fontSize: 13,
                fontWeight: 600,
                "&:hover": { bgcolor: "#333" },
              }}
            >
              Log In
            </Button>
          </Box>
        </Container>
      </Box>
    );
  }

  if (cartItems.length === 0) {
    return (
      <Box
        sx={{
          bgcolor: "grey.50",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Container maxWidth="sm">
          <Box sx={{ textAlign: "center", py: 10 }}>
            <Box
              sx={{
                width: 88,
                height: 88,
                borderRadius: "50%",
                bgcolor: "grey.100",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mx: "auto",
                mb: 3,
              }}
            >
              <ShoppingBagOutlinedIcon
                sx={{ fontSize: 40, color: "text.disabled" }}
              />
            </Box>
            <Typography
              variant="h5"
              fontWeight={700}
              letterSpacing="-0.02em"
              mb={1}
            >
              Your cart is empty
            </Typography>
            <Typography color="text.secondary" fontSize={14} mb={4}>
              Add items to your cart to see them here.
            </Typography>
            <Button
              component={Link}
              href="/products"
              variant="contained"
              endIcon={<ArrowForwardIcon sx={{ fontSize: 16 }} />}
              sx={{
                bgcolor: "#111",
                color: "#fff",
                borderRadius: 2,
                px: 3,
                py: 1.25,
                fontSize: 13,
                fontWeight: 600,
                "&:hover": { bgcolor: "#333" },
              }}
            >
              Browse Products
            </Button>
          </Box>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: "grey.50", minHeight: "100vh", py: { xs: 3, md: 5 } }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Box mb={{ xs: 3, md: 4 }}>
          <Typography
            variant="h4"
            fontWeight={700}
            letterSpacing="-0.02em"
            sx={{
              display: "inline-block",
              fontSize: { xs: "1.5rem", md: "2rem" },
              "&::after": {
                content: '""',
                display: "block",
                height: "2px",
                width: "40px",
                bgcolor: "#C9A96E",
                mt: "6px",
                borderRadius: "1px",
              },
            }}
          >
            Shopping Cart
          </Typography>
          <Typography color="text.secondary" fontSize={13} mt={1}>
            {totalItems} {totalItems === 1 ? "item" : "items"} in your cart
          </Typography>
        </Box>

        <Grid container spacing={3} alignItems="flex-start">
          {/* ── Left: cart items ── */}
          <Grid item xs={12} lg={8}>
            <Stack spacing={2}>
              {/* Free shipping progress */}
              <Paper variant="outlined" sx={{ borderRadius: 3, p: 2.5 }}>
                <Stack direction="row" alignItems="center" gap={1.5} mb={1.5}>
                  <LocalShippingOutlinedIcon
                    sx={{
                      fontSize: 18,
                      color: shipping === 0 ? "#0F6E56" : "text.secondary",
                    }}
                  />
                  <Typography fontSize={13} fontWeight={500}>
                    {shipping === 0
                      ? "You've unlocked free delivery! 🎉"
                      : `Add ₹${amountLeft.toLocaleString()} more for free delivery`}
                  </Typography>
                </Stack>
                <LinearProgress
                  variant="determinate"
                  value={shippingProgress}
                  sx={{
                    height: 5,
                    borderRadius: 4,
                    bgcolor: "grey.100",
                    "& .MuiLinearProgress-bar": {
                      borderRadius: 4,
                      bgcolor: shipping === 0 ? "#1D9E75" : "#C9A96E",
                    },
                  }}
                />
              </Paper>

              {/* Cart items */}
              <Paper
                variant="outlined"
                sx={{ borderRadius: 1, overflow: "hidden" }}
              >
                {cartItems.map((item, idx) => (
                  <Box key={item._id}>
                    <Box sx={{ px: { xs: 2, sm: 3 }, py: 2.5 }}>
                      <CartItem
                        item={item}
                        onRemove={handleRemove}
                        onIncrease={handleIncrease}
                        onDecrease={handleDecrease}
                      />
                    </Box>
                    {idx < cartItems.length - 1 && (
                      <Divider sx={{ borderColor: "divider", opacity: 0.6 }} />
                    )}
                  </Box>
                ))}
              </Paper>

              <Button
                component={Link}
                href="/products"
                size="small"
                sx={{
                  alignSelf: "flex-start",
                  fontSize: 13,
                  color: "text.secondary",
                  borderRadius: 2,
                  "&:hover": { color: "text.primary", bgcolor: "grey.100" },
                }}
              >
                ← Continue shopping
              </Button>
            </Stack>
          </Grid>

          {/* ── Right: order summary ── */}
          <Grid item xs={12} lg={4}>
            <Paper
              variant="outlined"
              sx={{
                borderRadius: 3,
                p: { xs: 2.5, sm: 3 },
                position: { lg: "sticky" },
                top: 24,
              }}
            >
              <Typography fontWeight={700} fontSize={15} mb={2.5}>
                Order Summary
              </Typography>
              {/* Promo code */}
              <Box
                sx={{
                  display: "flex",
                  border: "0.5px solid",
                  borderColor: "divider",
                  borderRadius: 2,
                  overflow: "hidden",
                  mb: 3,
                  "&:focus-within": { borderColor: "text.secondary" },
                }}
              >
                <Box
                  component="input"
                  placeholder="Promo / coupon code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  sx={{
                    flex: 1,
                    border: "none",
                    outline: "none",
                    px: 1.5,
                    py: 1,
                    fontSize: 13,
                    bgcolor: "transparent",
                    color: "text.primary",
                    fontFamily: "inherit",
                    "::placeholder": { color: "text.disabled" },
                  }}
                />
                <Button
                  size="small"
                  onClick={handleApplyCoupon}
                  disabled={!couponCode || !!couponData}
                  sx={{
                    borderRadius: 0,
                    px: 2,
                    fontSize: 12,
                    fontWeight: 600,
                    color: "text.primary",
                    borderLeft: "0.5px solid",
                    borderColor: "divider",
                    "&:hover": { bgcolor: "grey.100" },
                  }}
                >
                  Apply
                </Button>
              </Box>{" "}
              <AppliedCoupon
                coupon={couponData}
                discount={discount}
                onRemove={handleRemoveCoupon}
              />
              {/* Price breakdown */}
              <Stack spacing={1.5} mb={2}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography fontSize={13} color="text.secondary">
                    Subtotal ({totalItems} items)
                  </Typography>
                  <Typography fontSize={13} fontWeight={500}>
                    ₹{(subtotal || 0).toLocaleString()}
                  </Typography>
                </Stack>

                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography fontSize={13} color="text.secondary">
                    Shipping
                  </Typography>
                  {shipping === 0 ? (
                    <Chip
                      label="FREE"
                      size="small"
                      sx={{
                        height: 18,
                        fontSize: 10,
                        fontWeight: 700,
                        bgcolor: "#1D9E7520",
                        color: "#0F6E56",
                        "& .MuiChip-label": { px: 1 },
                      }}
                    />
                  ) : (
                    <Typography fontSize={13} fontWeight={500}>
                      ₹{shipping}
                    </Typography>
                  )}
                </Stack>

                <Stack direction="row" justifyContent="space-between">
                  <Typography fontSize={13} color="text.secondary">
                    Tax (5%)
                  </Typography>

                  <Typography fontSize={13} fontWeight={500}>
                    ₹{tax.toLocaleString()}
                  </Typography>
                </Stack>
                {discount > 0 && (
                  <Stack direction="row" justifyContent="space-between">
                    <Typography fontSize={13} color="success.main">
                      Coupon Discount
                    </Typography>

                    <Typography
                      fontSize={13}
                      color="success.main"
                      fontWeight={600}
                    >
                      - ₹{discount}
                    </Typography>
                  </Stack>
                )}
              </Stack>
              <Divider sx={{ borderColor: "divider", my: 2 }} />
              <Stack direction="row" justifyContent="space-between" mb={3}>
                <Typography fontWeight={700} fontSize={15}>
                  Total
                </Typography>
                <Typography fontWeight={700} fontSize={15}>
                  ₹{(total || 0).toLocaleString()}
                </Typography>
              </Stack>
              <Button
                fullWidth
                variant="contained"
                endIcon={<ArrowForwardIcon sx={{ fontSize: 16 }} />}
                onClick={handleCheckout}
                sx={{
                  bgcolor: "#111",
                  color: "#fff",
                  borderRadius: 2,
                  py: 1.5,
                  fontSize: 14,
                  fontWeight: 600,
                  mb: 1.5,
                  "&:hover": { bgcolor: "#333" },
                }}
              >
                Proceed to Checkout
              </Button>
              <Button
                component={Link}
                href="/products"
                fullWidth
                variant="outlined"
                sx={{
                  borderRadius: 2,
                  py: 1.25,
                  fontSize: 13,
                  color: "text.secondary",
                  borderColor: "divider",
                  "&:hover": {
                    borderColor: "text.secondary",
                    bgcolor: "grey.50",
                  },
                }}
              >
                Continue Shopping
              </Button>
              {/* Trust badge */}
              <Stack direction="row" alignItems="center" gap={1} mt={2.5}>
                <VerifiedUserOutlinedIcon
                  sx={{ fontSize: 15, color: "text.disabled" }}
                />
                <Typography fontSize={12} color="text.disabled">
                  Secure payments · Easy returns · 24/7 support
                </Typography>
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </Container>
      <Dialog
        open={stockDialog.open}
        onClose={() => setStockDialog({ open: false, adjustedCart: [] })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            fontWeight: 700,
            color: "#d97706",
          }}
        >
          <WarningAmberRoundedIcon color="warning" />
          Stock Availability Updated
        </DialogTitle>

        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Some products in your cart are no longer available in the quantity
            you selected. We've found the maximum available quantity for each
            item.
          </Typography>

          <Stack spacing={2}>
            {stockDialog.adjustedCart.map((item, index) => (
              <Box
                key={item.cartId || index}
                sx={{
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 2,
                  p: 2,
                }}
              >
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={1}
                >
                  <Typography fontWeight={600}>{item.name}</Typography>

                  <Inventory2RoundedIcon fontSize="small" color="action" />
                </Stack>

                <Stack direction="row" spacing={1} flexWrap="wrap">
                  <Chip
                    label={`Requested: ${item.requested}`}
                    color="error"
                    size="small"
                    variant="outlined"
                  />

                  <Chip
                    label={`Available: ${item.available}`}
                    color="success"
                    size="small"
                  />
                </Stack>
              </Box>
            ))}
          </Stack>

          <Divider sx={{ my: 3 }} />

          <Typography variant="body2" color="text.secondary">
            If you continue, your cart quantities will be automatically updated
            to the available stock before proceeding to checkout.
          </Typography>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            color="inherit"
            onClick={() =>
              setStockDialog({
                open: false,
                adjustedCart: [],
              })
            }
          >
            Review Cart
          </Button>

          <Button
            variant="contained"
            color="warning"
            onClick={async () => {
              const token = safeGetItem("token");
              if (!token) {
                toast.error("Please log in.");
                return;
              }

              try {
                const results = await Promise.allSettled(
                  stockDialog.adjustedCart.map((item) =>
                    fetch(`${API_URL}/cart/update/${item.cartId}`, {
                      method: "PUT",
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                      },
                      body: JSON.stringify({
                        type: "set",
                        quantity: item.available,
                      }),
                    }),
                  ),
                );

                const failed = results.some((r) => r.status === "rejected");
                if (failed) {
                  toast.error("Some items could not be updated.");
                }

                setStockDialog({
                  open: false,
                  adjustedCart: [],
                });

                await fetchCart();

                if (couponData) {
                  safeSetItem(
                    "checkoutCoupon",
                    JSON.stringify({
                      coupon: couponData,
                      discount,
                    }),
                  );
                }

                router.push("/checkout");
              } catch (err) {
                console.error("Stock update error:", err);
                toast.error("Could not update cart. Please try again.");
              }
            }}
          >
            Update Cart & Continue
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={outOfStockDialog.open}
        onClose={() =>
          setOutOfStockDialog({
            open: false,
            items: [],
          })
        }
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ color: "error.main", fontWeight: 700 }}>
          Out of Stock
        </DialogTitle>

        <DialogContent>
          <Typography sx={{ mb: 2 }}>
            The following products are currently unavailable:
          </Typography>

          <Stack spacing={1.5}>
            {outOfStockDialog.items.map((item, index) => (
              <Paper
                key={index}
                variant="outlined"
                sx={{
                  p: 2,
                  borderColor: "#ffcdd2",
                  bgcolor: "#fff5f5",
                }}
              >
                <Typography fontWeight={600}>{item.name}</Typography>

                <Typography variant="body2" color="error">
                  Available Stock: 0
                </Typography>
              </Paper>
            ))}
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button
            variant="contained"
            color="error"
            onClick={() =>
              setOutOfStockDialog({
                open: false,
                items: [],
              })
            }
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
