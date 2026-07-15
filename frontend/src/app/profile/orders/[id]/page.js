"use client";

import { toast } from "react-toastify";
import {
  Container,
  Typography,
  Paper,
  Stack,
  Divider,
  Box,
  Chip,
  Button,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Checkbox,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import CheckIcon from "@mui/icons-material/Check";
import CancelIcon from "@mui/icons-material/Cancel";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import UndoIcon from "@mui/icons-material/Undo";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import PaymentOutlinedIcon from "@mui/icons-material/PaymentOutlined";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import HourglassEmptyOutlinedIcon from "@mui/icons-material/HourglassEmptyOutlined";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import ReplayOutlinedIcon from "@mui/icons-material/ReplayOutlined";
import { API_URL } from "@/lib/api";

const STEP_ICONS = {
  Pending: ShoppingBagOutlinedIcon,
  Confirmed: Inventory2OutlinedIcon,
  Shipped: LocalShippingOutlinedIcon,
  Delivered: HomeOutlinedIcon,
  Requested: ShoppingBagOutlinedIcon,
  Approved: CheckIcon,
  Refunded: HomeOutlinedIcon,
};

const PICKUP_STATUS_STYLES = {
  NotPicked: { bg: "#f4f4f5", color: "#52525b", label: "Not Picked Up Yet" },
  PickupScheduled: { bg: "#eff6ff", color: "#1d4ed8", label: "Pickup Scheduled" },
  Picked: { bg: "#fefce8", color: "#a16207", label: "Picked Up" },
  InTransit: { bg: "#fefce8", color: "#a16207", label: "In Transit" },
  Received: { bg: "#f0fdf4", color: "#15803d", label: "Received by us" },
};

const REFUND_STATUS_STYLES = {
  None: { bg: "#f4f4f5", color: "#52525b", label: "Not Started" },
  Pending: { bg: "#fffbeb", color: "#d97706", label: "Refund Pending" },
  Completed: { bg: "#f0fdf4", color: "#15803d", label: "Refund Completed" },
};

// Payment status → visual language. Kept in the same restrained zinc/black
// system as the rest of the page instead of MUI's default red/green/amber,
// so it reads as one product instead of a bolted-on component.
const PAYMENT_STATUS_STYLES = {
  Paid: { bg: "#f0fdf4", border: "#bbf7d0", color: "#15803d", icon: VerifiedOutlinedIcon, label: "Paid" },
  Pending: { bg: "#fffbeb", border: "#fde68a", color: "#b45309", icon: HourglassEmptyOutlinedIcon, label: "Pending" },
  Failed: { bg: "#fef2f2", border: "#fecaca", color: "#b91c1c", icon: ErrorOutlineOutlinedIcon, label: "Failed" },
  Refunded: { bg: "#eff6ff", border: "#bfdbfe", color: "#1d4ed8", icon: ReplayOutlinedIcon, label: "Refunded" },
};

// Consistent section heading used across the page
function SectionHeading({ icon: Icon, children }) {
  return (
    <Stack direction="row" alignItems="center" spacing={1} mb={1.5}>
      {Icon && <Icon sx={{ color: "#71717a", fontSize: 20 }} />}
      <Typography sx={{ fontWeight: 700, fontSize: 15, color: "#18181b" }}>
        {children}
      </Typography>
    </Stack>
  );
}

// Shared row for the Payment Details card — label left, value right,
// same pattern the rest of the page already uses for price breakdown etc.
function DetailRow({ label, value, mono = false }) {
  if (value === undefined || value === null || value === "") return null;
  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center" gap={2}>
      <Typography sx={{ fontSize: 13.5, color: "#71717a" }}>{label}</Typography>
      <Typography
        sx={{
          fontSize: mono ? 12.5 : 13.5,
          fontWeight: mono ? 500 : 600,
          color: "#18181b",
          fontFamily: mono ? "monospace" : "inherit",
          textAlign: "right",
          wordBreak: "break-all",
        }}
      >
        {value}
      </Typography>
    </Stack>
  );
}

