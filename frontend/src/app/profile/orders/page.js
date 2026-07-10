"use client";
import { toast } from "react-toastify";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Paper,
  Divider,
  Chip,
  Box,
  Tabs,
  Tab,
  Avatar,InputAdornment, IconButton
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CancelIcon from "@mui/icons-material/Cancel";
import UndoIcon from "@mui/icons-material/Undo";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import InboxOutlinedIcon from "@mui/icons-material/InboxOutlined";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import DownloadInvoiceButton from "@/components/DownloadInvoiceButton";
import { API_URL } from "@/lib/api";

const STATUS_STYLES = {
  Pending: { bg: "#fffbeb", text: "#d97706" },
  Confirmed: { bg: "#eff6ff", text: "#2563eb" },
  Shipped: { bg: "#eef2ff", text: "#4f46e5" },
  Delivered: { bg: "#f0fdf4", text: "#16a34a" },
  Cancelled: { bg: "#fef2f2", text: "#dc2626" },
};

export default function OrdersPage() {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [returnOpen, setReturnOpen] = useState(false);
  const [returnReason, setReturnReason] = useState("");
  const [selectedReturnOrder, setSelectedReturnOrder] = useState(null);
  const [returnImages, setReturnImages] = useState([]);
  const [returnDescription, setReturnDescription] = useState("");
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

  const cancelOrder = async (id) => {
    const token = localStorage.getItem("token");

    await fetch(`${API_URL}/orders/admin/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status: "Cancelled" }),
    });

    fetchOrders();
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
    <Container maxWidth="lg" sx={{ py: { xs: 1, sm: 3 ,md:3}  }}>
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
          display: { xs: "none", sm: "block" }, // hide subtitle on very small screens to save space
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
            sx={{
              color: "#71717a",
              fontSize: { xs: 20, sm: 22 },
            }}
          />
        </InputAdornment>
      ),

      endAdornment: search && (
        <InputAdornment position="end">
          <IconButton
            size="small"
            onClick={() => setSearch("")}
            sx={{
              color: "#71717a",
            }}
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
        fontSize: {
          xs: "14px",
          sm: "15px",
        },
        "& fieldset": {
          borderColor: "#e4e4e7",
        },
        "&:hover fieldset": {
          borderColor: "#a1a1aa",
        },
        "&.Mui-focused fieldset": {
          borderColor: "#111827",
          borderWidth: "2px",
        },
      },

      "& input": {
        py: {
          xs: 1.2,
          sm: 1.4,
        },
      },
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
      "& .Mui-selected": {
        color: "#18181b !important",
      },
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
            <Typography
              fontSize={17}
              fontWeight={700}
              sx={{ color: "#18181b" }}
            >
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
            const visibleItems = order.items?.slice(0, 2) || [];
            const extraCount = (order.items?.length || 0) - visibleItems.length;

            return (
              <Card
                key={order._id}
                variant="outlined"
                sx={{
                  borderRadius: 2.5,
                  borderColor: "#e4e4e7",
                  boxShadow: "none",
                  overflow: "visible",
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
                      borderRadius: "10px 10px 0 0",
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
                      borderRadius: "10px 10px 0 0",
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

                <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
                  {/* TOP ROW: Order ID + Status */}
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="flex-start"
                  >
                    <Box>
                      <Typography
                        sx={{ fontWeight: 700, fontSize: 15, color: "#18181b" }}
                      >
                        Order #{order._id.slice(-6).toUpperCase()}
                      </Typography>
                      <Typography
                        sx={{ fontSize: 12.5, color: "#71717a", mt: 0.3 }}
                      >
                        {new Date(order.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </Typography>
                    </Box>

                    <Chip
                      label={order.status}
                      size="small"
                      sx={{
                        fontWeight: 600,
                        fontSize: 12,
                        bgcolor: statusStyle.bg,
                        color: statusStyle.text,
                      }}
                    />
                  </Stack>

                  <Divider sx={{ my: 1.75, borderColor: "#f4f4f5" }} />

                  {/* ITEMS WITH IMAGE */}
                  <Stack spacing={1.25}>
                    {visibleItems.map((item, i) => (
                      <Stack
                        key={i}
                        direction="row"
                        alignItems="center"
                        spacing={1.5}
                      >
                        <Avatar
                          src={item.image}
                          variant="rounded"
                          sx={{
                            width: 44,
                            height: 44,
                            borderRadius: 2,
                            bgcolor: "#f4f4f5",
                            border: "1px solid #e4e4e7",
                          }}
                        >
                          <ImageOutlinedIcon
                            sx={{ fontSize: 18, color: "#a1a1aa" }}
                          />
                        </Avatar>

                        <Box sx={{ minWidth: 0 }}>
                          <Typography
                            noWrap
                            sx={{
                              fontSize: 13.5,
                              color: "#27272a",
                              fontWeight: 500,
                            }}
                          >
                            {item.name}
                          </Typography>
                          <Typography sx={{ fontSize: 12, color: "#a1a1aa" }}>
                            Qty: {item.quantity}
                          </Typography>
                        </Box>
                      </Stack>
                    ))}

                    {extraCount > 0 && (
                      <Typography
                        sx={{ fontSize: 12.5, color: "#a1a1aa", pl: "58px" }}
                      >
                        +{extraCount} more item{extraCount > 1 ? "s" : ""}
                      </Typography>
                    )}
                  </Stack>

                  {/* TOTAL */}
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    mt={2}
                  >
                    <Typography sx={{ fontSize: 13.5, color: "#71717a" }}>
                      Total
                    </Typography>
                    <Typography
                      sx={{ fontSize: 16, fontWeight: 700, color: "#18181b" }}
                    >
                      ₹{(order.totalAmount || 0).toLocaleString()}
                    </Typography>
                  </Stack>

                  <Divider sx={{ my: 1.75, borderColor: "#f4f4f5" }} />

                  {/* ACTIONS */}
                  {/* ACTIONS */}
                  <Stack
                    direction="row"
                    spacing={1}
                    flexWrap="wrap"
                    sx={{
                      gap: 1,
                      "& .MuiButton-root": {
                        flex: { xs: "1 1 calc(50% - 4px)", sm: "0 0 auto" },
                      },
                    }}
                  >
                    <Button
                      component={Link}
                      href={`/profile/orders/${order._id}`}
                      size="small"
                      variant="outlined"
                      startIcon={<VisibilityIcon sx={{ fontSize: 16 }} />}
                      sx={{
                        borderRadius: 2,
                        textTransform: "none",
                        fontWeight: 500,
                        fontSize: { xs: 12.5, sm: 13 },
                        borderColor: "#e4e4e7",
                        color: "#27272a",
                        "&:hover": {
                          borderColor: "#18181b",
                          bgcolor: "#f4f4f5",
                        },
                      }}
                    >
                      View Details
                    </Button>

                    <Button
                      size="small"
                      variant="outlined"
                      disabled={order.status !== "Pending"}
                      startIcon={<CancelIcon sx={{ fontSize: 16 }} />}
                      sx={{
                        borderRadius: 2,
                        textTransform: "none",
                        fontWeight: 500,
                        fontSize: { xs: 12.5, sm: 13 },
                        borderColor: "#fecaca",
                        color: "#dc2626",
                        "&:hover": {
                          borderColor: "#dc2626",
                          bgcolor: "#fef2f2",
                        },
                      }}
                      onClick={() => {
                        setSelectedOrder(order);
                        setOpen(true);
                      }}
                    >
                      Cancel
                    </Button>

                    <Button
                      size="small"
                      variant="outlined"
                      disabled={order.status !== "Delivered"}
                      startIcon={<UndoIcon sx={{ fontSize: 16 }} />}
                      sx={{
                        borderRadius: 2,
                        textTransform: "none",
                        fontWeight: 500,
                        fontSize: { xs: 12.5, sm: 13 },
                        borderColor: "#fde68a",
                        color: "#d97706",
                        "&:hover": {
                          borderColor: "#d97706",
                          bgcolor: "#fffbeb",
                        },
                      }}
                      onClick={() => {
                        setSelectedReturnOrder(order);
                        setReturnOpen(true);
                      }}
                    >
                      Return
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            );
          })}
        </Stack>
      )}

      {/* CANCEL DIALOG */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 1,
            minWidth: { xs: "90%", sm: 420 },
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 700, color: "#18181b" }}>
          Cancel Order
        </DialogTitle>
        <Divider sx={{ my: 0, borderColor: "#f4f4f5" }} />

        <DialogContent>
          <Typography variant="body2" sx={{ color: "#71717a", mb: 2 }}>
            Please tell us the reason for cancelling this order.
          </Typography>

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
            onClick={() => setOpen(false)}
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
            disabled={!reason}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              bgcolor: "#dc2626",
              boxShadow: "none",
              "&:hover": { bgcolor: "#b91c1c", boxShadow: "none" },
            }}
            onClick={async () => {
              try {
                const res = await fetch(
                  `${API_URL}/orders/cancel/${selectedOrder._id}`,
                  {
                    method: "PUT",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                    body: JSON.stringify({ reason }),
                  },
                );

                const data = await res.json();

                if (res.ok) {
                  toast.success("Order cancelled successfully");

                  setOpen(false);
                  setReason("");
                  setSelectedOrder(null);

                  fetchOrders();
                } else {
                  toast.error(data.message || "Failed to cancel order");
                }
              } catch (err) {
                toast.error("Something went wrong");
              }
            }}
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
          sx: {
            borderRadius: 3,
            p: 1,
            minWidth: { xs: "90%", sm: 420 },
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 700, color: "#18181b" }}>
          Return Order
        </DialogTitle>

        <DialogContent>
          <Typography variant="body2" sx={{ color: "#71717a", mb: 2 }}>
            Please mention the reason for returning this order.
          </Typography>

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

                const invalid = files.find(
                  (file) => file.size > 5 * 1024 * 1024,
                );

                if (invalid) {
                  toast.error("Each image must be less than 5 MB");
                  return;
                }

                setReturnImages(files);
              }}
            />
          </Button>

          {returnImages.length > 0 && (
            <Box
              sx={{
                display: "flex",
                gap: 1,
                mt: 2,
                flexWrap: "wrap",
              }}
            >
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
            disabled={!returnDescription}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              bgcolor: "#d97706",
              boxShadow: "none",
              "&:hover": { bgcolor: "#b45309", boxShadow: "none" },
            }}
            onClick={async () => {
              try {
                const formData = new FormData();

                formData.append("description", returnDescription);

                returnImages.forEach((img) => {
                  formData.append("images", img);
                });

                const res = await fetch(
                  `${API_URL}/orders/return/${selectedReturnOrder._id}`,
                  {
                    method: "PUT",
                    headers: {
                      Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                    body: formData,
                  },
                );

                const data = await res.json();

                if (res.ok) {
                  toast.success("Return request submitted successfully");

                  setReturnOpen(false);
                  setReturnDescription("");
                  setReturnImages([]);
                  setSelectedReturnOrder(null);

                  fetchOrders();
                } else {
                  toast.error(
                    data.message || "Failed to submit return request",
                  );
                }
              } catch (err) {
                toast.error("Something went wrong");
              }
            }}
          >
            Confirm Return
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
