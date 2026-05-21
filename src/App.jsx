import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import { Routes, Route } from "react-router-dom";
import { useEffect, useCallback } from "react";
import { useAuth } from "./hooks/useAuth";
import { ToastContainer, useToast } from "./components/Toast";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import OAuthSuccess from "./pages/OAuthSuccess";

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
      </Routes>

      <Footer />

      {/* Toast notifications */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </>
  );
}

export default App;