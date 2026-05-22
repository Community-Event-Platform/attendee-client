import Header from "./components/layout/header/Header";
import Footer from "./components/layout/Footer";
import { Routes, Route } from "react-router-dom";
import { useEffect, useCallback } from "react";
import { useAuth } from "./hooks/useAuth";
import { ToastContainer, useToast } from "./components/toast/Toast";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import OAuthSuccess from "./pages/OAuthSuccess";
import Contact from "./pages/Contact";
import About from "./pages/About";

function App() {
  const { initAuth } = useAuth();
  const { toasts, addToast, removeToast } = useToast();

  // Initialize auth state from localStorage khi app start
  const handleInitAuth = useCallback(() => {
    initAuth();
  }, [initAuth]);

  useEffect(() => {
    handleInitAuth();
  }, [handleInitAuth]);

  return (
    <>
      <Header addToast={addToast} />

      <Routes>
        <Route path="/" element={<Home addToast={addToast} />} />
        <Route path="/login" element={<Login addToast={addToast} />} />
        <Route path="/register" element={<Register addToast={addToast} />} />
        <Route path="/oauth-success" element={<OAuthSuccess addToast={addToast} />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
      </Routes>

      <Footer />

      {/* Toast notifications */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </>
  );
}

export default App;
