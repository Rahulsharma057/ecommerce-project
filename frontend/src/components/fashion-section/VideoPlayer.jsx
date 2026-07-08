"use client";

import { Box, Button, Typography } from "@mui/material";

export default function VideoPlayer({ data }) {
  return (
    <Box
      sx={{
        flex: 1,
        position: "relative",
      }}
    >
      <Box
        sx={{
          width: "100%",
          height: "100%",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {data.video ? (
          <video
            key={data.video}
            src={data.video}
           // controls
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
            Your browser does not support the video tag.
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

        {/* Text */}
      </Box>
      <Box
        sx={{
          position: "absolute",
          left: 60,
          bottom: 60,
          color: "#fff",
          maxWidth: 500,
        }}
      >
        <Typography variant="h3" fontWeight={700}>
          {data.title}
        </Typography>

        <Typography mt={2} mb={3}>
          {data.description}
        </Typography>

        <Button href={data.buttonLink} variant="contained">
          {data.buttonText}
        </Button>
      </Box>
    </Box>
  );
}
