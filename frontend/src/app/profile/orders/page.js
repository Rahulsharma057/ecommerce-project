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
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import InboxOutlinedIcon from "@mui/icons-material/InboxOutlined";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import UndoIcon from "@mui/icons-material/Undo";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { API_URL } from "@/lib/api";

const STATUS_STYLES = {
  Pending: { bg: "#fffbeb", text: "#d97706" },
  Confirmed: { bg: "#eff6ff", text: "#2563eb" },
  Shipped: { bg: "#eef2ff", text: "#4f46e5" },
  Delivered: { bg: "#f0fdf4", text: "#16a34a" },
  Cancelled: { bg: "#fef2f2", text: "#dc2626" },
};

export default function OrdersPage() {
  const [search, setSearch] = useState("");
  const [orders, setOrders] = useState([]);
  const [tab, setTab] = useState(0); // 0 = Ongoing, 1 = Delivered, 2 = Returned, 3 = Cancelled
  const router = useRouter();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API_URL}/orders/my`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    setOrders(data);
  };

  const TAB_LABELS = ["Ongoing", "Delivered", "Returned", "Cancelled"];
  const ONGOING_STATUSES = ["Pending", "Confirmed", "Shipped"];

  const searchedOrders = (orders || []).filter((order) =>
    order._id.toLowerCase().includes(search.toLowerCase()),
  );

  const matchesTab = (order, tabIndex) => {
    if (tabIndex === 0) return ONGOING_STATUSES.includes(order.status);
    if (tabIndex === 1) return order.status === "Delivered";
    if (tabIndex === 2)
      return order.returnStatus && order.returnStatus !== "None";
    if (tabIndex === 3) return order.status === "Cancelled";
    return false;
  };

  const tabOrders = searchedOrders.filter((order) => matchesTab(order, tab));

  const tabCounts = TAB_LABELS.map(
    (_, i) => searchedOrders.filter((order) => matchesTab(order, i)).length,
  );

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 1, sm: 3, md: 3 } }}>
      {/* HEADER */}
      <Box sx={{ mb: { xs: 1.5, sm: 2 } }}>
        <Stack direction="row" alignItems="center" gap={{ xs: 1, sm: 1.5 }}>
          <Button
            onClick={() => router.back()}
            sx={{
              minWidth: { xs: 34, sm: 40 },
              width: { xs: 34, sm: 40 },
              height: { xs: 34, sm: 40 },
              borderRadius: 2,
              color: "#18181b",
              border: "1px solid #e4e4e7",
              flexShrink: 0,
              "&:hover": { borderColor: "#18181b", bgcolor: "#f4f4f5" },
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

      {/* SEARCH */}
      <Paper
        variant="outlined"
        sx={{
          p: { xs: 1, sm: 1.5 },
          mb: 1,
          borderRadius: 3,
          borderColor: "#e4e4e7",
        }}
      >
        <TextField
          fullWidth
          size="small"
          placeholder="Search Order ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchRoundedIcon
                  sx={{ color: "#71717a", fontSize: { xs: 20, sm: 22 } }}
                />
              </InputAdornment>
            ),
            endAdornment: search && (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  onClick={() => setSearch("")}
                  sx={{ color: "#71717a" }}
                >
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
              "&.Mui-focused fieldset": {
                borderColor: "#111827",
                borderWidth: "2px",
              },
            },
            "& input": { py: { xs: 1.2, sm: 1.4 } },
          }}
        />
      </Paper>

      {/* TABS */}
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
          TabIndicatorProps={{ sx: { bgcolor: "#18181b", height: 2.5 } }}
          sx={{
            minHeight: { xs: 38, sm: 48 },
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 600,
              fontSize: { xs: 11.5, sm: 13.5 },
              color: "#71717a",
              minHeight: { xs: 38, sm: 48 },
              minWidth: { xs: "auto", sm: 90 },
              px: { xs: 1.1, sm: 2 },
              whiteSpace: "nowrap",
            },
            "& .Mui-selected": { color: "#18181b !important" },
            "& .MuiTabs-scrollButtons": {
              width: { xs: 22, sm: 40 },
              "&.Mui-disabled": { opacity: 0.3 },
            },
          }}
        >
          {TAB_LABELS.map((label, i) => (
            <Tab key={label} label={`${label} (${tabCounts[i]})`} />
          ))}
        </Tabs>
      </Paper>

      {/* ORDER LIST */}
      {tabOrders.length === 0 ? (
        <Card
          variant="outlined"
          sx={{
            borderRadius: 3,
            p: 4,
            textAlign: "center",
            bgcolor: "#fafafa",
            borderColor: "#e4e4e7",
            boxShadow: "none",
          }}
        >
          <CardContent>
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
            <Typography fontSize={17} fontWeight={700} sx={{ color: "#18181b" }}>
              No {TAB_LABELS[tab].toLowerCase()} orders
            </Typography>
            <Typography sx={{ color: "#71717a", fontSize: 14, mt: 0.5 }}>
              Orders in this category will show up here.
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Stack spacing={2}>
          {tabOrders.map((order) => {
            const isReturning =
              order.returnStatus && order.returnStatus !== "None";
            const statusStyle = STATUS_STYLES[order.status] || {
              bg: "#f4f4f5",
              text: "#52525b",
            };
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
                  transition: "border-color .15s ease, background .15s ease",
                  "&:hover": {
                    borderColor: "#a1a1aa",
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
                      px: 2,
                      py: 0.75,
                      bgcolor: "#fff7ed",
                      borderBottom: "1px solid #fed7aa",
                    }}
                  >
                    <UndoIcon sx={{ fontSize: 15, color: "#c2410c" }} />
                    <Typography
                      sx={{ fontSize: 12.5, fontWeight: 600, color: "#c2410c" }}
                    >
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
                      px: 2,
                      py: 0.75,
                      bgcolor: "#eef2ff",
                      borderBottom: "1px solid #e0e7ff",
                    }}
                  >
                    <LocalShippingOutlinedIcon
                      sx={{ fontSize: 15, color: "#4f46e5" }}
                    />
                    <Typography
                      sx={{ fontSize: 12.5, fontWeight: 600, color: "#4f46e5" }}
                    >
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
                  }}
                >
                  <Stack direction="row" alignItems="center" spacing={0.75}>
                    <Box
                      sx={{
                        width: 7,
                        height: 7,
                        borderRadius: "50%",
                        bgcolor: statusStyle.text,
                        flexShrink: 0,
                      }}
                    />
                    <Typography
                      sx={{
                        fontWeight: 700,
                        fontSize: { xs: 12, sm: 13 },
                        color: statusStyle.text,
                      }}
                    >
                      {order.status}
                    </Typography>
                  </Stack>

                  <Typography
                    sx={{ fontSize: { xs: 11, sm: 12 }, color: "#71717a" }}
                  >
                    {new Date(order.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </Typography>
                </Box>

                <Divider sx={{ borderColor: "#e4e4e7" }} />

                {/* MAIN ROW */}
                <Box
                  sx={{
                    p: { xs: 1.75, sm: 2 },
                    display: "flex",
                    alignItems: "center",
                    gap: { xs: 1.5, sm: 2 },
                  }}
                >
                  {/* THUMBNAIL */}
                  <Box sx={{ position: "relative", flexShrink: 0 }}>
                    <Avatar
                      src={firstItem?.image}
                      variant="rounded"
                      sx={{
                        width: { xs: 50, sm: 58 },
                        height: { xs: 50, sm: 58 },
                        borderRadius: 2,
                        bgcolor: "#f4f4f5",
                        border: "1px solid #e4e4e7",
                      }}
                    >
                      <ImageOutlinedIcon
                        sx={{ fontSize: 20, color: "#a1a1aa" }}
                      />
                    </Avatar>

                    {itemCount > 1 && (
                      <Box
                        sx={{
                          position: "absolute",
                          bottom: -6,
                          right: -6,
                          bgcolor: "#18181b",
                          color: "#fff",
                          borderRadius: "50%",
                          width: 22,
                          height: 22,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 10,
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
                      sx={{
                        fontWeight: 700,
                        fontSize: { xs: 13.5, sm: 14.5 },
                        color: "#18181b",
                      }}
                    >
                      {firstItem?.name || "Order"}
                      {itemCount > 1 && (
                        <Typography
                          component="span"
                          sx={{
                            fontWeight: 500,
                            fontSize: { xs: 11.5, sm: 12.5 },
                            color: "#71717a",
                          }}
                        >
                          {" "}
                          +{itemCount - 1} more
                        </Typography>
                      )}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: { xs: 11.5, sm: 12.5 },
                        color: "#71717a",
                        mt: 0.3,
                      }}
                    >
                      Order #{order._id.slice(-6).toUpperCase()}
                    </Typography>
                    <Typography
                      noWrap
                      sx={{
                        fontSize: { xs: 11, sm: 12 },
                        color: "#a1a1aa",
                        mt: 0.3,
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
                      sx={{
                        fontSize: { xs: 14, sm: 15.5 },
                        fontWeight: 700,
                        color: "#18181b",
                        whiteSpace: "nowrap",
                      }}
                    >
                      ₹{(order.totalAmount || 0).toLocaleString()}
                    </Typography>

                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={0.3}
                      sx={{ color: "#27272a" }}
                    >
                      <Typography
                        sx={{
                          fontSize: { xs: 11.5, sm: 12.5 },
                          fontWeight: 600,
                          whiteSpace: "nowrap",
                        }}
                      >
                        View Details
                      </Typography>
                      <ArrowForwardRoundedIcon sx={{ fontSize: 15 }} />
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
