"use client";

import {
  Avatar,
  Box,
  Button,
  Chip,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";

import { deleteApplication } from "@/services/careerService";
import { useRouter } from "next/navigation";

const statusColor = {
  Pending: "warning",
  Reviewed: "info",
  Shortlisted: "success",
  Rejected: "error",
};

export default function CareerTable({ data = [], reload }) {
  const router = useRouter();

  console.log("Career Data:", data);

  const handleDelete = async (id) => {
    try {
      if (!confirm("Delete application?")) return;

      await deleteApplication(id);

      reload();
    } catch (error) {
      console.log(error);

      alert("Delete failed");
    }
  };

  return (
    <Paper
      sx={{
        borderRadius: 3,
        overflow: "hidden",
      }}
    >
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow
              sx={{
                bgcolor: "#111827",
              }}
            >
              {["Candidate", "Job", "Email", "Phone", "Status", "Action"].map(
                (item) => (
                  <TableCell
                    key={item}
                    sx={{
                      color: "#fff",
                      fontWeight: 700,
                    }}
                  >
                    {item}
                  </TableCell>
                ),
              )}
            </TableRow>
          </TableHead>

          <TableBody>
            {data.length > 0 ? (
              data.map((item) => (
                <TableRow key={item._id} hover>
                  <TableCell>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar>{item.fullName?.charAt(0)?.toUpperCase()}</Avatar>

                      <Box>
                        <Typography fontWeight={600}>
                          {item.fullName}
                        </Typography>

                        <Typography variant="caption" color="text.secondary">
                          Candidate
                        </Typography>
                      </Box>
                    </Stack>
                  </TableCell>

                  <TableCell>{item.jobTitle || "-"}</TableCell>

                  <TableCell>{item.email || "-"}</TableCell>

                  <TableCell>{item.phone || "-"}</TableCell>

                  <TableCell>
                    <Chip
                      label={item.status || "Pending"}
                      size="small"
                      color={statusColor[item.status] || "default"}
                    />
                  </TableCell>

                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <Button
                        size="small"
                        variant="contained"
                        startIcon={<VisibilityOutlinedIcon />}
                        onClick={() =>
                          router.push(`/admin/careers/${item._id}`)
                        }
                      >
                        View
                      </Button>

                      <Button
                        size="small"
                        color="error"
                        variant="outlined"
                        startIcon={<DeleteOutlineOutlinedIcon />}
                        onClick={() => handleDelete(item._id)}
                      >
                        Delete
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography py={5} color="text.secondary">
                    No Job Applications Found
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
