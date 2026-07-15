"use client";
import { useEffect, useRef, useState } from "react";
import {
  Box,
  Paper,
  TextField,
  MenuItem,
  InputAdornment,
  Chip,
  Stack,
  Typography,
  IconButton,
 FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import TuneRoundedIcon from "@mui/icons-material/TuneRounded";
import { API_URL } from "@/lib/api";

// Matches backend's `type` query param in getProducts (isNewArrival / isSale)
const TYPE_OPTIONS = [
  { label: "All", value: "" },
  { label: "New Arrivals", value: "new-arrivals" },
  { label: "Sale", value: "sale" },
];

export default function ProductFilters({
    category,
  subCategory,
  search,
  filterType,
  sortBy,
  setSortBy,
  updateURL,
}) {
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // Local, instantly-editable search value. The URL/backend only gets
  // updated after the person stops typing, so search doesn't feel laggy
  // and we don't spam the API on every keystroke.
  const [searchInput, setSearchInput] = useState(search || "");
  const debounceRef = useRef(null);

  useEffect(() => {
    setSearchInput(search || "");
  }, [search]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      if (searchInput !== search) {
        updateURL("search", searchInput);
      }
    }, 400);

    return () => clearTimeout(debounceRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);

  // 🔥 categories + subCategories live from backend (Product.getCategoryOptions)
  useEffect(() => {
    let ignore = false;

    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_URL}/products/categories`);

        if (!res.ok) {
          throw new Error(`Category fetch failed with status ${res.status}`);
        }

        const data = await res.json();

        if (!ignore) {
          setCategories(Array.isArray(data.categories) ? data.categories : []);
          setSubCategories(
            Array.isArray(data.subCategories) ? data.subCategories : [],
          );
        }
      } catch (err) {
        console.error("Failed to load categories:", err);
        if (!ignore) {
          setCategories([]);
          setSubCategories([]);
        }
      } finally {
        if (!ignore) setLoadingCategories(false);
      }
    };

    fetchCategories();

    return () => {
      ignore = true;
    };
  }, []);

const activeFilters = [
  category && {
    key: "category",
    label: `Category: ${category}`,
  },

  subCategory && {
    key: "subCategory",
    label: `Sub Category: ${subCategory}`,
  },

  filterType && {
    key: "type",
    label:
      TYPE_OPTIONS.find((t) => t.value === filterType)?.label ||
      filterType,
  },

  sortBy && {
    key: "sort",
    label: `Sort: ${
      {
        priceLow: "Price Low → High",
        priceHigh: "Price High → Low",
        name: "Name A-Z",
      }[sortBy]
    }`,
  },

  search && {
    key: "search",
    label: `"${search}"`,
  },
].filter(Boolean);

const clearFilter = (key) => {
  if (key === "search") setSearchInput("");

  if (key === "sort") {
    setSortBy("");
    return;
  }

  updateURL(key, "");
};

const clearAll = () => {
  setSearchInput("");

  updateURL("search", "");
  updateURL("category", "");
  updateURL("subCategory", "");
  updateURL("type", "");

  setSortBy("");
};

  return (
    <Paper
      variant="outlined"
      sx={{
        borderRadius: 3,
        p: { xs: 1.5, sm: 2 },
        mb: { xs: 2, sm: 3 },
        borderColor: "divider",
      }}
    >
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={{ xs: 1.25, sm: 1.5 }}
        alignItems={{ xs: "stretch", sm: "center" }}
      >
        <Box
          sx={{
            display: { xs: "none", sm: "flex" },
            alignItems: "center",
            gap: 0.5,
            color: "text.secondary",
            flexShrink: 0,
          }}
        >
          <TuneRoundedIcon fontSize="small" />
          <Typography fontSize={13} fontWeight={600}>
            Filters
          </Typography>
        </Box>

        <TextField
          placeholder="Search products..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          size="small"
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" sx={{ color: "text.disabled" }} />
              </InputAdornment>
            ),
            endAdornment: searchInput ? (
              <InputAdornment position="end">
                <IconButton size="small" onClick={() => setSearchInput("")}>
                  <ClearIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ) : null,
            sx: { borderRadius: 2 },
          }}
          sx={{
            minWidth: { xs: "100%", sm: 220 },
            maxWidth: { sm: 280 },
          }}
        />

        <TextField
          select
          label="Category"
          value={category || ""}
          onChange={(e) => updateURL("category", e.target.value)}
          size="small"
          fullWidth
          disabled={loadingCategories}
          sx={{
            minWidth: { xs: "100%", sm: 170 },
            maxWidth: { sm: 200 },
            "& .MuiOutlinedInput-root": { borderRadius: 2 },
          }}
        >
          <MenuItem value="">All Categories</MenuItem>
          {categories.map((cat) => (
            <MenuItem key={cat} value={cat}>
              {cat}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          label="Sub Category"
          value={subCategory || ""}
          onChange={(e) => updateURL("subCategory", e.target.value)}
          size="small"
          fullWidth
          disabled={loadingCategories}
          sx={{
            minWidth: { xs: "100%", sm: 170 },
            maxWidth: { sm: 200 },
            "& .MuiOutlinedInput-root": { borderRadius: 2 },
          }}
        >
          <MenuItem value="">All Types</MenuItem>
          {subCategories.map((sub) => (
            <MenuItem key={sub} value={sub}>
              {sub}
            </MenuItem>
          ))}
        </TextField>

        {/* New Arrivals / Sale — segmented chips read better than a dropdown */}
        <Stack direction="row" spacing={1} sx={{ flexShrink: 0 }}>
        <Box
  sx={{
    display: "flex",
    gap: 1.5,
    width: { xs: "100%", md: "auto" },
    flexWrap: "wrap",
  }}
>
  {/* Sort By */}
  <Box sx={{ minWidth: 180, flex: 1 }}>
    <FormControl fullWidth size="small">
      <InputLabel>Sort By</InputLabel>

      <Select
        value={sortBy}
        label="Sort By"
        onChange={(e) => setSortBy(e.target.value)}
        sx={{ borderRadius: 2 }}
      >
        <MenuItem value="">Default</MenuItem>
        <MenuItem value="priceLow">Price: Low to High</MenuItem>
        <MenuItem value="priceHigh">Price: High to Low</MenuItem>
        <MenuItem value="name">Name: A–Z</MenuItem>
      </Select>
    </FormControl>
  </Box>

  {/* Product Type */}
  <Box sx={{ minWidth: 170, flex: 1 }}>
    <FormControl fullWidth size="small">
      <InputLabel>Type</InputLabel>

      <Select
        value={filterType || ""}
        label="Type"
        onChange={(e) => updateURL("type", e.target.value)}
        sx={{ borderRadius: 2 }}
      >
        <MenuItem value="">All</MenuItem>
        <MenuItem value="new-arrivals">New Arrivals</MenuItem>
        <MenuItem value="sale">Sale</MenuItem>
      </Select>
    </FormControl>
  </Box>
</Box>
        </Stack>
      </Stack>

      {/* Active filter chips */}
      {activeFilters.length > 0 && (
        <Stack
          direction="row"
          spacing={1}
          flexWrap="wrap"
          alignItems="center"
          sx={{ mt: 1.5, rowGap: 1 }}
        >
          {activeFilters.map((f) => (
            <Chip
              key={f.key}
              label={f.label}
              size="small"
              onDelete={() => clearFilter(f.key)}
              sx={{
                borderRadius: 2,
                bgcolor: "grey.100",
                fontSize: 12,
              }}
            />
          ))}
          <Typography
            component="button"
            onClick={clearAll}
            sx={{
              border: "none",
              background: "none",
              cursor: "pointer",
              fontSize: 12,
              fontWeight: 600,
              color: "text.secondary",
              textDecoration: "underline",
              p: 0,
              "&:hover": { color: "text.primary" },
            }}
          >
            Clear all
          </Typography>
        </Stack>
      )}
    </Paper>
  );
}
