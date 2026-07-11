"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Box,
  Container,
  Typography,
  Chip,
  Grid,
  Divider,
  Avatar,
  Stack,
  IconButton,
  Skeleton,
  Button,
  Tabs,
  Tab,
  Select,
  MenuItem,
  TextField,
  Checkbox,
  Paper,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import PaymentOutlinedIcon from "@mui/icons-material/PaymentOutlined";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import AssignmentReturnOutlinedIcon from "@mui/icons-material/AssignmentReturnOutlined";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import DownloadInvoiceButton from "@/components/DownloadInvoiceButton";
import { API_URL } from "@/lib/api";

const STATUS_CONFIG = {
  Pending: { color: "#d97706", bg: "#fffbeb" },
  Confirmed: { color: "#2563eb", bg: "#eff6ff" },
  Shipped: { color: "#4f46e5", bg: "#eef2ff" },
  Delivered: { color: "#16a34a", bg: "#f0fdf4" },
  Cancelled: { color: "#dc2626", bg: "#fef2f2" },
};

const RETURN_STATUS_COLOR = {
  None: { color: "#64748b", bg: "#f1f5f9" },
  Requested: { color: "#a16207", bg: "#fefce8" },
  Approved: { color: "#1d4ed8", bg: "#eff6ff" },
  Rejected: { color: "#b91c1c", bg: "#fef2f2" },
  Returned: { color: "#6d28d9", bg: "#f5f3ff" },
  Refunded: { color: "#15803d", bg: "#f0fdf4" },
};

function SectionCard({ icon, title, children }) {
  return (
    <Box
      sx={{
        background: "#fff",
        borderRadius: 3,
        border: "1px solid",
        borderColor: "grey.200",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          px: 3,
          py: 2,
          borderBottom: "1px solid",
          borderColor: "grey.100",
          bgcolor: "grey.50",
        }}
      >
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: 2,
            bgcolor: "#eef2ff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#4338ca",
          }}
        >
          {icon}
        </Box>
        <Typography fontWeight={600} fontSize={14} color="text.primary">
          {title}
        </Typography>
      </Box>
      <Box sx={{ px: 3, py: 2.5 }}>{children}</Box>
    </Box>
  );
}

function InfoRow({ icon, label, value }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 2, py: 1 }}>
      <Box sx={{ color: "grey.400", display: "flex", flexShrink: 0 }}>{icon}</Box>
      <Typography fontSize={13} color="text.secondary" sx={{ minWidth: 90 }}>
        {label}
      </Typography>
      <Typography fontSize={13} fontWeight={500} color="text.primary">
        {value}
      </Typography>
    </Box>
  );
}

