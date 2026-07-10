"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import ConfirmationDialog from "@/components/common/ConfirmationDialog";
import {
  Container,
  Typography,
  Stack,
  Button,
  Grid,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  TextField,
  MenuItem,
  Box,
  Checkbox,
  FormControlLabel,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import AddressList from "@/components/address/AddressList";
import { API_URL } from "@/lib/api";

const inputSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: 2,
    "& fieldset": { borderColor: "#e4e4e7" },
    "&:hover fieldset": { borderColor: "#a1a1aa" },
    "&.Mui-focused fieldset": { borderColor: "#18181b" },
  },
};

export default function AddressPage() {
  const [addresses, setAddresses] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
const [deleteDialog, setDeleteDialog] = useState({
  open: false,
  id: null,
});
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    pincode: "",
    state: "",
    city: "",
    house: "",
    area: "",
    landmark: "",
    type: "Home",
    isDefault: false,
  });
  const resetForm = () => {
    setForm({
      fullName: "",
      phone: "",
      pincode: "",
      state: "",
      city: "",
      house: "",
      area: "",
      landmark: "",
      type: "Home",
      isDefault: false,
    });

    setEditingId(null);
  };
  const router = useRouter();
  const fetchAddresses = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_URL}/users/addresses`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      setAddresses(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  setLoading(true);

  try {
    const token = localStorage.getItem("token");

    const url = editingId
      ? `${API_URL}/users/addresses/${editingId}`
      : `${API_URL}/users/addresses`;

    const method = editingId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (!res.ok) {
      toast.error(data.message || "Something went wrong");
      return;
    }

    fetchAddresses();
    resetForm();
    setOpen(false);

    toast.success(
      editingId
        ? "Address updated successfully."
        : "Address added successfully."
    );
  } catch (err) {
    console.log(err);
    toast.error("Something went wrong.");
  } finally {
    setLoading(false);
  }
};

const handleDelete = async (id) => {
  try {
    setLoading(true);

    const token = localStorage.getItem("token");

    const res = await fetch(`${API_URL}/users/addresses/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (!res.ok) {
      toast.error(data.message || "Failed to delete address.");
      return;
    }

    toast.success("Address deleted successfully.");

    fetchAddresses();
  } catch (err) {
    console.log(err);
    toast.error("Something went wrong.");
  } finally {
    setLoading(false);

    setDeleteDialog({
      open: false,
      id: null,
    });
  }
};

  return (
    <Container
      maxWidth="lg"
      sx={{
        py: {
          xs: 3,
          md: 5,
        },
      }}
    >
      <Stack
        direction={{
          xs: "column",
          sm: "row",
        }}
        justifyContent="space-between"
        alignItems={{
          xs: "stretch",
          sm: "center",
        }}
        spacing={2}
        mb={4}
      >
        <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 1.5 }}>
          <Button
            onClick={() => {
              if (window.history.length > 1) {
                router.back();
              } else {
                router.push("/profile");
              }
            }}
            sx={{
              minWidth: 40,
              width: 40,
              height: 40,
              borderRadius: 2,
              color: "#18181b",
              border: "1px solid #e4e4e7",
              flexShrink: 0,
            }}
          >
            <ArrowBackIcon fontSize="small" />
          </Button>

          <Box>
            <Typography sx={{ fontSize: 22, fontWeight: 700, color: "#18181b", lineHeight: 1.2 }}>
              My Addresses
            </Typography>
            <Typography sx={{ fontSize: 13.5, color: "#71717a", mt: 0.3 }}>
              Manage your delivery locations
            </Typography>
          </Box>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            resetForm();
            setOpen(true);
          }}
          sx={{
            bgcolor: "#18181b",
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 600,
            boxShadow: "none",
            "&:hover": { bgcolor: "#27272a", boxShadow: "none" },
            width: {
              xs: "100%",
              sm: "fit-content",
            },
          }}
        >
          Add New Address
        </Button>
      </Stack>

      {addresses.length === 0 ? (
        <Card
          variant="outlined"
          sx={{
            borderRadius: 3,
            p: 4,
            textAlign: "center",
            bgcolor: "#fafafa",
            borderColor: "#e4e4e7",
            boxShadow: "none",
          }}
        >
          <CardContent>
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                bgcolor: "#f4f4f5",
                color: "#71717a",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mx: "auto",
                mb: 2,
              }}
            >
              <LocationOnOutlinedIcon sx={{ fontSize: 26 }} />
            </Box>

            <Typography fontSize={17} fontWeight={700} sx={{ color: "#18181b" }}>
              No addresses added yet
            </Typography>

            <Typography sx={{ color: "#71717a", fontSize: 14, mt: 0.5 }}>
              Save your delivery address to make checkout faster.
            </Typography>

            <Button
              variant="contained"
              sx={{
                mt: 3,
                borderRadius: 2,
                bgcolor: "#18181b",
                textTransform: "none",
                fontWeight: 600,
                boxShadow: "none",
                "&:hover": { bgcolor: "#27272a", boxShadow: "none" },
              }}
              onClick={() => {
                resetForm();
                setOpen(true);
              }}
            >
              Add First Address
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Box>
          <AddressList
            addresses={addresses}
            onEdit={(address) => {
              setEditingId(address._id);
              setForm(address);
              setOpen(true);
            }}
            onDelete={(id) =>
              setDeleteDialog({
                open: true,
                id,
              })
            }
          />
        </Box>
      )}

      <Dialog
        open={open}
        onClose={() => {
          setOpen(false);
          resetForm();
        }}
        fullWidth
        maxWidth="md"
        PaperProps={{
          sx: {
            borderRadius: 3,
            overflow: "hidden",
          },
        }}
      >
        {/* HEADER */}
        <DialogTitle
          sx={{
            fontWeight: 700,
            fontSize: 17,
            color: "#18181b",
            bgcolor: "#fafafa",
            borderBottom: "1px solid #f4f4f5",
          }}
        >
          {editingId ? "Update Address" : "Add New Address"}
        </DialogTitle>

        {/* BODY */}
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            p: 3,
            maxHeight: "70vh",
            overflowY: "auto",
            bgcolor: "#fff",
          }}
        >
          <Grid container spacing={2}>
            {/* FULL NAME */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Full Name"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                sx={inputSx}
              />
            </Grid>

            {/* PHONE */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Phone Number"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                sx={inputSx}
              />
            </Grid>

            {/* HOUSE */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Flat, House No, Building"
                name="house"
                value={form.house}
                onChange={handleChange}
                sx={inputSx}
              />
            </Grid>

            {/* AREA */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Area, Street, Sector"
                name="area"
                value={form.area}
                onChange={handleChange}
                sx={inputSx}
              />
            </Grid>

            {/* CITY */}
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="City"
                name="city"
                value={form.city}
                onChange={handleChange}
                sx={inputSx}
              />
            </Grid>

            {/* STATE */}
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="State"
                name="state"
                value={form.state}
                onChange={handleChange}
                sx={inputSx}
              />
            </Grid>

            {/* PINCODE */}
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Pincode"
                name="pincode"
                value={form.pincode}
                onChange={handleChange}
                sx={inputSx}
              />
            </Grid>

            {/* LANDMARK */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Landmark (Optional)"
                name="landmark"
                value={form.landmark}
                onChange={handleChange}
                sx={inputSx}
              />
            </Grid>

            {/* TYPE */}
            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                label="Address Type"
                name="type"
                value={form.type}
                onChange={handleChange}
                sx={inputSx}
              >
                <MenuItem value="Home">Home</MenuItem>
                <MenuItem value="Office">Office</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </TextField>
            </Grid>

            {/* DEFAULT CHECKBOX */}
            <Grid
              item
              xs={12}
              md={6}
              sx={{ display: "flex", alignItems: "center" }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={form.isDefault || false}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        isDefault: e.target.checked,
                      })
                    }
                    sx={{
                      color: "#d4d4d8",
                      "&.Mui-checked": { color: "#18181b" },
                    }}
                  />
                }
                label="Set as default address"
                sx={{ "& .MuiFormControlLabel-label": { fontSize: 14, color: "#27272a" } }}
              />
            </Grid>

            {/* BUTTON */}
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={loading}
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  fontWeight: 600,
                  mt: 1,
                  bgcolor: "#18181b",
                  textTransform: "none",
                  boxShadow: "none",
                  "&:hover": { bgcolor: "#27272a", boxShadow: "none" },
                }}
              >
                {loading
                  ? "Please wait..."
                  : editingId
                  ? "Update Address"
                  : "Save Address"}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Dialog>
      <ConfirmationDialog
        open={deleteDialog.open}
        title="Delete Address"
        message="Are you sure you want to delete this address? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        confirmColor="error"
        loading={loading}
        onCancel={() =>
          setDeleteDialog({
            open: false,
            id: null,
          })
        }
        onConfirm={() => handleDelete(deleteDialog.id)}
      />
    </Container>
  );
}