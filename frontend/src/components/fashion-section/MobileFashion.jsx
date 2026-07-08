"use client";

import { Box } from "@mui/material";

import RightVideo from "./RightVideo";
import CategorySlider from "./CategorySlider";

import { useState, useEffect } from "react";

export default function MobileFashion({
  sections,
}) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const index = sections.findIndex(
      (item) => item.video && item.video !== ""
    );

    setActive(index !== -1 ? index : 0);
  }, [sections]);

  return (
    <Box
      sx={{
        bgcolor: "#efe7df",
      }}
    >
      {/* Full Width Video/Image */}

      <RightVideo
        data={sections[active]}
      />

      {/* Categories */}

      <CategorySlider
        sections={sections}
        active={active}
        setActive={setActive}
      />
    </Box>
  );
}