"use client";

import {
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Stack,
  Radio,
  RadioGroup,
  FormControlLabel,
  Divider,
  Card,
  CardContent,
  Box,
  IconButton,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import AddressList from "@/components/address/AddressList";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import OrderSummary from "@/components/checkout/OrderSummary";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import ConfirmationDialog from "@/components/common/ConfirmationDialog";
import RazorpayPaymentButton from "@/components/payment/RazorpayPaymentButton";
import { API_URL } from "@/lib/api";
import { getPaymentSettings } from "@/services/payment";

export default function CheckoutPage() {
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [couponData, setCouponData] = useState(null);
  const [discount, setDiscount] = useState(0);
  const [couponCode, setCouponCode] = useState("");
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [payment, setPayment] = useState(null);
  const subtotal = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
  const shipping = subtotal >= 2000 ? 0 : 99;
  const tax = Math.round(subtotal * 0.05);
  const total = Math.max(subtotal + shipping + tax - discount, 0);

useEffect(() => {
  if (!payment) return;

  if (payment.razorpay?.enabled) {
    setPaymentMethod("RAZORPAY");
  } else if (payment.cod?.enabled) {
    setPaymentMethod("COD");
  }
}, [payment]);

  useEffect(() => {
    fetchAddresses();
    const savedCoupon = localStorage.getItem("checkoutCoupon");

    if (savedCoupon) {
      const data = JSON.parse(savedCoupon);

      setCouponData(data.coupon);
      setDiscount(data.discount);
      setCouponCode(data.coupon.code);
    }
    const buyNow = localStorage.getItem("buyNow");

    console.log("RAW", buyNow);
    if (buyNow) {
      const parsed = JSON.parse(buyNow);

      console.log("PARSED", parsed);

      console.log("QUANTITY", parsed[0].quantity);
      const fixedItems = parsed.map((item) => ({
        ...item,
        quantity: Number(item.quantity) || 1,
      }));

      setItems(fixedItems);
    } else {
      fetchCart();
    }
  }, []);

  const validateStock = () => {
    let updatedItems = [];
    let hasChange = false;

    for (let item of items) {
      if (item.stock === 0) {
        toast.error(`${item.name} is out of stock`);
        return null;
      }

      if (item.quantity > item.stock) {
        hasChange = true;
      }

      updatedItems.push({
        ...item,
        quantity: Math.min(item.quantity, item.stock),
      });
    }

    /*   if (hasChange) {
      const msg =
        "⚠️ Stock updated for some items:\n\n" +
        items
          .filter((i) => i.quantity > i.stock)
          .map(
            (i) =>
              `${i.name}: only ${i.stock} available (you selected ${i.quantity})`,
          )
          .join("\n") +
        "\n\nDo you want to continue?";

     
    }
 */
    return updatedItems;
  };

  useEffect(() => {
    const loadPaymentSettings = async () => {
      try {
        const data = await getPaymentSettings();
        console.log("Payment Settings:", data);
        console.log("yoooo");
        setPayment(data);
      } catch (err) {
        toast.error("Unable to load payment methods");
      }
    };
    console.log("uuuu");
    loadPaymentSettings();
  }, []);
  const fetchCart = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_URL}/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      const cartArray = Array.isArray(data) ? data : [];
      console.log(cartArray);
      const correctedItems = cartArray.map((item) => {
        const stock = item.productId?.stock || 0;

        return {
          productId: item.productId?._id,
          name: item.productId?.name,
          image: item.productId?.images?.[0],
          price: item.productId?.price,
          quantity: Math.min(item.quantity || 1, stock),

          color: item.color,
          size: item.size,

          sku: item.productId?.sku,
          category: item.productId?.category,
          subCategory: item.productId?.subCategory,
          brand: item.productId?.brand,
          fabric: item.productId?.fabric,

          stock,
        };
      });
      console.log(correctedItems, "yoo");
      setItems(correctedItems);
    } catch (err) {
      console.log(err);
      setItems([]);
    }
  };

  useEffect(() => {
    if (items.some((i) => i.quantity < 1)) {
      toast.warning(
        "Some cart quantities were updated based on available stock.",
      );
    }
  }, [items]);

  useEffect(() => {
    if (couponData && subtotal < couponData.minOrderAmount) {
      setCouponData(null);
      setDiscount(0);
      setCouponCode("");

      localStorage.removeItem("checkoutCoupon");

      toast.info(
        "Coupon has been removed because the minimum order amount is no longer met.",
      );
    }
  }, [subtotal, couponData]);

  const fetchAddresses = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API_URL}/users/addresses`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    setAddresses(data);

    if (data.length > 0) {
      setSelectedAddress(data[0]);
    }
  };

  const handleApplyCoupon = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_URL}/coupons/apply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          code: couponCode,
          subtotal,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message);
        return;
      }

      setCouponData(data.coupon);
      setDiscount(data.discount);

      localStorage.setItem(
        "checkoutCoupon",
        JSON.stringify({
          coupon: data.coupon,
          discount: data.discount,
        }),
      );

      toast.success("Coupon applied successfully.");
    } catch (err) {
      console.log(err);
    }
  };

  const handlePlaceOrder = async (transactionId = "", razorpayOrderId = "") => {
    if (!selectedAddress) {
      toast.warning("Please select a delivery address.");
      return;
    }
    if (items.length === 0) {
      toast.warning("Your cart is empty.");
      return;
    }

    setPlacingOrder(true);
    const validatedItems = validateStock();

    if (!validatedItems) {
      // FIX: pehle yahan return ho jata tha lekin placingOrder true hi reh jata
      // tha — button hamesha "Placing..." dikhata reh jata. Ab reset karte hain.
      setPlacingOrder(false);
      return;
    }

    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${API_URL}/orders/place`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: validatedItems,
          shippingAddress: selectedAddress,
          paymentMethod,
          coupon: couponData?._id,
          discount,
          total,
          transactionId, // FIX: Razorpay ke liye ab payment id save hoga
          razorpayOrderId,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to place order");
        return;
      }

      localStorage.removeItem("buyNow");
      localStorage.removeItem("checkoutCoupon");
      localStorage.removeItem("appliedCoupon");
      toast.success("Your order has been placed successfully.");
      localStorage.setItem("orderDetailsFrom", "checkout");
      router.push(`/profile/orders/${data._id}`);
    } catch (err) {
      toast.error("Something went wrong while placing the order.");
    } finally {
      setPlacingOrder(false);
    }
  };
  const removeCoupon = () => {
    setCouponData(null);
    setDiscount(0);
    setCouponCode("");

    localStorage.removeItem("appliedCoupon");
    localStorage.removeItem("checkoutCoupon");

    window.dispatchEvent(new Event("coupon-update"));
  };

  useEffect(() => {
    const handleCouponUpdate = () => {
      const saved = localStorage.getItem("checkoutCoupon");

      if (!saved) {
        setCouponData(null);
        setDiscount(0);
        setCouponCode("");
        return;
      }

      const data = JSON.parse(saved);

      setCouponData(data.coupon);
      setDiscount(data.discount);
    };

    window.addEventListener("coupon-update", handleCouponUpdate);

    return () =>
      window.removeEventListener("coupon-update", handleCouponUpdate);
  }, []);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f6f8fb",
        py: 2,
        px: 1,
      }}
    >
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Stack direction="row" spacing={2} alignItems="center" mb={4}>
              <IconButton
                onClick={() => router.back()}
                sx={{
                  width: 46,
                  height: 46,
                }}
              >
                <ArrowBackIcon />
              </IconButton>

              <Box>
                <Typography fontSize={28} fontWeight={800}>
                  Checkout
                </Typography>

                <Typography color="text.secondary">
                  Complete your order securely
                </Typography>
              </Box>
            </Stack>
            <Paper sx={{ p: 3 }}>
              <Stack direction="row" alignItems="center" spacing={1} mb={3}>
                <LocalShippingOutlinedIcon
                  sx={{
                    color: "#2f3132",
                    fontSize: 28,
                  }}
                />

                <Typography variant="h5" fontWeight={700}>
                  Delivery Address
                </Typography>
              </Stack>

              {addresses.length === 0 ? (
                <>
                  <Typography>No address found.</Typography>

                  <Button
                    sx={{
                      mt: 2,
                    }}
                    variant="contained"
                    onClick={() => router.push("/profile/address")}
                  >
                    Add Address
                  </Button>
                </>
              ) : (
                <RadioGroup>
                  <AddressList
                    addresses={addresses}
                    selectedAddress={selectedAddress}
                    onSelect={setSelectedAddress}
                  />
                </RadioGroup>
              )}
            </Paper>

            <Paper
              elevation={0}
              sx={{
                p: 3,
                mt: 3,
                borderRadius: 3,
                border: "1px solid #e5e7eb",
                background: "#fff",
              }}
            >
              <Typography variant="h6" fontWeight={700} mb={2}>
                Payment Method
              </Typography>

             <RadioGroup
  value={paymentMethod}
  onChange={(e) => setPaymentMethod(e.target.value)}
