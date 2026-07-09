"use client";

import {
  Paper,
  Typography,
  Divider,
  Stack,
  Button,
  Box,
  TextField,
} from "@mui/material";
import AppliedCoupon from "../coupon/AppliedCoupon";
import CircularProgress from "@mui/material/CircularProgress";
export default function OrderSummary({
  items = [],
  subtotal,
  shipping,
  tax,
  total,
  couponCode,
  setCouponCode,
  couponData,
  discount,
  onApplyCoupon,
  onRemoveCoupon,
  placingOrder,
  onPlaceOrder,
}) {
  return (
    <Paper
      sx={{
        p: 3,
        borderRadius: 3,
        border: "1px solid #e5e7eb",
        position: "sticky",
        top: 20,
      }}
    >
      <Typography fontSize={22} fontWeight={700}>
        Order Summary
      </Typography>

      <Divider sx={{ my: 2 }} />

      <Stack spacing={2}>
        {items.map((item) => (
          <Stack
            key={item.productId}
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography fontWeight={600}>{item.name}</Typography>

              <Typography variant="body2" color="text.secondary">
                Qty : {item.quantity}
              </Typography>
            </Box>

            <Typography fontWeight={700}>
              ₹{(item.price * item.quantity).toLocaleString()}
            </Typography>
          </Stack>
        ))}
      </Stack>

      <Divider sx={{ my: 3 }} />

      <Stack direction="row" spacing={1}>
        <TextField
          fullWidth
          size="small"
          color="success"
          placeholder="Coupon Code"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
          disabled={!!couponData}
        />

        <Button
          variant="contained"
          color="success"
          disabled={!couponCode || !!couponData}
          onClick={onApplyCoupon}
        >
          Apply
        </Button>
      </Stack>

      <AppliedCoupon
        coupon={couponData}
        discount={discount}
        onRemove={onRemoveCoupon}
      />

      <Divider sx={{ my: 3 }} />

      <Stack spacing={1.5}>
        <Stack direction="row" justifyContent="space-between">
          <Typography color="text.secondary">Subtotal</Typography>

          <Typography>₹{subtotal.toLocaleString()}</Typography>
        </Stack>

        <Stack direction="row" justifyContent="space-between">
          <Typography color="text.secondary">Shipping</Typography>

          <Typography>{shipping === 0 ? "Free" : `₹${shipping}`}</Typography>
        </Stack>

        <Stack direction="row" justifyContent="space-between">
          <Typography color="text.secondary">Tax</Typography>

          <Typography>₹{tax.toLocaleString()}</Typography>
        </Stack>

        {discount > 0 && (
          <Stack direction="row" justifyContent="space-between">
            <Typography color="success.main">Discount</Typography>

            <Typography color="success.main">
              -₹{discount.toLocaleString()}
            </Typography>
          </Stack>
        )}

        <Divider />

        <Stack direction="row" justifyContent="space-between">
          <Typography fontWeight={700} fontSize={18}>
            Total
          </Typography>

          <Typography fontWeight={700} fontSize={22}>
            ₹{total.toLocaleString()}
          </Typography>
        </Stack>
      </Stack>

      <Button
        fullWidth
        variant="contained"
        size="large"
        sx={{
          mt: 3,
          py: 1.5,
          borderRadius: 2,
          bgcolor: "black",
        }}
        onClick={onPlaceOrder}
      >
        {placingOrder ? (
          <>
            <CircularProgress size={20} sx={{ mr: 1, color: "#fff" }} />
            Placing Order...
          </>
        ) : (
          "Place Order"
        )}
      </Button>
    </Paper>
  );
}
