"use client";

import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Chip,
  IconButton,
  Stack,
  Button,
  Tooltip,
  TablePagination,
} from "@mui/material";

import { useMemo, useState } from "react";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export default function ProductsTable({
  products = [],
  onEdit,
  onDelete,
  onAdd,
}) {
  // PAGINATION STATE
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // PAGINATED DATA
  const paginatedProducts = useMemo(() => {
    return products.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );
  }, [products, page, rowsPerPage]);

  return (
    <Paper
      elevation={0}
      sx={{
        border: "1px solid #e5e7eb",
        borderRadius: 3,
        overflow: "hidden",
        bgcolor: "#fff",
      }}
    >
      {/* HEADER */}
{/*       <Box
        sx={{
          p: 2,
          borderBottom: "1px solid #eef2f7",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
          bgcolor: "#fafafa",
        }}
      >
        <Box>
          <Typography variant="h6" fontWeight={800}>
            Products
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Total Products:{" "}
            <b style={{ color: "#111827" }}>{products.length}</b>
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onAdd}
          sx={{
            borderRadius: 2,
            textTransform: "none",
            px: 2.5,
            fontWeight: 600,
          }}
        >
          Add Product
        </Button>
      </Box> */}

      {/* TABLE */}
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "#f3f4f6" }}>
              <TableCell sx={{ fontWeight: 700 }}>Image</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Product</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Category</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Price</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>New</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Sale</TableCell>
              <TableCell align="center" sx={{ fontWeight: 700 }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedProducts.length > 0 ? (
              paginatedProducts.map((product, index) => (
                <TableRow key={product._id} hover>
                  <TableCell>
                    <Avatar
                      variant="rounded"
                      src={product.images?.[0] || "/placeholder.png"}
                      sx={{ width: 55, height: 55, borderRadius: 2 }}
                    />
                  </TableCell>

                  <TableCell>
                    <Typography fontWeight={700}>
                      {product.name}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        maxWidth: 260,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {product.description}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Chip
                      label={product.category}
                      size="small"
                      sx={{
                        bgcolor: "#eef2ff",
                        color: "#4338ca",
                        fontWeight: 600,
                      }}
                    />
                  </TableCell>

                  <TableCell sx={{ fontWeight: 700 }}>
                    ₹{product.price?.toLocaleString()}
                  </TableCell>

                  <TableCell>
                    {product.isNewArrival ? (
                      <Chip label="New" size="small" color="success" />
                    ) : (
                      "-"
                    )}
                  </TableCell>

                  <TableCell>
                    {product.isSale ? (
                      <Chip label="Sale" size="small" color="error" />
                    ) : (
                      "-"
                    )}
                  </TableCell>

                  <TableCell align="center">
                    <Stack direction="row" spacing={1} justifyContent="center">
                      <Tooltip title="Edit">
                        <IconButton onClick={() => onEdit(product)}>
                          <EditIcon />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Delete">
                        <IconButton onClick={() => onDelete(product._id)}>
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                  <Typography color="text.secondary">
                    No Products Found
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* PAGINATION */}
      <TablePagination
        component="div"
        count={products.length}
        page={page}
        onPageChange={(_, newPage) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(0);
        }}
        rowsPerPageOptions={[5, 10, 25, 50]}
      />
    </Paper>
  );
}