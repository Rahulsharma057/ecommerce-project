"use client";

import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
} from "@mui/material";

const categories = [
  "Women",
  "Men",
  "Accessories",
  "Footwear",
];

export default function CategoriesSection() {
  return (
    <Container sx={{ py: 10 }}>
      <Typography
        variant="h4"
        fontWeight={700}
        mb={4}
      >
        Shop By Category
      </Typography>

<Grid container spacing={3}>
  {categories.map((item) => (
    <Grid size={{ xs: 12, md: 3 }} key={item}>
      <Card
        sx={{
          height: 220,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: ".3s",
          "&:hover": {
            transform: "translateY(-5px)",
          },
        }}
      >
        <CardContent>
          <Typography variant="h5" fontWeight={600}>
            {item}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  ))}
</Grid>
    </Container>
  );
}