function LoadingSkeleton() {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Skeleton width={100} height={24} sx={{ mb: 3 }} />
      <Skeleton width={200} height={36} sx={{ mb: 1 }} />
      <Skeleton width={260} height={20} sx={{ mb: 3 }} />
      {[1, 2, 3].map((i) => (
        <Skeleton key={i} height={160} sx={{ borderRadius: 3, mb: 2 }} variant="rectangular" />
      ))}
    </Container>
  );
}
function ReturnDecisionBox({ order, returnId, onDone }) {
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);

  const decide = async (status) => {
    setBusy(true);
    try {
      await fetch(`${API_URL}/orders/admin/return/${order._id}/${returnId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ status, adminNote: note }),
      });
      onDone();
    } finally {
      setBusy(false);
    }
  };

  return (
    <Box>
      <TextField
        fullWidth
        multiline
        rows={2}
        label="Admin Note"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        sx={{ mb: 1.5, "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
      />
      <Stack direction="row" spacing={1.5}>
        <Button variant="outlined" color="error" disabled={busy} onClick={() => decide("Rejected")} sx={{ textTransform: "none", fontWeight: 700, borderRadius: 2 }}>
          Reject
        </Button>
        <Button variant="contained" color="warning" disabled={busy} onClick={() => decide("Approved")} sx={{ textTransform: "none", fontWeight: 700, borderRadius: 2 }}>
          Approve
        </Button>
      </Stack>
    </Box>
  );
}
export default function OrderDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [tab, setTab] = useState(0); // 0 = Details, 1 = Cancel, 2 = Return & Refund

  // Cancel state
  const [cancelReason, setCancelReason] = useState("");
  const [selectedCancelItems, setSelectedCancelItems] = useState([]);
  const [cancelling, setCancelling] = useState(false);

  // Return/refund action state
  const [adminNote, setAdminNote] = useState("");
  const [acting, setActing] = useState(false);

  useEffect(() => {
    if (id) fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const res = await fetch(`${API_URL}/orders/admin/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      setOrder(data);
      setAdminNote(data?.adminNote || "");
    } catch (err) {
      console.error(err);
    }
  };

  if (!order) return <LoadingSkeleton />;

  const {
    shippingAddress: addr,
    userId: user,
    items = [],
    totalAmount,
    status,
    _id,
    createdAt,
    paymentMethod,
  } = order;

  const statusCfg = STATUS_CONFIG[status] || { color: "#64748b", bg: "#f1f5f9" };

  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
    : "—";

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  const cancelledIds = order.cancelledItems?.map((i) => i.itemId.toString()) || [];
  const cancellableItems = items.filter((i) => !cancelledIds.includes(i._id.toString()));
  const canCancel = order.status === "Pending" || order.status === "Confirmed" || order.status === "Shipped";
  const isReturnActive = order.returnStatus && order.returnStatus !== "None";

  const toggleCancelItem = (itemId) => {
    setSelectedCancelItems((prev) =>
      prev.includes(itemId) ? prev.filter((x) => x !== itemId) : [...prev, itemId],
    );
  };

  // ── ACTIONS ──
  const updateOrderStatus = async (newStatus) => {
    await fetch(`${API_URL}/orders/admin/${_id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ status: newStatus }),
    });
    fetchOrder();
  };

  const handleCancel = async () => {
    if (!cancelReason.trim() || selectedCancelItems.length === 0) return;
    setCancelling(true);
    try {
      const res = await fetch(`${API_URL}/orders/cancel/${_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ reason: cancelReason, items: selectedCancelItems }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "Failed to cancel order");
        return;
      }
      setCancelReason("");
      setSelectedCancelItems([]);
      fetchOrder();
    } finally {
      setCancelling(false);
    }
  };

  const updateReturnStatus = async (newStatus) => {
    setActing(true);
    try {
      await fetch(`${API_URL}/orders/admin/return/${_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ status: newStatus, adminNote }),
      });
      fetchOrder();
    } finally {
      setActing(false);
    }
  };

  const updatePickupStatus = async (pickupStatus) => {
    await fetch(`${API_URL}/orders/admin/return/pickup/${_id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ pickupStatus }),
    });
    fetchOrder();
  };

  const updateRefundStatus = async (refundStatus) => {
    await fetch(`${API_URL}/orders/admin/refund/${_id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ refundStatus }),
    });
    fetchOrder();
  };

  return (
    <Box sx={{ bgcolor: "#f7f8fa", minHeight: "100vh", py: 4 }}>
      <Container maxWidth="md">
        {/* HEADER */}
        <Stack direction="row" alignItems="center" gap={1.5} mb={3}>
          <IconButton
            size="small"
            onClick={() => router.back()}
            sx={{ border: "1px solid #e2e8f0", bgcolor: "#fff", borderRadius: 2, color: "#18181b" }}
          >
            <ArrowBackIcon fontSize="small" />
          </IconButton>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="h5" fontWeight={700}>
              Order Details
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.3 }} noWrap>
              Order ID: {_id}
            </Typography>
          </Box>

          <Chip
            label={status}
            sx={{ fontWeight: 700, bgcolor: statusCfg.bg, color: statusCfg.color }}
          />
        </Stack>

        {/* TABS */}
        <Paper variant="outlined" sx={{ borderRadius: 2, borderColor: "#e2e8f0", mb: 3, overflow: "hidden" }}>
          <Tabs
            value={tab}
            onChange={(e, v) => setTab(v)}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            TabIndicatorProps={{ sx: { bgcolor: "#18181b", height: 2.5 } }}
            sx={{
              minHeight: 48,
              "& .MuiTab-root": { textTransform: "none", fontWeight: 600, fontSize: 13.5, color: "#64748b" },
              "& .Mui-selected": { color: "#18181b !important" },
            }}
          >
            <Tab label="Details" />
            <Tab label="Cancel Order" />
            <Tab label={`Return & Refund${isReturnActive ? " •" : ""}`} />
          </Tabs>
        </Paper>

        {/* ───────────── TAB 0: DETAILS ───────────── */}
        {tab === 0 && (
          <Stack spacing={2}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <SectionCard icon={<PersonOutlineRoundedIcon sx={{ fontSize: 18 }} />} title="Customer">
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                    <Avatar sx={{ width: 44, height: 44, bgcolor: "#18181b", fontSize: 15, fontWeight: 700 }}>
                      {initials}
                    </Avatar>
                    <Box>
                      <Typography fontWeight={600} fontSize={15}>
                        {user?.name ?? "—"}
                      </Typography>
                      <Typography fontSize={12} color="text.secondary">
                        Customer
                      </Typography>
                    </Box>
                  </Box>
                  <Divider sx={{ mb: 1.5 }} />
                  <InfoRow icon={<EmailOutlinedIcon sx={{ fontSize: 16 }} />} label="Email" value={user?.email ?? addr?.email ?? "—"} />
                  <InfoRow icon={<CalendarTodayOutlinedIcon sx={{ fontSize: 16 }} />} label="Placed on" value={formattedDate} />
                  <InfoRow icon={<PaymentOutlinedIcon sx={{ fontSize: 16 }} />} label="Payment" value={paymentMethod ?? "—"} />
                </SectionCard>
              </Grid>

              <Grid item xs={12} md={6}>
                <SectionCard icon={<LocalShippingOutlinedIcon sx={{ fontSize: 18 }} />} title="Shipping address">
                  <Stack spacing={0.5}>
                    <Typography fontWeight={600} fontSize={14}>
                      {addr?.fullName ?? "—"}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <PhoneOutlinedIcon sx={{ fontSize: 14, color: "grey.400" }} />
                      <Typography fontSize={13} color="text.secondary">
                        {addr?.phone ?? "—"}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1, mt: 0.5 }}>
                      <LocationOnOutlinedIcon sx={{ fontSize: 15, color: "grey.400", mt: "1px" }} />
                      <Typography fontSize={13} color="text.secondary" lineHeight={1.7}>
                        {addr?.house}, {addr?.area}
                        <br />
                        {addr?.city}, {addr?.state} — {addr?.pincode}
                      </Typography>
                    </Box>
                  </Stack>
                </SectionCard>
              </Grid>
            </Grid>

            {/* ORDER STATUS UPDATE */}
            <SectionCard icon={<LocalShippingOutlinedIcon sx={{ fontSize: 18 }} />} title="Order Status">
              <Stack direction="row" alignItems="center" spacing={2} flexWrap="wrap" gap={1.5}>
                <Select
                  value={status}
                  size="small"
                  disabled={status === "Cancelled"}
                  onChange={(e) => updateOrderStatus(e.target.value)}
                  sx={{ minWidth: 180, fontWeight: 600, fontSize: 13.5, borderRadius: 2 }}
                >
                  <MenuItem value="Pending">Pending</MenuItem>
                  <MenuItem value="Confirmed">Confirmed</MenuItem>
                  <MenuItem value="Shipped">Shipped</MenuItem>
                  <MenuItem value="Delivered">Delivered</MenuItem>
                  <MenuItem value="Cancelled">Cancelled</MenuItem>
                </Select>
                {status === "Cancelled" && (
                  <Typography fontSize={12.5} color="text.secondary">
                    This order is cancelled and can no longer be updated.
                  </Typography>
                )}
              </Stack>
            </SectionCard>

            {/* PRODUCTS */}
            <SectionCard icon={<ShoppingBagOutlinedIcon sx={{ fontSize: 18 }} />} title="Products">
              {items.length === 0 ? (
                <Typography fontSize={13} color="text.secondary">
                  No items found
                </Typography>
              ) : (
                <Stack divider={<Divider />}>
                  {items.map((item, i) => (
                    <Box key={i} sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", py: 1.5 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Avatar
                          src={item.image}
                          variant="rounded"
                          sx={{ width: 44, height: 44, borderRadius: 2, bgcolor: "grey.100", border: "1px solid", borderColor: "grey.200" }}
                        >
                          <ShoppingBagOutlinedIcon sx={{ fontSize: 18, color: "grey.400" }} />
                        </Avatar>
                        <Box>
                          <Typography fontSize={14} fontWeight={500}>
                            {item.name}
                          </Typography>
                          <Typography fontSize={12} color="text.secondary">
                            Qty: {item.quantity}
                          </Typography>
                        </Box>
                      </Box>
                      <Typography fontSize={14} fontWeight={600}>
                        ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              )}

              <Divider sx={{ mt: 1 }} />

              <Box sx={{ pt: 2 }}>
                {order.couponCode && (
                  <>
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                      <Typography color="text.secondary">Coupon Applied</Typography>
                      <Typography color="success.main" fontWeight={600}>
                        {order.couponCode.code}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                      <Typography color="text.secondary">Discount</Typography>
                      <Typography color="success.main" fontWeight={600}>
                        -₹{order.discount}
                      </Typography>
                    </Box>
                  </>
                )}

                <Divider />

                <Box sx={{ display: "flex", justifyContent: "space-between", pt: 2 }}>
                  <Typography fontSize={13} color="text.secondary">
                    Order Total
                  </Typography>
                  <Typography fontSize={20} fontWeight={700} color="#18181b">
                    ₹{Number(totalAmount).toLocaleString("en-IN")}
                  </Typography>
                </Box>

                {order.refundAmount > 0 && (
                  <Box sx={{ display: "flex", justifyContent: "space-between", pt: 1 }}>
                    <Typography fontSize={13} color="text.secondary">
                      Refunded
                    </Typography>
                    <Typography fontSize={14} fontWeight={700} color="success.main">
                      -₹{Number(order.refundAmount).toLocaleString("en-IN")}
                    </Typography>
                  </Box>
                )}
              </Box>

              <Box sx={{ display: "flex", gap: 1.5, mt: 3, flexWrap: "wrap" }}>
                <DownloadInvoiceButton orderId={order._id} />
                <Button variant="outlined" onClick={() => window.open(`${API_URL}/invoice/view/${order._id}`, "_blank")}>
                  View Invoice
                </Button>
                <Button
                  variant="contained"
                  onClick={async () => {
                    await fetch(`${API_URL}/invoice/email/${order._id}`, { method: "POST" });
                    alert("Invoice sent to email");
                  }}
                >
                  Send Email
                </Button>
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => {
                    const phone = order.shippingAddress.phone;
                    const msg = `Hello, your invoice is ready. Download here: ${API_URL}/invoice/download/${order._id}`;
                    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, "_blank");
                  }}
                >
                  WhatsApp
                </Button>
              </Box>
            </SectionCard>
          </Stack>
        )}

        {/* ───────────── TAB 1: CANCEL ORDER ───────────── */}
        {tab === 1 && (
          <Stack spacing={2}>
            {status === "Cancelled" ? (
              <SectionCard icon={<CancelOutlinedIcon sx={{ fontSize: 18 }} />} title="Order Cancelled">
                <Box sx={{ p: 2, borderRadius: 2, bgcolor: "#fef2f2", border: "1px solid #fecaca" }}>
                  <Typography fontWeight={600} color="#dc2626" fontSize={14}>
                    Cancel Reason: {order.cancelReason || "Not specified"}
                  </Typography>
                  {order.cancelledAt && (
                    <Typography fontSize={12.5} color="text.secondary" mt={0.5}>
                      Cancelled on {new Date(order.cancelledAt).toLocaleString("en-IN")}
                    </Typography>
                  )}
                </Box>
              </SectionCard>
            ) : !canCancel ? (
              <SectionCard icon={<CancelOutlinedIcon sx={{ fontSize: 18 }} />} title="Cancel Order">
                <Typography fontSize={13.5} color="text.secondary">
                  This order can no longer be cancelled from here. Use the Return &amp; Refund tab instead.
                </Typography>
              </SectionCard>
            ) : (
              <SectionCard icon={<CancelOutlinedIcon sx={{ fontSize: 18 }} />} title="Cancel Order">
                {cancellableItems.length === 0 ? (
                  <Typography fontSize={13.5} color="text.secondary">
                    All items in this order have already been cancelled.
                  </Typography>
                ) : (
                  <>
                    <Typography fontSize={13} fontWeight={700} mb={1.5}>
                      Select item(s) to cancel
                    </Typography>
                    <Stack spacing={1} mb={2.5}>
                      {cancellableItems.map((item) => {
                        const checked = selectedCancelItems.includes(item._id);
                        return (
                          <Box
                            key={item._id}
                            onClick={() => toggleCancelItem(item._id)}
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1.5,
                              p: 1,
                              borderRadius: 2,
                              border: checked ? "1.5px solid #18181b" : "1px solid #e5e7eb",
                              bgcolor: checked ? "#fafafa" : "#fff",
                              cursor: "pointer",
                            }}
                          >
                            <Checkbox checked={checked} onChange={() => toggleCancelItem(item._id)} onClick={(e) => e.stopPropagation()} />
                            <Avatar src={item.image} variant="rounded" sx={{ width: 44, height: 44, borderRadius: 1.5 }} />
                            <Box>
                              <Typography fontWeight={600} fontSize={13.5}>
                                {item.name}
                              </Typography>
                              <Typography fontSize={12} color="text.secondary">
                                Qty: {item.quantity} · ₹{item.price}
                              </Typography>
                            </Box>
                          </Box>
                        );
                      })}
                    </Stack>

                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      label="Reason for cancellation"
                      value={cancelReason}
                      onChange={(e) => setCancelReason(e.target.value)}
                      sx={{ mb: 2, "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                    />

                    <Button
                      variant="contained"
                      color="error"
                      disabled={cancelling || !cancelReason.trim() || selectedCancelItems.length === 0}
                      onClick={handleCancel}
                      sx={{ textTransform: "none", fontWeight: 700, borderRadius: 2, px: 3 }}
                    >
                      {cancelling ? "Cancelling..." : "Confirm Cancellation"}
                    </Button>
                  </>
                )}
              </SectionCard>
            )}

            {order.cancelledItems?.length > 0 && (
              <SectionCard icon={<CancelOutlinedIcon sx={{ fontSize: 18 }} />} title="Previously Cancelled Items">
                <Stack spacing={1.5}>
                  {order.cancelledItems.map((item) => (
                    <Box
                      key={item.itemId}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        p: 1.5,
                        border: "1px solid #fecaca",
                        bgcolor: "#fef2f2",
                        borderRadius: 2,
                      }}
                    >
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <Avatar src={item.image} variant="rounded" sx={{ width: 48, height: 48, borderRadius: 1.5 }} />
                        <Box>
                          <Typography fontWeight={600} fontSize={13.5}>
                            {item.name}
                          </Typography>
                          <Typography fontSize={12} color="text.secondary">
                            Qty: {item.quantity} · ₹{item.price}
                          </Typography>
                          {item.reason && (
                            <Typography fontSize={11.5} color="text.secondary">
                              Reason: {item.reason}
                            </Typography>
                          )}
                        </Box>
                      </Stack>
                      <Chip label="Cancelled" color="error" size="small" sx={{ fontWeight: 700 }} />
                    </Box>
                  ))}
                </Stack>
              </SectionCard>
            )}
          </Stack>
        )}

        {/* ───────────── TAB 2: RETURN & REFUND ───────────── */}
     {tab === 2 && (
  <Stack spacing={2}>
    {(!order.returns || order.returns.length === 0) ? (
      <SectionCard icon={<AssignmentReturnOutlinedIcon sx={{ fontSize: 18 }} />} title="Return & Refund">
        <Typography fontSize={13.5} color="text.secondary">
          No return has been requested for this order.
        </Typography>
      </SectionCard>
    ) : (
      order.returns.map((ret, idx) => (
        <SectionCard
          key={ret._id}
          icon={<AssignmentReturnOutlinedIcon sx={{ fontSize: 18 }} />}
          title={`Return #${order.returns.length - idx}`}
        >
          <Stack spacing={2}>
            <Chip
              label={ret.status}
              sx={{
                fontWeight: 700,
                width: "fit-content",
                bgcolor: RETURN_STATUS_COLOR[ret.status]?.bg,
                color: RETURN_STATUS_COLOR[ret.status]?.color,
              }}
            />

            <Stack spacing={1}>
              {ret.items.map((item) => (
                <Box
                  key={item.itemId}
                  sx={{ display: "flex", alignItems: "center", gap: 1.5, p: 1, border: "1px solid #e5e7eb", borderRadius: 2 }}
                >
                  <Avatar src={item.image} variant="rounded" sx={{ width: 44, height: 44, borderRadius: 1.5 }} />
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography fontWeight={600} fontSize={13.5} noWrap>{item.name}</Typography>
                    <Typography fontSize={12} color="text.secondary">Qty: {item.quantity} · ₹{item.price}</Typography>
                  </Box>
                  <Typography fontWeight={700} fontSize={14}>₹{item.total?.toLocaleString()}</Typography>
                </Box>
              ))}
            </Stack>

            {ret.reason && (
              <Box>
                <Typography fontSize={11.5} fontWeight={600} color="text.secondary" textTransform="uppercase">
                  Customer Reason
                </Typography>
                <Typography fontSize={14} mt={0.5}>{ret.reason}</Typography>
              </Box>
            )}

            {/* Approve/Reject — only while this batch is still Requested */}
            {ret.status === "Requested" && (
              <ReturnDecisionBox order={order} returnId={ret._id} onDone={fetchOrder} />
            )}

            {/* Pickup — only relevant once THIS batch is approved */}
            {ret.status === "Approved" && (
              <Box>
                <Typography fontSize={11.5} fontWeight={600} color="text.secondary" textTransform="uppercase" mb={0.75}>
                  Pickup Status
                </Typography>
                <Select
                  value={ret.pickupStatus}
                  size="small"
                  onChange={async (e) => {
                    await fetch(`${API_URL}/orders/admin/return/pickup/${order._id}/${ret._id}`, {
                      method: "PUT",
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                      },
                      body: JSON.stringify({ pickupStatus: e.target.value }),
                    });
                    fetchOrder();
                  }}
                  sx={{ minWidth: 200, fontWeight: 600, fontSize: 13.5, borderRadius: 2 }}
                >
                  <MenuItem value="NotPicked">Not Picked</MenuItem>
                  <MenuItem value="PickupScheduled">Pickup Scheduled</MenuItem>
                  <MenuItem value="Picked">Picked</MenuItem>
                  <MenuItem value="InTransit">In Transit</MenuItem>
                  <MenuItem value="Received">Received</MenuItem>
                </Select>
              </Box>
            )}

            {/* Refund — only once THIS batch's item is received */}
            {ret.pickupStatus === "Received" && (
              <Box>
                <Typography fontSize={11.5} fontWeight={600} color="text.secondary" textTransform="uppercase" mb={0.75}>
                  Refund Status
                </Typography>
                <Select
                  value={ret.refundStatus}
                  size="small"
                  onChange={async (e) => {
                    await fetch(`${API_URL}/orders/admin/refund/${order._id}/${ret._id}`, {
                      method: "PUT",
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                      },
                      body: JSON.stringify({ refundStatus: e.target.value }),
                    });
                    fetchOrder();
                  }}
                  sx={{ minWidth: 200, fontWeight: 600, fontSize: 13.5, borderRadius: 2 }}
                >
                  <MenuItem value="None">None</MenuItem>
                  <MenuItem value="Pending">Pending</MenuItem>
                  <MenuItem value="Completed">Completed</MenuItem>
                </Select>

                {ret.refundAmount > 0 && (
                  <Typography fontSize={13.5} color="success.main" fontWeight={700} mt={1}>
                    Refund Amount: ₹{ret.refundAmount.toLocaleString("en-IN")}
                  </Typography>
                )}
              </Box>
            )}
          </Stack>
        </SectionCard>
      ))
    )}
  </Stack>
)}
      </Container>
    </Box>
  );
}