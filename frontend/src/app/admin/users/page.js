"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  Chip,
  TextField,
  Stack,
  Box,
  Avatar,
  IconButton,
  InputAdornment,
  Select,
  MenuItem,
  TablePagination,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import BlockIcon from "@mui/icons-material/Block";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { API_URL } from "@/lib/api";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  // NEW FILTERS
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // PAGINATION
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const fetchUsers = async () => {
    const res = await fetch(
      `${API_URL}/users/admin/all`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    const data = await res.json();
    setUsers(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const changeRole = async (id) => {
    await fetch(
      `${API_URL}/users/admin/role/${id}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    fetchUsers();
  };

  const blockUser = async (id) => {
    await fetch(
      `${API_URL}/users/admin/block/${id}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    fetchUsers();
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;

    await fetch(
      `${API_URL}/users/admin/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    fetchUsers();
  };

  // FILTER LOGIC (SEARCH + ROLE + STATUS)
  const filteredUsers = useMemo(() => {
    return users
      .filter(
        (u) =>
          u.name?.toLowerCase().includes(search.toLowerCase()) ||
          u.email?.toLowerCase().includes(search.toLowerCase())
      )
      .filter((u) =>
        roleFilter === "all" ? true : u.role === roleFilter
      )
      .filter((u) =>
        statusFilter === "all"
          ? true
          : statusFilter === "blocked"
          ? u.isBlocked
          : !u.isBlocked
      );
  }, [users, search, roleFilter, statusFilter]);

  // PAGINATION DATA
  const paginatedUsers = filteredUsers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box sx={{ bgcolor: "#f5f7fb", minHeight: "100vh", py: 3 }}>
      <Container maxWidth="lg">

        {/* HEADER */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" fontWeight={800}>
            Users Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {filteredUsers.length} users found
          </Typography>
        </Box>

        {/* SEARCH + FILTERS (UI SAME STYLE EXTENDED) */}
       <Paper
  elevation={0}
  sx={{
    mb: 2,
    p: 1.5,
    borderRadius: 3,
    border: "1px solid #e8ecf3",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 2,
    flexWrap: "wrap",
    bgcolor: "#fff",
  }}
>
  {/* LEFT: SEARCH */}
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      gap: 1,
      flex: 1,
      minWidth: 260,
      bgcolor: "#f9fafb",
      px: 1.5,
      py: 0.5,
      borderRadius: 2,
      border: "1px solid #eef2f7",
    }}
  >
    <SearchIcon sx={{ color: "#94a3b8" }} />

    <TextField
      variant="standard"
      placeholder="Search users by name or email..."
      value={search}
      onChange={(e) => {
        setSearch(e.target.value);
        setPage(0);
      }}
      fullWidth
      InputProps={{
        disableUnderline: true,
        sx: {
          fontSize: 14,
        },
      }}
    />
  </Box>

  {/* RIGHT: FILTERS */}
  <Stack direction="row" spacing={1.5} flexWrap="wrap">

    {/* ROLE FILTER */}
    <Select
      size="small"
      value={roleFilter}
      onChange={(e) => {
        setRoleFilter(e.target.value);
        setPage(0);
      }}
      sx={{
        minWidth: 140,
        bgcolor: "#f9fafb",
        borderRadius: 2,
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: "#e5e7eb",
        },
      }}
    >
      <MenuItem value="all">All Roles</MenuItem>
      <MenuItem value="admin">Admin</MenuItem>
      <MenuItem value="user">User</MenuItem>
    </Select>

    {/* STATUS FILTER */}
    <Select
      size="small"
      value={statusFilter}
      onChange={(e) => {
        setStatusFilter(e.target.value);
        setPage(0);
      }}
      sx={{
        minWidth: 150,
        bgcolor: "#f9fafb",
        borderRadius: 2,
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: "#e5e7eb",
        },
      }}
    >
      <MenuItem value="all">All Status</MenuItem>
      <MenuItem value="active">Active</MenuItem>
      <MenuItem value="blocked">Blocked</MenuItem>
    </Select>
  </Stack>
</Paper>

        {/* TABLE CARD (UNCHANGED UI) */}
        <Paper
          elevation={0}
          sx={{
            borderRadius: 3,
            overflow: "hidden",
            border: "1px solid #e8ecf3",
          }}
        >
          <Table>
            <TableHead>
              <TableRow
                sx={{
                  bgcolor: "#f9fafb",
                  "& th": {
                    fontWeight: 700,
                    fontSize: 12,
                    color: "#64748b",
                    textTransform: "uppercase",
                  },
                }}
              >
                <TableCell>User</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {paginatedUsers.map((user, i) => (
                <TableRow
                  key={user._id}
                  sx={{
                    "&:hover": { bgcolor: "#f1f5ff" },
                    bgcolor: i % 2 ? "#fcfcfd" : "#fff",
                    transition: "0.2s",
                  }}
                >
                  <TableCell>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Avatar sx={{ width: 34, height: 34, bgcolor: "#111827", fontSize: 14 }}>
                        {user.name?.[0]?.toUpperCase()}
                      </Avatar>
                      <Typography fontWeight={600}>{user.name}</Typography>
                    </Stack>
                  </TableCell>

                  <TableCell sx={{ color: "#64748b" }}>
                    {user.email}
                  </TableCell>

                  <TableCell>
                    <Chip
                      label={user.role}
                      size="small"
                      sx={{
                        fontWeight: 600,
                        bgcolor: user.role === "admin" ? "#ede9fe" : "#e0f2fe",
                        color: user.role === "admin" ? "#6d28d9" : "#0369a1",
                      }}
                    />
                  </TableCell>

                  <TableCell>
                    <Chip
                      label={user.isBlocked ? "Blocked" : "Active"}
                      size="small"
                      sx={{
                        fontWeight: 600,
                        bgcolor: user.isBlocked ? "#fee2e2" : "#dcfce7",
                        color: user.isBlocked ? "#dc2626" : "#16a34a",
                      }}
                    />
                  </TableCell>

                  <TableCell align="center">
                    <Stack direction="row" spacing={1} justifyContent="center">

                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<AdminPanelSettingsIcon />}
                        onClick={() => changeRole(user._id)}
                      >
                        Role
                      </Button>

                      <Button
                        size="small"
                        variant="outlined"
                        color="warning"
                        startIcon={<BlockIcon />}
                        onClick={() => blockUser(user._id)}
                      >
                        Block
                      </Button>

                      <IconButton
                        onClick={() => deleteUser(user._id)}
                        sx={{ bgcolor: "#fee2e2" }}
                      >
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>

                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* PAGINATION */}
          <TablePagination
            component="div"
            count={filteredUsers.length}
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

      </Container>
    </Box>
  );
}