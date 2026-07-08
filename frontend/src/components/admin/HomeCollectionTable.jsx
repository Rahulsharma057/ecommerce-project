"use client";

import { useEffect, useMemo, useState } from "react";

import {
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
  TextField,
  Avatar,
  Switch,
  Stack,
  IconButton,
  TablePagination,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import {
  getAdminHomeCollections,
  createHomeCollection,
  updateHomeCollection,
  deleteHomeCollection,
  toggleHomeCollection,
} from "@/services/homeCollection";

import HomeCollectionForm from "./HomeCollectionForm";

export default function HomeCollectionTable() {
  const [rows, setRows] = useState([]);

  const [search, setSearch] = useState("");
const [page, setPage] = useState(0);
const [rowsPerPage, setRowsPerPage] = useState(10);
  const [dialog, setDialog] = useState({
    open: false,
    editData: null,
  });

  const fetchData = async () => {
    try {
      const res = await getAdminHomeCollections();

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
      await updateHomeCollection(dialog.editData._id, form);
    } else {
      await createHomeCollection(form);
    }

    await fetchData();

    setDialog({
      open: false,
      editData: null,
    });
  } catch (err) {
    console.log(err.response?.data || err);
  }
};

  const handleDelete = async (id) => {
    if (!confirm("Delete this collection?")) return;

    await deleteHomeCollection(id);

    fetchData();
  };

  const handleToggle = async (id) => {
    await toggleHomeCollection(id);

    fetchData();
  };

  const handleChangePage = (event, newPage) => {
  setPage(newPage);
};

const handleChangeRowsPerPage = (event) => {
  setRowsPerPage(parseInt(event.target.value, 10));
  setPage(0);
};

  return (
    <>
      <Card>

        <CardContent>

          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            mb={3}
          >
            <Typography
              variant="h5"
              fontWeight={700}
            >
              Home Collections
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
              Add Collection
            </Button>

          </Stack>

        <TextField
  size="small"
  placeholder="Search Collection..."
  value={search}
  onChange={(e) => {
    setSearch(e.target.value);
    setPage(0);
  }}
  sx={{
    mb: 3,
    width: 350,
  }}
/>

          <TableContainer component={Paper}>

            <Table>

         <TableHead
  sx={{
    "& th": {
      fontWeight: 700,
      background: "#f5f5f5",
      whiteSpace: "nowrap",
    },
  }}
>

                <TableRow>

                  <TableCell>S.No</TableCell>

                  <TableCell>Image</TableCell>

                  <TableCell>Collection</TableCell>

                  <TableCell>Description</TableCell>

                  <TableCell>Keyword</TableCell>

                  <TableCell>Button</TableCell>

                  <TableCell>Visible</TableCell>

                  <TableCell align="center">
                    Action
                  </TableCell>

                </TableRow>

              </TableHead>

          <TableBody>
  {filteredRows
    .slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    )
    .map((row, index) => (
      <TableRow hover key={row._id}>
        <TableCell>
          {page * rowsPerPage + index + 1}
        </TableCell>

        <TableCell>
          <Avatar
            src={row.image}
            variant="rounded"
            sx={{
              width: 70,
              height: 70,
              borderRadius: 2,
            }}
          />
        </TableCell>

        <TableCell>{row.title}</TableCell>

        <TableCell
          sx={{
            maxWidth: 250,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {row.description}
        </TableCell>

        <TableCell>{row.searchKeyword}</TableCell>

        <TableCell>{row.buttonText || "-"}</TableCell>

        <TableCell>
          <Switch
            checked={row.visible}
            onChange={() => handleToggle(row._id)}
          />
        </TableCell>

        <TableCell align="center">
          <Stack
            direction="row"
            spacing={1}
            justifyContent="center"
          >
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
              onClick={() => handleDelete(row._id)}
            >
              <DeleteIcon />
            </IconButton>
          </Stack>
        </TableCell>
      </TableRow>
    ))}
</TableBody>

            </Table>

          </TableContainer>
<TablePagination
  component="div"
  count={filteredRows.length}
  page={page}
  rowsPerPage={rowsPerPage}
  onPageChange={handleChangePage}
  onRowsPerPageChange={handleChangeRowsPerPage}
  rowsPerPageOptions={[5, 10, 25, 50]}
/>
        </CardContent>

      </Card>

      <HomeCollectionForm
        open={dialog.open}
        editData={dialog.editData}
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