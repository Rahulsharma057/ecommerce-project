"use client";

import { IconButton } from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";

export default function Navigation({ onPrev, onNext }) {
  return (
    <>
      <IconButton
        onClick={onPrev}
        sx={{
          position: "absolute",
          left: "18%",
          bottom: 70,

          width: 55,
          height: 55,

          bgcolor: "rgba(255,255,255,.15)",
          color: "#fff",

          backdropFilter: "blur(10px)",

          "&:hover": {
            bgcolor: "rgba(255,255,255,.25)",
          },

          zIndex: 20,
        }}
      >
        <ChevronLeft />
      </IconButton>

      <IconButton
        onClick={onNext}
        sx={{
          position: "absolute",
          right: "18%",
          bottom: 70,

          width: 55,
          height: 55,

          bgcolor: "rgba(255,255,255,.15)",
          color: "#fff",

          backdropFilter: "blur(10px)",

          "&:hover": {
            bgcolor: "rgba(255,255,255,.25)",
          },

          zIndex: 20,
        }}
      >
        <ChevronRight />
      </IconButton>
    </>
  );
}