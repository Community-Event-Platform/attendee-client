import homepageImg from "../assets/homepage.png";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const Login = ({ addToast }) => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const colors = {
    bgLight: '#EAF5FF',
    btnPrimary: '#4D5EE3',
    cardRightBg: '#F3F7FA',
    inputPlaceholder: '#C4CCD4',
    labelColor: '#000000'
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
    setApiError("");
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please provide a valid email address";
    }
    
    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setApiError("");

    try {
      const result = await login(formData.email, formData.password, addToast);

      if (result.success) {
        // Wait for toast to be displayed before navigating
        setTimeout(() => {
          navigate("/");
        }, 100);
      } else {
        // Error toast already shown in useAuth
      }
    } catch {
      setApiError("An unexpected error occurred!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:8000/api/auth/google/redirect";
  };

  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-white p-3">
      <div 
        className="row rounded-4 p-4 p-md-5 w-100 justify-content-between align-items-stretch" 
        style={{ backgroundColor: colors.bgLight, maxWidth: '1024px' }}
      >
        <div className="col-12 col-md-6 d-flex flex-column justify-content-center pe-md-5 text-start">
          <h2 className="fw-bold text-dark mb-2 fs-3 text-start">Welcome back!</h2>
          <p className="text-secondary small mb-4 text-start" style={{ lineHeight: '1.5' }}>
            Sign in to continue exploring amazing events.
          </p>

          {apiError && (
            <div className="alert alert-danger py-2 mb-3 text-start" role="alert">
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="w-100">
            <div className="mb-3 text-start">
              <label className="form-label fw-bold small mb-1" style={{ color: colors.labelColor }}>
                Email <span className="text-danger">*</span>
              </label>
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0 border-dark rounded-start-3 px-3">
                  <i className="bi bi-envelope text-secondary"></i>
                </span>
                <input 
                  type="email" 
                  name="email"
                  className={`form-control border-start-0 border-dark rounded-end-3 py-2 ${errors.email ? 'is-invalid' : ''}`} 
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              {errors.email && <small className="text-danger">{errors.email}</small>}
            </div>

            <div className="mb-3 text-start">
              <label className="form-label fw-bold small mb-1" style={{ color: colors.labelColor }}>
                Password <span className="text-danger">*</span>
              </label>
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0 border-dark rounded-start-3 px-3">
                  <i className="bi bi-lock text-secondary"></i>
                </span>
                <input 
                  type={showPassword ? "text" : "password"} 
                  name="password"
                  className={`form-control border-start-0 border-end-0 border-dark py-2 ${errors.password ? 'is-invalid' : ''}`} 
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button 
                  className="btn btn-outline-secondary bg-white border-start-0 border-dark rounded-end-3 text-muted px-3" 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <i className={`bi bi-eye${showPassword ? '' : '-slash'}`}></i>
                </button>
              </div>
              {errors.password && <small className="text-danger">{errors.password}</small>}
            </div>

            <div className="form-check d-flex align-items-start mb-4 text-start">
              <input 
                className="form-check-input me-2 mt-1 border-secondary" 
                type="checkbox" 
                id="rememberMe" 
                name="remember"
                checked={formData.remember}
                onChange={handleChange}
                style={{ backgroundColor: colors.btnPrimary, borderColor: colors.btnPrimary, cursor: 'pointer' }}
              />
              <label className="form-check-label text-dark small" htmlFor="rememberMe" style={{ fontSize: '0.85rem', lineHeight: '1.4', cursor: 'pointer' }}>
                Remember me
              </label>
            </div>

            <button 
              type="submit" 
              className="btn text-white w-100 py-2.5 fw-bold rounded-3"
              style={{ backgroundColor: colors.btnPrimary }}
              disabled={isLoading}
            >
              {isLoading ? (
                <span>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Signing in...
                </span>
              ) : (
                "Sign in"
              )}
            </button>

            <div className="d-flex align-items-center my-4">
              <hr className="flex-grow-1" style={{ borderColor: '#C4CCD4' }} />
              <span className="px-3 text-secondary small">or</span>
              <hr className="flex-grow-1" style={{ borderColor: '#C4CCD4' }} />
            </div>

            <button 
              type="button" 
              className="btn btn-outline-dark w-100 py-2.5 fw-bold rounded-3 d-flex align-items-center justify-content-center gap-2"
              onClick={handleGoogleLogin}
              disabled={isLoading}
              style={{ borderColor: '#C4CCD4' }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Sign in with Google
            </button>
          </form>

          <div className="text-center mt-3">
            <span className="text-secondary small">Don't have an account? </span>
            <Link 
              to="/register" 
              className="text-decoration-none fw-semibold small"
              style={{ color: colors.btnPrimary }}
            >
              Sign up now
            </Link>
          </div>
        </div>

        <div className="col-12 col-md-6 d-flex flex-column justify-content-between ps-md-4 mt-4 mt-md-0">
          <div className="mb-4">
            <img
              src={homepageImg}
              alt="Homepage"
              className="img-fluid rounded-4 shadow-sm"
              style={{
                width: "100%",
                height: "280px",
                objectFit: "cover",
              }}
            />
          </div>

          <div className="p-4 rounded-4 flex-grow-1 d-flex flex-column justify-content-center text-start" style={{ backgroundColor: colors.cardRightBg }}>
            <div className="d-flex align-items-start mb-4 text-start">
              <div className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 me-3" style={{ backgroundColor: '#D7E4FF', width: '44px', height: '44px' }}>
                <i className="bi bi-calendar-event text-primary fs-5"></i>
              </div>
              <div>
                <h6 className="fw-bold mb-1 text-dark text-start" style={{ fontSize: '0.95rem' }}>Discover Events</h6>
                <p className="mb-0 text-secondary small text-start" style={{ fontSize: '0.8rem', color: '#718096' }}>Find local events that match your interests.</p>
              </div>
            </div>

            <div className="d-flex align-items-start mb-4 text-start">
              <div className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 me-3" style={{ backgroundColor: '#D7E4FF', width: '44px', height: '44px' }}>
                <i className="bi bi-people text-primary fs-5"></i>
              </div>
              <div>
                <h6 className="fw-bold mb-1 text-dark text-start" style={{ fontSize: '0.95rem' }}>Connect & Share</h6>
                <p className="mb-0 text-secondary small text-start" style={{ fontSize: '0.8rem', color: '#718096' }}>Connect with people and share amazing experiences.</p>
              </div>
            </div>

            <div className="d-flex align-items-start text-start">
              <div className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 me-3" style={{ backgroundColor: '#D7E4FF', width: '44px', height: '44px' }}>
                <i className="bi bi-ticket-perforated text-primary fs-5"></i>
              </div>
              <div>
                <h6 className="fw-bold mb-1 text-dark text-start" style={{ fontSize: '0.95rem' }}>Easy & Safe</h6>
                <p className="mb-0 text-secondary small text-start" style={{ fontSize: '0.8rem', color: '#718096' }}>Book tickets easily and safely in one place.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;