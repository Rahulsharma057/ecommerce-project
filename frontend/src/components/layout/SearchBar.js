"use client";

import TextField from "@mui/material/TextField";

export default function SearchBar({
  value = "",
  onChange,
}) {
  return (
    <TextField
      size="small"
      placeholder="Search products..."
      value={value}
      onChange={onChange}
      sx={{
        width: {
          xs: "100%",
          md: 300,
        },
        bgcolor: "#fff",
      }}
    />
  );
}