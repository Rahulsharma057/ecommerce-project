"use client";

import {
  Box,
  Typography,
  Stack,
  IconButton,
} from "@mui/material";

import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

export default function AppliedCoupon({
  coupon,
  discount,
  onRemove,
}) {
  if (!coupon) return null;

  return (
    <Box
      sx={{
        mt:2,
        mb: 1.5,
        p: 1,
        borderRadius: 1,
        border: "1px solid #268c5945",
        bgcolor: "#f0fdf4",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 2,
      }}
    >
      <Stack direction="row" spacing={1.5} alignItems="center">
        <Box
          sx={{
            width: 42,
            height: 42,
            borderRadius: 2,
            bgcolor: "#22c55e",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <CheckCircleRoundedIcon fontSize="small" />
        </Box>

        <Box>
          <Typography
            fontWeight={700}
            fontSize={14}
            color="#166534"
          >
            Coupon Applied {/* Successfully */}
          </Typography>

          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            mt={0.5}
          >
            <LocalOfferOutlinedIcon
              sx={{
                fontSize: 15,
                color: "#16a34a",
              }}
            />

            <Typography
              fontSize={13}
              color="text.secondary"
            >
              <b>{coupon.code}</b> applied
            </Typography>

         {/*    <Typography
              fontSize={13}
              color="success.main"
              fontWeight={700}
            >
              -₹{discount}
            </Typography> */}
          </Stack>
        </Box>
      </Stack>

      <IconButton
        size="small"
        onClick={onRemove}
        sx={{
          color: "#ef4444",
         // bgcolor: "#fff",
         // border: "1px solid #fecaca",

          "&:hover": {
            bgcolor: "#fef2f2",
          },
        }}
      >
        
        <CloseRoundedIcon fontSize="small" />
      </IconButton>
    </Box>
  );
}