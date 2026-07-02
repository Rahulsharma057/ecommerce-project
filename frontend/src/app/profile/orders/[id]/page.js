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
import { API_URL } from "@/lib/api";

const STEP_ICONS = {
  Pending: ShoppingBagOutlinedIcon,
  Confirmed: Inventory2OutlinedIcon,
  Shipped: LocalShippingOutlinedIcon,
  Delivered: HomeOutlinedIcon,
};
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

  function OrderSteps({ status, steps }) {
    const isCancelled = status === "Cancelled";
    const currentIndex = steps.indexOf(status);

    return (
      <Box sx={{ my: 3 }}>
        <Typography fontWeight={700} mb={2.5} sx={{ color: "#0f172a" }}>
          Order Status
        </Typography>

        {isCancelled ? (
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 1,
              bgcolor: "#fef2f2",
              color: "#b91c1c",
              px: 2,
              py: 1,
              borderRadius: 2.5,
            }}
          >
            <CancelOutlinedIcon sx={{ fontSize: 20 }} />
            <Typography fontWeight={700} fontSize={14}>
              Order Cancelled
            </Typography>
          </Box>
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
                        width: 38,
                        height: 38,
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        bgcolor: isActive ? "#4f46e5" : "#f1f5f9",
                        color: isActive ? "#fff" : "#94a3b8",
                        border: isCurrent ? "3px solid #e0e7ff" : "none",
                        boxSizing: "content-box",
                        transition: "all 0.2s ease",
                      }}
                    >
                      {isCompleted ? (
                        <CheckIcon sx={{ fontSize: 18 }} />
                      ) : (
                        <Icon sx={{ fontSize: 17 }} />
                      )}
                    </Box>

                    <Typography
                      sx={{
                        mt: 1,
                        fontSize: 12.5,
                        fontWeight: isCurrent ? 700 : 600,
                        color: isActive ? "#0f172a" : "#94a3b8",
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
                        height: 3,
                        mt: "18px",
                        mx: -1,
                        borderRadius: 2,
                        bgcolor: index < currentIndex ? "#4f46e5" : "#e2e8f0",
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

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      {/* HEADER */}
      <Stack direction="row" alignItems="center" spacing={2} mb={3}>
        <Button
          onClick={() => router.back()}
          sx={{ textTransform: "none", color: "black", mb: 3 }}
        >
          <ArrowBackIcon />
        </Button>

        <Box>
          <Typography variant="h4" fontWeight={800}>
            Order Details
          </Typography>
        </Box>
      </Stack>

      <Paper sx={{ p: 4, borderRadius: 3 }}>
        {/* STATUS ROW */}

        {order.status === "Cancelled" && (
          <Typography color="error" mb={2}>
            Cancel Reason: {order.cancelReason}
          </Typography>
        )}
        <Typography variant="body2" color="text.secondary">
          Order ID: {order._id}
        </Typography>
        <Divider sx={{ my: 3 }} />
        <OrderSteps
          status={order.status}
          steps={["Pending", "Confirmed", "Shipped", "Delivered"]}
        />
        <Chip label={order.paymentMethod} variant="outlined" />
        <Divider sx={{ my: 3 }} />
        {/* ADDRESS */}

        <Divider sx={{ my: 3 }} />
        <Box sx={{ mt: 2 }}>
          <Stack direction="row" alignItems="center" spacing={1} mb={1}>
            <LocationOnIcon color="error" />
            <Typography variant="h6" fontWeight={700}>
              Shipping Address
            </Typography>
          </Stack>

          <Paper
            elevation={0}
            sx={{
              py:2,
              px: 4,
              my:2,
              borderRadius: 2,
              border: "1px solid #eee",
              bgcolor: "#fafafa",
            }}
          >
            <Typography fontWeight={600}>
              {order.shippingAddress?.fullName}
            </Typography>
            <Typography  mt={1}>  {order.shippingAddress?.phone}</Typography>

            <Typography color="text.secondary">
              {order.shippingAddress?.house}, {order.shippingAddress?.area}
            </Typography>

            <Typography color="text.secondary">
              {order.shippingAddress?.city}, {order.shippingAddress?.state} -{" "}
              {order.shippingAddress?.pincode}
            </Typography>
          </Paper>
        </Box>
        {/* PRODUCTS */}
        <Typography variant="h6" fontWeight={700} mb={2}>
          Products
        </Typography>

        <Stack spacing={2}>
          {(order.items || []).map((item) => (
            <Paper
              key={item._id}
              sx={{
                p: 2,
                borderRadius: 2,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                border: "1px solid #eee",
              }}
            >
              <Box>
                <Typography fontWeight={600}>{item.name}</Typography>

                <Typography variant="body2" color="text.secondary">
                  Qty: {item.quantity}
                </Typography>
              </Box>

              <Typography fontWeight={700}>
                ₹{(item.price * item.quantity).toLocaleString()}
              </Typography>
            </Paper>
          ))}
        </Stack>

        <Divider sx={{ my: 3 }} />

        {/* TOTAL */}
        <Box textAlign="right">
          <Typography variant="h6" fontWeight={800}>
            Total: ₹{(order.totalAmount || 0).toLocaleString()}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Invoice: {order.invoiceNumber ? "Generated ✅" : "Not Generated ❌"}
          </Typography>
        </Box>
      </Paper>

      {/* RETURN INFO */}
      {order.returnStatus !== "None" && (
        <Paper sx={{ p: 3, mt: 3, borderRadius: 3, bgcolor: "#fff7ed" }}>
          <Typography fontWeight={700} mb={1}>
            Return Status: {order.returnStatus}
          </Typography>

          <Typography>Reason: {order.returnReason || "-"}</Typography>
          <Typography>Admin Note: {order.adminNote || "-"}</Typography>
          <Typography>Pickup: {order.returnPickupStatus}</Typography>
          <Typography>Refund: {order.refundStatus}</Typography>
        </Paper>
      )}
    </Container>
  );
}
