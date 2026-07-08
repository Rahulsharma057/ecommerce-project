"use client";

import { useEffect, useMemo, useState } from "react";

import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  Switch,
  IconButton,
  TextField,
  Stack,
  Avatar,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

import {
  getAdminCategoryHighlights,
  createCategoryHighlight,
  updateCategoryHighlight,
  deleteCategoryHighlight,
  toggleCategoryHighlight,
} from "@/services/categoryHighlight";

import CategoryHighlightForm from "./CategoryHighlightForm";

export default function CategoryHighlightTable() {
  const [rows, setRows] = useState([]);

  const [search, setSearch] = useState("");

  const [dialog, setDialog] = useState({
    open: false,
    editData: null,
  });

  const fetchData = async () => {
    try {
      const res = await getAdminCategoryHighlights();

      setRows(res.data.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredRows = useMemo(() => {
    return rows.filter((item) =>
      item.title.toLowerCase().includes(search.toLowerCase())
    );
  }, [rows, search]);

  const handleSubmit = async (form) => {
    try {
      if (dialog.editData) {
        await updateCategoryHighlight(dialog.editData._id, form);
      } else {
        await createCategoryHighlight(form);
      }

      setDialog({
        open: false,
        editData: null,
      });

      fetchData();
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this category?")) return;

    await deleteCategoryHighlight(id);

    fetchData();
  };

  const handleToggle = async (id) => {
    await toggleCategoryHighlight(id);

    fetchData();
  };

  return (
    <>
      <Card>

        <CardContent>

          <Stack
            direction="row"
            justifyContent="space-between"
            mb={3}
          >
            <Typography
              variant="h5"
              fontWeight={700}
            >
              Category Highlights
            </Typography>

            <Button
              startIcon={<AddIcon />}
              variant="contained"
              onClick={() =>
                setDialog({
                  open: true,
                  editData: null,
                })
              }
            >
              Add Category
            </Button>

          </Stack>

          <TextField
            fullWidth
            placeholder="Search Category..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            sx={{
              mb: 3,
            }}
          />

          <TableContainer component={Paper}>

            <Table>

              <TableHead>

                <TableRow>

                  <TableCell>S.No</TableCell>

                  <TableCell>Image</TableCell>

                  <TableCell>Name</TableCell>

                  <TableCell>Description</TableCell>

                  <TableCell>Keyword</TableCell>

                  <TableCell>Visible</TableCell>

                  <TableCell align="center">
                    Action
                  </TableCell>

                </TableRow>

              </TableHead>

              <TableBody>

                {filteredRows.map((row, index) => (

                  <TableRow key={row._id} hover>

                    <TableCell>
                      {index + 1}
                    </TableCell>

                    <TableCell>

                      <Avatar
                        src={row.image}
                        variant="rounded"
                        sx={{
                          width: 70,
                          height: 70,
                        }}
                      />

                    </TableCell>

                    <TableCell>
                      {row.title}
                    </TableCell>

                    <TableCell
                      sx={{
                        maxWidth: 250,
                      }}
                    >
                      {row.description}
                    </TableCell>

                    <TableCell>
                      {row.searchKeyword}
                    </TableCell>

                    <TableCell>

                      <Switch
                        checked={row.isVisible}
                        onChange={() =>
                          handleToggle(row._id)
                        }
                      />

                    </TableCell>

                    <TableCell align="center">

                      <IconButton
                        color="primary"
                        onClick={() =>
                          setDialog({
                            open: true,
                            editData: row,
                          })
                        }
                      >
                        <EditIcon />
                      </IconButton>

                      <IconButton
                        color="error"
                        onClick={() =>
                          handleDelete(row._id)
                        }
                      >
                        <DeleteIcon />
                      </IconButton>

                    </TableCell>

                  </TableRow>

                ))}

              </TableBody>

            </Table>

          </TableContainer>

        </CardContent>

      </Card>

      <CategoryHighlightForm
        open={dialog.open}
        initialData={dialog.editData}
        onClose={() =>
          setDialog({
            open: false,
            editData: null,
          })
        }
        onSubmit={handleSubmit}
      />
    </>
  );
}