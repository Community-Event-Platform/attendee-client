import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "./hooks/useAuth";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  const { initAuth } = useAuth();

  // Initialize auth state from localStorage khi app start
  useEffect(() => {
    initAuth();
  }, [initAuth]);

  return (
    <>
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>

      <Footer />
    </>
  );
}

export default App;