"use client";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Stack,
  Divider,
  Box,
  Tabs,
  Tab,
  Avatar,
  TextField,
  InputAdornment,
  IconButton,
  Button,
  Paper,
  Select,
  MenuItem,
  Chip,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import InboxOutlinedIcon from "@mui/icons-material/InboxOutlined";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import UndoIcon from "@mui/icons-material/Undo";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import SwapVertRoundedIcon from "@mui/icons-material/SwapVertRounded";
import FilterListRoundedIcon from "@mui/icons-material/FilterListRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { API_URL } from "@/lib/api";

// Whole theme is monochrome now — every accent that used to be the cream/gold
// (#C9A96E) is plain black, kept light everywhere else per the brief.
const DARK = "#18181b";

const STATUS_STYLES = {
  Pending: { bg: "#fffbeb", text: "#d97706" },
  Confirmed: { bg: "#eff6ff", text: "#2563eb" },
  Shipped: { bg: "#eef2ff", text: "#4f46e5" },
  Delivered: { bg: "#f0fdf4", text: "#16a34a" },
  Cancelled: { bg: "#fef2f2", text: "#dc2626" },
};

// Real e-commerce apps (Myntra/Amazon/Flipkart) split orders this way —
// broad enough to be scannable, granular enough to actually be useful.
const TAB_CONFIG = [
  { label: "All Orders", short: "All", match: () => true },
  { label: "Processing", short: "Processing", match: (o) => ["Pending", "Confirmed"].includes(o.status) },
  { label: "Shipped", short: "Shipped", match: (o) => o.status === "Shipped" },
  { label: "Delivered", short: "Delivered", match: (o) => o.status === "Delivered" },
  { label: "Returns", short: "Returns", match: (o) => o.returnStatus && o.returnStatus !== "None" },
  { label: "Cancelled", short: "Cancelled", match: (o) => o.status === "Cancelled" },
];

const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "price_high", label: "Price: High to Low" },
  { value: "price_low", label: "Price: Low to High" },
];

