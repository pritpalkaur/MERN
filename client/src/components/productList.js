import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Grid,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from "@mui/material";

const ProductList = () => {
  const [products, setProducts] = useState([]);

  // Dialog state
  const [open, setOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [form, setForm] = useState({ name: "", price: "", stock: "" });

  // ⭐ FETCH PRODUCTS FROM API ON PAGE LOAD
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/products");
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Fetch error:", error);
      alert("Failed to load products");
    }
  };

  // OPEN EDIT POPUP
  const handleUpdate = (p) => {
    setEditProduct(p._id || p.id);
    setForm({
      name: p.Name,
      price: p.Price,
      stock: p.Stock
    });
    setOpen(true);
  };

  // SAVE UPDATED PRODUCT TO API
  const saveUpdate = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/products/${editProduct}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            name: form.Name,
            price: Number(form.Price),
            stock: Number(form.Stock)
          })
        }
      );

      if (!response.ok) {
        console.error("API error:", response.statusText); 
        throw new Error("Failed to update product");
      }

      const updatedProduct = await response.json();

      // Update UI
      setProducts(
        products.map((p) =>
          (p._id || p.id) === editProduct ? updatedProduct : p
        )
      );

      setOpen(false);
    } catch (error) {
      console.error("Update error:", error);
      alert("Failed to update product");
    }
  };

  // DELETE PRODUCT
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Delete this product?");
    if (!confirmDelete) return;

    try {
      await fetch(`http://localhost:5000/api/products/${id}`, {
        method: "DELETE"
      });

      setProducts(products.filter((p) => (p._id || p.id) !== id));
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete product");
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        sx={{ fontWeight: "bold" }}
      >
        Product Dashboard
      </Typography>

      {/* Product Cards */}
      <Grid container spacing={3}>
        {products.map((p) => (
          <Grid item xs={12} sm={6} md={3} key={p._id || p.id}>
            <Card
              sx={{
                borderRadius: 3,
                boxShadow: 3,
                textAlign: "center",
                p: 2,
                transition: "0.2s",
                "&:hover": { transform: "scale(1.03)" }
              }}
            >
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  {p.name}
                </Typography>

                <Typography variant="body1" color="primary">
                  Price: ${p.price}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  Stock: {p.stock}
                </Typography>
              </CardContent>

              <CardActions sx={{ justifyContent: "center" }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleUpdate(p)}
                >
                  Update
                </Button>

                <Button
                  variant="contained"
                  color="error"
                  onClick={() => handleDelete(p._id || p.id)}
                >
                  Delete
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Edit Popup Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Edit Product</DialogTitle>

        <DialogContent>
          <TextField
            margin="dense"
            label="Name"
            fullWidth
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <TextField
            margin="dense"
            label="Price"
            type="number"
            fullWidth
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />

          <TextField
            margin="dense"
            label="Stock"
            type="number"
            fullWidth
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: e.target.value })}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)} color="secondary">
            Cancel
          </Button>

          <Button onClick={saveUpdate} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProductList;
