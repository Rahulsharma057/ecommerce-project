"use client";
import { API_URL } from "@/lib/api";
import { useEffect, useState } from "react";
import {
  Container, Typography, Paper, Table, TableBody, TableCell,
  TableHead, TableRow, Select, MenuItem, TextField, Button,
  Dialog, DialogTitle, DialogContent, DialogActions,
  Stack, Box, Chip, TableContainer, TablePagination,
  Divider, Avatar, IconButton, Tooltip, ToggleButton, ToggleButtonGroup,
} from "@mui/material";
import Link from "next/link";
import VisibilityIcon               from "@mui/icons-material/Visibility";
import SearchIcon                   from "@mui/icons-material/Search";
import CancelOutlinedIcon           from "@mui/icons-material/CancelOutlined";
import AssignmentReturnOutlinedIcon from "@mui/icons-material/AssignmentReturnOutlined";

{/* ==== Helper: status chip ==== */}
const StatusChip = ({ value, colorMap }) => {
  const c = colorMap[value] || { bg: "#f1f5f9", color: "#475569", dot: "#94a3b8" };
  return (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 0.7,
        bgcolor: c.bg,
        color: c.color,
        fontWeight: 600,
        fontSize: 12,
        px: 1.2,
        py: 0.5,
        borderRadius: 999,
        lineHeight: 1,
        whiteSpace: "nowrap",
      }}
    >
      <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: c.dot, flexShrink: 0 }} />
      {value}
    </Box>
  );
};

{/* ==== Color maps ==== */}
const ORDER_STATUS_COLOR = {
  Pending:   { bg: "#fff7ed", color: "#c2410c", dot: "#f97316" },
  Shipped:   { bg: "#eff6ff", color: "#1d4ed8", dot: "#3b82f6" },
  Delivered: { bg: "#f0fdf4", color: "#15803d", dot: "#22c55e" },
  Cancelled: { bg: "#fef2f2", color: "#b91c1c", dot: "#ef4444" },
};

const RETURN_STATUS_COLOR = {
  None:      { bg: "#f1f5f9", color: "#475569", dot: "#94a3b8" },
  Requested: { bg: "#fefce8", color: "#a16207", dot: "#eab308" },
  Approved:  { bg: "#eff6ff", color: "#1d4ed8", dot: "#3b82f6" },
  Rejected:  { bg: "#fef2f2", color: "#b91c1c", dot: "#ef4444" },
  Refunded:  { bg: "#f0fdf4", color: "#15803d", dot: "#22c55e" },
};

const PICKUP_STATUS_COLOR = {
  NotPicked: { bg: "#f1f5f9", color: "#475569", dot: "#94a3b8" },
  Picked:    { bg: "#fefce8", color: "#a16207", dot: "#eab308" },
  InTransit: { bg: "#eff6ff", color: "#1d4ed8", dot: "#3b82f6" },
  Received:  { bg: "#f0fdf4", color: "#15803d", dot: "#22c55e" },
};

const REFUND_STATUS_COLOR = {
  None:      { bg: "#f1f5f9", color: "#475569", dot: "#94a3b8" },
  Pending:   { bg: "#fff7ed", color: "#c2410c", dot: "#f97316" },
  Completed: { bg: "#f0fdf4", color: "#15803d", dot: "#22c55e" },
};

{/* ==== Select style (clean, visible) ==== */}
const inlineSel = {
  minWidth: 130,
  fontSize: 12.5,
  fontWeight: 600,
  bgcolor: "#fff",
  borderRadius: 2,
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "#e2e8f0",
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "#cbd5e1",
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "#6366f1",
    borderWidth: 1.5,
  },
  "& .MuiSelect-select": {
    py: 0.9,
    px: 1.2,
    display: "flex",
    alignItems: "center",
  },
  "&.Mui-disabled": {
    bgcolor: "#f8fafc",
  },
};

