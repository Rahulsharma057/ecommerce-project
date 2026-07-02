"use client";

import {
  Box,
  TextField,
  MenuItem,
} from "@mui/material";

export default function ProductFilters({
  search,
  setSearch,
  category,
  setCategory,
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
        onChange={(e) =>
          setSearch(e.target.value)
        }
         sx={{ minWidth: 275 ,mb:1}}

        size="small"
      />

      <TextField
        select
        label="Category"
        value={category}
        onChange={(e) =>
          setCategory(e.target.value)
        }
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