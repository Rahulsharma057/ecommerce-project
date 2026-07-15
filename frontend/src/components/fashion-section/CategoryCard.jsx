"use client";

import { Box, Typography } from "@mui/material";
import { useRouter } from "next/navigation";

export default function CategoryCard({
  item,
  active,  onClick,
}) {
  const router = useRouter();

  return (
    <Box
          //onClick={onClick}
     onClick={() => router.push(item.buttonLink)}
      sx={{
      
        cursor: "pointer",
       // borderRadius: 3,
        overflow: "hidden",
        position: "relative",
        height: 260,
       /*  border: active
          ? "3px solid #111"
          : "1px solid #ddd", */
        transition: ".35s",
        "&:hover": {
          transform: "translateY(-6px)",
          boxShadow: "0 15px 35px rgba(0,0,0,.18)",
        },
      }}
    >
      {/* Image */}
      <Box
        component="img"
        src={item.image}
        alt={item.category}
        sx={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transition: ".5s",
          "&:hover": {
            transform: "scale(1.08)",
          },
        }}
      />

      {/* Overlay */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to top, rgba(0,0,0,.85), rgba(0,0,0,.25), transparent)",
        }}
      />

      {/* Text on Image */}
      <Box
        sx={{
          position: "absolute",
          left: 20,
          right: 20,
          bottom: 20,
          color: "#fff",
          zIndex: 2,
        }}
      >
        <Typography
          sx={{
            fontSize: 12,
            textTransform: "uppercase",
            letterSpacing: 2,
            mb: 0.5,
            opacity: 0.9,
          }}
        >
          {item.category}
        </Typography>

        <Typography
          sx={{
            fontSize: 22,
            fontWeight: 700,
            lineHeight: 1.2,
          }}
        >
          {item.title}
        </Typography>

        <Typography
          sx={{
            mt: 0.5,
            fontSize: 14,
            opacity: 0.9,
          }}
        >
          {item.subtitle}
        </Typography>

        <Typography
          sx={{
            mt: 1,
            fontSize: 13,
            opacity: 0.85,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {item.description}
        </Typography>
      </Box>
    </Box>
  );
}