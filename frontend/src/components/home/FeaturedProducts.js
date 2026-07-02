"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Stack,
  Button,
} from "@mui/material";

import ProductGrid from "@/components/product/ProductGrid";
import EmptyState from "@/components/common/EmptyState";
import { API_URL } from "@/lib/api";

export default function FeaturedProducts() {
  const [productList, setProductList] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  const limit = 12;

  const fetchFeaturedProducts = async () => {
    try {
      const res = await fetch(
        `${API_URL}/products/featured?page=${page}&limit=${limit}`
      );

      const data = await res.json();

      console.log("FEATURED RESPONSE:", data);

      if (Array.isArray(data)) {
        setProductList(data);
        setTotalPages(1);
        setTotalProducts(data.length);
      } else {
        setProductList(data.products || []);
        setTotalPages(data.totalPages || 1);
        setTotalProducts(data.total || 0);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchFeaturedProducts();
  }, [page]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  return (
    <Box sx={{ bgcolor: "#f8f9fb", minHeight: "100vh", py: 5 }}>
      <Container maxWidth="xl">

        <Typography variant="h4" fontWeight={700} mb={1}>
          Featured Products
        </Typography>

        <Typography color="text.secondary" mb={3}>
          Showing <strong>{productList.length}</strong> products
        </Typography>

        {productList.length > 0 ? (
          <ProductGrid
            products={productList}
            wishlistMap={{}}          // ✅ FIX
            setWishlistMap={() => {}} // ✅ FIX
          />
        ) : (
          <Paper sx={{ py: 10, borderRadius: 4 }}>
            <EmptyState title="No featured products found" />
          </Paper>
        )}

        {/* PAGINATION */}
        <Stack direction="row" spacing={1} justifyContent="center" mt={4}>
          <Button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            variant="outlined"
          >
            Prev
          </Button>

          {Array.from({ length: totalPages }, (_, i) => (
            <Button
              key={i}
              variant={page === i + 1 ? "contained" : "outlined"}
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </Button>
          ))}

          <Button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            variant="outlined"
          >
            Next
          </Button>
        </Stack>

        <Box textAlign="center" mt={2}>
          <Typography fontSize={13} color="text.secondary">
            Total Featured: <strong>{totalProducts}</strong>
          </Typography>
        </Box>

      </Container>
    </Box>
  );
}