"use client";

import { Container } from "@mui/material";

import HomeCollectionTable from "@/components/admin/HomeCollectionTable";

export default function HomeCollectionsPage() {
  return (
    <Container
      maxWidth="xl"
      sx={{
        py: 4,
      }}
    >
      <HomeCollectionTable />
    </Container>
  );
}