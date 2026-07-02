"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import {
  Box,
  Container,
  Typography,
  Paper,
  Breadcrumbs,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Drawer,
  IconButton,
  Button,
  Divider,
} from "@mui/material";

import TuneIcon from "@mui/icons-material/Tune";
import CloseIcon from "@mui/icons-material/Close";

import { useEffect } from "react";
import ProductGrid from "@/components/product/ProductGrid";
import ProductFilters from "@/components/product/ProductFilters";
import EmptyState from "@/components/common/EmptyState";
import { API_URL } from "@/lib/api";

export default function ProductsPageContent()  {
  const [productList, setProductList] = useState([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [category, setCategory] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [wishlistMap, setWishlistMap] = useState({});
  const searchParams = useSearchParams();
  const [page, setPage] = useState(1);
const [totalPages, setTotalPages] = useState(1);
const [totalProducts, setTotalProducts] = useState(0);
const limit = 12;

  const selectedCategory = searchParams.get("category") || "";
  const selectedType = searchParams.get("type") || "";
/*   const matchesCategory = selectedCategory
    ? productList.category?.toLowerCase() === selectedCategory.toLowerCase()
    : true;
 */
  const pageTitle = selectedCategory
    ? `${selectedCategory} Collection`
    : selectedType === "new-arrivals"
      ? "New Arrivals"
      : selectedType === "sale"
        ? "Sale Products"
        : "All Products";

  const filteredProducts = useMemo(() => {
    return (productList || [])
      .filter((productList) => {
        const matchesSearch = productList?.name
          ?.toLowerCase()
          ?.includes(search.toLowerCase());

        const matchesCategory = selectedCategory
          ? productList?.category?.toLowerCase() ===
            selectedCategory.toLowerCase()
          : category
            ? productList?.category?.toLowerCase() === category.toLowerCase()
            : true;

        const matchesUrlType =
          selectedType === "new-arrivals"
            ? productList.isNewArrival
            : selectedType === "sale"
              ? productList.isSale
              : true;

        const matchesType =
          filterType === "new"
            ? productList.isNewArrival
            : filterType === "sale"
              ? productList.isSale
              : true;

        return (
          matchesSearch && matchesCategory && matchesUrlType && matchesType
        );
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "priceLow":
            return a.price - b.price;
          case "priceHigh":
            return b.price - a.price;
          case "name":
            return a.name.localeCompare(b.name);
          default:
            return 0;
        }
      });
  }, [
    productList,
    search,
    category,
    selectedCategory,
    selectedType,
    sortBy,
    filterType,
  ]);

const fetchProducts = async () => {
  try {
    const query = new URLSearchParams({
      page,
      limit,
      search,
      category,
      type: filterType,
    });

    const res = await fetch(
      `${API_URL}/products?${query.toString()}`
    );

    const data = await res.json();

    setProductList(Array.isArray(data.products) ? data.products : []);
    setTotalPages(data.totalPages || 1);
    setTotalProducts(data.total || 0);
  } catch (err) {
    console.log("Error loading products", err);
  }
};

useEffect(() => {
  window.scrollTo({ top: 0, behavior: "smooth" });
}, [page]);

useEffect(() => {
  const delay = setTimeout(() => {
    fetchProducts();
  }, 300);

  return () => clearTimeout(delay);
}, [page, search, category, filterType]);

useEffect(() => {
  if (page > totalPages) {
    setPage(totalPages || 1);
  }
}, [totalPages]);

useEffect(() => {
  setPage(1);
}, [search, category, filterType]);

  useEffect(() => {
    const fetchWishlist = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch(`${API_URL}/wishlist`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      const list = Array.isArray(data) ? data : [];
      const map = {};
      list.forEach((item) => {
        map[item.productId._id] = item._id;
      });

      setWishlistMap(map);
    };

    fetchWishlist();
  }, []);

  // Shared filter controls rendered in both bar and drawer
  const FilterControls = (
    <Stack spacing={2} direction={{ xs: "column", md: "row" }}>
      <Box flex={2}>
        <ProductFilters
          search={search}
          setSearch={setSearch}
          category={category}
          setCategory={setCategory}
        />
      </Box>

      <Box flex={1}>
        <FormControl fullWidth size="small">
          <InputLabel>Sort By</InputLabel>
          <Select
            value={sortBy}
            label="Sort By"
            onChange={(e) => setSortBy(e.target.value)}
          >
            <MenuItem value="">Default</MenuItem>
            <MenuItem value="priceLow">Price: Low to High</MenuItem>
            <MenuItem value="priceHigh">Price: High to Low</MenuItem>
            <MenuItem value="name">Name: A–Z</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Box flex={1}>
        <FormControl fullWidth size="small">
          <InputLabel>Type</InputLabel>
          <Select
            value={filterType}
            label="Type"
            onChange={(e) => setFilterType(e.target.value)}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="new">New Arrivals</MenuItem>
            <MenuItem value="sale">Sale</MenuItem>
          </Select>
        </FormControl>
      </Box>
    </Stack>
  );

  return (
    <Box sx={{ bgcolor: "#f8f9fb", minHeight: "100vh", py: { xs: 3, md: 2 } }}>
      <Container maxWidth="xl">
        {/* Breadcrumbs */}
        <Breadcrumbs sx={{ mb: 2 }}>
          <Link
            href="/"
            style={{ textDecoration: "none", color: "#666", fontSize: 13 }}
          >
            Home
          </Link>
          <Typography sx={{ fontSize: 13 }}>{pageTitle}</Typography>
        </Breadcrumbs>

        {/* Header */}
        <Stack
          direction="row"
          alignItems={{ xs: "flex-start", sm: "center" }}
          justifyContent="space-between"
          flexWrap="wrap"
          gap={1}
          mb={3}
        >
          <Box>
            <Typography
              variant="h4"
              fontWeight={700}
              sx={{ fontSize: { xs: "1.5rem", md: "2.125rem" } }}
            >
              {pageTitle}
            </Typography>
            <Typography color="text.secondary" mt={0.5} sx={{ fontSize: 14 }}>
              Showing <strong>{filteredProducts.length}</strong> products
            </Typography>
          </Box>

          {/* Mobile filter button */}
          <Button
            startIcon={<TuneIcon sx={{ fontSize: 16 }} />}
            onClick={() => setDrawerOpen(true)}
            variant="outlined"
            size="small"
            sx={{
              display: { xs: "inline-flex", md: "none" },
              borderRadius: 2,
              borderColor: "divider",
              color: "text.primary",
              fontSize: 13,
              "&:hover": { bgcolor: "grey.100" },
            }}
          >
            Filters & Sort
          </Button>
        </Stack>

        {/* Desktop filter bar */}
        <Paper
          elevation={0}
          sx={{
            p: 2.5,
            mb: 4,
            borderRadius: 1,
            border: "1px solid #e5e7eb",
            display: { xs: "none", md: "block" },
          }}
        >
          {FilterControls}
        </Paper>

        {/* Products */}
        {filteredProducts.length > 0 ? (
          <ProductGrid
            products={filteredProducts}
            wishlistMap={wishlistMap}
            setWishlistMap={setWishlistMap}
          />
        ) : (
          <Paper sx={{ py: 10, borderRadius: 4 }}>
            <EmptyState title={`No products found in ${pageTitle}`} />
          </Paper>
        )}
      </Container>

      <Stack direction="row" spacing={1} justifyContent="center" mt={4}>
  <Button
    disabled={page === 1}
    onClick={() => setPage((prev) => prev - 1)}
    variant="outlined"
  >
    Prev
  </Button>
{Array.from({ length: totalPages }, (_, i) => {
  const pageNumber = i + 1;

  return (
    <Button
      key={i}
      variant={page === pageNumber ? "contained" : "outlined"}
      onClick={() => setPage(pageNumber)}
    >
      {pageNumber}
    </Button>
  );
})}
  <Button
    disabled={page === totalPages}
    onClick={() => setPage((prev) => prev + 1)}
    variant="outlined"
  >
    Next
  </Button>
</Stack>

      {/* Mobile filter drawer */}
      <Drawer
        anchor="bottom"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: "16px 16px 0 0",
            px: 2.5,
            pt: 2,
            pb: 3,
            maxHeight: "85vh",
          },
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={2}
        >
          <Typography fontWeight={600} fontSize={15}>
            Filters & Sort
          </Typography>
          <IconButton
            size="small"
            onClick={() => setDrawerOpen(false)}
            aria-label="Close"
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Stack>

        <Divider sx={{ mb: 2.5 }} />

        {FilterControls}

        <Box mt={3}>
          <Button
            fullWidth
            variant="contained"
            onClick={() => setDrawerOpen(false)}
            sx={{
              bgcolor: "#111",
              color: "#fff",
              borderRadius: 2,
              fontWeight: 600,
              fontSize: 13,
              py: 1.25,
              "&:hover": { bgcolor: "#333" },
            }}
          >
           Showing <strong>{filteredProducts.length}</strong> of <strong>{totalProducts}</strong> products
          </Button>
        </Box>
      </Drawer>
    </Box>
  );
}
