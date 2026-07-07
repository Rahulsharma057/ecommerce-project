"use client";

import { useEffect, useState } from "react";

import {
  Box,
  Card,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Chip,
  Stack,
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Divider,
} from "@mui/material";

import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

import axios from "axios";
import { API_URL } from "@/lib/api";

export default function InquiryTable({
  type = "contact",

  title = "Customer Messages",
}) {
  const [items, setItems] = useState([]);

  const [selected, setSelected] = useState(null);

  const [viewOpen, setViewOpen] = useState(false);

  const [deleteOpen, setDeleteOpen] = useState(false);

  const getData = async () => {
    try {
      const res = await axios.get(`${API_URL}/${type}/admin`);

      setItems(res.data.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const handleDelete = async () => {
    try {
      await axios.delete(`${API_URL}/${type}/admin/${selected._id}`);

      setDeleteOpen(false);

      setSelected(null);

      getData();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box
      sx={{
        p: {
          xs: 2,
          md: 4,
        },
      }}
    >
      <Typography variant="h4" fontWeight={800} mb={3}>
        {title}
      </Typography>

      <Card
        sx={{
          borderRadius: 2,

          boxShadow: "0 8px 30px rgba(0,0,0,.08)",
        }}
      >
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow
                sx={{
                  bgcolor: "#111",
                }}
              >
                <TableCell sx={{ color: "#fff", fontWeight: 700 }}>
                  Name
                </TableCell>

                <TableCell sx={{ color: "#fff", fontWeight: 700 }}>
                  Email
                </TableCell>

                <TableCell sx={{ color: "#fff", fontWeight: 700 }}>
                  Phone
                </TableCell>

                {type === "affiliate" && (
                  <TableCell sx={{ color: "#fff", fontWeight: 700 }}>
                    Instagram
                  </TableCell>
                )}

                {type === "affiliate" && (
                  <TableCell sx={{ color: "#fff", fontWeight: 700 }}>
                    Followers
                  </TableCell>
                )}

                <TableCell sx={{ color: "#fff", fontWeight: 700 }}>
                  Status
                </TableCell>

                <TableCell sx={{ color: "#fff", fontWeight: 700 }}>
                  Action
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {items.map((item) => (
                <TableRow key={item._id} hover>
                  <TableCell>
                    <Typography fontWeight={600}>{item.name}</Typography>
                  </TableCell>

                  <TableCell>{item.email}</TableCell>

                  <TableCell>{item.phone}</TableCell>

                  {type === "affiliate" && (
                    <TableCell>{item.instagram || "-"}</TableCell>
                  )}

                  {type === "affiliate" && (
                    <TableCell>{item.followers || "-"}</TableCell>
                  )}

                  <TableCell>
                    <Chip
                      size="small"
                      label={item.status}
                      color={item.status === "New" ? "warning" : "success"}
                    />
                  </TableCell>

                  <TableCell>
                    <Stack direction="row">
                      <Tooltip title="View">
                        <IconButton
                          color="primary"
                          onClick={() => {
                            setSelected(item);

                            setViewOpen(true);
                          }}
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Delete">
                        <IconButton
                          color="error"
                          onClick={() => {
                            setSelected(item);

                            setDeleteOpen(true);
                          }}
                        >
                          <DeleteOutlineIcon />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* VIEW DIALOG */}

    <Dialog
  open={viewOpen}
  onClose={() => setViewOpen(false)}
  maxWidth="sm"
  fullWidth
>
  <DialogContent sx={{ p: 0 }}>
    <Card elevation={0} sx={{ borderRadius: 3 }}>
      <Box p={3}>
        <Typography variant="h5" fontWeight={700}>
          {type === "affiliate"
            ? "Affiliate Details"
            : "Inquiry Details"}
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Stack spacing={2}>
          <Box>
            <Typography variant="caption" color="text.secondary">
              Full Name
            </Typography>
            <Typography fontWeight={600}>
              {selected?.name || "-"}
            </Typography>
          </Box>

          <Box>
            <Typography variant="caption" color="text.secondary">
              Email
            </Typography>
            <Typography>{selected?.email || "-"}</Typography>
          </Box>

          <Box>
            <Typography variant="caption" color="text.secondary">
              Phone
            </Typography>
            <Typography>{selected?.phone || "-"}</Typography>
          </Box>

          {type === "inquiry" && (
            <Box>
              <Typography variant="caption" color="text.secondary">
                Organization / Company
              </Typography>
              <Typography>
                {selected?.organization || "-"}
              </Typography>
            </Box>
          )}

          {type === "affiliate" && (
            <>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Instagram
                </Typography>
                <Typography>
                  {selected?.instagram || "-"}
                </Typography>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary">
                  Followers
                </Typography>
                <Typography>
                  {selected?.followers || "-"}
                </Typography>
              </Box>
            </>
          )}

          <Box>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ mb: 1, display: "block" }}
            >
              Message
            </Typography>

            <Card
              variant="outlined"
              sx={{
                bgcolor: "#fafafa",
                borderRadius: 2,
              }}
            >
              <Box p={2}>
                <Typography whiteSpace="pre-wrap">
                  {selected?.message || "-"}
                </Typography>
              </Box>
            </Card>
          </Box>

          <Box>
            <Typography variant="caption" color="text.secondary">
              Submitted On
            </Typography>
            <Typography>
              {selected?.createdAt
                ? new Date(selected.createdAt).toLocaleString()
                : "-"}
            </Typography>
          </Box>
        </Stack>

        <Button
          fullWidth
          variant="contained"
          sx={{ mt: 4 }}
          onClick={() => setViewOpen(false)}
        >
          Close
        </Button>
      </Box>
    </Card>
  </DialogContent>
</Dialog>
      {/* DELETE DIALOG */}

      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
        <DialogContent>
          <Typography fontWeight={700} variant="h6">
            Delete Enquiry?
          </Typography>

          <Typography color="text.secondary" mt={1}>
            Are you sure you want to delete this record?
          </Typography>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setDeleteOpen(false)}>Cancel</Button>

          <Button variant="contained" color="error" onClick={handleDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
