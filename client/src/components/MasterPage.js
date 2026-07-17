import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { clearToken, authFetch } from "../utils/auth";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";

const MasterPage = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await authFetch("http://localhost:5000/api/users/profile");
        const data = await res.json();
        setUserName(data.name);
      } catch (err) {
        console.error("Profile fetch error:", err);
      }
    };
    fetchProfile();
  }, []);

  const handleLogout = () => {
    clearToken();
    navigate("/login");
  };

  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Welcome {userName}
          </Typography>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 3 }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default MasterPage;
