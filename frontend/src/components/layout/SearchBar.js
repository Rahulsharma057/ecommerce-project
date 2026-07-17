"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Popper,
  Paper,
  ClickAwayListener,
  List,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  Divider,
  Chip,
  Stack,
  CircularProgress,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import HistoryRoundedIcon from "@mui/icons-material/HistoryRounded";
import NorthEastRoundedIcon from "@mui/icons-material/NorthEastRounded";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import { API_URL } from "@/lib/api";

const RECENT_KEY = "veloura_recent_searches";
const MAX_RECENT = 6;

function getRecentSearches() {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveRecentSearch(term) {
  if (typeof window === "undefined" || !term.trim()) return;
  const current = getRecentSearches();
  const deduped = [term, ...current.filter((t) => t.toLowerCase() !== term.toLowerCase())];
  const trimmed = deduped.slice(0, MAX_RECENT);
  try {
    localStorage.setItem(RECENT_KEY, JSON.stringify(trimmed));
  } catch {}
  return trimmed;
}

// Bold the part of `text` that matches `query` — makes the dropdown feel
// like a real autocomplete instead of a static list.
function HighlightedText({ text, query }) {
  if (!query?.trim()) return <>{text}</>;
  const i = text.toLowerCase().indexOf(query.toLowerCase());
  if (i === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, i)}
      <Box component="span" sx={{ fontWeight: 800, color: "#111" }}>
        {text.slice(i, i + query.length)}
      </Box>
      {text.slice(i + query.length)}
    </>
  );
}

