import { Routes, Route } from "react-router-dom";

import Login from "../pages/Login";

function HomePage() {
  return (
    <div className="container py-5">
      <h1>Homepage</h1>
    </div>
  );
}

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

      <Route path="/" element={<HomePage />} />

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<RegisterPage />} />

    </Routes>
  );
}

export default AppRoutes;