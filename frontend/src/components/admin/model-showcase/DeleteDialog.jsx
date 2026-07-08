"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

export default function DeleteDialog({
  open,

  setOpen,

  onConfirm,
}) {
  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle>Delete Model</DialogTitle>

      <DialogContent>
        <Typography>Are you sure you want to delete this model?</Typography>
      </DialogContent>

      <DialogActions>
        <Button onClick={() => setOpen(false)}>Cancel</Button>

        <Button color="error" variant="contained" onClick={onConfirm}>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}
