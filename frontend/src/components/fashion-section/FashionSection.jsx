"use client";

import { useEffect, useState } from "react";

import { Box, CircularProgress,Typography  } from "@mui/material";

import { getFashionSections } from "@/services/fashionSection";

import FashionLayout from "./FashionLayout";
import MobileFashion from "./MobileFashion";

export default function FashionSection() {
  const [sections, setSections] = useState([]);

  const [active, setActive] = useState(0);

  const fetchData = async () => {
    try {
      const res = await getFashionSections();
      const data = res.data.data;
      setSections(data || []);
      const videoIndex = data.findIndex(
        (item) => item.video && item.video !== "", // video at top by default
      );
      setActive(videoIndex !== -1 ? videoIndex : 0);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

 if (!sections.length) {
 return null;
}

  return (
    <>
      {/* Desktop */}
  
      <Box
        sx={{
          display: {
            xs: "none",
            md: "block",
          },
          //py: 4,

          bgcolor: "#ffffff",
        }}
      >
         <Typography variant="h3" fontWeight={700} align="center"pt={4} mb={0}>
          Explore Catagories
        </Typography>

        <Typography align="center" color="text.secondary" mb={2}>
          Discover timeless pieces curated for every Type.
        </Typography>
        <FashionLayout
          sections={sections}
          active={active}
          setActive={setActive}
        />
      </Box>

      {/* Mobile */}

      <Box
        sx={{
          display: {
            xs: "block",
            md: "none",
          },
        }}
      >
        <MobileFashion sections={sections} />
      </Box>
    </>
  );
}
