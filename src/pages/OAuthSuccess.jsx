import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

function OAuthSuccess({ addToast }) {
    const navigate = useNavigate();
    const login = useAuthStore((state) => state.login);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");
        const userParam = params.get("user");

        if (token) {
            localStorage.setItem("token", token);

            if (userParam) {
                try {
                    const user = JSON.parse(decodeURIComponent(userParam));
                    localStorage.setItem("user", JSON.stringify(user));
                    login(user, token);
                } catch (e) {
                    console.error("Failed to parse user data:", e);
                }
            }
            // Show success toast and navigate
            if (addToast) {
                addToast("Đăng nhập Google thành công!", "success");
            }
            setTimeout(() => {
                navigate("/");
            }, 100);
        } else {
            navigate("/login");
        }
    }, [navigate, login, addToast]);

    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center">
            <div className="text-center">
                <div className="spinner-border text-primary mb-3" role="status"></div>
                <p className="text-secondary">Dang nhap voi Google...</p>
            </div>
        </div>
    );
}

export default OAuthSuccess;