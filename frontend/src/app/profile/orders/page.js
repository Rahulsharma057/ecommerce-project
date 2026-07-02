"use client";

import {
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Stack,Dialog, DialogTitle, DialogContent, DialogActions,TextField,Paper,Divider, Chip,Box,MenuItem
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CancelIcon from "@mui/icons-material/Cancel";
import UndoIcon from "@mui/icons-material/Undo";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter } from "next/navigation";
import {
  useEffect,
  useState,
} from "react";
import Link from "next/link";
import DownloadInvoiceButton from "@/components/DownloadInvoiceButton";
import { API_URL } from "@/lib/api";

export default function OrdersPage() {
    const [open, setOpen] = useState(false);
const [reason, setReason] = useState("");
const [selectedOrder, setSelectedOrder] = useState(null);
const [returnOpen, setReturnOpen] = useState(false);
const [returnReason, setReturnReason] = useState("");
const [selectedReturnOrder, setSelectedReturnOrder] = useState(null);
const [filterStatus, setFilterStatus] = useState("ALL");
const [search, setSearch] = useState("");
  const [orders,
    setOrders] =
    useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);
const filteredOrders = (orders || []).filter((order) => {
  const matchStatus =
    filterStatus === "ALL" || order.status === filterStatus;

  const matchSearch =
    order._id.toLowerCase().includes(search.toLowerCase());

  return matchStatus && matchSearch;
});
  const fetchOrders =
    async () => {
      const token =
        localStorage.getItem(
          "token"
        );

      const res =
        await fetch(
          `${API_URL}/orders/my`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

      const data =
        await res.json();

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

  return (
    <Container
      maxWidth="lg"
      sx={{ py: 5 }}
    >
 <Box sx={{ mb: 4 }}>
  <Stack direction="row" alignItems="center" spacing={1}>
   

  
      <Box sx={{   display:"flex",
        flexDirection:"row"}}>
         <Button
      onClick={() => router.back()}

      sx={{
        textTransform: "none",
        fontWeight: 600,
        color: "text.primary",
        mb:3,
     
      }}
    >
    <ArrowBackIcon />
    </Button>
       <Box>
     <Typography variant="h4" fontWeight={800}>
        My Orders
      </Typography>
      <Typography variant="body2" color="text.secondary" >
        Track, manage and view all your orders in one place
      </Typography>
</Box>


    </Box>
  </Stack>

  <Divider sx={{ mt: 2, borderColor: "#e5e7eb" }} />
</Box>
<Paper
  elevation={0}
  sx={{
    p: 2,
    mb: 3,
    borderRadius: 1,
    border: "1px solid #e5e7eb",
  }}
>
  <Stack
    direction={{ xs: "column", sm: "row" }}
    spacing={2}
    alignItems={{ xs: "stretch", sm: "center" }}
  >
    {/* SEARCH */}
    <TextField
      size="small"
      fullWidth
      placeholder="Search Order ID..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      sx={{
        bgcolor: "#fff",
        borderRadius: 2,
      }}
    />

    {/* FILTER */}
    <TextField
      select
      size="small"
      value={filterStatus}
      onChange={(e) => setFilterStatus(e.target.value)}
      sx={{
        minWidth: { xs: "100%", sm: 180 },
        bgcolor: "#fff",
        borderRadius: 2,
      }}
    >
      <MenuItem value="ALL">All Orders</MenuItem>
      <MenuItem value="Pending">Pending</MenuItem>
      <MenuItem value="Confirmed">Confirmed</MenuItem>
      <MenuItem value="Shipped">Shipped</MenuItem>
      <MenuItem value="Delivered">Delivered</MenuItem>
      <MenuItem value="Cancelled">Cancelled</MenuItem>
    </TextField>

    {/* RESET */}
    <Button
      variant="outlined"
      onClick={() => {
        setSearch("");
        setFilterStatus("ALL");
      }}
      sx={{
        borderRadius: 2,
        textTransform: "none",
        whiteSpace: "nowrap",
        minWidth: { xs: "100%", sm: "auto" },
      }}
    >
      Reset Filters
    </Button>
  </Stack>
</Paper>
      <Stack spacing={3}>
        {(filteredOrders || []).map(
          (order) => (
   <Card
  key={order._id}
  sx={{
    borderRadius: 2,
    border: "1px solid #eee",
    boxShadow: "none",
    mb: 2,
  }}
>
  <CardContent>

    {/* ORDER HEADER */}
    <Stack direction="row" justifyContent="space-between" alignItems="center">
      <Typography fontWeight={600}>
        Order #{order._id.slice(-6).toUpperCase()}
      </Typography>

      {/* STATUS CHIP */}
      <Chip
        label={order.status}
        size="small"
        color={
          order.status === "Delivered"
            ? "success"
            : order.status === "Cancelled"
            ? "error"
            : "warning"
        }
      />
    </Stack>

    <Divider sx={{ my: 1 }} />
    <Stack spacing={0.5} mt={2}>
      <Typography variant="body2" color="text.secondary" fontSize={12}>
        Date: {new Date(order.createdAt).toLocaleDateString("en-IN")}
      </Typography>

   
    </Stack>
    {/* ORDER ITEMS NAMES */}
<Box sx={{display:"flex", justifyContent:"space-between"}}>
      <Typography fontWeight={500}>
      Items:
    </Typography>

    <Stack spacing={0.5} mt={0.5}>
      {order.items?.slice(0, 2).map((item, i) => (
        <Typography key={i} variant="body2" color="text.secondary">
          • {item.name} × {item.quantity}
        </Typography>
      ))}

      {order.items?.length > 2 && (
        <Typography variant="body2" color="text.secondary">
          +{order.items.length - 2} more items
        </Typography>
      )}
    </Stack>
</Box>

    {/* DETAILS */}
    <Stack spacing={0.5} mt={2}>


      <Typography sx={{display:"flex",justifyContent:"space-between"}}>
      <span>  Total: </span><span>₹{(order.totalAmount || 0).toLocaleString()}</span>
      </Typography>
    </Stack>

    {/* ACTION BUTTONS */}
<Stack
  direction="row"
  spacing={1}
  mt={2}
  flexWrap="wrap"
  sx={{
    gap: 1,
  }}
>
  <Button
    component={Link}
    href={`/profile/orders/${order._id}`}
    size="small"
    variant="outlined"
    endIcon={<VisibilityIcon />}
    sx={{
      px:2,
      borderRadius: 1,
      textTransform: "none",
    }}
  >
    View
  </Button>

  <Button
    size="small"
    color="error"
    variant="outlined"
    disabled={order.status !== "Pending"}
    endIcon={<CancelIcon />}
     sx={{
      px:1.5,
      borderRadius: 1,
      textTransform: "none",
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
    color="warning"
    variant="outlined"
    disabled={order.status !== "Delivered"}
    endIcon={<UndoIcon />}
      sx={{
      px:1.5,
      borderRadius: 1,
      textTransform: "none",
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
          )
        )}
 {/*        {order.returnStatus !== "None" && (
  <Paper sx={{ p: 2, mt: 2, bgcolor: "#fff3e0" }}>
    <Typography fontWeight={600}>
      Return Status: {order.returnStatus}
    </Typography>

    <Typography>
      Reason: {order.returnReason || "—"}
    </Typography>

    <Typography fontSize={12} color="text.secondary">
      Requested At:{" "}
      {order.returnRequestedAt
        ? new Date(order.returnRequestedAt).toLocaleString("en-IN")
        : "—"}
    </Typography>

    {order.adminNote && (
      <Typography fontSize={13} color="text.secondary">
        Admin Note: {order.adminNote}
      </Typography>
    )}

    {order.returnCompletedAt && (
      <Typography fontSize={12}>
        Completed:{" "}
        {new Date(order.returnCompletedAt).toLocaleString("en-IN")}
      </Typography>
    )}
  </Paper>
)} */}
      </Stack>
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
  <DialogTitle sx={{ fontWeight: 700 }}>
    Cancel Order
  </DialogTitle>
  <Divider sx={{my:0}} />

  <DialogContent>
    <Typography
      variant="body2"
      color="text.secondary"
      sx={{ mb: 2 }}
    >
      Please tell us the reason for cancelling this order.
    </Typography>

    <TextField
      fullWidth
      multiline
      rows={4}
      placeholder="Write your reason..."
      value={reason}
      onChange={(e) => setReason(e.target.value)}
    />
  </DialogContent>

  <DialogActions sx={{ px: 3, pb: 2 }}>
    <Button
      onClick={() => setOpen(false)}
      variant="outlined"
      sx={{ borderRadius: 2, textTransform: "none" }}
    >
      Close
    </Button>

    <Button
      color="error"
      variant="contained"
      disabled={!reason}
      sx={{ borderRadius: 2, textTransform: "none" }}
      onClick={async () => {
        await fetch(
          `${API_URL}/orders/cancel/${selectedOrder._id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({ reason }),
          }
        );

        setOpen(false);
        setReason("");
        fetchOrders();
      }}
    >
      Confirm Cancel
    </Button>
  </DialogActions>
</Dialog>
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
  <DialogTitle sx={{ fontWeight: 700 }}>
    Return Order
  </DialogTitle>

  <DialogContent>
    <Typography
      variant="body2"
      color="text.secondary"
      sx={{ mb: 2 }}
    >
      Please mention the reason for returning this order.
    </Typography>

    <TextField
      fullWidth
      multiline
      rows={4}
      placeholder="Write your reason..."
      value={returnReason}
      onChange={(e) => setReturnReason(e.target.value)}
    />
  </DialogContent>

  <DialogActions sx={{ px: 3, pb: 2 }}>
    <Button
      onClick={() => setReturnOpen(false)}
      variant="outlined"
      sx={{ borderRadius: 2, textTransform: "none" }}
    >
      Close
    </Button>

    <Button
      color="warning"
      variant="contained"
      disabled={!returnReason}
      sx={{ borderRadius: 2, textTransform: "none" }}
      onClick={async () => {
        await fetch(
          `${API_URL}/orders/return/${selectedReturnOrder._id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({ reason: returnReason }),
          }
        );

        setReturnOpen(false);
        setReturnReason("");
        fetchOrders();
      }}
    >
      Confirm Return
    </Button>
  </DialogActions>
</Dialog>


    </Container>
  );
}