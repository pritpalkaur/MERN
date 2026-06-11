import React, { useEffect, useState } from "react";
import api from "../services/api";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  CircularProgress,
  Box
} from "@mui/material";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/")
      .then((res) => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={4}>
      <Typography variant="h4" align="center" gutterBottom>
        Product Dashboard
      </Typography>

      <Grid container spacing={3}>
        {products.map((p) => (
          <Grid item xs={12} sm={6} md={4} key={p._id}>
            <Card elevation={4}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {p.Name}
                </Typography>

                <Typography variant="body1" color="primary">
                  Price: ${p.Price}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  Stock: {p.Stock}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default ProductList;

