"use client";

import {
  Box,
  Typography,
} from "@mui/material";

export default function CategoryList({
  sections,
  active,
  setActive,
}) {
  return (
    <Box
      sx={{
        width: "28%",
        bgcolor: "#f5f5f5",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        px: 6,
      }}
    >
      {sections.map((item, index) => (
        <Typography
          key={item._id}
          onClick={() => setActive(index)}
          sx={{
            cursor: "pointer",
            fontSize: 34,
            mb: 3,
            fontWeight:
              active === index
                ? 700
                : 300,
            transition: ".3s",
          }}
        >
          {item.category}
        </Typography>
      ))}
    </Box>
  );
}