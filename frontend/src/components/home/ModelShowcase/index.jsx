"use client";

import { useEffect, useState } from "react";

import { Box, Typography, Button } from "@mui/material";
import EastRoundedIcon from "@mui/icons-material/EastRounded";
import { getModels } from "@/services/modelShowcase";

import ModelCard from "./ModelCard";
import Navigation from "./Navigation";

export default function ModelShowcase() {
  const [models, setModels] = useState([]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    getModels()
      .then((res) => {
        setModels(res.data.data || []);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const next = () => {
    setActive((prev) => (prev + 1) % models.length);
  };

  const prev = () => {
    setActive((prev) => (prev === 0 ? models.length - 1 : prev - 1));
  };

  const getPosition = (index) => {
    const total = models.length;

    let diff = index - active;

    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;

    return diff.toString();
  };

  if (!models.length) return null;

  const current = models[active];

  return (
    <Box
      sx={{
        height: "100vh",
        width: "100%",
        position: "relative",
        overflow: "hidden",

        display: "flex",
        justifyContent: "center",

        background: "linear-gradient(180deg,#0c0c0c 0%,#1b1b1b 100%)",
      }}
    >
      {/* Background Glow */}
      <Box
        sx={{
          position: "absolute",
          width: 900,
          height: 900,
          borderRadius: "50%",
          background:
            "radial-gradient(circle,rgba(255,255,255,.08),transparent 70%)",
          top: -500,
          left: "50%",
          transform: "translateX(-50%)",
        }}
      />

      {/* Text Section */}

      <Box
        sx={{
          position: "absolute",
          top: 50,
          left: "50%",
          transform: "translateX(-50%)",
          textAlign: "center",
          color: "#fff",
          zIndex: 10,
          width: "80%",
        }}
      >
        <Typography
          sx={{
            display: "inline-block",
            px: 2,
            py: 0.5,
            color: "rgba(255,255,255,.7)",
            border: "1px solid rgba(255,255,255,.3)",
            borderRadius: 10,
            mb: 2,
            fontSize: 12,
          }}
        >
          New Spring Collection 2025
        </Typography>

        <Typography variant="h3" fontWeight={700}>
          {current.title}
        </Typography>

        <Typography
          mt={2}
          color="rgba(255,255,255,.7)"
          maxWidth={650}
          mx="auto"
        >
          {current.description}
        </Typography>
        <Button
          href={current.buttonLink}
          variant="contained"
          sx={{
            mt: 4,
            bgcolor: "#fff",
            color: "#111",
            borderRadius: "999px",
            px: 1,
         //   py: 1,
            pl: 3,
            textTransform: "none",
            fontSize: "1rem",
            fontWeight: 500,
            boxShadow: "0 12px 30px rgba(0,0,0,.12)",
            display: "inline-flex",
            alignItems: "center",
            gap: 2,
            "&:hover": {
              bgcolor: "#fff",
              transform: "translateY(-3px)",
              boxShadow: "0 18px 40px rgba(0,0,0,.18)",
              "& .arrowBox": {
                transform: "translateX(4px)",
              },
            },
          }}
        >
          {current.buttonText}

          <Box
            className="arrowBox"
            sx={{
              width: 42,
              height: 42,
              borderRadius: "50%",
              bgcolor: "#111",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all .3s ease",
            }}
          >
            <EastRoundedIcon fontSize="small" />
          </Box>
        </Button>
      </Box>

      {/* Carousel */}

      <Box
        sx={{
          position: "absolute",
          bottom: 30,
          width: "100%",
          height: 420,
        }}
      >
        {models.map((item, index) => (
          <ModelCard
            key={item._id}
            model={item}
            position={getPosition(index)}
          />
        ))}

        <Navigation onPrev={prev} onNext={next} />
      </Box>
    </Box>
  );
}
