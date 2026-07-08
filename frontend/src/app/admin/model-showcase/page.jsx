"use client";

import { useEffect, useState } from "react";

import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Switch,
  Avatar,
  Chip,
} from "@mui/material";

import { Add, Edit, Delete } from "@mui/icons-material";

import {
  getAdminModels,
  deleteModel,
  toggleVisibility,
} from "@/services/modelShowcase";

import FormDialog from "@/components/admin/model-showcase/FormDialog";
import DeleteDialog from "@/components/admin/model-showcase/DeleteDialog";

export default function ModelShowcaseAdmin() {
  const [models, setModels] = useState([]);

  const [open, setOpen] = useState(false);

  const [editData, setEditData] = useState(null);

  const [deleteOpen, setDeleteOpen] = useState(false);

  const [deleteId, setDeleteId] = useState(null);
  const [page, setPage] = useState(0);

  const [rowsPerPage, setRowsPerPage] = useState(5);
  // Fetch

  const fetchModels = async () => {
    try {
      const res = await getAdminModels();

      setModels(res.data.data);

      setPage(0);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchModels();
  }, []);

  // Add

  const handleAdd = () => {
    setEditData(null);

    setOpen(true);
  };

  // Edit

  const handleEdit = (item) => {
    setEditData(item);

    setOpen(true);
  };

  // Delete

  const handleDelete = (id) => {
    setDeleteId(id);

    setDeleteOpen(true);
  };

  // Confirm Delete

  const confirmDelete = async () => {
    await deleteModel(deleteId);

    setDeleteOpen(false);

    fetchModels();
  };

  // Toggle

  const handleToggle = async (id) => {
    await toggleVisibility(id);

    fetchModels();
  };

  return (
    <Box p={3}>
      <Card>
        <CardContent>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={3}
          >
            <Typography variant="h5">Model Showcase</Typography>

            <Button variant="contained" startIcon={<Add />} onClick={handleAdd}>
              Add Model
            </Button>
          </Box>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Image</TableCell>

                  <TableCell>Title</TableCell>

                  <TableCell>Button</TableCell>

                  <TableCell>Order</TableCell>

                  <TableCell>Status</TableCell>

                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {models
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((item) => (
                    <TableRow key={item._id}>
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
                        <Typography>{item.title}</Typography>

                        <Chip size="small" label={item.subtitle} />
                      </TableCell>

                      <TableCell>{item.buttonText}</TableCell>

                      <TableCell>{item.order}</TableCell>

                      <TableCell>
                        <Switch
                          checked={item.visible}
                          onChange={() => handleToggle(item._id)}
                        />
                      </TableCell>

                      <TableCell>
                        <IconButton
                          color="primary"
                          onClick={() => handleEdit(item)}
                        >
                          <Edit />
                        </IconButton>

                        <IconButton
                          color="error"
                          onClick={() => handleDelete(item._id)}
                        >
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={models.length}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={(event, newPage) => {
              setPage(newPage);
            }}
            onRowsPerPageChange={(event) => {
              setRowsPerPage(parseInt(event.target.value, 10));

              setPage(0);
            }}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </CardContent>
      </Card>

      <FormDialog
        open={open}
        setOpen={setOpen}
        editData={editData}
        refresh={fetchModels}
      />

      <DeleteDialog
        open={deleteOpen}
        setOpen={setDeleteOpen}
        onConfirm={confirmDelete}
      />
    </Box>
  );
}
