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

    // Open dialog for new user
  const handleCreate = () => {
    setEditUser(null);
    setForm({ name: "", email: "", password: "" });
    setOpen(true);
  };
  // Open edit dialog
  const handleUpdate = (u) => {
    setEditUser(u._id || u.id);
    setForm({ name: u.name, email: u.email, password: "" }); // password left blank
    setOpen(true);
  };

  // Save updated user
// Save new or updated user
const saveUser = async () => {
  try {
    const isEdit = Boolean(editUser);
    const url = isEdit
      ? `http://localhost:5000/api/users/${editUser}`
      : "http://localhost:5000/api/users/register";
    const method = isEdit ? "PUT" : "POST";

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    if (!response.ok) throw new Error("Failed to save user");

    const savedUser = await response.json();

    if (isEdit) {
      setUsers(users.map((u) => (u._id || u.id) === editUser ? savedUser : u));
    } else {
      setUsers([...users, savedUser]);
    }

    setOpen(false);
  } catch (error) {
    console.error("Save error:", error);
    alert("Failed to save user");
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

  {/* Create User Button */}
      <Box sx={{ textAlign: "center", mb: 3 }}>
        <Button variant="contained" color="success" onClick={handleCreate}>
          + Add User
        </Button>
      </Box>
      
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
          <Button onClick={saveUser} variant="contained" color="primary">Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserList;
