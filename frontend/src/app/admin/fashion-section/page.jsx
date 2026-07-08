"use client";

import { useEffect, useMemo, useState } from "react";

import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Chip,
  IconButton,
  Switch,
  TextField,
  TablePagination,
  Stack,
} from "@mui/material";

import {
  Add,
  Edit,
  Delete,
  Search,
  PlayCircleFilled,
} from "@mui/icons-material";

import {
  getAdminFashionSections,
  deleteFashionSection,
  toggleFashionVisibility,
} from "@/services/fashionSection";

import FashionFormDialog from "@/components/admin/fashion-section/FashionDialog";
import DeleteDialog from "@/components/admin/fashion-section/DeleteDialog";

export default function FashionSectionPage() {
  const [rows, setRows] = useState([]);

  const [search, setSearch] = useState("");

  const [page, setPage] = useState(0);

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [open, setOpen] = useState(false);

  const [editData, setEditData] = useState(null);

  const [deleteOpen, setDeleteOpen] = useState(false);

  const [deleteId, setDeleteId] = useState("");

  const fetchData = async () => {
    try {
      const res = await getAdminFashionSections();

      setRows(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredRows = useMemo(() => {
    return rows.filter(
      (item) =>
        item.category
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        item.title
          ?.toLowerCase()
          .includes(search.toLowerCase())
    );
  }, [rows, search]);

  const handleToggle = async (id) => {
    await toggleFashionVisibility(id);

    fetchData();
  };

  const handleDelete = (id) => {
    setDeleteId(id);

    setDeleteOpen(true);
  };

  const confirmDelete = async () => {
    await deleteFashionSection(deleteId);

    setDeleteOpen(false);

    fetchData();
  };

  return (
    <Box p={3}>
      <Card
        sx={{
          borderRadius: 4,
          boxShadow: "0 10px 25px rgba(0,0,0,.08)",
        }}
      >
        <CardContent>
          <Stack
            direction={{
              xs: "column",
              md: "row",
            }}
            spacing={2}
            justifyContent="space-between"
            mb={3}
          >
            <Box>
              <Typography
                variant="h4"
                fontWeight={700}
              >
                Fashion Section
              </Typography>

              <Typography
                color="text.secondary"
              >
                Manage Landing Categories
              </Typography>
            </Box>

            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => {
                setEditData(null);

                setOpen(true);
              }}
              sx={{
                borderRadius: 3,
                px: 4,
              }}
            >
              Add Category
            </Button>
          </Stack>

          <TextField
            fullWidth
            placeholder="Search..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            InputProps={{
              startAdornment: (
                <Search
                  sx={{
                    mr: 1,
                    color: "gray",
                  }}
                />
              ),
            }}
            sx={{
              mb: 3,
            }}
          />

          <TableContainer
            component={Paper}
            sx={{
              borderRadius: 3,
            }}
          >
            <Table>
              <TableHead>
                <TableRow
                  sx={{
                    bgcolor: "#111827",
                  }}
                >
                  {[
                    "Image",
                    "Video",
                    "Category",
                    "Title",
                    "Order",
                    "Status",
                    "Action",
                  ].map((head) => (
                    <TableCell
                      key={head}
                      sx={{
                        color: "#fff",
                        fontWeight: 700,
                      }}
                    >
                      {head}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {filteredRows
                  .slice(
                    page * rowsPerPage,
                    page * rowsPerPage +
                      rowsPerPage
                  )
                  .map((item) => (
                    <TableRow
                      hover
                      key={item._id}
                    >
                      <TableCell>
                        <Avatar
                          src={item.image}
                          variant="rounded"
                          sx={{
                            width: 70,
                            height: 70,
                          }}
                        />
                      </TableCell>

                      <TableCell>
                        {item.video ? (
                          <IconButton
                            component="a"
                            href={item.video}
                            target="_blank"
                          >
                            <PlayCircleFilled
                              color="error"
                            />
                          </IconButton>
                        ) : (
                          "-"
                        )}
                      </TableCell>

                      <TableCell>
                        <Chip
                          label={
                            item.category
                          }
                          color="primary"
                        />
                      </TableCell>

                      <TableCell>
                        <Typography
                          fontWeight={600}
                        >
                          {item.title}
                        </Typography>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                        >
                          {item.subtitle}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        {item.order}
                      </TableCell>

                      <TableCell>
                        <Switch
                          checked={
                            item.visible
                          }
                          onChange={() =>
                            handleToggle(
                              item._id
                            )
                          }
                        />
                      </TableCell>

                      <TableCell>
                        <IconButton
                          color="primary"
                          onClick={() => {
                            setEditData(
                              item
                            );

                            setOpen(
                              true
                            );
                          }}
                        >
                          <Edit />
                        </IconButton>

                        <IconButton
                          color="error"
                          onClick={() =>
                            handleDelete(
                              item._id
                            )
                          }
                        >
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>

            <TablePagination
              component="div"
              count={filteredRows.length}
              page={page}
              rowsPerPage={rowsPerPage}
              onPageChange={(
                e,
                newPage
              ) =>
                setPage(newPage)
              }
              onRowsPerPageChange={(e) => {
                setRowsPerPage(
                  parseInt(
                    e.target.value
                  )
                );

                setPage(0);
              }}
            />
          </TableContainer>
        </CardContent>
      </Card>

      <FashionFormDialog
        open={open}
        setOpen={setOpen}
        editData={editData}
        refresh={fetchData}
      />

      <DeleteDialog
        open={deleteOpen}
        setOpen={setDeleteOpen}
        onConfirm={confirmDelete}
      />
    </Box>
  );
}