function timeAgo(dateStr) {
  if (!dateStr) return "";
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (days <= 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months > 1 ? "s" : ""} ago`;
  const years = Math.floor(months / 12);
  return `${years} year${years > 1 ? "s" : ""} ago`;
}

// Skeleton row used while orders are loading, instead of a bare "Loading..."
// line — keeps the layout from jumping once real cards render in.
function OrderCardSkeleton() {
  return (
    <Card variant="outlined" sx={{ borderRadius: 2.5, borderColor: "#e4e4e7", boxShadow: "none" }}>
      <Box sx={{ p: { xs: 1.75, sm: 2 }, display: "flex", alignItems: "center", gap: { xs: 1.5, sm: 2 } }}>
        <Box sx={{ width: { xs: 50, sm: 58 }, height: { xs: 50, sm: 58 }, borderRadius: 2, bgcolor: "#f4f4f5", flexShrink: 0 }} />
        <Box sx={{ flex: 1 }}>
          <Box sx={{ height: 14, width: "60%", borderRadius: 1, bgcolor: "#f4f4f5", mb: 1 }} />
          <Box sx={{ height: 11, width: "40%", borderRadius: 1, bgcolor: "#f4f4f5" }} />
        </Box>
        <Box sx={{ height: 18, width: 60, borderRadius: 1, bgcolor: "#f4f4f5", flexShrink: 0 }} />
      </Box>
    </Card>
  );
}

export default function OrdersPage() {
  const [search, setSearch] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState(0);
  const [sortBy, setSortBy] = useState("newest");
  const [filterOpen, setFilterOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_URL}/orders/my`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  };

  // Search matches order id AND product names inside the order — closer
  // to how people actually try to find an order ("that blue jacket order").
  const searchedOrders = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return orders;
    return (orders || []).filter((order) => {
      const idMatch = order._id.toLowerCase().includes(q);
      const itemMatch = (order.items || []).some((item) =>
        item.name?.toLowerCase().includes(q),
      );
      return idMatch || itemMatch;
    });
  }, [orders, search]);

  const tabCounts = TAB_CONFIG.map(
    (t) => searchedOrders.filter((o) => t.match(o)).length,
  );

  const sortedTabOrders = useMemo(() => {
    const filtered = searchedOrders.filter((o) => TAB_CONFIG[tab].match(o));
    const arr = [...filtered];
    switch (sortBy) {
      case "oldest":
        arr.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case "price_high":
        arr.sort((a, b) => (b.totalAmount || 0) - (a.totalAmount || 0));
        break;
      case "price_low":
        arr.sort((a, b) => (a.totalAmount || 0) - (b.totalAmount || 0));
        break;
      default:
        arr.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    return arr;
  }, [searchedOrders, tab, sortBy]);

  // Quick glance stats — mirrors the "orders / in transit / delivered"
  // strip real order-history pages show above the list.
  const stats = useMemo(() => {
    const inTransit = orders.filter((o) =>
      ["Confirmed", "Shipped"].includes(o.status),
    ).length;
    const delivered = orders.filter((o) => o.status === "Delivered").length;
    return { total: orders.length, inTransit, delivered };
  }, [orders]);

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 1.5, sm: 3, md: 3 }, px: { xs: 1.5, sm: 3 } }}>
      {/* HEADER */}
      <Box sx={{ mb: { xs: 2, sm: 2.5 } }}>
        <Stack direction="row" alignItems="center" gap={{ xs: 1, sm: 1.5 }}>
          <Button
            onClick={() => router.back()}
            sx={{
              minWidth: { xs: 36, sm: 40 },
              width: { xs: 36, sm: 40 },
              height: { xs: 36, sm: 40 },
              borderRadius: 2,
              color: DARK,
              border: "1px solid #e4e4e7",
              flexShrink: 0,
              "&:hover": { borderColor: DARK, bgcolor: "#f4f4f5" },
            }}
          >
            <ArrowBackIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />
          </Button>

          <Box sx={{ minWidth: 0 }}>
            <Typography
              sx={{
                fontSize: { xs: 18, sm: 22 },
                fontWeight: 700,
                color: DARK,
                lineHeight: 1.2,
              }}
            >
              My Orders
            </Typography>
            <Typography
              sx={{
                fontSize: { xs: 12, sm: 13.5 },
                color: "#71717a",
                mt: 0.3,
                display: { xs: "none", sm: "block" },
              }}
            >
              Track, manage and view all your orders in one place
            </Typography>
          </Box>
        </Stack>
      </Box>

      {/* QUICK STATS STRIP — hidden on mobile, shown from sm and up */}
      <Stack
        direction="row"
        spacing={1.25}
        sx={{
          display: { xs: "none", sm: "flex" },
          mb: 2,
          overflowX: "auto",
          pb: 0.5,
          scrollSnapType: "x mandatory",
          "&::-webkit-scrollbar": { display: "none" },
          scrollbarWidth: "none",
        }}
      >
        {[
          { label: "Total Orders", value: stats.total, icon: Inventory2OutlinedIcon },
          { label: "In Transit", value: stats.inTransit, icon: LocalShippingOutlinedIcon },
          { label: "Delivered", value: stats.delivered, icon: CheckCircleOutlineIcon },
        ].map((s) => (
          <Paper
            key={s.label}
            variant="outlined"
            sx={{
              flex: { xs: "0 0 auto", sm: 1 },
              minWidth: { xs: "31%", sm: 140 },
              scrollSnapAlign: "start",
              p: { xs: 1.25, sm: 1.5 },
              borderRadius: 2.5,
              borderColor: "#e4e4e7",
              display: "flex",
              alignItems: "center",
              gap: { xs: 1, sm: 1.25 },
            }}
          >
            <Box
              sx={{
                width: { xs: 30, sm: 34 },
                height: { xs: 30, sm: 34 },
                borderRadius: "50%",
                bgcolor: "#f4f4f5",
                color: DARK,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <s.icon sx={{ fontSize: { xs: 15, sm: 18 } }} />
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <Typography sx={{ fontSize: { xs: 15, sm: 16 }, fontWeight: 700, color: DARK, lineHeight: 1.1 }}>
                {s.value}
              </Typography>
              <Typography
                noWrap
                sx={{ fontSize: { xs: 10, sm: 11 }, color: "#71717a" }}
              >
                {s.label}
              </Typography>
            </Box>
          </Paper>
        ))}
      </Stack>

      {/* SEARCH + SORT — on mobile the sort dropdown is replaced by a
          filter icon button next to search that opens a simple sheet;
          the dropdown stays inline on larger screens where there's room */}
      <Paper
        variant="outlined"
        sx={{
          p: { xs: 0, sm: 1.5 },
          mb: 1,
          borderRadius: 1,
          borderColor:  { xs: "#fdfdfd00", sm: "#ffffff" } ,
          display: "flex",
          flexDirection: "row",
          gap: 1,
          bgcolor:{ xs: "#e4e4e700", sm: "#ffffff" } ,
        }}
      >
        <TextField
          fullWidth
          size="small"
          placeholder="Search by Order ID or product name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchRoundedIcon sx={{ color: "#71717a", fontSize: { xs: 20, sm: 22 } }} />
              </InputAdornment>
            ),
            endAdornment: search && (
              <InputAdornment position="end">
                <IconButton size="small" onClick={() => setSearch("")} sx={{ color: "#71717a" }}>
                  <CloseRoundedIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "14px",
              bgcolor: "#fff",
              fontSize: { xs: "14px", sm: "15px" },
              "& fieldset": { borderColor: "#e4e4e7" },
              "&:hover fieldset": { borderColor: "#a1a1aa" },
              "&.Mui-focused fieldset": { borderColor: DARK, borderWidth: "2px" },
            },
            "& input": { py: { xs: 1.2, sm: 1.4 } },
          }}
        />

        {/* Mobile: filter icon opens the sort sheet */}
        <IconButton
          onClick={() => setFilterOpen(true)}
          sx={{
            display: { xs: "flex", sm: "none" },
            flexShrink: 0,
            width: 40,
            height: 40,
            borderRadius: "12px",
         //   bgcolor: DARK,
            color: "#0a0a0a",
            "&:hover": { bgcolor: "#4d4d4d" },
          }}
        >
          <FilterListRoundedIcon sx={{ fontSize: 20 }} />
        </IconButton>

        {/* Desktop / tablet: inline dropdown */}
        <Select
          size="small"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          IconComponent={SwapVertRoundedIcon}
          sx={{
            display: { xs: "none", sm: "flex" },
            minWidth: 200,
            borderRadius: "14px",
            bgcolor: "#fff",
            fontSize: "14px",
            "& .MuiOutlinedInput-notchedOutline": { borderColor: "#e4e4e7" },
            "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#a1a1aa" },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: DARK,
              borderWidth: "2px",
            },
          }}
        >
          {SORT_OPTIONS.map((opt) => (
            <MenuItem key={opt.value} value={opt.value} sx={{ fontSize: 14 }}>
              {opt.label}
            </MenuItem>
          ))}
        </Select>
      </Paper>

      {/* MOBILE FILTER / SORT SHEET */}
      <Dialog
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        fullWidth
        PaperProps={{
          sx: {
            position: "fixed",
            bottom: 0,
            m: 0,
            width: "100%",
            maxWidth: "100%",
            borderRadius: "20px 20px 0 0",
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 700, color: DARK, fontSize: 16 }}>
          Sort Orders By
        </DialogTitle>
        <DialogContent sx={{ px: 1, pb: 2 }}>
          <List sx={{ py: 0 }}>
            {SORT_OPTIONS.map((opt) => {
              const selected = sortBy === opt.value;
              return (
                <ListItemButton
                  key={opt.value}
                  selected={selected}
                  onClick={() => {
                    setSortBy(opt.value);
                    setFilterOpen(false);
                  }}
                  sx={{
                    borderRadius: 2,
                    mb: 0.5,
                    "&.Mui-selected": { bgcolor: "#f4f4f5" },
                  }}
                >
                  <ListItemText
                    primary={opt.label}
                    primaryTypographyProps={{
                      fontSize: 14.5,
                      fontWeight: selected ? 700 : 500,
                      color: DARK,
                    }}
                  />
                  {selected && <CheckRoundedIcon sx={{ fontSize: 19, color: DARK }} />}
                </ListItemButton>
              );
            })}
          </List>
        </DialogContent>
      </Dialog>

      {/* TABS — short labels below sm so 6 tabs + counts don't fight for
          space on a narrow screen; counts only shown once there's room */}
      <Paper
        variant="outlined"
        sx={{
          borderRadius: 2,
          borderColor: "#e4e4e7",
          mb: { xs: 2, sm: 3 },
          overflow: "hidden",
        }}
      >
        <Tabs
          value={tab}
          onChange={(e, v) => setTab(v)}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          TabIndicatorProps={{ sx: { bgcolor: DARK, height: 2.5 } }}
          sx={{
            minHeight: { xs: 40, sm: 48 },
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 600,
              fontSize: { xs: 12, sm: 13.5 },
              color: "#71717a",
              minHeight: { xs: 40, sm: 48 },
              minWidth: { xs: "auto", sm: 90 },
              px: { xs: 1.25, sm: 2 },
              whiteSpace: "nowrap",
            },
            "& .Mui-selected": { color: `${DARK} !important` },
            "& .MuiTabs-scrollButtons": {
              width: { xs: 24, sm: 40 },
              "&.Mui-disabled": { opacity: 0.3 },
            },
          }}
        >
          {TAB_CONFIG.map((t, i) => (
            <Tab
              key={t.label}
              label={
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.6 }}>
                  <Box component="span" sx={{ display: { xs: "inline", sm: "none" } }}>
                    {t.short}
                  </Box>
                  <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
                    {t.label}
                  </Box>
                  <Box
                    component="span"
                    sx={{
                      fontSize: { xs: 10.5, sm: 11.5 },
                      fontWeight: 700,
                      color: tab === i ? "#fff" : "#71717a",
                      bgcolor: tab === i ? DARK : "#f4f4f5",
                      borderRadius: "999px",
                      minWidth: 18,
                      height: 18,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      px: 0.5,
                    }}
                  >
                    {tabCounts[i]}
                  </Box>
                </Box>
              }
            />
          ))}
        </Tabs>
      </Paper>

      {/* ORDER LIST */}
      {loading ? (
        <Stack spacing={1.5}>
          <OrderCardSkeleton />
          <OrderCardSkeleton />
          <OrderCardSkeleton />
        </Stack>
      ) : sortedTabOrders.length === 0 ? (
        <Card
          variant="outlined"
          sx={{
            borderRadius: 3,
            p: { xs: 3, sm: 4 },
            textAlign: "center",
            bgcolor: "#fafafa",
            borderColor: "#e4e4e7",
            boxShadow: "none",
          }}
        >
          <CardContent sx={{ p: { xs: 1, sm: 2 } }}>
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                bgcolor: "#f4f4f5",
                color: "#71717a",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mx: "auto",
                mb: 2,
              }}
            >
              <InboxOutlinedIcon sx={{ fontSize: 26 }} />
            </Box>
            <Typography fontSize={{ xs: 15.5, sm: 17 }} fontWeight={700} sx={{ color: DARK }}>
              {search ? "No matching orders" : `No ${TAB_CONFIG[tab].label.toLowerCase()}`}
            </Typography>
            <Typography sx={{ color: "#71717a", fontSize: { xs: 13, sm: 14 }, mt: 0.5 }}>
              {search
                ? "Try a different order ID or product name."
                : "Orders in this category will show up here."}
            </Typography>
            {!search && (
              <Button
                component={Link}
                href="/"
                variant="contained"
                sx={{
                  mt: 2.5,
                  textTransform: "none",
                  borderRadius: 2,
                  bgcolor: DARK,
                  boxShadow: "none",
                  "&:hover": { bgcolor: "#000" },
                }}
              >
                Continue Shopping
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <Stack spacing={{ xs: 1.5, sm: 2 }}>
          {sortedTabOrders.map((order) => {
            const isReturning = order.returnStatus && order.returnStatus !== "None";
            const statusStyle = STATUS_STYLES[order.status] || { bg: "#f4f4f5", text: "#52525b" };
            const firstItem = order.items?.[0];
            const itemCount = order.items?.length || 0;

            return (
              <Card
                key={order._id}
                variant="outlined"
                component={Link}
                href={`/profile/orders/${order._id}`}
                sx={{
                  borderRadius: 2.5,
                  borderColor: "#e4e4e7",
                  boxShadow: "none",
                  overflow: "hidden",
                  display: "block",
                  textDecoration: "none",
                  WebkitTapHighlightColor: "transparent",
                  transition: "border-color .15s ease, box-shadow .15s ease",
                  "&:hover": {
                    borderColor: DARK,
                    boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
                  },
                  "&:active": {
                    bgcolor: "#fafafa",
                  },
                }}
              >
                {/* RETURN BADGE */}
                {isReturning && (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.75,
                      px: { xs: 1.75, sm: 2 },
                      py: 0.75,
                      bgcolor: "#fff7ed",
                      borderBottom: "1px solid #fed7aa",
                    }}
                  >
                    <UndoIcon sx={{ fontSize: 15, color: "#c2410c" }} />
                    <Typography sx={{ fontSize: 12.5, fontWeight: 600, color: "#c2410c" }}>
                      Return {order.returnStatus}
                    </Typography>
                  </Box>
                )}

                {/* ONGOING BADGE (shipped) */}
                {!isReturning && order.status === "Shipped" && (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.75,
                      px: { xs: 1.75, sm: 2 },
                      py: 0.75,
                      bgcolor: "#eef2ff",
                      borderBottom: "1px solid #e0e7ff",
                    }}
                  >
                    <LocalShippingOutlinedIcon sx={{ fontSize: 15, color: "#4f46e5" }} />
                    <Typography sx={{ fontSize: 12.5, fontWeight: 600, color: "#4f46e5" }}>
                      On the way
                    </Typography>
                  </Box>
                )}

                {/* TOP STRIP: status dot + date */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    px: { xs: 1.75, sm: 2 },
                    py: { xs: 1, sm: 1.1 },
                    bgcolor: "#fafafa",
                    gap: 1,
                  }}
                >
                  <Stack direction="row" alignItems="center" spacing={0.75} sx={{ minWidth: 0 }}>
                    <Box
                      sx={{
                        width: 7,
                        height: 7,
                        borderRadius: "50%",
                        bgcolor: statusStyle.text,
                        flexShrink: 0,
                      }}
                    />
                    <Typography noWrap sx={{ fontWeight: 700, fontSize: { xs: 12, sm: 13 }, color: statusStyle.text }}>
                      {order.status}
                    </Typography>
                  </Stack>

                  <Stack direction="row" alignItems="center" spacing={{ xs: 0.5, sm: 1 }} sx={{ flexShrink: 0 }}>
                    <Typography sx={{ fontSize: { xs: 10.5, sm: 12 }, color: "#a1a1aa", display: { xs: "none", sm: "block" } }}>
                      {timeAgo(order.createdAt)}
                    </Typography>
                    <Typography sx={{ fontSize: { xs: 10.5, sm: 12 }, color: "#71717a", whiteSpace: "nowrap" }}>
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </Typography>
                  </Stack>
                </Box>

                <Divider sx={{ borderColor: "#e4e4e7" }} />

                {/* MAIN ROW */}
                <Box
                  sx={{
                    p: { xs: 1.5, sm: 2 },
                    display: "flex",
                    alignItems: "center",
                    gap: { xs: 1.25, sm: 2 },
                  }}
                >
                  {/* THUMBNAIL */}
                  <Box sx={{ position: "relative", flexShrink: 0 }}>
                    <Avatar
                      src={firstItem?.image}
                      variant="rounded"
                      sx={{
                        width: { xs: 48, sm: 58 },
                        height: { xs: 48, sm: 58 },
                        borderRadius: 2,
                        bgcolor: "#f4f4f5",
                        border: "1px solid #e4e4e7",
                      }}
                    >
                      <ImageOutlinedIcon sx={{ fontSize: 20, color: "#a1a1aa" }} />
                    </Avatar>

                    {itemCount > 1 && (
                      <Box
                        sx={{
                          position: "absolute",
                          bottom: -6,
                          right: -6,
                          bgcolor: DARK,
                          color: "#fff",
                          borderRadius: "50%",
                          width: { xs: 19, sm: 22 },
                          height: { xs: 19, sm: 22 },
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: { xs: 9, sm: 10 },
                          fontWeight: 700,
                          border: "2px solid #fff",
                        }}
                      >
                        +{itemCount - 1}
                      </Box>
                    )}
                  </Box>

                  {/* NAME / ORDER ID / META */}
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                      noWrap
                      sx={{ fontWeight: 700, fontSize: { xs: 13, sm: 14.5 }, color: DARK }}
                    >
                      {firstItem?.name || "Order"}
                    </Typography>
                    {itemCount > 1 && (
                      <Typography
                        sx={{ fontWeight: 500, fontSize: { xs: 11, sm: 12.5 }, color: "#71717a" }}
                      >
                        +{itemCount - 1} more item{itemCount - 1 > 1 ? "s" : ""}
                      </Typography>
                    )}
                    <Typography sx={{ fontSize: { xs: 11, sm: 12.5 }, color: "#71717a", mt: 0.3 }}>
                      Order #{order._id.slice(-6).toUpperCase()}
                    </Typography>
                    <Typography
                      noWrap
                      sx={{
                        fontSize: 12,
                        color: "#a1a1aa",
                        mt: 0.2,
                        display: { xs: "none", sm: "block" },
                      }}
                    >
                      {itemCount} Item{itemCount > 1 ? "s" : ""}
                      {order.paymentMethod && ` • ${order.paymentMethod}`}
                    </Typography>
                  </Box>

                  {/* PRICE + VIEW DETAILS */}
                  <Stack
                    alignItems="flex-end"
                    justifyContent="space-between"
                    sx={{ alignSelf: "stretch", flexShrink: 0, gap: 0.75 }}
                  >
                    <Typography
                      sx={{ fontSize: { xs: 13.5, sm: 15.5 }, fontWeight: 700, color: DARK, whiteSpace: "nowrap" }}
                    >
                      ₹{(order.totalAmount || 0).toLocaleString()}
                    </Typography>

                    <Stack direction="row" alignItems="center" spacing={0.3} sx={{ color: DARK }}>
                      <Typography sx={{ fontSize: { xs: 10.5, sm: 12.5 }, fontWeight: 600, whiteSpace: "nowrap" }}>
                        View Details
                      </Typography>
                      <ArrowForwardRoundedIcon sx={{ fontSize: { xs: 13, sm: 15 } }} />
                    </Stack>
                  </Stack>
                </Box>
              </Card>
            );
          })}
        </Stack>
      )}
    </Container>
  );
}
