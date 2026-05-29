import Header from "./components/layout/Header";
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
import Event from "./pages/Event";
import EventDetail from "./pages/EventDetail";
import Profile from "./pages/Profile";

function App() {
  const { initAuth } = useAuth();
  const { toasts, addToast, removeToast } = useToast();

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
        <Route path="/events" element={<Event addToast={addToast} />} />
        <Route path="/events/:id" element={<EventDetail addToast={addToast} />} />
        <Route path="/profile" element={<Profile addToast={addToast} />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
      </Routes>

      <Footer />

      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </>
  );
}

export default App;
