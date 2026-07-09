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
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  MenuItem,
  IconButton,
  Box,
  Checkbox,
  FormControlLabel,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import AddressList from "@/components/address/AddressList";
import { API_URL } from "@/lib/api";

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
        {" "}
        <Box sx={{display:"flex",flexDirection:"row"}}>
          <Box>
            {" "}
            <Button
              onClick={() => {
                if (window.history.length > 1) {
                  router.back();
                } else {
                  router.push("/profile");
                }
              }}
             
              sx={{
                color: "rgb(2, 2, 2)",
                width: {
                  xs: "100%",
                  sm: "fit-content",
                },
              }}
            >
              <ArrowBackIcon />
            </Button>
         
          </Box >
          <Box>
               <Typography fontSize={22} fontWeight={800}>
              My Addresses
            </Typography>
          <Typography fontSize={13} color="text.secondary">
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
          color="success"
          sx={{
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
          sx={{
            borderRadius: 4,
            p: 4,
            textAlign: "center",
            bgcolor: "#f9fafb",
            border: "1px dashed #d1d5db",
          }}
        >
          <CardContent>
            <Typography fontSize={18} fontWeight={700}>
              No addresses added yet
            </Typography>

            <Typography color="text.secondary" mt={1}>
              Save your delivery address to make checkout faster.
            </Typography>

            <Button
              variant="contained"
              color="success"
              sx={{ mt: 3, borderRadius: 2 }}
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
  <Box m={2} px={4}>
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
            fontSize: 18,
            color: "rgba(24, 24, 24, 0.97)",
            bgcolor: "#f9f9f9",
            borderBottom: "1px solid #eee",
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
                  />
                }
                label="Set as default address"
              />
            </Grid>

            {/* BUTTON */}
            <Grid item xs={12}>
             <Button
  type="submit"
  variant="contained"
  fullWidth
  color="success"
  size="large"
  disabled={loading}
  sx={{
    py: 1.5,
    borderRadius: 2,
    fontWeight: 600,
    mt: 1,
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