>
  {payment?.cod?.enabled && (
    <FormControlLabel
      value="COD"
      control={<Radio />}
      label="Cash On Delivery"
    />
  )}

  {payment?.razorpay?.enabled && (
    <FormControlLabel
      value="RAZORPAY"
      control={<Radio />}
      label="Online Payment (UPI / Card / Wallet)"
    />
  )}
</RadioGroup>
              {paymentMethod === "RAZORPAY" && (
                <RazorpayPaymentButton
                 gatewayEnabled={payment?.razorpay?.enabled}
    items={items}
    shippingAddress={selectedAddress}
    coupon={couponData?._id}
    discount={discount}
                  onSuccess={(order) => {
                    localStorage.removeItem("buyNow");
                    localStorage.removeItem("checkoutCoupon");
                    localStorage.removeItem("appliedCoupon");

                    window.dispatchEvent(new Event("cart-update"));

                    toast.success("Payment Successful");

                    router.push(`/profile/orders/${order._id}`);
                  }}
                />
              )}
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <OrderSummary
              items={items}
              subtotal={subtotal}
              shipping={shipping}
              tax={tax}
              total={total}
              couponCode={couponCode}
              setCouponCode={setCouponCode}
              couponData={couponData}
              discount={discount}
              onApplyCoupon={handleApplyCoupon}
              onRemoveCoupon={() => {
                setCouponData(null);
                setDiscount(0);
                setCouponCode("");

                localStorage.removeItem("checkoutCoupon");
                localStorage.removeItem("appliedCoupon");
              }}
              placingOrder={placingOrder}
             onPlaceOrder={() => {
  if (paymentMethod === "COD") {
    setConfirmDialog(true);
  }
}}
            />
          </Grid>
        </Grid>
      </Container>
      <ConfirmationDialog
        open={confirmDialog}
        title="Confirm Your Order"
        message={`Please review your order before placing it.

✓ Delivery Address Selected
✓ Payment Method: ${
         paymentMethod === "COD"
  ? "Cash On Delivery"
  : "Online Payment"
        }

✓ Total Amount: ₹${total}

Do you want to continue?`}
        confirmText="Place Order"
        cancelText="Review Order"
        confirmColor="success"
        onCancel={() => setConfirmDialog(false)}
        onConfirm={() => {
          setConfirmDialog(false);

          if (paymentMethod === "COD") {
            handlePlaceOrder();
          }
        }}
      />
    </Box>
  );
}
