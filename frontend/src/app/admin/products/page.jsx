"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProductsTable from "../ProductsTable";
import { Box,Container,Typography,Paper ,Button} from "@mui/material";
import { API_URL } from "@/lib/api";
export default function AdminProductsPage() {
  const router = useRouter();

  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_URL}/products`);

      const data = await res.json();

      setProducts(Array.isArray(data.products) ? data.products : []);
    } catch (err) {
      console.log("Error fetching products", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Delete this product?");

    if (!confirmDelete) return;

    try {
      await fetch(`${API_URL}/products/${id}`, {
        method: "DELETE",
      });

      setProducts((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      console.log("Delete Error", err);
    }
  };

  const handleEdit = (product) => {
    router.push(`/admin/products/edit/${product._id}`);
  };

  const handleAdd = () => {
    router.push("/admin/products/add");
  };

  return (
    <Box sx={{ bgcolor: "#f5f7fb", minHeight: "100vh", py: 3 }}>
      <Container maxWidth="lg">
        {/* HEADER (ONLY ONE ADD BUTTON HERE) */}
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
              Manage  Products 
            </Typography>
            <Typography variant="body2" color="text.secondary">

            <b style={{ color: "#111827" }}> Total Products:{" "}{products.length}</b>
            </Typography>
               
          </Box>
            <Button     color="success"
            variant="contained"
            onClick={handleAdd}
            sx={{
              textTransform: "none",
              borderRadius: 2,
              px: 2.5,
              fontWeight: 600,
            }}
          >
            + Add Product
          </Button>
        </Box>

        {/* TABLE ONLY */}
        <Paper
          elevation={0}
          sx={{
            borderRadius: 3,
            overflow: "hidden",
            border: "1px solid #e8ecf3",
          }}
        >
          <ProductsTable
            products={products}
            onDelete={handleDelete}
            onEdit={handleEdit}
          //  onAdd={handleAdd}
          />
        </Paper>
      </Container>
    </Box>
  );
}