{/* ==== Action icon button style ==== */}
const actionBtn = (bg, color, hover) => ({
  width: 30,
  height: 30,
  bgcolor: bg,
  color,
  borderRadius: 2,
  "&:hover": { bgcolor: hover },
  "&.Mui-disabled": { opacity: 0.4 },
});



const TH = { fontWeight: 700, fontSize: 11, color: "#999", py: 1.4, whiteSpace: "nowrap", letterSpacing: 0.3 };

const STATUS_FILTERS = ["All", "Pending", "Shipped", "Delivered", "Cancelled"];

// ────────────────────────────────────────────────────────────────────────────
export default function AdminOrders() {
  const [orders,               setOrders]               = useState([]);
  const [search,               setSearch]               = useState("");
  const [statusFilter,         setStatusFilter]         = useState("All");
  const [open,                 setOpen]                 = useState(false);
  const [reason,               setReason]               = useState("");
  const [selectedOrder,        setSelectedOrder]        = useState(null);
  const [returnOpen,           setReturnOpen]           = useState(false);
  const [returnReason,         setReturnReason]         = useState("");
  const [selectedReturnOrder,  setSelectedReturnOrder]  = useState(null);
  const [page,                 setPage]                 = useState(0);
  const [rowsPerPage,          setRowsPerPage]          = useState(10);

  const fetchOrders = async () => {
    const res  = await fetch(`${API_URL}/orders/admin/all`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    const data = await res.json();
    setOrders(Array.isArray(data) ? data : []);
  };
  useEffect(() => { fetchOrders(); }, []);

  const updateStatus       = async (id, status)        => { await fetch(`${API_URL}/orders/admin/${id}`,                   { method:"PUT", headers:{ "Content-Type":"application/json", Authorization:`Bearer ${localStorage.getItem("token")}` }, body: JSON.stringify({ status }) }); fetchOrders(); };
  const updateReturnStatus = async (id, status)        => { await fetch(`${API_URL}/orders/admin/return/${id}`,             { method:"PUT", headers:{ "Content-Type":"application/json", Authorization:`Bearer ${localStorage.getItem("token")}` }, body: JSON.stringify({ status }) }); fetchOrders(); };
  const updatePickupStatus = async (id, pickupStatus)  => { await fetch(`${API_URL}/orders/admin/return/pickup/${id}`,      { method:"PUT", headers:{ "Content-Type":"application/json", Authorization:`Bearer ${localStorage.getItem("token")}` }, body: JSON.stringify({ pickupStatus }) }); fetchOrders(); };
  const updateRefundStatus = async (id, refundStatus)  => { await fetch(`${API_URL}/orders/admin/refund/${id}`,             { method:"PUT", headers:{ "Content-Type":"application/json", Authorization:`Bearer ${localStorage.getItem("token")}` }, body: JSON.stringify({ refundStatus }) }); fetchOrders(); };

  const filtered = (orders || []).filter((o) =>
    (o?._id?.toLowerCase().includes(search.toLowerCase()) ||
     o?.userId?.name?.toLowerCase().includes(search.toLowerCase())) &&
    (statusFilter === "All" || o?.status === statusFilter)
  );
  const paginated = filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  const counts    = STATUS_FILTERS.reduce((a, s) => ({ ...a, [s]: s === "All" ? orders.length : orders.filter(o => o.status === s).length }), {});

  return (
<Box sx={{ bgcolor:"#f4f6f9", minHeight:"100vh" }}>
      <Container >

        {/* HEADER */}
  <Box sx={{ mb: 3,mt:2 }}>
  <Typography variant="h5" fontWeight={800} sx={{ letterSpacing: "-0.5px" }}>
    Orders Management
  </Typography>

  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 ,ml:1}}>
    {filtered.length} of {orders.length} total orders
  </Typography>
</Box>

      {/* Search */}
<Box mb={1}>
<Paper
  elevation={0}
  sx={{
    p: 1.2,
    mb: 1.5,
    display: "flex",
    alignItems: "center",
    gap: 1,
    borderRadius: 3,
    bgcolor: "rgba(255,255,255,0.8)",
    backdropFilter: "blur(10px)",
    border: "1px solid #e8ecf3",
  }}
>
  <SearchIcon sx={{ color: "#94a3b8" }} />

  <TextField
    fullWidth
    variant="standard"
    placeholder="Search orders, customer..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    InputProps={{
      disableUnderline: true,
      sx: { fontSize: 14 },
    }}
  />
