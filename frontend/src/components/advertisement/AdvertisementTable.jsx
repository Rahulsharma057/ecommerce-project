"use client";

import {
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Chip,
  Avatar,
  Stack,
} from "@mui/material";

export default function AdvertisementTable({
  rows,

  onEdit,

  onDelete,
}) {
  console.log(rows);
  const IMAGE_URL = "http://localhost:5000";
  return (
    <Paper>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Banner</TableCell>

            <TableCell>Title</TableCell>

            <TableCell>Status</TableCell>

            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {rows.map((item) => (
            <TableRow key={item._id}>
              <TableCell>
                <Avatar
                  src={item.image}
                  variant="rounded"
                  sx={{
                    width: 90,
                    height: 55,
                  }}
                />
              </TableCell>

              <TableCell>{item.title}</TableCell>

              <TableCell>
                <Chip
                  label={item.status ? "Active" : "Inactive"}
                  color={item.status ? "success" : "default"}
                />
              </TableCell>

              <TableCell>
                <Stack direction="row" spacing={1}>
                  <Button variant="contained" onClick={() => onEdit(item)}>
                    Edit
                  </Button>

                  <Button
                    color="error"
                    variant="outlined"
                    onClick={() => onDelete(item._id)}
                  >
                    Delete
                  </Button>
                </Stack>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}
