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
import DownloadInvoiceButton from "@/components/DownloadInvoiceButton";
import { API_URL } from "@/lib/api";
const STATUS_CONFIG = {
  confirmed: { label: "Confirmed", color: "success" },
  pending: { label: "Pending", color: "warning" },
  cancelled: { label: "Cancelled", color: "error" },
  delivered: { label: "Delivered", color: "info" },
  shipped: { label: "Shipped", color: "primary" },
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
        boxShadow: "0 1px 4px 0 rgba(0,0,0,0.06)",
      }}
    >
      {/* Card header */}
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
            bgcolor: "primary.50",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "primary.main",
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
      <Box sx={{ color: "grey.400", display: "flex", flexShrink: 0 }}>
        {icon}
      </Box>
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
        <Skeleton
          key={i}
          height={160}
          sx={{ borderRadius: 3, mb: 2 }}
          variant="rectangular"
        />
      ))}
    </Container>
  );
}

export default function OrderDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`${API_URL}/orders/admin/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await res.json();
        setOrder(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchOrder();
  }, [id]);

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
  const statusCfg = STATUS_CONFIG[status?.toLowerCase()] ?? {
    label: status,
    color: "default",
  };

  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "—";

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  return (
    <Box sx={{ bgcolor: "#f7f8fa", minHeight: "100vh", py: 4 }}>
      <Container maxWidth="md">
        {/* Page header */}

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2,
            mb: 0,
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Box>
              {" "}
              <IconButton
                size="small"
                onClick={() => router.back()}
                sx={{
                  // border: "1px solid",
                  //borderColor: "grey.200",
                  //bgcolor: "#fff",
                  borderRadius: 2,
                  px: 2,
                  color: "black",
                }}
              >
                <ArrowBackIcon />
              </IconButton>
            </Box>{" "}
            <Box>
              <Typography variant="h4" fontWeight={700}>
                Order Details
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 0.5 }}
              >
                Order ID : {_id}
              </Typography>
            </Box>
          </Box>

          <Stack direction="row" spacing={1}>
            <Chip
              label={statusCfg.label}
              color={statusCfg.color}
              sx={{ fontWeight: 600 }}
            />

            <Chip variant="outlined" label={paymentMethod} />
          </Stack>
        </Box>

        <Stack spacing={2}>
          <Grid container spacing={2} mb={2}>
            <Grid item xs={12} md={6}>
              <SectionCard
                icon={<PersonOutlineRoundedIcon sx={{ fontSize: 18 }} />}
                title="Customer"
              >
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}
                >
                  <Avatar
                    sx={{
                      width: 44,
                      height: 44,
                      bgcolor: "primary.main",
                      fontSize: 15,
                      fontWeight: 700,
                    }}
                  >
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

                <InfoRow
                  icon={<EmailOutlinedIcon sx={{ fontSize: 16 }} />}
                  label="Email"
                  value={user?.email ?? "—"}
                />
                <InfoRow
                  icon={<CalendarTodayOutlinedIcon sx={{ fontSize: 16 }} />}
                  label="Placed on"
                  value={formattedDate}
                />
                <InfoRow
                  icon={<PaymentOutlinedIcon sx={{ fontSize: 16 }} />}
                  label="Payment"
                  value={paymentMethod ?? "—"}
                />
              </SectionCard>
            </Grid>

            <Grid item xs={12} md={6}>
              <SectionCard
                icon={<LocalShippingOutlinedIcon sx={{ fontSize: 18 }} />}
                title="Shipping address"
              >
                <Stack spacing={0.5}>
                  <Typography fontWeight={600} fontSize={14}>
                    {addr?.fullName ?? "—"}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <PhoneOutlinedIcon
                      sx={{ fontSize: 14, color: "grey.400" }}
                    />
                    <Typography fontSize={13} color="text.secondary">
                      {addr?.phone ?? "—"}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 1,
                      mt: 0.5,
                    }}
                  >
                    <LocationOnOutlinedIcon
                      sx={{ fontSize: 15, color: "grey.400", mt: "1px" }}
                    />
                    <Typography
                      fontSize={13}
                      color="text.secondary"
                      lineHeight={1.7}
                    >
                      {addr?.house}, {addr?.area}
                      <br />
                      {addr?.city}, {addr?.state} — {addr?.pincode}
                    </Typography>
                  </Box>
                </Stack>
              </SectionCard>
            </Grid>
          </Grid>
          {/* Customer */}

          {/* Shipping */}

          {/* Products */}
          <SectionCard
            icon={<ShoppingBagOutlinedIcon sx={{ fontSize: 18 }} />}
            title="Products"
          >
            {items.length === 0 ? (
              <Typography fontSize={13} color="text.secondary">
                No items found
              </Typography>
            ) : (
              <Stack divider={<Divider />}>
                {items.map((item, i) => (
                  <Box
                    key={i}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      py: 1.5,
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: 2,
                          bgcolor: "grey.100",
                          border: "1px solid",
                          borderColor: "grey.200",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <ShoppingBagOutlinedIcon
                          sx={{ fontSize: 18, color: "grey.400" }}
                        />
                      </Box>
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
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Typography color="text.secondary">
                      Coupon Applied
                    </Typography>

                    <Typography color="success.main" fontWeight={600}>
                      {order.couponCode.code}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 2,
                    }}
                  >
                    <Typography color="text.secondary">Discount</Typography>

                    <Typography color="success.main" fontWeight={600}>
                      -₹{order.discount}
                    </Typography>
                  </Box>
                </>
              )}

              {order.status === "Cancelled" && (
                <Typography color="error" mb={2}>
                  Cancel Reason: {order.cancelReason}
                </Typography>
              )}

              <Divider />

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  pt: 2,
                }}
              >
                <Typography fontSize={13} color="text.secondary">
                  Order Total
                </Typography>

                <Typography fontSize={20} fontWeight={700} color="primary.main">
                  ₹{Number(totalAmount).toLocaleString("en-IN")}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
              {/* DOWNLOAD */}
              <DownloadInvoiceButton orderId={order._id} />

              {/* VIEW */}
              <Button
                variant="outlined"
                onClick={() =>
                  window.open(`${API_URL}/invoice/view/${order._id}`, "_blank")
                }
              >
                View Invoice
              </Button>

              {/* EMAIL */}
              <Button
                variant="contained"
                color="primary"
                onClick={async () => {
                  await fetch(`${API_URL}/invoice/email/${order._id}`, {
                    method: "POST",
                  });
                  alert("Invoice sent to email");
                }}
              >
                Send Email
              </Button>

              {/* WHATSAPP */}
              <Button
                variant="contained"
                color="success"
                onClick={() => {
                  const phone = order.shippingAddress.phone;

                  const msg = `Hello, your invoice is ready. Download here: ${API_URL}/invoice/download/${order._id}`;

                  window.open(
                    `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`,
                    "_blank",
                  );
                }}
              >
                WhatsApp
              </Button>
            </Box>
          </SectionCard>
        </Stack>
        {/* Return Section */}

        {order.returnImages?.length > 0 && (
          <Box mt={2}>
            <Typography fontWeight={600}>Return Images</Typography>

            <Stack direction="row" spacing={2} mt={1}>
              {order.returnImages.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  width="100"
                  height="100"
                  style={{
                    objectFit: "cover",
                    borderRadius: "8px",
                  }}
                />
              ))}
            </Stack>
          </Box>
        )}
        {order.returnDescription && (
          <Typography fontSize={13}>
            <b>Description:</b> {order.returnDescription}
          </Typography>
        )}

        {order.returnStatus !== "None" && (
          <SectionCard
            title="Return Tracking"
            icon={<LocalShippingOutlinedIcon />}
          >
            <Typography fontSize={13}>
              <b>Status:</b> {order.returnStatus}
            </Typography>

            <Typography fontSize={13}>
              <b>Pickup Status:</b> {order.returnPickupStatus}
            </Typography>

            {order.returnReason && (
              <Typography fontSize={13}>
                <b>User Reason:</b> {order.returnReason}
              </Typography>
            )}

            {order.adminNote && (
              <Typography fontSize={13}>
                <b>Admin Note:</b> {order.adminNote}
              </Typography>
            )}

            {order.returnRequestedAt && (
              <Typography fontSize={12}>
                Requested:{" "}
                {new Date(order.returnRequestedAt).toLocaleString("en-IN")}
              </Typography>
            )}

            {order.refundStatus && (
              <Typography fontSize={13}>
                <b>Refund Status:</b> {order.refundStatus}
              </Typography>
            )}

            {order.returnCompletedAt && (
              <Typography fontSize={12}>
                Completed:{" "}
                {new Date(order.returnCompletedAt).toLocaleString("en-IN")}
              </Typography>
            )}
          </SectionCard>
        )}
      </Container>
    </Box>
  );
}
