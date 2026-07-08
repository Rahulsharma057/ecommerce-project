"use client";

import { Box, Typography } from "@mui/material";

export default function RightVideo({ data }) {
  return (
    <Box
      sx={{
        height: 320,
        position: "relative",
        overflow: "hidden",
        bgcolor: "#000",
      }}
    >
      {data.video ? (
        <video
          key={data.video}
          src={data.video}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        >
          Your browser does not support video.
        </video>
      ) : (
        <Box
          component="img"
          src={data.image}
          alt={data.title}
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      )}

      {/* Dark Overlay */}

      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to top, rgba(0,0,0,.65), rgba(0,0,0,.15), transparent)",
        }}
      />

     

     {/*  <Box
        sx={{
          position: "absolute",
          left: 40,
          bottom: 35,
          color: "#fff",
          maxWidth: 500,
          zIndex: 2,
        }}
      >
        <Typography
          sx={{
            fontSize: 14,
            letterSpacing: 3,
            textTransform: "uppercase",
            mb: 1,
            opacity: .9,
          }}
        >
          {data.category}
        </Typography>

        <Typography
          variant="h3"
          fontWeight={700}
          lineHeight={1.1}
        >
          {data.title}
        </Typography>

        {data.subtitle && (
          <Typography
            sx={{
              mt: 1,
              opacity: .9,
            }}
          >
            {data.subtitle}
          </Typography>
        )}
      </Box> */}
    </Box>
  );
}