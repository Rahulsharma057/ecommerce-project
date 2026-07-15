"use client";

import Box from "@mui/material/Box";
import ProductCard from "./ProductCard";

export default function ProductGrid({ products, wishlistMap, setWishlistMap }) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr 1fr",
          sm: "1fr 1fr",
          md: "1fr 1fr 1fr",
          lg: "1fr 1fr 1fr 1fr 1fr",
        },
        gap: { xs: 1.25, sm: 2, md: 3 },
      }}
    >
      {products.map((product) => (
        <ProductCard
          key={product._id}
          product={product}
          wishlistMap={wishlistMap}
          setWishlistMap={setWishlistMap}
        />
      ))}
    </Box>
  );
}
