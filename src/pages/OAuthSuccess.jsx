import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

function OAuthSuccess({ addToast }) {
    const navigate = useNavigate();
    const login = useAuthStore((state) => state.login);
    const hasRun = useRef(false);

    useEffect(() => {
        if (hasRun.current) return;
        hasRun.current = true;

        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");
        const userParam = params.get("user");

        // MUST have both token and userParam to proceed
        if (!token || !userParam) {
            navigate("/login");
            return;
        }

        try {
            // Validate and parse user data BEFORE storing anything
            const userData = JSON.parse(decodeURIComponent(userParam));
            
            // Store in localStorage
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(userData));
            
            // Update auth store
            login(userData, token);
            
            // Show success toast
            if (addToast) {
                addToast("Google login successful!", "success");
            }
            
            // Clear URL params to prevent re-submit on refresh
            window.history.replaceState({}, document.title, "/oauth-success");
            
            // Navigate to home
            setTimeout(() => {
                navigate("/");
            }, 100);
            
        } catch (e) {
            console.error("Failed to parse user data:", e);
            
            // Clean up on error
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            
            if (addToast) {
                addToast("Login failed. Please try again.", "error");
            }
            
            setTimeout(() => {
                navigate("/login");
            }, 100);
        }
    }, [navigate, login, addToast]);

    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center">
            <div className="text-center">
                <div className="spinner-border text-primary mb-3" role="status"></div>
                <p className="text-secondary">Logging in with Google...</p>
            </div>
        </div>
    );
}

export default OAuthSuccess;