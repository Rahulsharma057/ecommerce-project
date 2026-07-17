"use client";

import { Box, Container } from "@mui/material";

export default function HomeSkeleton() {
  return (
    <Box>
      {/* Hero skeleton */}

      <Box
        sx={{
          height: {
            xs: 400,
            md: 600,
          },
          bgcolor: "#eeeeee",
        }}
      />

      <Container maxWidth="xl">
        {/* product skeleton */}

        <Box
          sx={{
            mt: 5,
            height: 300,
            borderRadius: 4,
            bgcolor: "#eeeeee",
          }}
        />

        {/* Story skeleton */}

        <Box
          sx={{
            mt: 5,
            height: 500,
            borderRadius: 4,
            bgcolor: "#eeeeee",
          }}
        />

        {/* Collection skeleton */}

        <Box
          sx={{
            mt: 5,
            height: 350,
            borderRadius: 4,
            bgcolor: "#eeeeee",
          }}
        />
      </Container>
    </Box>
  );
}
