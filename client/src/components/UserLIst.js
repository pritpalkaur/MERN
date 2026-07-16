import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from "@mui/material";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  // Fetch users on load
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/users");
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Fetch error:", error);
      alert("Failed to load users");
    }
  };

  // Open edit dialog
  const handleUpdate = (u) => {
    setEditUser(u._id || u.id);
    setForm({ name: u.name, email: u.email, password: "" }); // password left blank
    setOpen(true);
  };

  // Save updated user
  const saveUpdate = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/users/${editUser}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password // optional: only update if provided
        })
      });

      if (!response.ok) throw new Error("Failed to update user");

      const updatedUser = await response.json();
      setUsers(users.map((u) => (u._id || u.id) === editUser ? updatedUser : u));
      setOpen(false);
    } catch (error) {
      console.error("Update error:", error);
      alert("Failed to update user");
    }
  };

  // Delete user
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Delete this user?");
    if (!confirmDelete) return;

    try {
      await fetch(`http://localhost:5000/api/users/${id}`, { method: "DELETE" });
      setUsers(users.filter((u) => (u._id || u.id) !== id));
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete user");
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: "bold" }}>
        User Dashboard
      </Typography>

      <Grid container spacing={3}>
        {users.map((u) => (
          <Grid item xs={12} sm={6} md={4} key={u._id || u.id}>
            <Card sx={{ borderRadius: 3, boxShadow: 3, p: 2 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  {u.name}
                </Typography>
                <Typography variant="body1" color="primary">
                  Email: {u.email}
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: "center" }}>
                <Button variant="contained" color="primary" onClick={() => handleUpdate(u)}>
                  Update
                </Button>
                <Button variant="contained" color="error" onClick={() => handleDelete(u._id || u.id)}>
                  Delete
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Edit Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Edit User</DialogTitle>
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
            label="Email"
            fullWidth
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Password (optional)"
            type="password"
            fullWidth
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="secondary">Cancel</Button>
          <Button onClick={saveUpdate} variant="contained" color="primary">Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserList;