export default function OrderDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState(null);

  // Cancel order state
  const [cancelOpen, setCancelOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [selectedCancelItems, setSelectedCancelItems] = useState([]);

  // Return order state
  const [returnOpen, setReturnOpen] = useState(false);
  const [returnDescription, setReturnDescription] = useState("");
  const [returnImages, setReturnImages] = useState([]);
  const [selectedReturnItems, setSelectedReturnItems] = useState([]);

  useEffect(() => {
    if (id) {
      fetchOrder();
    }
  }, [id]);

  const fetchOrder = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_URL}/orders/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      let data = {};
      try {
        data = await res.json();
      } catch {}

      if (!res.ok) {
        toast.error(data.message || "Failed to load order");
        return;
      }

      setOrder(data);
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    }
  };

  const handleCancelOrder = async () => {
    try {
      const res = await fetch(`${API_URL}/orders/cancel/${order._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          reason,
          items: selectedCancelItems,
        }),
      });

      let data = {};
      try {
        data = await res.json();
      } catch {}

      if (res.ok) {
        toast.success(data.message || "Order cancelled successfully");
        setCancelOpen(false);
        setReason("");
        setSelectedCancelItems([]);
        fetchOrder();
      } else {
        toast.error(data.message || "Failed to cancel order");
      }
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    }
  };

  const handleReturnOrder = async () => {
    if (returnImages.length === 0) {
      toast.error("Please upload at least one return image");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("description", returnDescription);
      formData.append("items", JSON.stringify(selectedReturnItems));
      returnImages.forEach((img) => formData.append("images", img));

      const res = await fetch(`${API_URL}/orders/return/${order._id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      let data = {};
      try {
        data = await res.json();
      } catch {}

      if (res.ok) {
        toast.success(data.message || "Return request submitted successfully");
        setReturnOpen(false);
        setReturnDescription("");
        setReturnImages([]);
        setSelectedReturnItems([]);
        fetchOrder();
      } else {
        toast.error(data.message || "Failed to submit return request");
      }
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    }
  };

  if (!order) {
    return (
      <Container maxWidth="lg" sx={{ py: { xs: 4, sm: 6 } }}>
        <Stack spacing={2}>
          <Box sx={{ height: 28, width: 180, borderRadius: 1, bgcolor: "#f4f4f5" }} />
          <Box sx={{ height: 220, borderRadius: 3, bgcolor: "#f4f4f5" }} />
          <Box sx={{ height: 140, borderRadius: 3, bgcolor: "#f4f4f5" }} />
        </Stack>
      </Container>
    );
  }

  // Item ids that are NOT eligible for a new return: cancelled ones,
  // or ones already inside an active/completed return batch. Items from
  // a REJECTED batch are excluded from this block-list, so the customer
  // can try returning them again.
  const ineligibleIds = new Set([
    ...(order.cancelledItems?.map((i) => i.itemId.toString()) || []),
    ...(order.returns || [])
      .filter((r) => r.status !== "Rejected")
      .flatMap((r) => r.items.map((i) => i.itemId.toString())),
  ]);

  const returnableItems =
    order.items?.filter((item) => !ineligibleIds.has(item._id.toString())) ||
    [];
  const cancellableItems =
    order.items?.filter(
      (item) =>
        !order.cancelledItems
          ?.map((i) => i.itemId.toString())
          .includes(item._id.toString()),
    ) || [];

  const canReturn = order.status === "Delivered" && returnableItems.length > 0;
  const canCancel = order.status === "Pending" && cancellableItems.length > 0;

  const openReturnDialog = () => {
    if (returnableItems.length === 1) {
      setSelectedReturnItems([returnableItems[0]._id]);
    } else {
      setSelectedReturnItems([]);
    }
    setReturnOpen(true);
  };
  const openCancelDialog = () => {
    if (cancellableItems.length === 1) {
      setSelectedCancelItems([cancellableItems[0]._id]);
    } else {
      setSelectedCancelItems([]);
    }
    setCancelOpen(true);
  };

  const toggleReturnItem = (itemId) => {
    setSelectedReturnItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId],
    );
  };

  const toggleCancelItem = (itemId) => {
    setSelectedCancelItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId],
    );
  };

  // Shared step-tracker used for both order status and return status.
  function StepTracker({
    title,
    status,
    steps,
    negativeStatuses = ["Cancelled"],
    negativeLabel,
  }) {
    const isNegative = negativeStatuses.includes(status);
    const currentIndex = steps.indexOf(status);
    const isCompletedFlow = currentIndex === steps.length - 1;
    return (
      <Box sx={{ my: 1 }}>
        <Typography
          sx={{ fontWeight: 700, fontSize: 15, color: "#18181b", mb: 2.5 }}
        >
          {title}
        </Typography>

        {isNegative ? (
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 1,
              bgcolor: "#fef2f2",
              color: "#dc2626",
              px: 2,
              py: 1,
              borderRadius: 2,
            }}
          >
            <CancelOutlinedIcon sx={{ fontSize: 18 }} />
            <Typography sx={{ fontWeight: 700, fontSize: 13.5 }}>
              {negativeLabel || `${status} `}
            </Typography>
          </Box>
        ) : currentIndex === -1 ? (
          <Chip
            label={status}
            size="small"
            sx={{ bgcolor: "#f4f4f5", color: "#52525b", fontWeight: 600 }}
          />
        ) : (
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-start",
              width: "100%",
              overflowX: "auto",
              py: 1,
            }}
          >
            {steps.map((step, index) => {
              const isCompleted = index < currentIndex;
              const isCurrent = index === currentIndex;
              const isActive = index <= currentIndex;
              const isLast = index === steps.length - 1;
              const Icon = STEP_ICONS[step] || ShoppingBagOutlinedIcon;

              return (
                <Box
                  key={step}
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    flex: isLast ? "0 0 auto" : 1,
                    minWidth: isLast ? "auto" : 90,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      minWidth: 84,
                    }}
                  >
                    <Box
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        bgcolor: isCompletedFlow
                          ? "#919191"
                          : isCurrent
                            ? "#22c55e"
                            : isCompleted
                              ? "#18181b"
                              : "#f2f2f2",

                        color:
                          isCompletedFlow || isCurrent || isCompleted
                            ? "#fff"
                            : "#a1a1aa",

                        border:
                          isCurrent && !isCompletedFlow
                            ? "3px solid #bbf7d0"
                            : "none",

                        boxShadow:
                          isCurrent && !isCompletedFlow
                            ? "0 8px 20px rgba(34,197,94,0.35)"
                            : "none",
                      }}
                    >
                      {isCompleted ? (
                        <CheckIcon sx={{ fontSize: 17 }} />
                      ) : (
                        <Icon sx={{ fontSize: 16 }} />
                      )}
                    </Box>

                    <Typography
                      sx={{
                        mt: 1,
                        fontSize: 12,
                        color: isCompletedFlow
                          ? "#8a8a8a"
                          : isActive
                            ? "#18181b"
                            : "#a1a1aa",
                        fontWeight: isCompletedFlow ? 600 : isCurrent ? 700 : 600,
                        textAlign: "center",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {step}
                    </Typography>
                  </Box>

                  {!isLast && (
                    <Box
                      sx={{
                        flex: 1,
                        height: 2.5,
                        mt: "17px",
                        mx: -1,
                        borderRadius: 2,
                        bgcolor: isCompletedFlow
                          ? "#868686"
                          : index < currentIndex
                            ? "#18181b"
                            : index === currentIndex
                              ? "#22c55e"
                              : "#e4e4e7",
                        transition: "background 0.3s ease",
                      }}
                    />
                  )}
                </Box>
              );
            })}
          </Box>
        )}
      </Box>
    );
  }

  // Fixed: this used to check the no-longer-existent order.returnItems,
  // which meant it was always false and the "Return More Item(s)" button
  // label never appeared even when a return history existed.
  const hasReturnHistory = (order.returns || []).length > 0;

  const paymentStyle =
    PAYMENT_STATUS_STYLES[order.paymentStatus] || PAYMENT_STATUS_STYLES.Pending;
  const PaymentIcon = paymentStyle.icon;

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 5 } }}>
      {/* HEADER */}
      <Stack
        direction="row"
        alignItems="center"
        gap={{ xs: 1, sm: 1.5 }}
        mb={{ xs: 2.5, sm: 4 }}
      >
        <Button
          onClick={() => {
            const from = localStorage.getItem("orderDetailsFrom");

            if (from === "checkout") {
              router.replace("/");
            } else if (from === "orders") {
              router.back();
            } else {
              router.back();
            }

            localStorage.removeItem("orderDetailsFrom");
          }}
          sx={{
            minWidth: { xs: 34, sm: 40 },
            width: { xs: 34, sm: 40 },
            height: { xs: 34, sm: 40 },
            borderRadius: 2,
            color: "#18181b",
            border: "1px solid #e4e4e7",
            flexShrink: 0,
          }}
        >
          <ArrowBackIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />
        </Button>

        <Box sx={{ minWidth: 0 }}>
          <Typography
            sx={{
              fontSize: { xs: 17, sm: 22 },
              fontWeight: 700,
              color: "#18181b",
              lineHeight: 1.2,
            }}
          >
            Order Details
          </Typography>
          <Typography noWrap sx={{ fontSize: 13, color: "#a1a1aa", mt: 0.3 }}>
            Order ID: {order._id}
          </Typography>
        </Box>
      </Stack>

      <Paper
        variant="outlined"
        sx={{ p: { xs: 2.5, sm: 4 }, borderRadius: 3, borderColor: "#e4e4e7" }}
      >
        {/* ORDER META: date + payment method */}
        <Stack direction="row" flexWrap="wrap" gap={1.5} mb={3}>
          <Stack direction="row" alignItems="center" spacing={0.75}>
            <CalendarMonthOutlinedIcon sx={{ fontSize: 17, color: "#a1a1aa" }} />
            <Typography sx={{ fontSize: 13, color: "#71717a" }}>
              Placed on{" "}
              {order.createdAt
                ? new Date(order.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })
                : "-"}
            </Typography>
          </Stack>

          <Stack direction="row" alignItems="center" spacing={0.75}>
            <PaymentOutlinedIcon sx={{ fontSize: 17, color: "#a1a1aa" }} />
            <Chip
              label={order.paymentMethod || "Not specified"}
              variant="outlined"
              size="small"
              sx={{
                borderColor: "#e4e4e7",
                color: "#27272a",
                fontWeight: 500,
                height: 24,
              }}
            />
          </Stack>
        </Stack>

        <Divider sx={{ mb: 3, borderColor: "#f4f4f5" }} />

        {/* ORDER STATUS */}
        <StepTracker
          title="Order Status"
          status={order.status}
          steps={["Pending", "Confirmed", "Shipped", "Delivered"]}
          negativeStatuses={["Cancelled"]}
          negativeLabel="Order Cancelled"
        />

        {/* CANCELLED BANNER */}
        {order.status === "Cancelled" && (
          <Box
            sx={{
              mb: 3,
              p: 2,
              borderRadius: 2,
              bgcolor: "#fef2f2",
              border: "1px solid #fecaca",
            }}
          >
            <Typography
              sx={{
                fontSize: 12,
                fontWeight: 700,
                color: "#991b1b",
                textTransform: "uppercase",
                letterSpacing: 0.3,
                mb: 0.5,
              }}
            >
              {order.cancelledBy === "admin"
                ? "Message from our team"
                : "Cancellation reason"}
            </Typography>
            <Typography sx={{ fontSize: 14, color: "#dc2626", fontWeight: 500 }}>
              {order.cancelReason || "No reason provided"}
            </Typography>
            {order.cancelledAt && (
              <Typography sx={{ fontSize: 12, color: "#b91c1c", mt: 0.5 }}>
                Cancelled on{" "}
                {new Date(order.cancelledAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </Typography>
            )}
          </Box>
        )}

        {/* CANCEL / RETURN ACTIONS */}
        {(canCancel || canReturn) && (
          <>
            <Divider sx={{ my: 3, borderColor: "#f4f4f5" }} />
            <Stack direction="row" spacing={1.5} flexWrap="wrap" gap={1.5}>
              {canCancel && (
                <Button
                  variant="outlined"
                  startIcon={<CancelIcon sx={{ fontSize: 16 }} />}
                  onClick={openCancelDialog}
                  sx={{
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: 500,
                    fontSize: 13.5,
                    borderColor: "#fecaca",
                    color: "#dc2626",
                    "&:hover": { borderColor: "#dc2626", bgcolor: "#fef2f2" },
                  }}
                >
                  Cancel Order
                </Button>
              )}

              {canReturn && (
                <Button
                  variant="outlined"
                  startIcon={<UndoIcon sx={{ fontSize: 16 }} />}
                  onClick={openReturnDialog}
                  sx={{
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: 500,
                    fontSize: 13.5,
                    borderColor: "#fde68a",
                    color: "#d97706",
                    "&:hover": { borderColor: "#d97706", bgcolor: "#fffbeb" },
                  }}
                >
                  {hasReturnHistory ? "Return More Item(s)" : "Return Order"}
                </Button>
              )}
            </Stack>
          </>
        )}

        <Divider sx={{ my: 3, borderColor: "#f4f4f5" }} />

        {/* ADDRESS */}
        <Box>
          <SectionHeading icon={LocationOnIcon}>Shipping Address</SectionHeading>

          {order.shippingAddress ? (
            <Box
              sx={{
                py: 2,
                px: 2.5,
                borderRadius: 2,
                border: "1px solid #f4f4f5",
                bgcolor: "#fafafa",
              }}
            >
              <Typography sx={{ fontWeight: 600, fontSize: 14, color: "#18181b" }}>
                {order.shippingAddress?.fullName || "-"}
              </Typography>
              <Typography sx={{ fontSize: 13.5, color: "#52525b", mt: 0.5 }}>
                {order.shippingAddress?.phone || "-"}
              </Typography>
              <Typography sx={{ fontSize: 13.5, color: "#71717a", mt: 0.5 }}>
                {order.shippingAddress?.house}, {order.shippingAddress?.area}
              </Typography>
              <Typography sx={{ fontSize: 13.5, color: "#71717a" }}>
                {order.shippingAddress?.city}, {order.shippingAddress?.state} -{" "}
                {order.shippingAddress?.pincode}
              </Typography>
            </Box>
          ) : (
            <Typography sx={{ fontSize: 13.5, color: "#a1a1aa" }}>
              No address on file for this order.
            </Typography>
          )}
        </Box>

        <Divider sx={{ my: 3, borderColor: "#f4f4f5" }} />

        {/* PAYMENT DETAILS — redesigned to match the zinc/black system used
            everywhere else on this page instead of MUI's default
            red/green/amber Chip colors, and the broken standalone
            Timeline components (which need a <Timeline> parent to render)
            have been replaced with a simple status banner. */}
        <Box>
          <SectionHeading icon={PaymentOutlinedIcon}>Payment Details</SectionHeading>

          <Box
            sx={{
              borderRadius: 2,
              border: "1px solid #f4f4f5",
              bgcolor: "#fafafa",
              overflow: "hidden",
            }}
          >
            {/* Status strip */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                px: 2.5,
                py: 1.75,
                bgcolor: paymentStyle.bg,
                borderBottom: "1px solid",
                borderColor: paymentStyle.border,
              }}
            >
              <PaymentIcon sx={{ fontSize: 19, color: paymentStyle.color }} />
              <Typography sx={{ fontWeight: 700, fontSize: 13.5, color: paymentStyle.color }}>
                Payment {paymentStyle.label}
              </Typography>
              {order.paymentStatus === "Paid" && order.paymentVerifiedAt && (
                <Typography sx={{ fontSize: 12, color: paymentStyle.color, opacity: 0.8, ml: "auto" }}>
                  {new Date(order.paymentVerifiedAt).toLocaleString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Typography>
              )}
            </Box>

            <Stack spacing={1.5} sx={{ px: 2.5, py: 2.25 }}>
              <DetailRow label="Payment Method" value={order.paymentMethod} />
              <DetailRow
                label="Amount Paid"
                value={`₹${(order.totalAmount || 0).toLocaleString()}`}
              />
              {order.paymentChannel && (
                <DetailRow label="Payment Mode" value={order.paymentChannel.toUpperCase()} />
              )}
              {order.razorpayPaymentId && (
                <DetailRow label="Transaction ID" value={order.razorpayPaymentId} mono />
              )}
            </Stack>

            {order.paymentStatus === "Refunded" && order.refundedAmount > 0 && (
              <Box
                sx={{
                  mx: 2.5,
                  mb: 2.25,
                  p: 1.5,
                  borderRadius: 1.5,
                  bgcolor: "#eff6ff",
                  border: "1px solid #bfdbfe",
                }}
              >
                <Typography sx={{ fontSize: 13, color: "#1d4ed8", fontWeight: 500 }}>
                  ₹{order.refundedAmount.toLocaleString()} has been refunded to your original
                  payment method.
                </Typography>
              </Box>
            )}
          </Box>
        </Box>

        <Divider sx={{ my: 3, borderColor: "#f4f4f5" }} />

        {/* PRODUCTS */}
        <SectionHeading>Products ({order.items?.length || 0})</SectionHeading>

        <Stack spacing={1.5}>
          {(order.items || []).map((item) => {
            const product = item.productId; // populated product object (may be null if deleted)

            return (
              <Box
                key={item._id}
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  border: "1px solid #f4f4f5",
                  flexWrap: "wrap",
                }}
              >
                <Avatar
                  src={item.image}
                  variant="rounded"
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: 2,
                    bgcolor: "#f4f4f5",
                    border: "1px solid #e4e4e7",
                    flexShrink: 0,
                  }}
                >
                  <ImageOutlinedIcon sx={{ fontSize: 20, color: "#a1a1aa" }} />
                </Avatar>

                <Box sx={{ flex: 1, minWidth: 200 }}>
                  <Typography noWrap sx={{ fontWeight: 600, fontSize: 14, color: "#18181b" }}>
                    {item.name}
                  </Typography>

                  {/* Brand · Category · Sub-category — from the populated product */}
                  {product && (product.brand || product.category) && (
                    <Typography sx={{ fontSize: 11.5, color: "#a1a1aa", mt: 0.2 }}>
                      {[product.brand, product.category, product.subCategory].filter(Boolean).join(" · ")}
                    </Typography>
                  )}

                  {/* Fabric */}
                  {product?.fabric && (
                    <Typography sx={{ fontSize: 11.5, color: "#a1a1aa" }}>
                      Fabric: {product.fabric}
                    </Typography>
                  )}

                  <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap sx={{ mt: 0.75 }}>
                    {item.color && (
                      <Chip
                        label={`Color: ${item.color}`}
                        size="small"
                        sx={{ height: 20, fontSize: 11, bgcolor: "#f4f4f5", color: "#52525b" }}
                      />
                    )}
                    {item.size && (
                      <Chip
                        label={`Size: ${item.size}`}
                        size="small"
                        sx={{ height: 20, fontSize: 11, bgcolor: "#f4f4f5", color: "#52525b" }}
                      />
                    )}
                    <Chip
                      label={`Qty: ${item.quantity}`}
                      size="small"
                      sx={{ height: 20, fontSize: 11, bgcolor: "#f4f4f5", color: "#52525b" }}
                    />
                    {product?.sku && (
                      <Chip
                        label={`SKU: ${product.sku}`}
                        size="small"
                        variant="outlined"
                        sx={{ height: 20, fontSize: 11, borderColor: "#e4e4e7", color: "#71717a" }}
                      />
                    )}
                  </Stack>
                </Box>

                <Typography
                  sx={{
                    fontWeight: 700,
                    fontSize: 14.5,
                    color: "#18181b",
                    flexShrink: 0,
                    textAlign: "right",
                  }}
                >
                  ₹{(item.price * item.quantity).toLocaleString()}
                </Typography>
              </Box>
            );
          })}

          {(!order.items || order.items.length === 0) && (
            <Typography sx={{ fontSize: 13.5, color: "#a1a1aa" }}>
              No products found for this order.
            </Typography>
          )}
        </Stack>

        <Divider sx={{ my: 3, borderColor: "#f4f4f5" }} />

        {/* PRICE BREAKDOWN */}
        <Box>
          <Typography sx={{ fontWeight: 700, fontSize: 15, color: "#18181b", mb: 1.5 }}>
            Price Details
          </Typography>

          <Stack spacing={1}>
            <Stack direction="row" justifyContent="space-between">
              <Typography sx={{ fontSize: 13.5, color: "#71717a" }}>Subtotal</Typography>
              <Typography sx={{ fontSize: 13.5, color: "#27272a" }}>
                ₹{(order.subtotal || 0).toLocaleString()}
              </Typography>
            </Stack>

            {order.couponCode && order.discount > 0 && (
              <Stack direction="row" justifyContent="space-between">
                <Typography sx={{ fontSize: 13.5, color: "#71717a" }}>
                  Coupon ({order.couponCode.code || "Applied"})
                </Typography>
                <Typography sx={{ fontSize: 13.5, color: "#16a34a", fontWeight: 600 }}>
                  −₹{order.discount.toLocaleString()}
                </Typography>
              </Stack>
            )}

            <Stack direction="row" justifyContent="space-between">
              <Typography sx={{ fontSize: 13.5, color: "#71717a" }}>Shipping</Typography>
              <Typography sx={{ fontSize: 13.5, color: "#27272a" }}>
                {order.shippingFee > 0 ? `₹${order.shippingFee}` : "Free"}
              </Typography>
            </Stack>

            <Stack direction="row" justifyContent="space-between">
              <Typography sx={{ fontSize: 13.5, color: "#71717a" }}>Tax</Typography>
              <Typography sx={{ fontSize: 13.5, color: "#27272a" }}>
                ₹{(order.tax || 0).toLocaleString()}
              </Typography>
            </Stack>
          </Stack>
        </Box>
        <Divider sx={{ my: 3, borderColor: "#f4f4f5" }} />

        {/* TOTAL */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
            gap: 1,
            p: 2,
            borderRadius: 2,
            bgcolor: "#fafafa",
            border: "1px solid #f4f4f5",
          }}
        >
          <Box>
            <Typography sx={{ fontSize: 12.5, color: "#71717a" }}>Order Total</Typography>
            <Typography sx={{ fontSize: 20, fontWeight: 700, color: "#18181b" }}>
              ₹{(order.totalAmount || 0).toLocaleString()}
            </Typography>
            {order.refundedAmount > 0 && (
              <Typography sx={{ fontSize: 12, color: "#16a34a", mt: 0.5 }}>
                ₹{order.refundedAmount.toLocaleString()} refunded so far
              </Typography>
            )}
          </Box>

          <Stack direction="row" alignItems="center" spacing={0.75}>
            <ReceiptLongOutlinedIcon
              sx={{ fontSize: 17, color: order.invoiceNumber ? "#16a34a" : "#a1a1aa" }}
            />
            <Typography
              sx={{
                fontSize: 12.5,
                color: order.invoiceNumber ? "#16a34a" : "#a1a1aa",
                fontWeight: 500,
              }}
            >
              {order.invoiceNumber ? "Invoice Generated" : "Invoice Not Generated"}
            </Typography>
          </Stack>
        </Box>
      </Paper>

      {/* CANCELLED ITEMS */}
      {order.cancelledItems?.length > 0 && (
        <Box mt={3}>
          <Typography sx={{ fontSize: 16, fontWeight: 700, mb: 2 }}>
            Cancelled Items
          </Typography>

          <Stack spacing={2}>
            {order.cancelledItems.map((item) => (
              <Box
                key={item.itemId}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  p: 2,
                  border: "1px solid #e5e7eb",
                  borderRadius: 2,
                  bgcolor: "#fafafa",
                  flexWrap: "wrap",
                }}
              >
                <Avatar
                  src={item.image}
                  variant="rounded"
                  imgProps={{
                    onError: (e) => {
                      e.target.src = "/placeholder.png";
                    },
                  }}
                  sx={{ width: 65, height: 65, borderRadius: 2 }}
                />

                <Box flex={1} minWidth={180}>
                  <Typography fontWeight={600}>{item.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Qty : {item.quantity}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    ₹{item.price.toLocaleString()}
                  </Typography>
                </Box>

                {item.reason && (
                  <Box sx={{ mt: 1, minWidth: 180 }}>
                    <Typography
                      sx={{
                        fontSize: 12,
                        fontWeight: 700,
                        color: "#991b1b",
                        textTransform: "uppercase",
                      }}
                    >
                      {item.cancelledBy === "admin"
                        ? "Message from our team"
                        : "Cancellation Reason"}
                    </Typography>

                    <Typography sx={{ fontSize: 13, color: "#dc2626" }}>
                      {item.reason}
                    </Typography>
                    {item.cancelledAt && (
                      <Typography sx={{ fontSize: 12, color: "#9f1239", mt: 0.5 }}>
                        Cancelled on{" "}
                        {new Date(item.cancelledAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </Typography>
                    )}
                  </Box>
                )}

                {item.adminNote && (
                  <Box sx={{ mt: 1, minWidth: 180 }}>
                    <Typography
                      sx={{
                        fontSize: 12,
                        fontWeight: 700,
                        color: "#2563eb",
                        textTransform: "uppercase",
                      }}
                    >
                      Admin Note
                    </Typography>

                    <Typography sx={{ fontSize: 13, color: "#1d4ed8" }}>
                      {item.adminNote}
                    </Typography>
                  </Box>
                )}

                <Chip label="Cancelled" color="error" sx={{ fontWeight: 600 }} />
              </Box>
            ))}
          </Stack>
        </Box>
      )}

      {/* RETURN HISTORY — each return is its own independent card, showing
          exactly what stage it's at (requested/approved/rejected, pickup
          progress, and refund status + amount) */}
      {hasReturnHistory && (
        <Stack spacing={2} mt={3}>
          {order.returns.map((ret, idx) => {
            const pickupStyle =
              PICKUP_STATUS_STYLES[ret.pickupStatus] || PICKUP_STATUS_STYLES.NotPicked;
            const refundStyle =
              REFUND_STATUS_STYLES[ret.refundStatus] || REFUND_STATUS_STYLES.None;

            return (
              <Paper
                key={ret._id}
                variant="outlined"
                sx={{ p: { xs: 2.5, sm: 3 }, borderRadius: 3, borderColor: "#e4e4e7" }}
              >
                <Typography sx={{ fontSize: 12.5, fontWeight: 700, color: "#71717a", mb: 2 }}>
                  Return #{order.returns.length - idx} · Requested on{" "}
                  {new Date(ret.requestedAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </Typography>

                <StepTracker
                  title="Return Status"
                  status={ret.status}
                  steps={["Requested", "Approved", "Refunded"]}
                  negativeStatuses={["Rejected"]}
                  negativeLabel="Return Rejected"
                />

                {/* Pickup progress — only meaningful once approved */}
                {ret.status === "Approved" && (
                  <Box sx={{ mt: 2, mb: 1 }}>
                    <Typography
                      sx={{
                        fontSize: 11.5,
                        fontWeight: 600,
                        color: "#a1a1aa",
                        textTransform: "uppercase",
                        letterSpacing: 0.3,
                        mb: 0.75,
                      }}
                    >
                      Pickup
                    </Typography>
                    <Chip
                      label={pickupStyle.label}
                      size="small"
                      sx={{ fontWeight: 700, bgcolor: pickupStyle.bg, color: pickupStyle.color }}
                    />
                  </Box>
                )}

                <Divider sx={{ my: 3, borderColor: "#f4f4f5" }} />

                <Stack spacing={1.5} mb={2}>
                  {ret.items.map((item) => (
                    <Box
                      key={item.itemId}
                      sx={{
                        p: 1.5,
                        borderRadius: 2,
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        border: "1px solid #f4f4f5",
                      }}
                    >
                      <Avatar
                        src={item.image}
                        variant="rounded"
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: 2,
                          bgcolor: "#f4f4f5",
                          border: "1px solid #e4e4e7",
                        }}
                      >
                        <ImageOutlinedIcon sx={{ fontSize: 18, color: "#a1a1aa" }} />
                      </Avatar>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                          noWrap
                          sx={{ fontWeight: 600, fontSize: 13.5, color: "#18181b" }}
                        >
                          {item.name}
                        </Typography>
                        <Typography sx={{ fontSize: 12, color: "#a1a1aa" }}>
                          Qty: {item.quantity}
                        </Typography>
                      </Box>
                      <Typography sx={{ fontWeight: 700, fontSize: 14, color: "#18181b" }}>
                        ₹{item.total?.toLocaleString()}
                      </Typography>
                    </Box>
                  ))}
                </Stack>

                {ret.reason && (
                  <Typography sx={{ fontSize: 13.5, color: "#52525b", mb: 1 }}>
                    Reason: {ret.reason}
                  </Typography>
                )}
                {ret.adminNote && (
                  <Typography sx={{ fontSize: 13.5, color: "#71717a", mb: 1 }}>
                    Admin Note: {ret.adminNote}
                  </Typography>
                )}

                {/* Images the customer originally submitted with this return */}
                {ret.images?.length > 0 && (
                  <Box sx={{ mt: 1.5 }}>
                    <Typography
                      sx={{
                        fontSize: 11.5,
                        fontWeight: 600,
                        color: "#a1a1aa",
                        textTransform: "uppercase",
                        letterSpacing: 0.3,
                        mb: 1,
                      }}
                    >
                      Images You Submitted
                    </Typography>
                    <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap>
                      {ret.images.map((img, index) => (
                        <Box
                          key={index}
                          component="img"
                          src={img}
                          onClick={() => window.open(img, "_blank")}
                          sx={{
                            width: 84,
                            height: 84,
                            objectFit: "cover",
                            borderRadius: 2,
                            border: "1px solid #e4e4e7",
                            cursor: "pointer",
                          }}
                        />
                      ))}
                    </Stack>
                  </Box>
                )}

                {/* Refund status + amount — shown as soon as pickup is
                    received, even before the final amount is confirmed, so
                    the customer knows where things stand rather than only
                    finding out once it's fully Completed. */}
                {ret.pickupStatus === "Received" && (
                  <Box
                    sx={{
                      mt: 2,
                      p: 1.5,
                      borderRadius: 2,
                      bgcolor: ret.refundStatus === "Completed" ? "#f0fdf4" : "#fffbeb",
                      border: "1px solid",
                      borderColor:
                        ret.refundStatus === "Completed" ? "#bbf7d0" : "#fde68a",
                    }}
                  >
                    <Stack direction="row" alignItems="center" spacing={1} mb={0.5}>
                      <Chip
                        label={refundStyle.label}
                        size="small"
                        sx={{ fontWeight: 700, bgcolor: refundStyle.bg, color: refundStyle.color }}
                      />
                    </Stack>
                    {ret.refundAmount > 0 && (
                      <>
                        <Typography
                          sx={{
                            fontSize: 15,
                            fontWeight: 700,
                            color:
                              ret.refundStatus === "Completed" ? "#16a34a" : "#d97706",
                            mt: 0.75,
                          }}
                        >
                          ₹{ret.refundAmount.toLocaleString()}
                        </Typography>
                        <Typography sx={{ fontSize: 11.5, color: "#71717a", mt: 0.3 }}>
                          {ret.refundTax
                            ? "Includes applicable tax"
                            : "Tax not included in this refund"}
                        </Typography>
                      </>
                    )}
                  </Box>
                )}
              </Paper>
            );
          })}
        </Stack>
      )}

      {/* CANCEL DIALOG */}
      <Dialog
        open={cancelOpen}
        onClose={() => setCancelOpen(false)}
        PaperProps={{ sx: { borderRadius: 3, p: 1, minWidth: { xs: "90%", sm: 420 } } }}
      >
        <DialogTitle sx={{ fontWeight: 700, color: "#18181b" }}>Cancel Order</DialogTitle>
        <Divider sx={{ my: 0, borderColor: "#f4f4f5" }} />

        <DialogContent>
          <Typography variant="body2" sx={{ color: "#71717a", mb: 2, mt: 1 }}>
            Please tell us the reason for cancelling this order.
          </Typography>

          {cancellableItems.length > 1 && (
            <Box sx={{ mb: 2.5 }}>
              <Typography sx={{ fontSize: 13, fontWeight: 700, mb: 1 }}>
                Select item(s) to cancel
              </Typography>

              <Stack spacing={1}>
                {cancellableItems.map((item) => {
                  const checked = selectedCancelItems.includes(item._id);

                  return (
                    <Box
                      key={item._id}
                      onClick={() => toggleCancelItem(item._id)}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        p: 1,
                        borderRadius: 2,
                        border: checked ? "1px solid #18181b" : "1px solid #e5e7eb",
                        cursor: "pointer",
                      }}
                    >
                      <Checkbox
                        checked={checked}
                        onChange={() => toggleCancelItem(item._id)}
                        onClick={(e) => e.stopPropagation()}
                      />

                      <Avatar src={item.image} variant="rounded" sx={{ width: 45, height: 45 }} />

                      <Box>
                        <Typography fontWeight={600}>{item.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          Qty : {item.quantity} · ₹{item.price}
                        </Typography>
                      </Box>
                    </Box>
                  );
                })}
              </Stack>
            </Box>
          )}

          <TextField
            fullWidth
            multiline
            rows={4}
            placeholder="Write your reason..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                "& fieldset": { borderColor: "#e4e4e7" },
                "&.Mui-focused fieldset": { borderColor: "#18181b" },
              },
            }}
          />
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => {
              setCancelOpen(false);
              setReason("");
              setSelectedCancelItems([]);
            }}
            variant="outlined"
            sx={{ borderRadius: 2, textTransform: "none", borderColor: "#e4e4e7", color: "#27272a" }}
          >
            Close
          </Button>

          <Button
            variant="contained"
            disabled={!reason.trim() || selectedCancelItems.length === 0}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              bgcolor: "#dc2626",
              boxShadow: "none",
              "&:hover": { bgcolor: "#b91c1c", boxShadow: "none" },
            }}
            onClick={handleCancelOrder}
          >
            Confirm Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* RETURN DIALOG */}
      <Dialog
        open={returnOpen}
        onClose={() => setReturnOpen(false)}
        PaperProps={{ sx: { borderRadius: 3, p: 1, minWidth: { xs: "90%", sm: 420 } } }}
      >
        <DialogTitle sx={{ fontWeight: 700, color: "#18181b" }}>Return Item(s)</DialogTitle>

        <DialogContent>
          <Typography variant="body2" sx={{ color: "#71717a", mb: 2 }}>
            Please mention the reason for returning these item(s).
          </Typography>

          {returnableItems.length > 1 && (
            <Box sx={{ mb: 2.5 }}>
              <Typography sx={{ fontSize: 13, fontWeight: 700, color: "#18181b", mb: 1 }}>
                Select item(s) to return
              </Typography>

              <Stack spacing={1}>
                {returnableItems.map((item) => {
                  const checked = selectedReturnItems.includes(item._id);
                  return (
                    <Box
                      key={item._id}
                      onClick={() => toggleReturnItem(item._id)}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.25,
                        p: 1,
                        borderRadius: 2,
                        border: checked ? "1.5px solid #18181b" : "1px solid #e4e4e7",
                        bgcolor: checked ? "#fafafa" : "#fff",
                        cursor: "pointer",
                        transition: "all .15s ease",
                      }}
                    >
                      <Checkbox
                        checked={checked}
                        size="small"
                        sx={{ p: 0 }}
                        onChange={() => toggleReturnItem(item._id)}
                        onClick={(e) => e.stopPropagation()}
                      />

                      <Avatar
                        src={item.image}
                        variant="rounded"
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: 1.5,
                          bgcolor: "#f4f4f5",
                          border: "1px solid #e4e4e7",
                          flexShrink: 0,
                        }}
                      >
                        <ImageOutlinedIcon sx={{ fontSize: 16, color: "#a1a1aa" }} />
                      </Avatar>

                      <Box sx={{ minWidth: 0 }}>
                        <Typography noWrap sx={{ fontSize: 13, fontWeight: 600, color: "#18181b" }}>
                          {item.name}
                        </Typography>
                        <Typography sx={{ fontSize: 11.5, color: "#71717a" }}>
                          Qty: {item.quantity} · ₹{item.price}
                        </Typography>
                      </Box>
                    </Box>
                  );
                })}
              </Stack>
            </Box>
          )}

          <TextField
            fullWidth
            multiline
            rows={4}
            label="Return Description"
            placeholder="Describe issue with product..."
            value={returnDescription}
            onChange={(e) => setReturnDescription(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                "& fieldset": { borderColor: "#e4e4e7" },
                "&.Mui-focused fieldset": { borderColor: "#18181b" },
              },
            }}
          />

          <Box
            component="label"
            sx={{
              mt: 2,
              border: "2px dashed #d4d4d8",
              borderRadius: 2,
              bgcolor: "#fafafa",
              cursor: "pointer",
              p: 3,
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              transition: ".2s",
              "&:hover": { borderColor: "#18181b", bgcolor: "#f4f4f5" },
            }}
          >
            <ImageOutlinedIcon sx={{ fontSize: 42, color: "#71717a", mb: 1 }} />

            <Typography sx={{ fontWeight: 600, color: "#18181b", fontSize: 14 }}>
              Add Return Images
            </Typography>

            <Typography sx={{ fontSize: 12, color: "#71717a", mt: 0.5 }}>
              Upload clear images of the product
            </Typography>

            <Typography sx={{ fontSize: 11, color: "#a1a1aa", mt: 0.5 }}>
              JPG, PNG • Max 5 MB each
            </Typography>

            <input
              hidden
              multiple
              type="file"
              accept="image/*"
              onChange={(e) => {
                const files = Array.from(e.target.files);

                const invalid = files.find((file) => file.size > 5 * 1024 * 1024);

                if (invalid) {
                  toast.error("Each image must be less than 5 MB");
                  return;
                }
                if (returnImages.length + files.length > 5) {
                  toast.error("Maximum 5 images allowed");
                  return;
                }
                if (returnDescription.trim().length < 10) {
                  toast.error("Please describe the issue properly.");
                }

                setReturnImages((prev) => {
                  const all = [...prev, ...files];

                  return all.filter(
                    (file, index, self) =>
                      index ===
                      self.findIndex(
                        (f) =>
                          f.name === file.name &&
                          f.size === file.size &&
                          f.lastModified === file.lastModified,
                      ),
                  );
                });
              }}
            />
          </Box>

          {returnImages.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Stack direction="row" spacing={2} flexWrap="wrap">
                {returnImages.map((img, index) => (
                  <Box
                    key={index}
                    sx={{
                      position: "relative",
                      width: 90,
                      height: 90,
                      borderRadius: 2,
                      overflow: "hidden",
                      border: "1px solid #e5e7eb",
                    }}
                  >
                    <Box
                      component="img"
                      src={URL.createObjectURL(img)}
                      sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />

                    <Box
                      onClick={() =>
                        setReturnImages((prev) => prev.filter((_, i) => i !== index))
                      }
                      sx={{
                        position: "absolute",
                        top: 5,
                        right: 5,
                        width: 22,
                        height: 22,
                        borderRadius: "50%",
                        bgcolor: "#000000aa",
                        color: "#fff",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        cursor: "pointer",
                        fontSize: 14,
                        fontWeight: 700,
                      }}
                    >
                      ×
                    </Box>
                  </Box>
                ))}

                <Box
                  component="label"
                  sx={{
                    width: 90,
                    height: 90,
                    border: "2px dashed #d4d4d8",
                    borderRadius: 2,
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    bgcolor: "#fafafa",
                    "&:hover": { bgcolor: "#f4f4f5", borderColor: "#18181b" },
                  }}
                >
                  <ImageOutlinedIcon sx={{ color: "#71717a", fontSize: 28 }} />

                  <Typography sx={{ fontSize: 11, mt: 0.5, textAlign: "center", fontWeight: 600 }}>
                    {returnImages.length === 0 ? "Add Image" : "Add More"}
                  </Typography>

                  <input
                    hidden
                    multiple
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const files = Array.from(e.target.files);

                      const invalid = files.find((file) => file.size > 5 * 1024 * 1024);

                      if (invalid) {
                        toast.error("Each image must be less than 5 MB");
                        return;
                      }

                      setReturnImages((prev) => {
                        const all = [...prev, ...files];

                        return all.filter(
                          (file, index, self) =>
                            index ===
                            self.findIndex(
                              (f) =>
                                f.name === file.name &&
                                f.size === file.size &&
                                f.lastModified === file.lastModified,
                            ),
                        );
                      });

                      e.target.value = "";
                    }}
                  />
                </Box>
              </Stack>
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => {
              setReturnOpen(false);
              setReturnDescription("");
              setReturnImages([]);
              setSelectedReturnItems([]);
            }}
            variant="outlined"
            sx={{ borderRadius: 2, textTransform: "none", borderColor: "#e4e4e7", color: "#27272a" }}
          >
            Close
          </Button>

          <Button
            variant="contained"
            disabled={
              !returnDescription.trim() ||
              selectedReturnItems.length === 0 ||
              returnImages.length === 0
            }
            sx={{
              borderRadius: 2,
              textTransform: "none",
              bgcolor: "#d97706",
              boxShadow: "none",
              "&:hover": { bgcolor: "#b45309", boxShadow: "none" },
            }}
            onClick={handleReturnOrder}
          >
            Confirm Return
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
