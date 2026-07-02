"use client";

import {
  Box,
  Typography,
} from "@mui/material";

export default function EmptyState({
  title = "No Data Found",
}) {
  return (
    <Box
      sx={{
        py: 10,
        textAlign: "center",
      }}
    >
      <Typography
        variant="h5"
        color="text.secondary"
      >
        {title}
      </Typography>
    </Box>
  );
}