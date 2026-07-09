"use client";

import { useEffect, useState, useRef } from "react";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  IconButton,
  Button,
  Stack,
  Box,
} from "@mui/material";
import Link from "next/link";
import DeleteIcon from "@mui/icons-material/Delete";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import { API_URL } from "@/lib/api";
import { toast } from "react-toastify";

export default function WishlistPage() {
  const [items, setItems] = useState([]);
  const hasFetched = useRef(false);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const fetchWishlist = async () => {
    if (!token) {
      toast.info("Please login to use wishlist");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/wishlist`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to load wishlist");
        return;
      }

      setItems(data);
    } catch (err) {
      toast.error("Something went wrong");
    }
  };
  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    fetchWishlist();
  }, []);

  const removeItem = async (id, showToast = true) => {
    try {
      const res = await fetch(`${API_URL}/wishlist/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        toast.error("Failed to remove item");
        return;
      }

      if (showToast) {
        toast.success("Removed from wishlist ");
      }

      fetchWishlist();
    } catch {
      toast.error("Something went wrong");
    }
  };
  const moveToCart = async (productId, wishlistId) => {
    try {
      const res = await fetch(`${API_URL}/cart/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId,
          quantity: 1,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to add to cart");
        return;
      }

      await removeItem(wishlistId, false);

      toast.success("Moved to cart successfully 🛒");
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  return (
    <Container sx={{ py: 5 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="h4" fontWeight={800} color="#111827">
            My Wishlist
          </Typography>

          <Typography variant="body2" color="text.secondary" mt={0.5}>
            {items.length} saved items
          </Typography>
        </Box>
      </Box>

      {items.length === 0 ? (
        <Box
          sx={{
            py: 10,
            textAlign: "center",
          }}
        >
          <ShoppingBagIcon
            sx={{
              fontSize: 70,
              color: "#d1d5db",
              mb: 2,
            }}
          />

          <Typography variant="h5" fontWeight={700}>
            Your Wishlist is Empty
          </Typography>

          <Typography color="text.secondary" mt={1} mb={3}>
            Save products here for later.
          </Typography>

          <Button
            variant="contained"
            href="/products"
            sx={{
              bgcolor: "#111827",
              borderRadius: 3,
              px: 4,
            }}
          >
            Explore Products
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {Array.isArray(items) &&
            items?.map((item) => (
              <Grid item xs={12} sm={6} md={3} key={item._id}>
                <Card
                  component={Link}
                  href={`/products/${item.productId._id}`}
                  sx={{
                    textDecoration: "none",
                    color: "inherit",
                    display: "block",
                    borderRadius: 3,
                    overflow: "hidden",
                    transition: "0.3s",
                    "&:hover": {
                      transform: "translateY(-5px)",
                      boxShadow: 5,
                    },
                  }}
                >
                  {/* IMAGE */}
                  <CardMedia
                    component="img"
                    height="220"
                    image={item.productId.images?.[0]}
                    sx={{ objectFit: "cover" }}
                  />

                  <CardContent>
                    {/* NAME */}
                    <Typography fontWeight={600} noWrap>
                      {item.productId.name}
                    </Typography>

                    {/* PRICE */}
                    <Typography
                      sx={{
                        fontWeight: 700,
                        color: "primary.main",
                        mt: 1,
                        borderBottom: "none",
                        textDecoration: "none",
                      }}
                    >
                      ₹{item.productId.price}
                    </Typography>

                    {/* ACTIONS */}
                    <Stack direction="row" spacing={1} mt={2}>
                      {/* MOVE TO CART */}
                      <Button
                        size="small"
                        variant="contained"
                        startIcon={<ShoppingBagIcon />}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          moveToCart(item.productId._id, item._id);
                        }}
                        sx={{
                          bgcolor: "#111",
                          fontSize: 11,
                          flex: 1,
                          "&:hover": { bgcolor: "#333" },
                        }}
                      >
                        Move
                      </Button>

                      {/* DELETE */}
                      <IconButton
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          removeItem(item._id);
                        }}
                        sx={{
                          bgcolor: "#fff0f0",
                          color: "red",
                          borderRadius: 2,
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
        </Grid>
      )}
    </Container>
  );
}
