"use client";

import { Box, Grid } from "@mui/material";

import CategoryCard from "./CategoryCard";

export default function CategorySlider({ sections, active, setActive }) {
  return (
    <Box
      sx={{
        m: 0,
        p: 0,
        bgcolor: "#fafafa",
      }}
    >
      <Grid container spacing={0}>
        {sections.map((item, index) => {
          if (item.video) return null;

          return (
            <Grid item xs={6} sm={6} md={3} key={item._id}>
              <CategoryCard
                item={item}
                active={active === index}
                onClick={() => setActive(index)}
              />
            </Grid>
          );
        })}
        {/*   {sections.map((item, index) => (
          <Grid
            item
            xs={12}
            sm={6}
            md={3}
            key={item._id}
          >
            <CategoryCard
              item={item}
              active={active === index}
              onClick={() => setActive(index)}
            />
          </Grid>
        ))} */}
      </Grid>
    </Box>
  );
}
