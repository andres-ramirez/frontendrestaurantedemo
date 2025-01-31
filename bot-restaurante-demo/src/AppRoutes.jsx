
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Orders from "./pages/Orders";
import CompletedOrders from "./pages/CompletedOrders";

const AppRoutes = () => {
  return (
    
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/completed-orders" element={<CompletedOrders />} />
      </Routes>
    
  );
};

export default AppRoutes;



