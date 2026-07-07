"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { TextField, InputAdornment, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState("");

  // URL → local sync (only when page loads or URL changes)
  useEffect(() => {
    setSearch(searchParams.get("search") || "");
  }, [searchParams]);

  // debounce URL update
/*   useEffect(() => {
    const delay = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());

      if (search.trim()) {
        params.set("search", search.trim());
      } else {
        params.delete("search");
      }

      router.push(`/products?${params.toString()}`);
    }, 400); // 👈 debounce

    return () => clearTimeout(delay);
  }, [search]); */
useEffect(() => {
  const delay = setTimeout(() => {
    if (!search.trim()) return; // 🔥 Empty search par kuch mat karo

    const params = new URLSearchParams(searchParams.toString());
    params.set("search", search.trim());

    router.push(`/products?${params.toString()}`);
  }, 400);

  return () => clearTimeout(delay);
}, [search]);
  return (
    <TextField
      size="small"
      placeholder="Search products..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      sx={{
        width: { xs: "100%", md: 300 },
        bgcolor: "#fff",
      }}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton>
              <SearchIcon />
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
}