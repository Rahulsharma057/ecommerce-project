"use client";

import { useState, useEffect } from "react";
import {
  Autocomplete, Box, Button, Checkbox, Chip, Container, Divider,
  FormControlLabel, Grid, InputAdornment, Paper, Stack, TextField,
  Typography, MenuItem,
} from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import IconButton from "@mui/material/IconButton";
import { toast } from "react-toastify";
import { API_URL } from "@/lib/api";

const emptyForm = {
  name: "",
  price: "",
  originalPrice: "",
  costPrice: "",
  taxPercent: 5,
  stock: "",
  category: "",
  subCategory: "",
  collection: "",
  brand: "Veloura",
  fabric: "",
  fit: "",
  pattern: "",
  neckType: "",
  sleeveType: "",
  occasion: "",
  careInstructions: "",
  countryOfOrigin: "India",
  colors: [],
  sizes: [],
  tags: [],
  description: "",
  status: "Draft",
  isNewArrival: false,
  isSale: false,
  isFeatured: false,
  images: [{ url: "", file: null }],
};

// Fields on the form that map directly to a ProductAttribute "type" —
// used to fetch suggestion options from /api/attributes.
const ATTRIBUTE_FIELDS = [
  "category", "subCategory", "collection", "brand", "fabric", "fit",
  "pattern", "neckType", "sleeveType", "occasion", "careInstructions",
  "countryOfOrigin", "tags",
];

const SIZE_SUGGESTIONS = ["XS", "S", "M", "L", "XL", "XXL", "Free Size"];
const COLOR_SUGGESTIONS = [
  "Black", "White", "Red", "Blue", "Green", "Yellow", "Pink", "Beige",
  "Maroon", "Navy", "Gold", "Silver",
];

