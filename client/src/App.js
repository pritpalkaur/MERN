import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import DashboardTabs from "./components/DashboardTabs";
import UserList from "./components/UserLIst";
import Products from "./components/productList";
import MasterPage from "./components/MasterPage";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* Protected routes inside MasterPage */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <MasterPage />
            </PrivateRoute>
          }
        >
          <Route path="dashboard" element={<DashboardTabs />} />
          <Route path="users" element={<UserList />} />
          <Route path="products" element={<Products />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;


// import React from "react";
// import DashboardTabs from "./components/DashboardTabs";

// function App() {
//   return <DashboardTabs />;
// }
// export default App;