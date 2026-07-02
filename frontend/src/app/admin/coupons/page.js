"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Paper,
  Typography,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  Chip,
  Stack,
  IconButton,
  Divider,
  LinearProgress,
} from "@mui/material";

import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import PercentIcon from "@mui/icons-material/Percent";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import Link from "next/link";
import CouponTable from "@/components/coupon/CouponTable";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import { API_URL } from "@/lib/api";
export default function CouponsPage() {
  const [coupons, setCoupons] = useState([]);

  // PAGINATION
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [open, setOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const fetchCoupons = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API_URL}/coupons`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    setCoupons(data);
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");

    await fetch(`${API_URL}/coupons/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    fetchCoupons();
  };

  const handleToggleStatus = async (id, currentStatus) => {
    const token = localStorage.getItem("token");

    await fetch(`${API_URL}/coupons/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        isActive: !currentStatus,
      }),
    });

    fetchCoupons();
  };

  const handleView = async (id) => {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API_URL}/coupons/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    setSelectedCoupon(data);
    setOpen(true);
  };

  // PAGINATED DATA
  const paginatedCoupons = useMemo(() => {
    return coupons.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [coupons, page, rowsPerPage]);

  function InfoCard({ label, value }) {
    return (
      <Box
        sx={{
          px: 3,
          py:2,
          borderRadius: 1.5,
         border: "1px solid #eef2f7",
          bgcolor: "#ffffff",
        }}
      >
        <Typography fontSize={11} color="#5c5c5c">
          {label}
        </Typography>

        <Typography fontSize={14} fontWeight={700} color="#0f172a">
          {value}
        </Typography>
      </Box>
    );
  }
  return (
    <Box sx={{ p: 3, bgcolor: "#f5f7fb", minHeight: "100vh" }}>
      {/* HEADER */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h5" fontWeight={800}>
            Coupons Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage discount coupons & promotions
          </Typography>
        </Box>

        <Button
          component={Link}
          href="/admin/coupons/create"
          variant="contained"
          color="success"
          startIcon={<AddIcon />}
          sx={{
            textTransform: "none",
            borderRadius: 2,
            px: 2.5,
          }}
        >
          Create Coupon
        </Button>
      </Box>

      {/* TABLE CARD */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          overflow: "hidden",
          border: "1px solid #e8ecf3",
        }}
      >
        <CouponTable
          coupons={paginatedCoupons}
          onDelete={handleDelete}
          onToggleStatus={handleToggleStatus}
          onView={handleView}
        />

        {/* PAGINATION */}
        <TablePagination
          component="div"
          count={coupons.length}
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
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: 4,
            overflow: "hidden",
            bgcolor: "#ffffff",
          },
        }}
      >
        {selectedCoupon && (
          <>
            {/* ================= HEADER ================= */}
            <Box
              sx={{
                px: 3,
                py: 2.5,
                bgcolor: "#7822ab",
                borderBottom: "1px solid #eef2f7",
              }}
            >
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Box>
                  <Typography fontSize={14} color="#f7f7f7">
                    Coupon Details
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: 22,
                      fontWeight: 800,
                      fontFamily: "monospace",
                      letterSpacing: 1,
                      color: "#ffffff",
                    }}
                  >
                    {selectedCoupon.code}{" "}
                    <Chip
                      label={selectedCoupon.isActive ? "Active" : "Inactive"}
                      size="small"
                      sx={{
                        fontWeight: 700,
                        bgcolor: selectedCoupon.isActive
                          ? "#ecfdf5"
                          : "#fff7ed",
                        color: selectedCoupon.isActive ? "#17783a" : "#c2410c",
                      }}
                    />
                  </Typography>
                </Box>

                <IconButton
                  onClick={() => setOpen(false)}
                >
                  <CloseIcon
                    sx={{ color: "rgb(223, 223, 223)", "&:hover": { color:"white"} }}
                  />
                </IconButton>
              </Stack>

              {/* STATUS */}
            </Box>

            {/* ================= CONTENT ================= */}
            <DialogContent sx={{ p: 2 }}>
              <Stack spacing={3}>
                {/* DISCOUNT CARD */}
                <Box
                  sx={{
                    p: 2.5,
                    borderRadius: 3,
                    border: "1px solid #eef2f7",
                    bgcolor: "#1cc919",
                  }}
                >
                  <Typography fontSize={12} color="#fdfdfd">
                    DISCOUNT
                  </Typography>

                  <Typography fontSize={18} fontWeight={800} color="#fdfdfd">
                    {selectedCoupon.discountType === "percentage"
                      ? `${selectedCoupon.discountValue}% OFF`
                      : `₹${selectedCoupon.discountValue} OFF`}
                  </Typography>

                  <Typography fontSize={12} color="#ffffff" mt={0.5}>
                    {selectedCoupon.discountType === "percentage"
                      ? "Percentage discount applied on cart value"
                      : "Fixed amount discount applied on cart value"}
                  </Typography>
                </Box>

                {/* INFO GRID */}
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 2,
                  }}
                >
                  <InfoCard label="Type" value={selectedCoupon.discountType} />
                  <InfoCard
                    label="Min Order"
                    value={`₹${selectedCoupon.minOrderAmount}`}
                  />
                  <InfoCard
                    label="Max Discount"
                    value={
                      selectedCoupon.maxDiscount
                        ? `₹${selectedCoupon.maxDiscount}`
                        : "∞"
                    }
                  />
                  <InfoCard
                    label="Usage"
                    value={`${selectedCoupon.usedCount}/${selectedCoupon.usageLimit || "∞"}`}
                  />
                </Box>

                {/* PROGRESS */}
                {selectedCoupon.usageLimit > 0 && (
                  <Box>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      mb={1}
                      px={2}
                    >
                      <Typography fontSize={12} color="#3e3e3f">
                        Usage Progress
                      </Typography>

                      <Typography fontSize={12} fontWeight={600} >
                        {Math.round(
                          (selectedCoupon.usedCount /
                            selectedCoupon.usageLimit) *
                            100,
                        )}
                        %
                      </Typography>
                    </Stack>

                    <LinearProgress
                      variant="determinate"
                      value={Math.min(
                        100,
                        (selectedCoupon.usedCount / selectedCoupon.usageLimit) *
                          100,
                      )}
                      sx={{
                        height: 8,
                        mx:2,
                        borderRadius: 5,
                        bgcolor: "#f1f5f9",
                        "& .MuiLinearProgress-bar": {
                          borderRadius: 5,
                          bgcolor: "#4f46e5",
                        },
                      }}
                    />
                  </Box>
                )}
              </Stack>
            </DialogContent>
          </>
        )}
      </Dialog>
    </Box>
  );
}
