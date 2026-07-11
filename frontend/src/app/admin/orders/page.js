"use client";
import { API_URL } from "@/lib/api";
import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Stack,
  Box,
  Chip,
  TableContainer,
  TablePagination,
  Divider,
  Avatar,
  IconButton,
  Tooltip,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import Link from "next/link";
import VisibilityIcon from "@mui/icons-material/Visibility";
import SearchIcon from "@mui/icons-material/Search";

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

const ORDER_STATUS_COLOR = {
  Pending: { bg: "#fff7ed", color: "#c2410c", dot: "#f97316" },
  Confirmed: { bg: "#f5f3ff", color: "#6d28d9", dot: "#8b5cf6" },
  Shipped: { bg: "#eff6ff", color: "#1d4ed8", dot: "#3b82f6" },
  Delivered: { bg: "#f0fdf4", color: "#15803d", dot: "#22c55e" },
  Cancelled: { bg: "#fef2f2", color: "#b91c1c", dot: "#ef4444" },
};

const RETURN_STATUS_COLOR = {
  None: { bg: "#f1f5f9", color: "#475569", dot: "#94a3b8" },
  Requested: { bg: "#fefce8", color: "#a16207", dot: "#eab308" },
  Approved: { bg: "#eff6ff", color: "#1d4ed8", dot: "#3b82f6" },
  Rejected: { bg: "#fef2f2", color: "#b91c1c", dot: "#ef4444" },
  Returned: { bg: "#f5f3ff", color: "#6d28d9", dot: "#8b5cf6" },
  Refunded: { bg: "#f0fdf4", color: "#15803d", dot: "#22c55e" },
};

const actionBtn = (bg, color, hover) => ({
  width: 32,
  height: 32,
  bgcolor: bg,
  color,
  borderRadius: 2,
  "&:hover": { bgcolor: hover },
});

