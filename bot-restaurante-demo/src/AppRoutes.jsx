
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Orders from "./pages/Orders";
import CompletedOrders from "./pages/CompletedOrders";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/completed-orders" element={<CompletedOrders />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;



