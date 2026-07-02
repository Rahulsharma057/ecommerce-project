"use client";

import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Paper,
  Grid,
  Stack,
  Box,
  Avatar,
  Skeleton,
  Divider,
} from "@mui/material";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import PendingActionsOutlinedIcon from "@mui/icons-material/PendingActionsOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import InboxOutlinedIcon from "@mui/icons-material/InboxOutlined";
import { API_URL } from "@/lib/api";

/* ================= STATUS COLOR MAP ================= */
const STATUS_COLOR = {
  Pending:   { bg: "#fff7ed", color: "#c2410c", dot: "#f97316" },
  Shipped:   { bg: "#eff6ff", color: "#1d4ed8", dot: "#3b82f6" },
  Delivered: { bg: "#f0fdf4", color: "#15803d", dot: "#22c55e" },
  Cancelled: { bg: "#fef2f2", color: "#b91c1c", dot: "#ef4444" },
};

const StatusChip = ({ value }) => {
  const c = STATUS_COLOR[value] || { bg: "#f1f5f9", color: "#475569", dot: "#94a3b8" };
  return (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 0.6,
        bgcolor: c.bg,
        color: c.color,
        fontWeight: 600,
        fontSize: 11.5,
        px: 1.1,
        py: 0.4,
        borderRadius: 999,
        lineHeight: 1,
      }}
    >
      <Box sx={{ width: 5, height: 5, borderRadius: "50%", bgcolor: c.dot }} />
      {value}
    </Box>
  );
};

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/orders/admin/all`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setOrders(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, []);

  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((acc, o) => acc + (o.totalAmount || 0), 0);
  const pending = orders.filter((o) => o.status === "Pending").length;
  const shipped = orders.filter((o) => o.status === "Shipped").length;
  const delivered = orders.filter((o) => o.status === "Delivered").length;

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>

      {/* ================= HEADER ================= */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700} sx={{ color: "#0f172a", letterSpacing: -0.5 }}>
          Admin Dashboard
        </Typography>
        <Typography variant="body2" sx={{ color: "#64748b", mt: 0.5 }}>
          Overview of your store's orders and performance
        </Typography>
      </Box>

      {/* ================= STAT CARDS ================= */}
      <Grid container spacing={2.5}>
        <StatCard
          title="Total Orders"
          value={loading ? null : totalOrders}
          icon={<ShoppingBagOutlinedIcon sx={{ fontSize: 20 }} />}
          iconBg="#eef2ff"
          iconColor="#4f46e5"
        />
        <StatCard
          title="Total Revenue"
          value={loading ? null : `₹${totalRevenue.toLocaleString()}`}
          icon={<CurrencyRupeeIcon sx={{ fontSize: 20 }} />}
          iconBg="#f0fdf4"
          iconColor="#16a34a"
        />
        <StatCard
          title="Pending Orders"
          value={loading ? null : pending}
          icon={<PendingActionsOutlinedIcon sx={{ fontSize: 20 }} />}
          iconBg="#fff7ed"
          iconColor="#ea580c"
        />
        <StatCard
          title="Delivered Orders"
          value={loading ? null : delivered}
          icon={<CheckCircleOutlineIcon sx={{ fontSize: 20 }} />}
          iconBg="#f0fdf4"
          iconColor="#16a34a"
        />
      </Grid>

      {/* ================= STATUS BREAKDOWN ================= */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mt: 3,
          borderRadius: 3,
          border: "1px solid #e5e7eb",
        }}
      >
        <Typography variant="subtitle1" fontWeight={700} sx={{ color: "#0f172a", mb: 2 }}>
          Order Status Overview
        </Typography>

        <Stack direction="row" spacing={4} flexWrap="wrap" rowGap={2}>
          <StatusRow icon={<PendingActionsOutlinedIcon sx={{ fontSize: 18 }} />} label="Pending" value={pending} color="#f59e0b" />
          <StatusRow icon={<LocalShippingOutlinedIcon sx={{ fontSize: 18 }} />} label="Shipped" value={shipped} color="#3b82f6" />
          <StatusRow icon={<CheckCircleOutlineIcon sx={{ fontSize: 18 }} />} label="Delivered" value={delivered} color="#22c55e" />
        </Stack>
      </Paper>

      {/* ================= RECENT ORDERS ================= */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mt: 3,
          borderRadius: 3,
          border: "1px solid #e5e7eb",
        }}
      >
        <Typography variant="subtitle1" fontWeight={700} sx={{ color: "#0f172a", mb: 1 }}>
          Recent Orders
        </Typography>

        {loading && (
          <Stack spacing={1.5} sx={{ mt: 2 }}>
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} variant="rounded" height={52} sx={{ borderRadius: 2 }} />
            ))}
          </Stack>
        )}

        {!loading && orders.length === 0 && (
          <Box sx={{ textAlign: "center", py: 6, color: "#94a3b8" }}>
            <InboxOutlinedIcon sx={{ fontSize: 40, mb: 1, opacity: 0.5 }} />
            <Typography variant="body2">No orders found yet.</Typography>
          </Box>
        )}

        {!loading &&
          orders.slice(0, 5).map((order, idx) => (
            <Box key={order._id}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  py: 1.6,
                  transition: "background 0.15s ease",
                  borderRadius: 2,
                  px: 1,
                  mx: -1,
                  "&:hover": { bgcolor: "#f8fafc" },
                }}
              >
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ minWidth: 0 }}>
                  <Avatar
                    sx={{
                      width: 36,
                      height: 36,
                      bgcolor: "#18181b",
                      fontSize: 13,
                      fontWeight: 700,
                      flexShrink: 0,
                    }}
                  >
                    {(order.userId?.name?.[0] || "U").toUpperCase()}
                  </Avatar>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography fontWeight={600} fontSize={14} noWrap sx={{ color: "#1e293b" }}>
                      {order.userId?.name || "Unknown User"}
                    </Typography>
                    <Box sx={{ mt: 0.4 }}>
                      <StatusChip value={order.status} />
                    </Box>
                  </Box>
                </Stack>

                <Typography fontWeight={700} fontSize={14.5} sx={{ color: "#0f172a", whiteSpace: "nowrap", pl: 2 }}>
                  ₹{order.totalAmount?.toLocaleString()}
                </Typography>
              </Box>
              {idx < orders.slice(0, 5).length - 1 && <Divider sx={{ borderColor: "#f1f5f9" }} />}
            </Box>
          ))}
      </Paper>
    </Container>
  );
}

/* ================= STAT CARD ================= */
function StatCard({ title, value, icon, iconBg, iconColor }) {
  return (
    <Grid item xs={12} sm={6} md={3}>
      <Paper
        elevation={0}
        sx={{
          p: 2.5,
          borderRadius: 3,
          border: "1px solid #e5e7eb",
          transition: "all 0.2s ease",
          "&:hover": {
            boxShadow: "0 8px 20px rgba(15,23,42,0.06)",
            transform: "translateY(-2px)",
          },
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1.5 }}>
          <Typography variant="body2" sx={{ color: "#64748b", fontWeight: 500 }}>
            {title}
          </Typography>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: 2,
              bgcolor: iconBg,
              color: iconColor,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {icon}
          </Box>
        </Stack>

        {value === null ? (
          <Skeleton variant="text" width={80} height={36} />
        ) : (
          <Typography variant="h5" fontWeight={700} sx={{ color: "#0f172a" }}>
            {value}
          </Typography>
        )}
      </Paper>
    </Grid>
  );
}

/* ================= STATUS BREAKDOWN ROW ================= */
function StatusRow({ icon, label, value, color }) {
  return (
    <Stack direction="row" spacing={1.2} alignItems="center">
      <Box
        sx={{
          width: 32,
          height: 32,
          borderRadius: "50%",
          bgcolor: `${color}18`,
          color,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {icon}
      </Box>
      <Box>
        <Typography variant="body2" sx={{ color: "#64748b", fontSize: 12 }}>
          {label}
        </Typography>
        <Typography variant="body1" fontWeight={700} sx={{ color: "#0f172a" }}>
          {value}
        </Typography>
      </Box>
    </Stack>
  );
}