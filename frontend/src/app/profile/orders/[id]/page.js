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
  Grid,
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
import { API_URL } from "@/lib/api";

const STEP_ICONS = {
  Pending: ShoppingBagOutlinedIcon,
  Confirmed: Inventory2OutlinedIcon,
  Shipped: LocalShippingOutlinedIcon,
  Delivered: HomeOutlinedIcon,
  Requested: ShoppingBagOutlinedIcon,
  Approved: CheckIcon,
  "Picked Up": LocalShippingOutlinedIcon,
  Refunded: HomeOutlinedIcon,
};

const RETURN_STEPS = ["Requested", "Approved", "Picked Up", "Refunded"];

const RETURN_ITEM_STATUS_STYLES = {
  Requested: { bg: "#fefce8", color: "#a16207" },
  Approved: { bg: "#eff6ff", color: "#1d4ed8" },
  Rejected: { bg: "#fef2f2", color: "#b91c1c" },
  Refunded: { bg: "#f0fdf4", color: "#15803d" },
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

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to load order");
        return;
      }

      setOrder(data);
    } catch (err) {
      toast.error("Something went wrong");
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

      const data = await res.json();

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
      toast.error("Something went wrong");
    }
  };

  const handleReturnOrder = async () => {
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

      const data = await res.json();

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
      toast.error("Something went wrong");
    }
  };

  if (!order) return <Container sx={{ py: 5 }}>Loading...</Container>;

  // Items that were fully cancelled — never eligible for anything again
  const cancelledIds = (order.cancelledItems || []).map((item) =>
    item.itemId.toString(),
  );

  // Items that already have an ACTIVE (Requested/Approved) or COMPLETED
  // (Refunded) return on file. Only a "Rejected" return frees an item up
  // again, so those are intentionally excluded from this block-list.
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

