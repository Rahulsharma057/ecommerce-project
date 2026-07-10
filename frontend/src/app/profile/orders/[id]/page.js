"use client";

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
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import CheckIcon from "@mui/icons-material/Check";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
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

  useEffect(() => {
    fetchOrder();
  }, []);

  const fetchOrder = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API_URL}/orders/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    setOrder(data);
  };

  if (!order) return <Container sx={{ py: 5 }}>Loading...</Container>;

  // Shared step-tracker used for both order status and return status.
  // `negativeStatuses` covers terminal "failure" states (Cancelled / Rejected etc.)
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
          // Status doesn't match any known step and isn't a negative status —
          // show it plainly instead of silently rendering a broken/empty tracker.
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
                  {/* Step circle + label */}
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

fontWeight:
  isCompletedFlow
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

                  {/* Connector line */}
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

  const isReturnActive = order.returnStatus && order.returnStatus !== "None";

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      {/* HEADER */}
      <Stack direction="row" alignItems="center" gap={1.5} mb={4}>
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
            minWidth: 40,
            width: 40,
            height: 40,
            borderRadius: 2,
            color: "#18181b",
            border: "1px solid #e4e4e7",
            flexShrink: 0,
          }}
        >
          <ArrowBackIcon fontSize="small" />
        </Button>

        <Box sx={{ minWidth: 0 }}>
          <Typography
            sx={{
              fontSize: 22,
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
              {/* PRODUCT IMAGE */}
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

              {/* NAME + QTY */}
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

              {/* PRICE */}
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

      {/* RETURN INFO — only rendered when a return is actually active */}
      {isReturnActive && (
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
                label={order.returnPickupStatus || "Pending"}
                size="small"
                sx={{
                  fontWeight: 600,
                  fontSize: 12,
                  bgcolor:
                    order.returnPickupStatus === "Completed"
                      ? "#f0fdf4"
                      : "#fffbeb",
                  color:
                    order.returnPickupStatus === "Completed"
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
                label={order.refundStatus || "Not refunded yet"}
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
      )}
    </Container>
  );
}