export default function AddProductPage() {
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [options, setOptions] = useState({});

  const params = useParams();
  const router = useRouter();
  const isEdit = !!params?.id;

  const numPrice = Number(form.price) || 0;
  const numOriginal = Number(form.originalPrice) || 0;
  const previewDiscount =
    numOriginal > numPrice ? Math.round(((numOriginal - numPrice) / numOriginal) * 100) : 0;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (index, value) => {
    const updated = [...form.images];
    updated[index].url = value;
    setForm((prev) => ({ ...prev, images: updated }));
  };

  const handleFileChange = (index, e) => {
    const file = e.target.files[0];
    const updated = [...form.images];
    updated[index].file = file;
    setForm((prev) => ({ ...prev, images: updated }));
  };

  const addImageField = () =>
    setForm((prev) => ({ ...prev, images: [...prev.images, { url: "", file: null }] }));

  const removeImageField = (index) =>
    setForm((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));

  useEffect(() => {
    fetch(`${API_URL}/attributes`)
      .then((res) => res.json())
      .then((data) => setOptions(data))
      .catch(() => setOptions({}));
  }, []);

  useEffect(() => {
    if (!isEdit) return;

    const fetchProduct = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/products/admin/${params.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      setForm({
        ...emptyForm,
        ...data,
        price: data.price ?? "",
        originalPrice: data.originalPrice ?? "",
        costPrice: data.costPrice ?? "",
        stock: data.stock ?? "",
        colors: data.colors || [],
        sizes: data.sizes || [],
        tags: data.tags || [],
        images: data.images?.length
          ? data.images.map((img) => ({ url: img, file: null }))
          : [{ url: "", file: null }],
      });
    };

    fetchProduct();
  }, [params.id, isEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) return toast.error("Product name is required");
    if (!form.category.trim()) return toast.error("Category is required");
    if (!form.price) return toast.error("Selling price is required");

    const hasImage = form.images.some((img) => img.file || img.url.trim());
    if (!hasImage) return toast.error("Add at least one product image");

    setSaving(true);

    const formData = new FormData();
    const simpleFields = [
      "name", "price", "originalPrice", "costPrice", "taxPercent", "stock",
      "category", "subCategory", "collection", "brand", "fabric", "fit",
      "pattern", "neckType", "sleeveType", "occasion", "careInstructions",
      "countryOfOrigin", "description", "status",
    ];

    simpleFields.forEach((field) => formData.append(field, form[field] ?? ""));

    formData.append("colors", JSON.stringify(form.colors));
    formData.append("sizes", JSON.stringify(form.sizes));
    formData.append("tags", JSON.stringify(form.tags));
    formData.append("isNewArrival", form.isNewArrival);
    formData.append("isSale", form.isSale);
    formData.append("isFeatured", form.isFeatured);

    form.images.forEach((img) => {
      if (img.file) formData.append("images", img.file);
      if (img.url) formData.append("imageUrls", img.url);
    });

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        isEdit ? `${API_URL}/products/${params.id}` : `${API_URL}/products/add`,
        {
          method: isEdit ? "PUT" : "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || data.message || "Something went wrong");
        return;
      }

      toast.success(isEdit ? "Product updated" : "Product added");
      router.push("/admin/products");
    } catch {
      toast.error("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const getOptionValues = (type) => (options[type] || []).map((o) => o.value);

  return (
    <Box sx={{ bgcolor: "#f8f9fb", minHeight: "100vh", py: 2 }}>
      <Container maxWidth="md">
        <Paper sx={{ p: 4, borderRadius: 3 }}>
          <Stack direction="row" spacing={2} alignItems="flex-start" sx={{ mb: 3 }}>
            <IconButton onClick={() => router.back()} sx={{ width: 42, height: 42, borderRadius: 2 }}>
              <ArrowBackIcon />
            </IconButton>
            <Box>
              <Typography variant="h5" fontWeight={700}>
                {isEdit ? "Edit Product" : "Add Product"}
              </Typography>
              <Typography variant="body2" color="text.secondary" mt={0.3}>
                {isEdit ? "Update product information" : "Create a new product for your store"}
              </Typography>
            </Box>
          </Stack>

          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <TextField label="Product Name" name="name" value={form.name} onChange={handleChange} fullWidth required />

              {/* PRICING */}
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Selling Price" name="price" type="number" value={form.price}
                    onChange={handleChange} fullWidth required
                    InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Original Price (MRP)" name="originalPrice" type="number" value={form.originalPrice}
                    onChange={handleChange} fullWidth helperText="Optional — leave blank if no discount"
                    InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Discount" value={previewDiscount > 0 ? `${previewDiscount}% OFF` : "No discount"}
                    fullWidth disabled helperText="Auto-calculated"
                  />
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Cost Price (internal)" name="costPrice" type="number" value={form.costPrice}
                    onChange={handleChange} fullWidth helperText="Never shown to customers"
                    InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Tax %" name="taxPercent" type="number" value={form.taxPercent}
                    onChange={handleChange} fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Stock Quantity" name="stock" type="number" value={form.stock}
                    onChange={handleChange} fullWidth required
                  />
                </Grid>
              </Grid>

              {/* CATEGORY / TAXONOMY */}
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Autocomplete
                    freeSolo options={getOptionValues("category")} value={form.category}
                    onInputChange={(e, v) => setForm((p) => ({ ...p, category: v }))}
                    renderInput={(p) => <TextField {...p} label="Category" required fullWidth />}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Autocomplete
                    freeSolo options={getOptionValues("subCategory")} value={form.subCategory}
                    onInputChange={(e, v) => setForm((p) => ({ ...p, subCategory: v }))}
                    renderInput={(p) => <TextField {...p} label="Sub-Category" fullWidth />}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Autocomplete
                    freeSolo options={getOptionValues("collection")} value={form.collection}
                    onInputChange={(e, v) => setForm((p) => ({ ...p, collection: v }))}
                    renderInput={(p) => <TextField {...p} label="Collection" fullWidth />}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Autocomplete
                    freeSolo options={getOptionValues("brand")} value={form.brand}
                    onInputChange={(e, v) => setForm((p) => ({ ...p, brand: v }))}
                    renderInput={(p) => <TextField {...p} label="Brand" fullWidth />}
                  />
                </Grid>
              </Grid>

              {/* APPAREL DETAILS */}
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Autocomplete
                    freeSolo options={getOptionValues("fabric")} value={form.fabric}
                    onInputChange={(e, v) => setForm((p) => ({ ...p, fabric: v }))}
                    renderInput={(p) => <TextField {...p} label="Fabric" fullWidth />}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Autocomplete
                    freeSolo options={getOptionValues("fit")} value={form.fit}
                    onInputChange={(e, v) => setForm((p) => ({ ...p, fit: v }))}
                    renderInput={(p) => <TextField {...p} label="Fit" fullWidth />}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Autocomplete
                    freeSolo options={getOptionValues("pattern")} value={form.pattern}
                    onInputChange={(e, v) => setForm((p) => ({ ...p, pattern: v }))}
                    renderInput={(p) => <TextField {...p} label="Pattern" fullWidth />}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Autocomplete
                    freeSolo options={getOptionValues("occasion")} value={form.occasion}
                    onInputChange={(e, v) => setForm((p) => ({ ...p, occasion: v }))}
                    renderInput={(p) => <TextField {...p} label="Occasion" fullWidth />}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Autocomplete
                    freeSolo options={getOptionValues("neckType")} value={form.neckType}
                    onInputChange={(e, v) => setForm((p) => ({ ...p, neckType: v }))}
                    renderInput={(p) => <TextField {...p} label="Neck Type" fullWidth />}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Autocomplete
                    freeSolo options={getOptionValues("sleeveType")} value={form.sleeveType}
                    onInputChange={(e, v) => setForm((p) => ({ ...p, sleeveType: v }))}
                    renderInput={(p) => <TextField {...p} label="Sleeve Type" fullWidth />}
                  />
                </Grid>
              </Grid>

              <Autocomplete
                multiple freeSolo options={COLOR_SUGGESTIONS} value={form.colors}
                onChange={(e, v) => setForm((p) => ({ ...p, colors: v }))}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => <Chip label={option} size="small" {...getTagProps({ index })} key={option} />)
                }
                renderInput={(p) => <TextField {...p} label="Available Colors" placeholder="Type and press enter" fullWidth />}
              />

              <Autocomplete
                multiple freeSolo options={SIZE_SUGGESTIONS} value={form.sizes}
                onChange={(e, v) => setForm((p) => ({ ...p, sizes: v }))}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => <Chip label={option} size="small" {...getTagProps({ index })} key={option} />)
                }
                renderInput={(p) => <TextField {...p} label="Available Sizes" placeholder="Type and press enter" fullWidth />}
              />

              <Autocomplete
                multiple freeSolo options={getOptionValues("tags")} value={form.tags}
                onChange={(e, v) => setForm((p) => ({ ...p, tags: v }))}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => <Chip label={option} size="small" {...getTagProps({ index })} key={option} />)
                }
                renderInput={(p) => <TextField {...p} label="Search Tags" placeholder="Type and press enter" fullWidth />}
              />

              <TextField
                label="Care Instructions" name="careInstructions" value={form.careInstructions}
                onChange={handleChange} fullWidth multiline rows={2}
              />

              <Autocomplete
                freeSolo options={getOptionValues("countryOfOrigin")} value={form.countryOfOrigin}
                onInputChange={(e, v) => setForm((p) => ({ ...p, countryOfOrigin: v }))}
                renderInput={(p) => <TextField {...p} label="Country of Origin" fullWidth />}
              />

              <Divider />

              {/* IMAGES */}
              <Box>
                <Typography mb={2} fontWeight={600}>Product Images</Typography>
                <Stack spacing={2}>
                  {form.images.map((img, index) => (
                    <Box key={index}>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <TextField
                          label={`Image URL ${index + 1}`} value={img.url} fullWidth
                          onChange={(e) => handleImageChange(index, e.target.value)}
                        />
                        <Button variant="outlined" component="label" sx={{ whiteSpace: "nowrap" }}>
                          Upload
                          <input hidden type="file" accept="image/*" onChange={(e) => handleFileChange(index, e)} />
                        </Button>
                        {form.images.length > 1 && (
                          <Button color="error" variant="outlined" onClick={() => removeImageField(index)}>
                            Remove
                          </Button>
                        )}
                      </Stack>
                      {img.file && <Typography variant="caption">Selected: {img.file.name}</Typography>}
                    </Box>
                  ))}
                </Stack>
                <Button sx={{ mt: 2 }} variant="outlined" onClick={addImageField}>+ Add More Images</Button>
              </Box>

              <TextField
                label="Description" name="description" value={form.description}
                onChange={handleChange} multiline rows={4} fullWidth
              />

              {/* STATUS + FLAGS */}
              <TextField select label="Status" name="status" value={form.status} onChange={handleChange} fullWidth>
                <MenuItem value="Draft">Draft (not visible to customers)</MenuItem>
                <MenuItem value="Active">Active (live on storefront)</MenuItem>
                <MenuItem value="Archived">Archived</MenuItem>
              </TextField>

              <Stack direction="row" spacing={3} flexWrap="wrap">
                <FormControlLabel
                  control={<Checkbox checked={form.isNewArrival} onChange={(e) => setForm((p) => ({ ...p, isNewArrival: e.target.checked }))} />}
                  label="New Arrival"
                />
                <FormControlLabel
                  control={<Checkbox checked={form.isFeatured} onChange={(e) => setForm((p) => ({ ...p, isFeatured: e.target.checked }))} />}
                  label="Featured Product"
                />
              </Stack>

              <Button
                type="submit" variant="contained" disabled={saving}
                sx={{ bgcolor: "#111", py: 1.5, borderRadius: 2, "&:hover": { bgcolor: "#333" } }}
              >
                {saving ? "Saving..." : isEdit ? "Update Product" : "Add Product"}
              </Button>
            </Stack>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}