</Paper>
</Box>

{/* Filters */}
<Box mb={2}>
<Paper
  elevation={0}
  sx={{
    p: 1,
    mb: 2,
    borderRadius: 3,
    border: "1px solid #e8ecf3",
    bgcolor: "#fff",
  }}
>
    <ToggleButtonGroup
      value={statusFilter}
      exclusive
      onChange={(_, v) => {
        if (v) {
          setStatusFilter(v);
          setPage(0);
        }
      }}
      sx={{
        flexWrap: "wrap",
        gap: 1,

        "& .MuiToggleButton-root": {
          border: "none",
          borderRadius: 2,
          px: 2,
          py: 1,
          textTransform: "none",
          fontWeight: 600,
          color: "#555",

          "&.Mui-selected": {
            bgcolor: "#293245",
            color: "#fff",

            "&:hover": {
              bgcolor: "#424a60",
            },
          },
        },
      }}
    >
      {STATUS_FILTERS.map((s) => (
        <ToggleButton key={s} value={s}>
          {s}
          <Chip
            label={counts[s]}
            size="small"
            sx={{
              ml: 1,
              height: 20,
              fontSize: 11,
              bgcolor:
                statusFilter === s
                  ? "rgba(255,255,255,.2)"
                  : "#EEF2FF",
              color:
                statusFilter === s
                  ? "#fff"
                  : "#343d50",
            }}
          />
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  </Paper>
</Box>

        {/* TABLE */}
        <Paper elevation={0} sx={{mb:2, border:"1px solid #e3e6ea", borderRadius:3, overflow:"hidden" }}>
  <TableContainer
  sx={{
    overflowX: "auto",
    width: "100%",
    maxWidth: "100%",
  }}
>
<Table
  sx={{
    minWidth: 1400,
    width: "100%",
    tableLayout: "fixed",
    "& td:last-child, & th:last-child": {
      position: "sticky",
      right: 0,
      zIndex: 50,
      backgroundColor: "#fff",
    },
  }}
>

   <TableHead>
<TableRow
  sx={{
    bgcolor: "#f9fafb",
    "& th": {
      fontSize: 11,
      fontWeight: 700,
      color: "#64748b",
      letterSpacing: 0.5,
      textTransform: "uppercase",
    },
  }}
>
    {/* ORDER */}
    <TableCell
      sx={{

        zIndex: 20,
        minWidth: 130,
      }}
    >
      Order ID
    </TableCell>

    {/* CUSTOMER */}
    <TableCell
      sx={{
        minWidth: 180,
      }}
    >
      Customer
    </TableCell>

    {/* AMOUNT */}
    <TableCell
      align="center"
      sx={{
        minWidth: 120,
      }}
    >
      Amount
    </TableCell>

    {/* ORDER STATUS */}
    <TableCell
      align="center"
      sx={{
        minWidth: 170,
      }}
    >
      Order Status
    </TableCell>

    {/* RETURN STATUS */}
    <TableCell
      align="center"
      sx={{
        minWidth: 170,
      }}
    >
      Return Status
    </TableCell>

    {/* PICKUP */}
    <TableCell
      align="center"
      sx={{
        minWidth: 160,
      }}
    >
      Pickup Status
    </TableCell>

    {/* REFUND */}
    <TableCell
      align="center"
      sx={{
        minWidth: 150,
      }}
    >
      Refund Status
    </TableCell>

    {/* ADMIN NOTE */}
    <TableCell
      sx={{
        minWidth: 220,
      }}
    >
      Admin Note
    </TableCell>

    {/* ACTION */}
  <TableCell
  align="center"
  sx={{
    minWidth: 140,
    position: "sticky",
    right: 0,
    zIndex: 50,
    bgcolor: "#F8FAFC",
  }}
>
  Actions
</TableCell>
  </TableRow>
</TableHead>

       <TableBody>
  {paginated.length === 0 && (
    <TableRow>
      <TableCell colSpan={9} align="center" sx={{ py: 8, color: "#94a3b8", fontSize: 13 }}>
        No orders found.
      </TableCell>
    </TableRow>
  )}

  {paginated.map((order, i) => {
    const rowBg = i % 2 === 0 ? "#fff" : "#fcfcfd";
    return (
      <TableRow
        key={order._id}
        hover
        sx={{
          "&:hover td": { bgcolor: "#f1f5ff !important" },
          "& td": { borderBottom: "1px solid #f1f5f9" },
        }}
      >
        {/* ORDER ID */}
        <TableCell sx={{ py: 1.4 }}>
          <Typography
            variant="caption"
            sx={{
              fontFamily: "monospace",
              fontWeight: 700,
              fontSize: 12,
              color: "#334155",
              bgcolor: "#f1f5f9",
              px: 1,
              py: 0.4,
              borderRadius: 1.5,
              display: "inline-block",
            }}
          >
            #{order._id.slice(-6).toUpperCase()}
          </Typography>
        </TableCell>

        {/* CUSTOMER */}
        <TableCell sx={{ py: 1.4 }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Avatar
              sx={{
                width: 26,
                height: 26,
                bgcolor: "#18181b",
                fontSize: 11,
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              {(order.userId?.name?.[0] || "U").toUpperCase()}
            </Avatar>
            <Typography variant="body2" fontWeight={600} noWrap sx={{ maxWidth: 110, color: "#1e293b" }}>
              {order.userId?.name || "Unknown"}
            </Typography>
          </Stack>
        </TableCell>

        {/* AMOUNT */}
        <TableCell sx={{ py: 1.4 }}>
          <Typography variant="body2" fontWeight={700} noWrap sx={{ color: "#0f172a" }}>
            ₹{order.totalAmount?.toLocaleString()}
          </Typography>
        </TableCell>

        {/* ORDER STATUS */}
        <TableCell sx={{ py: 1.4 }}>
          <Select
            value={order.status}
            size="small"
            sx={inlineSel}
            onChange={(e) => updateStatus(order._id, e.target.value)}
            renderValue={(v) => <StatusChip value={v} colorMap={ORDER_STATUS_COLOR} />}
          >
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Shipped">Shipped</MenuItem>
            <MenuItem value="Delivered">Delivered</MenuItem>
            <MenuItem value="Cancelled">Cancelled</MenuItem>
          </Select>
        </TableCell>

        {/* RETURN */}
        <TableCell sx={{ py: 1.4 }}>
          <Select
            size="small"
            value={order.returnStatus || "None"}
            sx={inlineSel}
            onChange={(e) => {
              if (order.returnStatus === "Refunded") return;
              updateReturnStatus(order._id, e.target.value);
            }}
            renderValue={(v) => <StatusChip value={v} colorMap={RETURN_STATUS_COLOR} />}
          >
            <MenuItem value="None">No Return</MenuItem>
            <MenuItem value="Requested">Requested</MenuItem>
            <MenuItem value="Approved">Approved</MenuItem>
            <MenuItem value="Rejected">Rejected</MenuItem>
            <MenuItem value="Refunded">Refunded</MenuItem>
          </Select>
        </TableCell>

        {/* PICKUP */}
        <TableCell sx={{ py: 1.4 }}>
          <Select
            size="small"
            value={order.returnPickupStatus}
            sx={inlineSel}
            disabled={order.returnStatus !== "Approved"}
            onChange={(e) => updatePickupStatus(order._id, e.target.value)}
            renderValue={(v) => <StatusChip value={v} colorMap={PICKUP_STATUS_COLOR} />}
          >
            <MenuItem value="NotPicked">Not Picked</MenuItem>
            <MenuItem value="Picked">Picked</MenuItem>
            <MenuItem value="InTransit">In Transit</MenuItem>
            <MenuItem value="Received">Received</MenuItem>
          </Select>
        </TableCell>

        {/* REFUND */}
        <TableCell sx={{ py: 1.4 }}>
          <Select
            size="small"
            value={order.refundStatus}
            sx={inlineSel}
            disabled={order.returnPickupStatus !== "Received"}
            onChange={(e) => updateRefundStatus(order._id, e.target.value)}
            renderValue={(v) => <StatusChip value={v} colorMap={REFUND_STATUS_COLOR} />}
          >
            <MenuItem value="None">None</MenuItem>
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Completed">Completed</MenuItem>
          </Select>
        </TableCell>

        {/* NOTE */}
        <TableCell sx={{ py: 1.4 }}>
          <Typography
            variant="caption"
            color="text.secondary"
            noWrap
            sx={{ maxWidth: 120, display: "block" }}
          >
            {order.adminNote || "—"}
          </Typography>
        </TableCell>

        {/* ACTIONS — sticky right */}
        <TableCell
          align="center"
          sx={{
            minWidth: 140,
            position: "sticky",
            right: 0,
            zIndex: 2,
            bgcolor: rowBg,
            boxShadow: "-6px 0 10px rgba(0,0,0,0.05)",
            py: 1.4,
          }}
        >
          <Stack direction="row" spacing={0.7} justifyContent="center">
            <Tooltip title="View Order" arrow>
              <Link href={`/admin/orders/${order._id}`}>
                <IconButton size="small" sx={actionBtn("#eef2ff", "#4338ca", "#e0e7ff")}>
                  <VisibilityIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </Link>
            </Tooltip>

            <Tooltip title="Cancel Order" arrow>
              <span>
                <IconButton
                  size="small"
                  sx={actionBtn("#fff1f2", "#ef4444", "#ffe4e6")}
                  onClick={() => { setSelectedOrder(order); setOpen(true); }}
                  disabled={order.status === "Cancelled" || order.status === "Delivered"}
                >
                  <CancelOutlinedIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </span>
            </Tooltip>

            <Tooltip title="Return Request" arrow>
              <span>
                <IconButton
                  size="small"
                  sx={actionBtn("#fff7ed", "#f59e0b", "#ffedd5")}
                  onClick={() => { setSelectedReturnOrder(order); setReturnOpen(true); }}
                  disabled={order.returnStatus !== "Requested"}
                >
                  <AssignmentReturnOutlinedIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </span>
            </Tooltip>
          </Stack>
        </TableCell>
      </TableRow>
    );
  })}
</TableBody>
            </Table>
          </TableContainer>

          <Divider />
          <TablePagination
            component="div"
            count={filtered.length}
            page={page}
            onPageChange={(_, p) => setPage(p)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value,10)); setPage(0); }}
            rowsPerPageOptions={[5,10,25,50]}
            sx={{ fontSize:12, "& .MuiTablePagination-toolbar":{ minHeight:44 } }}
          />
        </Paper>
      </Container>

      {/* ── CANCEL DIALOG ── */}
      <Dialog open={open} onClose={() => setOpen(false)} PaperProps={{ sx:{ borderRadius:3, minWidth:400 } }}>
        <DialogTitle sx={{ fontWeight:700, fontSize:15, pb:1 }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <CancelOutlinedIcon color="error" fontSize="small" />
            <span>Cancel Order</span>
          </Stack>
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ pt:2 }}>
          {selectedOrder && (
            <Box sx={{ bgcolor:"#f7f8fa", borderRadius:2, px:1.5, py:1, mb:2 }}>
              <Typography variant="caption" color="text.secondary">Order ID</Typography>
              <Typography fontWeight={700} fontFamily="monospace" fontSize={13}>
                #{selectedOrder._id.slice(-6).toUpperCase()}
              </Typography>
            </Box>
          )}
          <TextField fullWidth multiline rows={3} label="Reason for cancellation" value={reason}
            onChange={(e) => setReason(e.target.value)}
            sx={{ "& .MuiOutlinedInput-root":{ borderRadius:2 } }} />
        </DialogContent>
        <DialogActions sx={{ px:2.5, pb:2, pt:1 }}>
          <Button onClick={() => setOpen(false)} sx={{ textTransform:"none", color:"#666" }}>Close</Button>
          <Button color="error" variant="contained" sx={{ textTransform:"none", fontWeight:700, borderRadius:2, px:2.5 }}
            onClick={async () => {
              if (!selectedOrder?._id) return;
              await fetch(`${API_URL}/orders/cancel/${selectedOrder._id}`, {
                method:"PUT",
                headers:{ "Content-Type":"application/json", Authorization:`Bearer ${localStorage.getItem("token")}` },
                body: JSON.stringify({ reason }),
              });
              setOpen(false); setReason(""); setSelectedOrder(null); fetchOrders();
            }}>
            Confirm Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── RETURN DIALOG ── */}
      <Dialog open={returnOpen} onClose={() => setReturnOpen(false)} PaperProps={{ sx:{ borderRadius:3, minWidth:420 } }}>
        <DialogTitle sx={{ fontWeight:700, fontSize:15, pb:1 }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <AssignmentReturnOutlinedIcon color="warning" fontSize="small" />
            <span>Return Approval</span>
          </Stack>
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ pt:2 }}>
          {selectedReturnOrder && (
            <Box sx={{ bgcolor:"#f7f8fa", borderRadius:2, px:1.5, py:1, mb:2 }}>
              <Typography variant="caption" color="text.secondary">Order ID</Typography>
              <Typography fontWeight={700} fontFamily="monospace" fontSize={13}>
                #{selectedReturnOrder._id.slice(-6).toUpperCase()}
              </Typography>
            </Box>
          )}
          <TextField fullWidth multiline rows={3} label="Admin Note (optional)" value={returnReason}
            onChange={(e) => setReturnReason(e.target.value)}
            sx={{ "& .MuiOutlinedInput-root":{ borderRadius:2 } }} />
        </DialogContent>
        <DialogActions sx={{ px:2.5, pb:2, pt:1 }}>
          <Button onClick={() => setReturnOpen(false)} sx={{ textTransform:"none", color:"#666" }}>Close</Button>
          <Button color="error" variant="outlined" sx={{ textTransform:"none", fontWeight:700, borderRadius:2 }}
            disabled={!selectedReturnOrder||selectedReturnOrder.returnStatus!=="Requested"}
            onClick={async () => {
              if (!selectedReturnOrder?._id) return;
              await fetch(`${API_URL}/orders/admin/return/${selectedReturnOrder._id}`, {
                method:"PUT",
                headers:{ "Content-Type":"application/json", Authorization:`Bearer ${localStorage.getItem("token")}` },
                body: JSON.stringify({ status:"Rejected", adminNote:"Return rejected by admin" }),
              });
              setReturnOpen(false); setSelectedReturnOrder(null); fetchOrders();
            }}>
            Reject
          </Button>
          <Button color="warning" variant="contained" sx={{ textTransform:"none", fontWeight:700, borderRadius:2, px:2.5 }}
            disabled={!selectedReturnOrder||selectedReturnOrder.returnStatus!=="Requested"}
            onClick={async () => {
              if (!selectedReturnOrder?._id) return;
              await fetch(`${API_URL}/orders/admin/return/${selectedReturnOrder._id}`, {
                method:"PUT",
                headers:{ "Content-Type":"application/json", Authorization:`Bearer ${localStorage.getItem("token")}` },
                body: JSON.stringify({ status:"Approved", adminNote:returnReason }),
              });
              setReturnOpen(false); setReturnReason(""); setSelectedReturnOrder(null); fetchOrders();
            }}>
            Approve
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}