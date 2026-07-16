import React, { useState } from "react";
import { Tabs, Tab, Box } from "@mui/material";
import ProductList from "./productList";
import UserList from "./UserLIst";

const DashboardTabs = () => {
  const [tabIndex, setTabIndex] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  return (
    <Box sx={{ width: "100%", p: 3 }}>
      <Tabs
        value={tabIndex}
        onChange={handleTabChange}
        centered
        textColor="primary"
        indicatorColor="primary"
      >
        <Tab label="Products" />
        <Tab label="Users" />
      </Tabs>

      <Box sx={{ mt: 4 }}>
        {tabIndex === 0 && <ProductList />}
        {tabIndex === 1 && <UserList />}
      </Box>
    </Box>
  );
};

export default DashboardTabs;