export default function SearchBar({ fullWidth }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState({ products: [], categories: [], brands: [] });
  const [recent, setRecent] = useState([]);
  const [activeIndex, setActiveIndex] = useState(-1);

  const anchorRef = useRef(null);
  const debounceRef = useRef(null);
  const abortRef = useRef(null);

  // URL → local sync (only when navigating directly / URL changes elsewhere)
  useEffect(() => {
    setQuery(searchParams.get("search") || "");
  }, [searchParams]);

  useEffect(() => {
    setRecent(getRecentSearches());
  }, []);

  // Debounced suggestion fetch — cancels the previous in-flight request so
  // fast typing never lets an older, slower response overwrite a newer one.
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!query.trim()) {
      setSuggestions({ products: [], categories: [], brands: [] });
      setLoading(false);
      return;
    }

    setLoading(true);
    debounceRef.current = setTimeout(async () => {
      if (abortRef.current) abortRef.current.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const res = await fetch(
          `${API_URL}/products/search/suggestions?q=${encodeURIComponent(query.trim())}`,
          { signal: controller.signal },
        );
        const data = await res.json();
        setSuggestions({
          products: data.products || [],
          categories: data.categories || [],
          brands: data.brands || [],
        });
      } catch (err) {
        if (err.name !== "AbortError") console.log(err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(debounceRef.current);
  }, [query]);

  const goToResults = useCallback(
    (term) => {
      const q = term.trim();
      if (!q) return;
      setRecent(saveRecentSearch(q) || getRecentSearches());
      router.push(`/products?search=${encodeURIComponent(q)}`);
      setOpen(false);
      setActiveIndex(-1);
    },
    [router],
  );

  const goToProduct = useCallback(
    (product) => {
      saveRecentSearch(product.name);
      router.push(`/product/${product.slug || product._id}`);
      setOpen(false);
      setActiveIndex(-1);
    },
    [router],
  );

  const goToCategory = useCallback(
    (cat) => {
      router.push(`/products?category=${encodeURIComponent(cat)}`);
      setOpen(false);
      setActiveIndex(-1);
    },
    [router],
  );

  const clearRecent = (e) => {
    e.stopPropagation();
    try {
      localStorage.removeItem(RECENT_KEY);
    } catch {}
    setRecent([]);
  };

  const showingRecent = !query.trim();
  const hasSuggestions = suggestions.products.length > 0 || suggestions.categories.length > 0;

  // Flat list of navigable items — drives ArrowUp/ArrowDown/Enter regardless
  // of whether we're showing recent searches or live suggestions.
  const flatItems = showingRecent
    ? recent.map((term) => ({ type: "recent", term }))
    : [
        ...suggestions.categories.map((cat) => ({ type: "category", cat })),
        ...suggestions.products.map((p) => ({ type: "product", product: p })),
      ];

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setActiveIndex((i) => Math.min(i + 1, flatItems.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const active = flatItems[activeIndex];
      if (!active) {
        goToResults(query);
      } else if (active.type === "recent") {
        goToResults(active.term);
      } else if (active.type === "category") {
        goToCategory(active.cat);
      } else if (active.type === "product") {
        goToProduct(active.product);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
      setActiveIndex(-1);
    }
  };

  const dropdownVisible = open && (showingRecent ? recent.length > 0 : true);

  return (
    <ClickAwayListener onClickAway={() => setOpen(false)}>
      <Box ref={anchorRef} sx={{ position: "relative", width: fullWidth ? "100%" : "auto" }}>
        <TextField
          size="small"
          placeholder="Search for products, brands and more..."
          value={query}
          onFocus={() => setOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
            setActiveIndex(-1);
          }}
          onKeyDown={handleKeyDown}
          autoComplete="off"
          sx={{
            width: { xs: "100%", md: 300 },
            bgcolor: "#fff",
            "& .MuiOutlinedInput-root": { borderRadius: 2 },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ fontSize: 19, color: "#a1a1aa" }} />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                {loading ? (
                  <CircularProgress size={16} sx={{ color: "#a1a1aa", mr: 0.5 }} />
                ) : query ? (
                  <IconButton
                    size="small"
                    onClick={() => {
                      setQuery("");
                      setSuggestions({ products: [], categories: [], brands: [] });
                    }}
                  >
                    <ClearIcon fontSize="small" />
                  </IconButton>
                ) : null}
              </InputAdornment>
            ),
          }}
        />

        <Popper
          open={Boolean(dropdownVisible)}
          anchorEl={anchorRef.current}
          placement="bottom-start"
          style={{ zIndex: 1301, width: anchorRef.current?.offsetWidth }}
          modifiers={[{ name: "offset", options: { offset: [0, 6] } }]}
        >
          <Paper
            elevation={6}
            sx={{
              borderRadius: 2.5,
              overflow: "hidden",
              border: "1px solid #e4e4e7",
              maxHeight: 420,
              overflowY: "auto",
            }}
          >
            {/* RECENT SEARCHES */}
            {showingRecent && recent.length > 0 && (
              <>
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  sx={{ px: 2, pt: 1.5, pb: 0.5 }}
                >
                  <Typography sx={{ fontSize: 11.5, fontWeight: 700, color: "#a1a1aa", textTransform: "uppercase", letterSpacing: 0.4 }}>
                    Recent Searches
                  </Typography>
                  <Typography
                    component="button"
                    onClick={clearRecent}
                    sx={{
                      border: "none",
                      background: "none",
                      cursor: "pointer",
                      fontSize: 11.5,
                      fontWeight: 600,
                      color: "#71717a",
                      "&:hover": { color: "#111" },
                    }}
                  >
                    Clear
                  </Typography>
                </Stack>
                <List dense disablePadding sx={{ pb: 1 }}>
                  {recent.map((term, i) => (
                    <ListItemButton
                      key={term}
                      selected={activeIndex === i}
                      onMouseEnter={() => setActiveIndex(i)}
                      onClick={() => goToResults(term)}
                      sx={{ px: 2, py: 0.75 }}
                    >
                      <HistoryRoundedIcon sx={{ fontSize: 17, color: "#a1a1aa", mr: 1.5 }} />
                      <ListItemText
                        primaryTypographyProps={{ fontSize: 13.5, color: "#27272a" }}
                        primary={term}
                      />
                    </ListItemButton>
                  ))}
                </List>
              </>
            )}

            {/* LIVE SUGGESTIONS */}
            {!showingRecent && (
              <>
                {/* "Search for '...'" quick action, always first */}
                <List dense disablePadding>
                  <ListItemButton
                    selected={activeIndex === -1 ? false : false}
                    onClick={() => goToResults(query)}
                    sx={{ px: 2, py: 1, bgcolor: "#fafafa" }}
                  >
                    <SearchIcon sx={{ fontSize: 17, color: "#71717a", mr: 1.5 }} />
                    <ListItemText
                      primaryTypographyProps={{ fontSize: 13.5, fontWeight: 600, color: "#111" }}
                      primary={`Search for "${query}"`}
                    />
                    <NorthEastRoundedIcon sx={{ fontSize: 14, color: "#a1a1aa" }} />
                  </ListItemButton>
                </List>

                {!hasSuggestions && !loading && (
                  <Typography sx={{ px: 2, py: 2, fontSize: 12.5, color: "#a1a1aa" }}>
                    No quick matches — press Enter to search all products for &quot;{query}&quot;.
                  </Typography>
                )}

                {/* CATEGORY SUGGESTIONS */}
                {suggestions.categories.length > 0 && (
                  <Box sx={{ px: 2, py: 1 }}>
                    <Typography sx={{ fontSize: 11, fontWeight: 700, color: "#a1a1aa", textTransform: "uppercase", letterSpacing: 0.4, mb: 0.75 }}>
                      Categories
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                      {suggestions.categories.map((cat, i) => {
                        const idx = i; // categories come first in flatItems
                        return (
                          <Chip
                            key={cat}
                            label={<HighlightedText text={cat} query={query} />}
                            size="small"
                            onClick={() => goToCategory(cat)}
                            onMouseEnter={() => setActiveIndex(idx)}
                            sx={{
                              borderRadius: 1.5,
                              fontSize: 12,
                              bgcolor: activeIndex === idx ? "#111" : "#f4f4f5",
                              color: activeIndex === idx ? "#fff" : "#27272a",
                              cursor: "pointer",
                            }}
                          />
                        );
                      })}
                    </Stack>
                  </Box>
                )}

                {/* PRODUCT SUGGESTIONS */}
                {suggestions.products.length > 0 && (
                  <>
                    <Divider sx={{ mt: 0.5 }} />
                    <Typography sx={{ px: 2, pt: 1, pb: 0.25, fontSize: 11, fontWeight: 700, color: "#a1a1aa", textTransform: "uppercase", letterSpacing: 0.4 }}>
                      Products
                    </Typography>
                    <List dense disablePadding sx={{ pb: 1 }}>
                      {suggestions.products.map((product, i) => {
                        const idx = suggestions.categories.length + i;
                        return (
                          <ListItemButton
                            key={product._id}
                            selected={activeIndex === idx}
                            onMouseEnter={() => setActiveIndex(idx)}
                            onClick={() => goToProduct(product)}
                            sx={{ px: 2, py: 0.75, gap: 1.5 }}
                          >
                            <ListItemAvatar sx={{ minWidth: "auto" }}>
                              <Avatar
                                src={product.frontImage || product.images?.[0]}
                                variant="rounded"
                                sx={{ width: 40, height: 40, borderRadius: 1.5, bgcolor: "#f4f4f5", border: "1px solid #e4e4e7" }}
                              >
                                <ImageOutlinedIcon sx={{ fontSize: 16, color: "#a1a1aa" }} />
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                              primary={<HighlightedText text={product.name} query={query} />}
                              secondary={[product.category, product.subCategory].filter(Boolean).join(" · ")}
                              primaryTypographyProps={{ fontSize: 13.5, color: "#18181b", noWrap: true }}
                              secondaryTypographyProps={{ fontSize: 11.5, color: "#a1a1aa" }}
                            />
                            <Box sx={{ textAlign: "right", flexShrink: 0 }}>
                              <Typography sx={{ fontSize: 13, fontWeight: 700, color: "#18181b" }}>
                                ₹{(product.price || 0).toLocaleString()}
                              </Typography>
                              {product.originalPrice > product.price && (
                                <Typography sx={{ fontSize: 11, color: "#a1a1aa", textDecoration: "line-through" }}>
                                  ₹{product.originalPrice.toLocaleString()}
                                </Typography>
                              )}
                            </Box>
                          </ListItemButton>
                        );
                      })}
                    </List>
                  </>
                )}
              </>
            )}
          </Paper>
        </Popper>
      </Box>
    </ClickAwayListener>
  );
}