const STATUS_FILTERS = ["All", "Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const fetchOrders = async () => {
    const res = await fetch(`${API_URL}/orders/admin/all`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    const data = await res.json();
    setOrders(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filtered = (orders || []).filter(
    (o) =>
      (o?._id?.toLowerCase().includes(search.toLowerCase()) ||
        o?.userId?.name?.toLowerCase().includes(search.toLowerCase())) &&
      (statusFilter === "All" || o?.status === statusFilter),
  );

  const paginated = filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const counts = STATUS_FILTERS.reduce(
    (acc, s) => ({
      ...acc,
      [s]: s === "All" ? orders.length : orders.filter((o) => o.status === s).length,
    }),
    {},
  );

  return (
    <Box sx={{ bgcolor: "#f4f6f9", minHeight: "100vh" }}>
      <Container>
        {/* HEADER */}
        <Box sx={{ mb: 3, mt: 2 }}>
          <Typography variant="h5" fontWeight={800} sx={{ letterSpacing: "-0.5px" }}>
            Orders Management
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, ml: 0.5 }}>
            {filtered.length} of {orders.length} total orders
          </Typography>
        </Box>

        {/* SEARCH */}
        <Paper
          elevation={0}
          sx={{
            p: 1.2,
            mb: 1.5,
            display: "flex",
            alignItems: "center",
            gap: 1,
            borderRadius: 3,
            bgcolor: "#fff",
            border: "1px solid #e8ecf3",
          }}
        >
          <SearchIcon sx={{ color: "#94a3b8" }} />
          <TextField
            fullWidth
            variant="standard"
            placeholder="Search orders, customer..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
            }}
            InputProps={{ disableUnderline: true, sx: { fontSize: 14 } }}
          />
        </Paper>

        {/* FILTERS */}
        <Paper
          elevation={0}
          sx={{ p: 1, mb: 2, borderRadius: 3, border: "1px solid #e8ecf3", bgcolor: "#fff" }}
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
                  bgcolor: "#18181b",
                  color: "#fff",
                  "&:hover": { bgcolor: "#27272a" },
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
                    bgcolor: statusFilter === s ? "rgba(255,255,255,.2)" : "#eef2ff",
                    color: statusFilter === s ? "#fff" : "#343d50",
                  }}
                />
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Paper>

        {/* TABLE — read-only, status display only */}
        <Paper elevation={0} sx={{ mb: 2, border: "1px solid #e3e6ea", borderRadius: 3, overflow: "hidden" }}>
          <TableContainer sx={{ overflowX: "auto" }}>
            <Table sx={{ minWidth: 900 }}>
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
                  <TableCell>Order ID</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell align="center">Amount</TableCell>
                  <TableCell align="center">Order Status</TableCell>
                  <TableCell align="center">Return Status</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell align="center">Action</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {paginated.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 8, color: "#94a3b8", fontSize: 13 }}>
                      No orders found.
                    </TableCell>
                  </TableRow>
                )}

                {paginated.map((order) => (
                  <TableRow
                    key={order._id}
                    hover
                    sx={{
                      "&:hover td": { bgcolor: "#f8fafc" },
                      "& td": { borderBottom: "1px solid #f1f5f9" },
                    }}
                  >
                    <TableCell sx={{ py: 1.6 }}>
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

                    <TableCell sx={{ py: 1.6 }}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Avatar
                          sx={{
                            width: 26,
                            height: 26,
                            bgcolor: "#18181b",
                            fontSize: 11,
                            fontWeight: 700,
                          }}
                        >
                          {(order.userId?.name?.[0] || "U").toUpperCase()}
                        </Avatar>
                        <Typography variant="body2" fontWeight={600} noWrap sx={{ maxWidth: 130, color: "#1e293b" }}>
                          {order.userId?.name || "Unknown"}
                        </Typography>
                      </Stack>
                    </TableCell>

                    <TableCell align="center" sx={{ py: 1.6 }}>
                      <Typography variant="body2" fontWeight={700} sx={{ color: "#0f172a" }}>
                        ₹{(order.totalAmount || 0).toLocaleString()}
                      </Typography>
                    </TableCell>

                    <TableCell align="center" sx={{ py: 1.6 }}>
                      <StatusChip value={order.status} colorMap={ORDER_STATUS_COLOR} />
                    </TableCell>

                   {/* RETURN */}
<TableCell align="center" sx={{ py: 1.6 }}>
  {(() => {
    const pendingCount = (order.returns || []).filter((r) => r.status === "Requested").length;
    const totalCount = (order.returns || []).length;

    if (totalCount === 0) {
      return <StatusChip value="None" colorMap={RETURN_STATUS_COLOR} />;
    }

    return (
      <Chip
        label={pendingCount > 0 ? `${pendingCount} pending · ${totalCount} total` : `${totalCount} return(s)`}
        size="small"
        sx={{
          fontWeight: 600,
          fontSize: 11.5,
          bgcolor: pendingCount > 0 ? "#fefce8" : "#f1f5f9",
          color: pendingCount > 0 ? "#a16207" : "#475569",
        }}
      />
    );
  })()}
</TableCell>

                    <TableCell sx={{ py: 1.6 }}>
                      <Typography variant="body2" sx={{ color: "#64748b", fontSize: 12.5 }}>
                        {new Date(order.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </Typography>
                    </TableCell>

                    <TableCell align="center" sx={{ py: 1.6 }}>
                      <Tooltip title="View & Manage Order" arrow>
                        <Link href={`/admin/orders/${order._id}`}>
                          <IconButton size="small" sx={actionBtn("#eef2ff", "#4338ca", "#e0e7ff")}>
                            <VisibilityIcon sx={{ fontSize: 16 }} />
                          </IconButton>
                        </Link>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
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
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
            rowsPerPageOptions={[5, 10, 25, 50]}
            sx={{ fontSize: 12, "& .MuiTablePagination-toolbar": { minHeight: 44 } }}
          />
        </Paper>
      </Container>
    </Box>
  );
}