"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
} from "@/redux/slices/cartSlice";
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
import { useDispatch, useSelector } from "react-redux";
import { applyCoupon, removeCoupon } from "@/redux/slices/couponSlice";
import CartItem from "@/components/cart/CartItem";
import EmptyState from "@/components/common/EmptyState";
import { API_URL } from "@/lib/api";

const FREE_SHIPPING_THRESHOLD = 2000;

export default function CartPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
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
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_URL}/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      const items = Array.isArray(data)
        ? data
        : data?.items || data?.cart?.items || [];

      setCartItems(items);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load cart.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (couponData && subtotal < couponData.minOrderAmount) {
      setCouponData(null);
      setDiscount(0);

      localStorage.removeItem("appliedCoupon");

      toast.info(
        "Coupon removed because minimum order value is no longer met.",
      );
    }
  }, [subtotal, couponData]);

  const handleCheckout = async () => {
    try {
      const token = localStorage.getItem("token");

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
          localStorage.removeItem("appliedCoupon");
          localStorage.removeItem("checkoutCoupon");

          return;
        }
      }

      const res = await fetch(`${API_URL}/cart/validate-stock`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

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
      let updated = false;

      if (data.adjustedCart?.length > 0) {
        updated = true;

        await Promise.all(
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
      }

      // 🔄 refresh cart UI
      await fetchCart();

      if (data.adjustedCart?.length > 0) {
        setStockDialog({
          open: true,
          adjustedCart: data.adjustedCart,
        });
        return;
      }

      // 📦 save address
      const defaultAddress = localStorage.getItem("selectedAddress");

      if (defaultAddress) {
        localStorage.setItem("checkoutAddress", defaultAddress);
      }
      if (couponData) {
        localStorage.setItem(
          "checkoutCoupon",
          JSON.stringify({
            coupon: couponData,
            discount,
          }),
        );
      } else {
        localStorage.removeItem("checkoutCoupon");
      }
      // 🚀 navigate AFTER all updates
      router.push("/checkout");
    } catch (err) {
      console.log(err);
      toast.error("Unable to verify stock. Please try again.");
    }
  };

  const handleApplyCoupon = async () => {
    try {
      const token = localStorage.getItem("token");

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

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Invalid coupon.");
        return;
      }

      setCouponData(data.coupon);
      setDiscount(data.discount);

      localStorage.setItem(
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

    const savedCoupon = localStorage.getItem("appliedCoupon");

    if (savedCoupon) {
      const data = JSON.parse(savedCoupon);
      setCouponData(data.coupon);
      setDiscount(data.discount);
    }

    const handleCartUpdate = () => {
      fetchCart();
    };

    window.addEventListener("cart-update", handleCartUpdate);

    return () => {
      window.removeEventListener("cart-update", handleCartUpdate);
    };
  }, []);

  useEffect(() => {
    if (cartItems.length === 0) {
      setCouponData(null);
      setDiscount(0);

      localStorage.removeItem("appliedCoupon");
      localStorage.removeItem("checkoutCoupon");
    }
  }, [cartItems]);

  const handleRemove = async (id) => {
    const token = localStorage.getItem("token");

    await fetch(`${API_URL}/cart/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

  await fetchCart();
toast.success("Item removed from cart.");
  };

  // ➕ INCREASE
  const handleIncrease = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await fetch(`${API_URL}/cart/update/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ type: "inc" }),
      });

      fetchCart(); // 🔥 THIS IS MISSING
    } catch (err) {
      console.log("Increase error:", err);
    }
  };

  // ➖ DECREASE
  const handleDecrease = async (id) => {
    const token = localStorage.getItem("token");

    await fetch(`${API_URL}/cart/update/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ type: "dec" }),
    });

    fetchCart();
  };

  const removeCoupon = () => {
    setCouponData(null);
    setDiscount(0);
    setCouponCode("");

    localStorage.removeItem("appliedCoupon");
    localStorage.removeItem("checkoutCoupon");

    window.dispatchEvent(new Event("coupon-update"));
  };

  useEffect(() => {
    const handleCouponUpdate = () => {
      const saved = localStorage.getItem("appliedCoupon");

      if (!saved) {
        setCouponData(null);
        setDiscount(0);
        setCouponCode("");
        return;
      }

      const data = JSON.parse(saved);

      setCouponData(data.coupon);
      setDiscount(data.discount);
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
                  disabled={!couponCode || couponData}
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
                onRemove={() => {
                  setCouponData(null);
                  setDiscount(0);
                  setCouponCode("");

                  localStorage.removeItem("appliedCoupon");
                  localStorage.removeItem("checkoutCoupon");
                }}
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
              const token = localStorage.getItem("token");

              await Promise.all(
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

              setStockDialog({
                open: false,
                adjustedCart: [],
              });

              await fetchCart();

              if (couponData) {
                localStorage.setItem(
                  "checkoutCoupon",
                  JSON.stringify({
                    coupon: couponData,
                    discount,
                  }),
                );
              }

              router.push("/checkout");
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