const returnableItems = order.items?.filter((item) => !ineligibleIds.has(item._id.toString())) || [];
const cancellableItems = order.items?.filter(
  (item) => !order.cancelledItems?.map((i) => i.itemId.toString()).includes(item._id.toString()),
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
                        fontWeight: isCompletedFlow
                          ? 600
                          : isCurrent
                            ? 700
                            : 600,
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

  // "Active batch" = the return status shown in the tracker above — i.e.
  // items that are currently Requested/Approved (or the most recent
  // decision if nothing is currently in-flight).
  const hasReturnHistory = (order.returnItems || []).length > 0;

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
        {/* CANCELLED BANNER */}
        {order.status === "Cancelled" && (
          <Box
            sx={{
              mb: 3,
              p: 1.5,
              borderRadius: 2,
              bgcolor: "#fef2f2",
              border: "1px solid #fecaca",
            }}
          >
            <Typography
              sx={{ fontSize: 13.5, color: "#dc2626", fontWeight: 600 }}
            >
              Cancel Reason: {order.cancelReason || "Not specified"}
            </Typography>
          </Box>
        )}

        {/* ORDER META: date + payment method */}
        <Stack direction="row" flexWrap="wrap" gap={1.5} mb={3}>
          <Stack direction="row" alignItems="center" spacing={0.75}>
            <CalendarMonthOutlinedIcon
              sx={{ fontSize: 17, color: "#a1a1aa" }}
            />
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
          <SectionHeading icon={LocationOnIcon}>
            Shipping Address
          </SectionHeading>

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
              <Typography
                sx={{ fontWeight: 600, fontSize: 14, color: "#18181b" }}
              >
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

        {/* PRODUCTS */}
        <SectionHeading>Products ({order.items?.length || 0})</SectionHeading>

        <Stack spacing={1.5}>
          {(order.items || []).map((item) => (
            <Box
              key={item._id}
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

              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  noWrap
                  sx={{ fontWeight: 600, fontSize: 14, color: "#18181b" }}
                >
                  {item.name}
                </Typography>
                <Typography sx={{ fontSize: 12.5, color: "#a1a1aa", mt: 0.3 }}>
                  Qty: {item.quantity}
                </Typography>
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
          ))}

          {(!order.items || order.items.length === 0) && (
            <Typography sx={{ fontSize: 13.5, color: "#a1a1aa" }}>
              No products found for this order.
            </Typography>
          )}
        </Stack>

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
            <Typography sx={{ fontSize: 12.5, color: "#71717a" }}>
              Order Total
            </Typography>
            <Typography
              sx={{ fontSize: 20, fontWeight: 700, color: "#18181b" }}
            >
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
              sx={{
                fontSize: 17,
                color: order.invoiceNumber ? "#16a34a" : "#a1a1aa",
              }}
            />
            <Typography
              sx={{
                fontSize: 12.5,
                color: order.invoiceNumber ? "#16a34a" : "#a1a1aa",
                fontWeight: 500,
              }}
            >
              {order.invoiceNumber
                ? "Invoice Generated"
                : "Invoice Not Generated"}
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
                }}
              >
                <Avatar
                  src={item.image}
                  variant="rounded"
                  sx={{ width: 65, height: 65, borderRadius: 2 }}
                />

                <Box flex={1}>
                  <Typography fontWeight={600}>{item.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Qty : {item.quantity}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    ₹{item.price}
                  </Typography>
                </Box>

                <Chip label="Cancelled" color="error" sx={{ fontWeight: 600 }} />
              </Box>
            ))}
          </Stack>
        </Box>
      )}

      {/* RETURN HISTORY — every item that's ever had a return request,
          each showing its OWN status (not one blanket status for all) */}
   {/*    {hasReturnHistory && (
        <Paper
          variant="outlined"
          sx={{
            p: { xs: 2.5, sm: 3 },
            mt: 3,
            borderRadius: 3,
            borderColor: "#e4e4e7",
          }}
        >
          <StepTracker
            title="Return Status"
            status={order.returnStatus}
            steps={RETURN_STEPS}
            negativeStatuses={["Rejected", "Cancelled"]}
            negativeLabel={`Return ${order.returnStatus}`}
          />

          <Divider sx={{ my: 3, borderColor: "#f4f4f5" }} />

          <Box mt={1}>
            <Typography variant="h6" fontWeight={700} mb={2} color="text.primary">
              Returned Item(s)
            </Typography>

            <Stack spacing={2} mb={2}>
              {order.returnItems.map((item, i) => {
                const style =
                  RETURN_ITEM_STATUS_STYLES[item.status] || {
                    bg: "#f4f4f5",
                    color: "#52525b",
                  };
                return (
                  <Box
                    key={`${item.itemId}-${i}`}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      p: 2,
                      borderRadius: 3,
                      border: "1px solid",
                      borderColor: "#e5e7eb",
                      bgcolor: "#fff",
                    }}
                  >
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar
                        src={item.image}
                        variant="rounded"
                        sx={{
                          width: 64,
                          height: 64,
                          borderRadius: 2,
                          border: "1px solid #e5e7eb",
                        }}
                      />

                      <Box>
                        <Typography fontWeight={700} fontSize={15}>
                          {item.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" mt={0.5}>
                          Quantity : {item.quantity}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Price : ₹{item.price}
                        </Typography>
                      </Box>
                    </Stack>

                    <Chip
                      label={item.status}
                      sx={{
                        fontWeight: 700,
                        minWidth: 100,
                        bgcolor: style.bg,
                        color: style.color,
                      }}
                    />
                  </Box>
                );
              })}
            </Stack>
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography
                sx={{
                  fontSize: 11.5,
                  fontWeight: 600,
                  color: "#a1a1aa",
                  textTransform: "uppercase",
                  letterSpacing: 0.3,
                }}
              >
                Reason
              </Typography>
              <Typography sx={{ fontSize: 14, color: "#27272a", mt: 0.5 }}>
                {order.returnReason || "-"}
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography
                sx={{
                  fontSize: 11.5,
                  fontWeight: 600,
                  color: "#a1a1aa",
                  textTransform: "uppercase",
                  letterSpacing: 0.3,
                }}
              >
                Admin Note
              </Typography>
              <Typography sx={{ fontSize: 14, color: "#27272a", mt: 0.5 }}>
                {order.adminNote || "-"}
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
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
                Pickup Status
              </Typography>
              <Chip
                label={order.returnPickupStatus || "NotPicked"}
                size="small"
                sx={{
                  fontWeight: 600,
                  fontSize: 12,
                  bgcolor:
                    order.returnPickupStatus === "Received"
                      ? "#f0fdf4"
                      : "#fffbeb",
                  color:
                    order.returnPickupStatus === "Received"
                      ? "#16a34a"
                      : "#d97706",
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
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
                Refund Status
              </Typography>
              <Chip
                label={order.refundStatus || "None"}
                size="small"
                sx={{
                  fontWeight: 600,
                  fontSize: 12,
                  bgcolor:
                    order.refundStatus === "Completed" ? "#f0fdf4" : "#fffbeb",
                  color:
                    order.refundStatus === "Completed" ? "#16a34a" : "#d97706",
                }}
              />
            </Grid>
          </Grid>
        </Paper>
      )} */}
{/* RETURN HISTORY — each return is its own independent card now */}
{(order.returns || []).length > 0 && (
  <Stack spacing={2} mt={3}>
    {order.returns.map((ret, idx) => (
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
                sx={{ width: 48, height: 48, borderRadius: 2, bgcolor: "#f4f4f5", border: "1px solid #e4e4e7" }}
              >
                <ImageOutlinedIcon sx={{ fontSize: 18, color: "#a1a1aa" }} />
              </Avatar>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography noWrap sx={{ fontWeight: 600, fontSize: 13.5, color: "#18181b" }}>
                  {item.name}
                </Typography>
                <Typography sx={{ fontSize: 12, color: "#a1a1aa" }}>Qty: {item.quantity}</Typography>
              </Box>
              <Typography sx={{ fontWeight: 700, fontSize: 14, color: "#18181b" }}>
                ₹{item.total?.toLocaleString()}
              </Typography>
            </Box>
          ))}
        </Stack>

        {ret.reason && (
          <Typography sx={{ fontSize: 13.5, color: "#52525b", mb: 1 }}>Reason: {ret.reason}</Typography>
        )}
        {ret.adminNote && (
          <Typography sx={{ fontSize: 13.5, color: "#71717a" }}>Admin Note: {ret.adminNote}</Typography>
        )}

        {ret.refundAmount > 0 && (
          <Typography sx={{ fontSize: 13.5, fontWeight: 700, color: "#16a34a", mt: 1 }}>
            Refund Amount: ₹{ret.refundAmount.toLocaleString()}
          </Typography>
        )}
      </Paper>
    ))}
  </Stack>
)}

      {/* CANCEL DIALOG */}
      <Dialog
        open={cancelOpen}
        onClose={() => setCancelOpen(false)}
        PaperProps={{
          sx: { borderRadius: 3, p: 1, minWidth: { xs: "90%", sm: 420 } },
        }}
      >
        <DialogTitle sx={{ fontWeight: 700, color: "#18181b" }}>
          Cancel Order
        </DialogTitle>
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
                        border: checked
                          ? "1px solid #18181b"
                          : "1px solid #e5e7eb",
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
            sx={{
              borderRadius: 2,
              textTransform: "none",
              borderColor: "#e4e4e7",
              color: "#27272a",
            }}
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
        PaperProps={{
          sx: { borderRadius: 3, p: 1, minWidth: { xs: "90%", sm: 420 } },
        }}
      >
        <DialogTitle sx={{ fontWeight: 700, color: "#18181b" }}>
          Return Item(s)
        </DialogTitle>

        <DialogContent>
          <Typography variant="body2" sx={{ color: "#71717a", mb: 2 }}>
            Please mention the reason for returning these item(s).
          </Typography>

          {returnableItems.length > 1 && (
            <Box sx={{ mb: 2.5 }}>
              <Typography
                sx={{ fontSize: 13, fontWeight: 700, color: "#18181b", mb: 1 }}
              >
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
                        border: checked
                          ? "1.5px solid #18181b"
                          : "1px solid #e4e4e7",
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

          <Button
            variant="outlined"
            component="label"
            sx={{
              mt: 2,
              borderRadius: 2,
              textTransform: "none",
              borderColor: "#e4e4e7",
              color: "#27272a",
              "&:hover": { borderColor: "#18181b", bgcolor: "#f4f4f5" },
            }}
          >
            Add Return Images
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

                setReturnImages(files);
              }}
            />
          </Button>

          {returnImages.length > 0 && (
            <Box sx={{ display: "flex", gap: 1, mt: 2, flexWrap: "wrap" }}>
              {returnImages.map((img, index) => (
                <Box
                  key={index}
                  component="img"
                  src={URL.createObjectURL(img)}
                  sx={{
                    width: 70,
                    height: 70,
                    borderRadius: 2,
                    objectFit: "cover",
                    border: "1px solid #e4e4e7",
                  }}
                />
              ))}
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
            sx={{
              borderRadius: 2,
              textTransform: "none",
              borderColor: "#e4e4e7",
              color: "#27272a",
            }}
          >
            Close
          </Button>

          <Button
            variant="contained"
            disabled={!returnDescription || selectedReturnItems.length === 0}
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
