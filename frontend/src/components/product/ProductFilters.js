"use client";
import { useSearchParams } from "next/navigation";
import {
  Box,
  TextField,
  MenuItem,
} from "@mui/material";

export default function ProductFilters({
  category,
  search,
  filterType,
  updateURL,
}) {



  return (
    <Box
      sx={{
        width:"100%",
        display: "flex",
        mb: 0,
        justifyContent:"space-between",
        flexWrap: "wrap",
      }}
    >
      <TextField
    label="Search"
  value={search}
  onChange={(e) => updateURL("search", e.target.value)}
  size="small"
         sx={{ minWidth: 275 ,mb:1}}

 
      />

      <TextField
    select
  label="Category"
value={category || ""}
  onChange={(e) => updateURL("category", e.target.value)}
        sx={{ minWidth: 275 }}
        size="small"
      >
        <MenuItem value="">
          All
        </MenuItem>

        <MenuItem value="Women">
          Women
        </MenuItem>

        <MenuItem value="Men">
          Men
        </MenuItem>

        <MenuItem value="Accessories">
          Accessories
        </MenuItem>

        <MenuItem value="Footwear">
          Footwear
        </MenuItem>
      </TextField>
    </Box>
  );
}