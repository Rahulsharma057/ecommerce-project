"use client";

import {
  Box,
  Typography,
  IconButton,
  Stack,
  Avatar,
  Paper,Chip
} from "@mui/material";
import { useState } from "react";
import ConfirmationDialog from "@/components/common/ConfirmationDialog";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete";

export default function CartItem({ item, onRemove, onIncrease, onDecrease }) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  return (
    <>
      {" "}
      <Paper
        elevation={0}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          p: 2,
          border: "1px solid #eee",
          borderRadius: 2,
        }}
      >
        {/* LEFT */}
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar
            src={
              item.productId?.image ||
              item.productId?.images?.[0] ||
              "/placeholder.png"
            }
            alt={item.productId?.name}
            variant="rounded"
            sx={{ width: 70, height: 70 }}
          />

          <Box>
            <Typography fontWeight={600}>{item.productId?.name}</Typography>

            <Typography variant="body2" color="text.secondary">
              ₹{item.productId?.price}
            </Typography>

            <Typography variant="body2" fontWeight={500}>
              Qty: {item.quantity}
            </Typography>
          </Box>
        </Stack>

        <Stack direction="row" spacing={1} mt={1} flexWrap="wrap">
  {item.color && (
    <Chip
      label={`Color: ${item.color}`}
      size="small"
      variant="outlined"
      sx={{
        fontSize: 12,
        height: 26,
      }}
    />
  )}

  {item.size && (
    <Chip
      label={`Size: ${item.size}`}
      size="small"
      variant="outlined"
      sx={{
        fontSize: 12,
        height: 26,
      }}
    />
  )}
</Stack>

        {/* RIGHT */}
        <Stack direction="row" spacing={1} alignItems="center">
          <IconButton onClick={() => onDecrease(item._id)}>
            <RemoveIcon fontSize="small" />
          </IconButton>

          <Typography fontWeight={600}>{item.quantity}</Typography>

          <IconButton onClick={() => onIncrease(item._id)}>
            <AddIcon fontSize="small" />
          </IconButton>

          <IconButton
            color="error"
            onClick={() => {
              setSelectedItemId(item._id);
              setDeleteDialogOpen(true);
            }}
          >
            <DeleteIcon />
          </IconButton>
        </Stack>
      </Paper>{" "}
      <ConfirmationDialog
        open={deleteDialogOpen}
        title="Remove Item"
        message="Are you sure you want to remove this product from your cart?"
        confirmText="Remove"
        cancelText="Cancel"
        confirmColor="error"
        onConfirm={() => {
          onRemove(selectedItemId);
          setDeleteDialogOpen(false);
          setSelectedItemId(null);
        }}
        onCancel={() => {
          setDeleteDialogOpen(false);
          setSelectedItemId(null);
        }}
      />
    </>
  );
}
