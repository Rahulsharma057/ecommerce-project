"use client";

import { Box, Typography, CircularProgress } from "@mui/material";


export default function WebsiteLoader(){

  return (
    <Box
      sx={{
        height:"100vh",
        width:"100%",
        display:"flex",
        flexDirection:"column",
        alignItems:"center",
        justifyContent:"center",
        bgcolor:"#fdfcfb",
      }}
    >

      {/* Logo */}
      <Typography
        sx={{
          fontFamily:"Georgia, serif",
          fontSize:{
            xs:"3rem",
            md:"4rem"
          },
          fontWeight:700,
          letterSpacing:"8px",
          color:"#111",
        }}
      >
        VELOURA
      </Typography>


      <Typography
        sx={{
          mt:2,
          color:"#8a7560",
          letterSpacing:"3px",
          fontSize:"0.85rem",
          textTransform:"uppercase"
        }}
      >
        Welcome to Luxury Fashion
      </Typography>


      <CircularProgress
        size={28}
        sx={{
          mt:5,
          color:"#111"
        }}
      />


      <Typography
        sx={{
          mt:2,
          fontSize:"0.8rem",
          color:"#777"
        }}
      >
        Loading your experience...
      </Typography>


    </Box>
  )
}