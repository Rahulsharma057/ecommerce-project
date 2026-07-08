"use client";

import { Box, Typography } from "@mui/material";

export default function ModelCard({ model, position }) {
  const positions = {
    "-2": {
      x: -470,
      y: 80,
      scale: 0.72,
      rotate: -10,
      opacity: 0.55,
      z: 1,
    },

    "-1": {
      x: -240,
      y: 25,
      scale: 0.9,
      rotate: -5,
      opacity: 0.9,
      z: 3,
    },

    "0": {
      x: 0,
      y: 0,
      scale: 1.08,
      rotate: 0,
      opacity: 1,
      z: 5,
    },

    "1": {
      x: 240,
      y: 25,
      scale: 0.9,
      rotate: 5,
      opacity: 0.9,
      z: 3,
    },

    "2": {
      x: 470,
      y: 80,
      scale: 0.72,
      rotate: 10,
      opacity: 0.55,
      z: 1,
    },
  };

  const style = positions[position];

  if (!style) return null;

  return (
    <Box
      sx={{
        position: "absolute",

        left: "50%",
        bottom: 0,

        width: 220,
        height: 340,

        transform: `
          translateX(${style.x}px)
          translateY(${style.y}px)
          translateX(-50%)
          scale(${style.scale})
          rotate(${style.rotate}deg)
        `,

        transition: "all .8s cubic-bezier(.22,.61,.36,1)",

        zIndex: style.z,

        opacity: style.opacity,
      }}
    >
      <Box
        component="img"
        src={model.image}
        alt={model.title}
        sx={{
          width: "100%",
          height: "100%",
          objectFit: "cover",

          borderRadius: "120px 120px 18px 18px",

          boxShadow: "0 20px 40px rgba(0,0,0,.35)",
        }}
      />

      {position === 0 && (
        <Box
          sx={{
            position: "absolute",
            bottom: 25,
            left: 0,
            right: 0,

            textAlign: "center",
            color: "#fff",
          }}
        >
          <Typography
            variant="h6"
            fontWeight={700}
          >
            {model.title}
          </Typography>

          <Typography variant="body2">
            {model.description}
          </Typography>
        </Box>
      )}
    </Box>
  );
}