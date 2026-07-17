"use client";

import { Box } from "@mui/material";
import { useEffect, useRef } from "react";

export default function RightVideo({ data }) {

  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const loadedRef = useRef(false);

  useEffect(() => {

    const video = videoRef.current;
    const container = containerRef.current;

    if (!video || !container) return;


    const observer = new IntersectionObserver(
      ([entry]) => {

        if (entry.isIntersecting) {

          if (!loadedRef.current) {
            video.load();
            loadedRef.current = true;
          }

          video.play().catch(() => {});

        } else {

          video.pause();

        }

      },
      {
        threshold: 0.5,
      }
    );


    observer.observe(container);


    return () => observer.disconnect();


  }, [data]);


  if (!data) return null;


  return (
    <Box
      ref={containerRef}
      sx={{
        height:320,
        position:"relative",
        overflow:"hidden",
        bgcolor:"#000",
      }}
    >

      {data.video ? (

        <video
          ref={videoRef}
          key={data.video}
          src={data.video}
          muted
          loop
          playsInline
          preload="none"
          poster={data.image}
          style={{
            width:"100%",
            height:"100%",
            objectFit:"cover",
          }}
          
        />

      ) : (

        <Box
          component="img"
          src={data.image}
          alt={data.title}
          loading="lazy"
          sx={{
            width:"100%",
            height:"100%",
            objectFit:"cover",
          }}
        />

      )}
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