"use client";

import { useEffect, useMemo, useState } from "react";

import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  IconButton,
  Tooltip,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";

import {
  getSubscribers,
  deleteSubscriber,
} from "@/services/newsletter";

export default function NewsletterTable() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const fetchSubscribers = async () => {
    try {
      setLoading(true);

      const res = await getSubscribers();

      setRows(res.data.data || []);
    } catch (err) {
      console.log(err);
      alert("Failed to load subscribers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this subscriber?")) return;

    try {
      await deleteSubscriber(id);
      fetchSubscribers();
    } catch (err) {
      alert("Delete failed");
    }
  };

  const filteredRows = useMemo(() => {
    return rows.filter((item) =>
      item.email.toLowerCase().includes(search.toLowerCase())
    );
  }, [rows, search]);

  return (
    <Card
      sx={{
        borderRadius: 3,
        boxShadow: "0 10px 30px rgba(0,0,0,.08)",
      }}
    >
      <CardContent>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
          flexWrap="wrap"
          gap={2}
        >
          <Typography variant="h5" fontWeight={700}>
            Newsletter Subscribers
          </Typography>

          <Chip
            color="primary"
            label={`Total : ${filteredRows.length}`}
          />
        </Box>

        <TextField
          fullWidth
          size="small"
          placeholder="Search email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ mb: 3 }}
        />

        <TableContainer component={Paper} variant="outlined">
          <Table>
            <TableHead>
              <TableRow
                sx={{
                  bgcolor: "#111827",
                  "& th": {
                    color: "#fff",
                    fontWeight: 700,
                  },
                }}
              >
                <TableCell>S.No</TableCell>
                <TableCell>Email Address</TableCell>
                <TableCell>Subscribed On</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="center">Action</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : filteredRows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No Subscribers Found
                  </TableCell>
                </TableRow>
              ) : (
                filteredRows.map((item, index) => (
                  <TableRow
                    key={item._id}
                    hover
                  >
                    <TableCell>{index + 1}</TableCell>

                    <TableCell>
                      <Typography fontWeight={600}>
                        {item.email}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      {new Date(item.createdAt).toLocaleDateString()}
                    </TableCell>

                    <TableCell>
                      <Chip
                        label="Subscribed"
                        color="success"
                        size="small"
                      />
                    </TableCell>

                    <TableCell align="center">
                      <Tooltip title="Delete">
                        <IconButton
                          color="error"
                          onClick={() => handleDelete(item._id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
}