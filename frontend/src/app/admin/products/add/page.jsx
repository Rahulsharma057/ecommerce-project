"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import IconButton from "@mui/material/IconButton";
import { API_URL } from "@/lib/api";
export default function AddProductPage() {
  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
    description: "",
    stock: "",
    isNewArrival: false,
    isSale: false,
    isFeatured: false,
    images: [""],
  });

  const params = useParams();
  const router = useRouter();

  const isEdit = !!params?.id;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleImageChange = (index, value) => {
    const updatedImages = [...form.images];
    updatedImages[index] = value;

    setForm({
      ...form,
      images: updatedImages,
    });
  };

  const addImageField = () => {
    setForm({
      ...form,
      images: [...form.images, ""],
    });
  };

  const removeImageField = (index) => {
    const updatedImages = form.images.filter((_, i) => i !== index);

    setForm({
      ...form,
      images: updatedImages,
    });
  };

  useEffect(() => {
    if (!isEdit) return;

    const fetchProduct = async () => {
      const res = await fetch(
        `${API_URL}/products/${params.id}`,
      );

      const data = await res.json();

      setForm({
        name: data.name || "",
        price: data.price || "",
        category: data.category || "",
        description: data.description || "",
        stock: data.stock || "",
        isNewArrival: data.isNewArrival || false,
        isSale: data.isSale || false,
        isFeatured: data.isFeatured || false,
        images: data.images?.length > 0 ? data.images : [""],
      });
    };

    fetchProduct();
  }, [params.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
      images: form.images.filter((img) => img.trim() !== ""),
    };

    try {
      let res;

      if (isEdit) {
        res = await fetch(`${API_URL}/products/${params.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch(`${API_URL}/products/add`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
      }

      if (res.ok) {
        alert(isEdit ? "Product Updated" : "Product Added");

        router.push("/admin/products");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Box sx={{ bgcolor: "#f8f9fb", minHeight: "100vh", py: 2 }}>
      <Container maxWidth="md">
        <Paper sx={{ p: 4, borderRadius: 3 }}>
         <Stack
  direction="row"
  spacing={2}
  alignItems="flex-start"
  sx={{ mb: 3 }}
>
  <IconButton
    onClick={() => router.back()}
    sx={{
      mt: 0.3,
      width: 42,
      height: 42,
      borderRadius: 2,
    //  border: "1px solid #e5e7eb",
    //  bgcolor: "#fff",
     // boxShadow: "0 2px 8px rgba(0,0,0,.05)",
      "&:hover": {
        bgcolor: "#f8fafc",
      },
    }}
  >
    <ArrowBackIcon sx={{ fontSize: 24 }} />
  </IconButton>

  <Box>
    <Typography
      variant="h5"
      fontWeight={700}
      color="#111827"
    >
      {isEdit ? "Edit Product" : "Add Product"}
    </Typography>

    <Typography
      variant="body2"
      color="text.secondary"
      mt={0.3}
    >
      {isEdit
        ? "Update product information"
        : "Create a new product for your store"}
    </Typography>
  </Box>
</Stack>
          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <TextField
                label="Product Name"
                name="name"
                value={form.name}
                onChange={handleChange}
                fullWidth
                required
              />

              <TextField
                label="Price"
                name="price"
                type="number"
                value={form.price}
                onChange={handleChange}
                fullWidth
                required
              />

              <TextField
                label="Stock Quantity"
                name="stock"
                type="number"
                value={form.stock}
                onChange={handleChange}
                fullWidth
                required
              />
              <TextField
                label="Category"
                name="category"
                value={form.category}
                onChange={handleChange}
                fullWidth
                required
              />

              <Box>
                <Typography mb={2} fontWeight={600}>
                  Product Images
                </Typography>

                <Stack spacing={2}>
                  {form.images.map((img, index) => (
                    <Stack key={index} direction="row" spacing={2}>
                      <TextField
                        label={`Image URL ${index + 1}`}
                        value={img}
                        fullWidth
                        onChange={(e) =>
                          handleImageChange(index, e.target.value)
                        }
                      />

                      {form.images.length > 1 && (
                        <Button
                          color="error"
                          variant="outlined"
                          onClick={() => removeImageField(index)}
                        >
                          Remove
                        </Button>
                      )}
                    </Stack>
                  ))}
                </Stack>

                <Button
                  sx={{ mt: 2 }}
                  variant="outlined"
                  onClick={addImageField}
                >
                  + Add More Images
                </Button>
              </Box>

              <TextField
                label="Description"
                name="description"
                value={form.description}
                onChange={handleChange}
                multiline
                rows={4}
                fullWidth
              />

              <Stack direction="row" spacing={3}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={form.isNewArrival}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          isNewArrival: e.target.checked,
                        })
                      }
                    />
                  }
                  label="New Arrival"
                />

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={form.isSale}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          isSale: e.target.checked,
                        })
                      }
                    />
                  }
                  label="Sale Product"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={form.isFeatured}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          isFeatured: e.target.checked,
                        })
                      }
                    />
                  }
                  label="Featured Product"
                />
              </Stack>

              <Button
                type="submit"
                variant="contained"
                sx={{
                  bgcolor: "#111",
                  py: 1.5,
                  borderRadius: 2,
                  "&:hover": {
                    bgcolor: "#333",
                  },
                }}
              >
                {isEdit ? "Update Product" : "Add Product"}
              </Button>
            </Stack>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
