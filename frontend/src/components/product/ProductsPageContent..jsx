"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";

import {
  Box,
  Container,
  Typography,
  Paper,
  Breadcrumbs,
  Stack,
  Drawer,
  IconButton,
  Button,
  Divider,
} from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import TuneIcon from "@mui/icons-material/Tune";
import CloseIcon from "@mui/icons-material/Close";

import ProductGrid from "@/components/product/ProductGrid";
import ProductFilters from "@/components/product/ProductFilters";
import EmptyState from "@/components/common/EmptyState";
import { API_URL } from "@/lib/api";

export default function ProductsPageContent() {
  const [productList, setProductList] = useState([]);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [wishlistMap, setWishlistMap] = useState({});
  const searchParams = useSearchParams();

  // 🔥 single source of truth for every filter — all read from the URL,
  // ProductFilters writes to the URL via updateURL(). No local sortBy /
  // type state duplicated here anymore.
  const search = searchParams.get("search") || "";
  const selectedCategory = searchParams.get("category") || "";
  const selectedSubCategory = searchParams.get("subCategory") || "";
  const selectedType = searchParams.get("type") || "";
  const selectedSort = searchParams.get("sort") || "";

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const limit = 12;
  const router = useRouter();

  const updateURL = (key, value) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value) params.set(key, value);
    else params.delete(key);

    router.push(`/products?${params.toString()}`);
  };

  const pageTitle = search
    ? `Search results for "${search}"`
    : selectedCategory
      ? `${selectedCategory} Collection`
      : selectedType === "new-arrivals"
        ? "New Arrivals"
        : selectedType === "sale"
          ? "Sale Products"
          : "All Products";

  const searchWords = search
    .toLowerCase()
    .split(" ")
    .filter((w) => w.length > 1);

  const filteredProducts = useMemo(() => {
    return (productList || [])
      .filter((item) => {
        const matchesSearch =
          searchWords.length === 0
            ? true
            : searchWords.every((word) => {
                const name = item?.name?.toLowerCase() || "";
                const category = item?.category?.toLowerCase() || "";
                const description = item?.description?.toLowerCase() || "";

                return (
                  name.includes(word) ||
                  category.includes(word) ||
                  description.includes(word)
                );
              });

        const matchesCategory = selectedCategory
          ? item.category
              ?.toLowerCase()
              .includes(selectedCategory.toLowerCase())
          : true;

        const matchesSubCategory = selectedSubCategory
          ? item.subCategory
              ?.toLowerCase()
              .includes(selectedSubCategory.toLowerCase())
          : true;

        const matchesUrlType =
          selectedType === "new-arrivals"
            ? item.isNewArrival
            : selectedType === "sale"
              ? item.isSale
              : true;

        return (
          matchesSearch &&
          matchesCategory &&
          matchesSubCategory &&
          matchesUrlType
        );
      })
      .sort((a, b) => {
        // values match ProductFilters' SORT_OPTIONS
        switch (selectedSort) {
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
    selectedCategory,
    selectedSubCategory,
    selectedType,
    selectedSort,
  ]);

  const fetchProducts = async () => {
    try {
      const query = new URLSearchParams({
        page,
        limit,
        category: selectedCategory || "",
        subCategory: selectedSubCategory || "",
        type: selectedType || "",
        search,
        sort: selectedSort || "",
      });

      const res = await fetch(`${API_URL}/products?${query.toString()}`);

      if (!res.ok) {
        throw new Error(`Products fetch failed with status ${res.status}`);
      }

      const data = await res.json();

      setProductList(data.products || []);
      setTotalPages(data.totalPages || 1);
      setTotalProducts(data.total || 0);
    } catch (err) {
      console.error("Error loading products", err);
      setProductList([]);
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
  }, [
    page,
    search,
    selectedCategory,
    selectedSubCategory,
    selectedType,
    selectedSort,
  ]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages || 1);
    }
  }, [totalPages]);

  // reset to page 1 whenever any filter changes
  useEffect(() => {
    setPage(1);
  }, [
    search,
    selectedCategory,
    selectedSubCategory,
    selectedType,
    selectedSort,
  ]);

  useEffect(() => {
    const fetchWishlist = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch(`${API_URL}/wishlist`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) return;

        const data = await res.json();
        const list = Array.isArray(data) ? data : [];
        const map = {};

        list.forEach((item) => {
          const productId = item?.productId?._id;
          if (productId) {
            map[productId] = item._id;
          }
        });

        setWishlistMap(map);
      } catch (err) {
        console.error("Failed to load wishlist", err);
      }
    };

    fetchWishlist();
  }, []);

  // Filters + Sort + Type — all handled inside ProductFilters now.
  const FilterControls = (
    <ProductFilters
      category={selectedCategory}
      subCategory={selectedSubCategory}
      search={search}
      filterType={selectedType}
      sortBy={selectedSort}
      setSortBy={(value) => updateURL("sort", value)}
      updateURL={updateURL}
    />
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
              fontWeight={600}
              sx={{ fontSize: { xs: "1.5rem", md: "1.8rem" } }}
            >
              {pageTitle}
            </Typography>
            <Typography color="text.secondary" mt={0.5} sx={{ fontSize: 14 }}>
              Showing <strong> {filteredProducts.length} </strong> results
              {search && (
                <span>
                  {" "}
                  for "<b>{search}</b>"
                </span>
              )}
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

        {/* Desktop filter bar — ProductFilters already renders its own
            Paper/border/padding, so it's used directly without an extra
            wrapper here. */}
        <Box sx={{ display: { xs: "none", md: "block" } }}>
          {FilterControls}
        </Box>

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

      <Stack
        direction="row"
        spacing={1}
        justifyContent="center"
        alignItems="center"
        mt={4}
        sx={{
          flexWrap: "wrap",
          gap: 1,
        }}
      >
        {/* Prev */}
        <Button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          variant="outlined"
          size="small"
          sx={{
            borderRadius: 1,
            textTransform: "none",
          }}
        >
          Prev
        </Button>

        {/* Pages (clean range UI) */}
        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .filter((p) => {
            return p === 1 || p === totalPages || Math.abs(p - page) <= 1;
          })
          .map((pageNumber, idx, arr) => (
            <Box
              key={pageNumber}
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              {/* ellipsis */}
              {idx > 0 && pageNumber - arr[idx - 1] > 1 && (
                <span style={{ padding: "0 6px" }}>...</span>
              )}

              <Button
                onClick={() => setPage(pageNumber)}
                variant={page === pageNumber ? "contained" : "outlined"}
                size="small"
                sx={{
                  bgcolor: page === pageNumber ? "black" : "transparent",
                  minWidth: 36,
                  borderRadius: "10px",
                  fontWeight: 600,
                  textTransform: "none",
                }}
              >
                {pageNumber}
              </Button>
            </Box>
          ))}

        {/* Next */}
        <Button
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
          variant="outlined"
          size="small"
          sx={{
            borderRadius: 1,
            textTransform: "none",
          }}
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
              fontSize: 12,
              py: 1.25,
              "&:hover": { bgcolor: "#333" },
            }}
          >
            show{" "}
            {/*   Showing <strong> {filteredProducts.length} </strong> of {" "}
            <strong>{totalProducts}</strong> */}{" "}
            products
          </Button>
        </Box>
      </Drawer>
    </Box>
  );
}
