"use client";

import { Box, Grid, Paper } from "@mui/material";

import LeftContent from "./LeftContent";
import RightVideo from "./RightVideo";
import CategorySlider from "./CategorySlider";

export default function FashionLayout({
  sections,
  active,
  setActive,
}) {
  const current = sections[active];

  return (
    <Box
      sx={{
        maxWidth: "1550px",
        mx: "auto",
       px: 0,
    py: 4,
      }}
    >
      <Paper
        elevation={0}
        sx={{
            borderRadius:0,
       //  borderRadius: "0px 20px 20px 0px",
          overflow: "hidden",
          bgcolor: "#ffffff",
        }}
      >
        <Grid container>
          {/* LEFT */}

          <Grid
            item
            md={6}
            sx={{
              borderRight: "1px solid #eee",
            }}
          >
            <LeftContent data={current} />
          </Grid>

          {/* RIGHT */}

          <Grid item md={6}>
            <RightVideo data={current} />

            <CategorySlider
              sections={sections}
              active={active}
              setActive={setActive}
            />
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}