"use client";

import {
  Box,
  Container,
} from "@mui/material";

import CategoryHighlightTable from "@/components/admin/category-highlight/CategoryHighlightTable";

export default function CategoryHighlightPage() {
  return (
    <Container
      maxWidth="xl"
      sx={{
        py: 4,
      }}
    >
      <CategoryHighlightTable />
    </Container>
  );
}