"use client";

import { Box, Button, Typography } from "@mui/material";
import EastRoundedIcon from "@mui/icons-material/EastRounded";

export default function LeftContent({ data }) {
  return (
    <Box
      sx={{
        width: "100%",height: "100%",
        position: "relative",
        display: "flex",
        alignItems: "center",
        px: 8,
        py: 8,
        overflow: "hidden",
        bgcolor: "#fff",
      }}
    >
      {/* Background Image */}
      {data.image && (
        <>
          <Box
            component="img"
            src={data.image}
            alt={data.title}
            sx={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />

          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to right, rgba(0,0,0,.75), rgba(0,0,0,.45))",
            }}
          />
        </>
      )}

      {/* Content */}
      <Box
        sx={{
          position: "relative",
          zIndex: 2,
          color: data.image ? "#fff" : "#111",
          maxWidth: 500,
        }}
      >
        <Typography
          sx={{
            fontSize: 14,
            letterSpacing: 3,
            textTransform: "uppercase",
            mb: 2,
          }}
        >
          {data.category}
        </Typography>

        <Typography
          sx={{
            fontSize: 52,
            fontWeight: 700,
            lineHeight: 1.1,
          }}
        >
          {data.title}
        </Typography>

        <Typography
          sx={{
            mt: 2,
            fontSize: 20,
            opacity: 0.9,
          }}
        >
          {data.subtitle}
        </Typography>

        <Typography
          sx={{
            mt: 3,
            lineHeight: 1.9,
            opacity: 0.9,
          }}
        >
          {data.description}
        </Typography>

        <Button
          href={data.buttonLink}
          variant="contained"
          endIcon={<EastRoundedIcon />}
          sx={{
            mt: 5,
            bgcolor: "#fff",
            color: "#111",
            px: 4,
            py: 1.5,
            borderRadius: "50px",
            textTransform: "none",
            fontWeight: 700,
            "&:hover": {
              bgcolor: "#f2f2f2",
            },
          }}
        >
          {data.buttonText}
        </Button>
      </Box>
    </Box>
  );
}