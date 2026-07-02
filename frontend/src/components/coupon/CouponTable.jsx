"use client";

import Link from "next/link";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
  IconButton,
  Stack,
  Tooltip,
} from "@mui/material";
import Switch from "@mui/material/Switch";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";

export default function CouponTable({
  coupons,
  onDelete,
  onToggleStatus,
  onView,
}) {
  const isExpired = (date) => {
    return new Date(date) < new Date();
  };

  return (
    <TableContainer
      component={Paper}
      sx={{
        borderRadius: 3,
        overflow: "hidden",
      }}
    >
      <Table>
        <TableHead>
          <TableRow
            sx={{
              bgcolor: "#f5f5f5",
            }}
          >
            <TableCell>
              <strong>Code</strong>
            </TableCell>

            <TableCell>
              <strong>Type</strong>
            </TableCell>

            <TableCell>
              <strong>Discount</strong>
            </TableCell>

            <TableCell>
              <strong>Min Order</strong>
            </TableCell>

            <TableCell>
              <strong>Usage</strong>
            </TableCell>

            <TableCell>
              <strong>Expiry</strong>
            </TableCell>

            <TableCell>
              <strong>Status</strong>
            </TableCell>

            <TableCell align="center">
              <strong>Actions</strong>
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {coupons.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} align="center">
                <Typography py={4} color="text.secondary">
                  No Coupons Found
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            coupons.map((coupon) => (
              <TableRow key={coupon._id} hover>
                <TableCell>
                  <Typography fontWeight={500}>{coupon.code}</Typography>
                </TableCell>

                <TableCell>
                  {coupon.discountType === "percentage"
                    ? "Percentage"
                    : "Fixed"}
                </TableCell>

                <TableCell>
                  {coupon.discountType === "percentage"
                    ? `${coupon.discountValue}%`
                    : `₹${coupon.discountValue}`}
                </TableCell>

                <TableCell>₹{coupon.minOrderAmount}</TableCell>

                <TableCell>
                  {coupon.usedCount}/{coupon.usageLimit}
                </TableCell>

                <TableCell>
                  {new Date(coupon.expiryDate).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Switch
                      checked={coupon.isActive}
                      onChange={() =>
                        onToggleStatus(coupon._id, coupon.isActive)
                      }
                      color="success"
                    />

                    {isExpired(coupon.expiryDate) ? (
                      <Chip label="Expired" color="error" size="small" />
                    ) : coupon.isActive ? (
                      <Chip label="Active" color="success" size="small" />
                    ) : (
                      <Chip label="Inactive" color="warning" size="small" />
                    )}
                  </Stack>
                </TableCell>
                <TableCell>
                  <Stack direction="row" justifyContent="center" spacing={1}>
                    <Tooltip title="View">
                      <IconButton
                        onClick={() => onView(coupon._id)}
                        sx={{ color: "#1976d2" }}
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Edit">
                      <IconButton
                        component={Link}
                        href={`/admin/coupons/${coupon._id}`}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Delete">
                      <IconButton
                        color="error"
                        onClick={() => onDelete(coupon._id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
