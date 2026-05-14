import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Login from "../pages/Login";

function RegisterPage() {
  return (
    <div className="container py-5">
      <h1>Register Page</h1>
    </div>
  );
}

function AppRoutes() {
  return (
    <Routes>

      <Route path="/" element={<Home />} />

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<RegisterPage />} />

    </Routes>
  );
}

export default AppRoutes;
