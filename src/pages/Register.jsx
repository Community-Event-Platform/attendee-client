import homepageImg from "../assets/homepage.png";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    password_confirmation: ""
  });
  
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  // Bảng màu chính xác từ thiết kế
  const colors = {
    bgLight: '#EAF5FF',
    btnPrimary: '#4D5EE3',
    cardRightBg: '#F3F7FA',
    inputPlaceholder: '#C4CCD4',
    labelColor: '#000000'
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
    setApiError("");
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.full_name.trim()) {
      newErrors.full_name = "Full name is required";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please provide a valid email address";
    }
    
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    if (!formData.password_confirmation) {
      newErrors.password_confirmation = "Password confirmation is required";
    } else if (formData.password !== formData.password_confirmation) {
      newErrors.password_confirmation = "Password confirmation does not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setApiError("");

    try {
      const result = await register({
        full_name: formData.full_name,
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.password_confirmation,
        role: "attendee"
      });

      if (result.success) {
        alert("Registration successful!");
        navigate("/");
      } else {
        setApiError(result.error);
      }
    } catch {
      setApiError("Đã xảy ra lỗi không mong muốn!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-white p-3">
      {/* Khung lớn bo tròn chứa toàn bộ form */}
      <div 
        className="row rounded-4 p-4 p-md-5 w-100 justify-content-between align-items-stretch" 
        style={{ backgroundColor: colors.bgLight, maxWidth: '1024px' }}
      >
        
        {/* CỘT BÊN TRÁI: FORM ĐĂNG KÝ (Căn trái toàn bộ) */}
        <div className="col-12 col-md-6 d-flex flex-column justify-content-center pe-md-5 text-start">
          <h2 className="fw-bold text-dark mb-2 fs-3 text-start">Tạo tài khoản của bạn</h2>
          <p className="text-secondary small mb-4 text-start" style={{ lineHeight: '1.5' }}>
            Hãy tham gia cộng đồng của chúng tôi và bắt đầu khám phá những sự kiện tuyệt vời.
          </p>

          {/* API Error Alert */}
          {apiError && (
            <div className="alert alert-danger py-2 mb-3 text-start" role="alert">
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="w-100">
            {/* Full Name */}
            <div className="mb-3 text-start">
              <label className="form-label fw-bold small mb-1" style={{ color: colors.labelColor }}>
                Full name <span className="text-danger">*</span>
              </label>
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0 border-dark rounded-start-3 px-3">
                  <i className="bi bi-person text-secondary"></i>
                </span>
                <input 
                  type="text" 
                  name="full_name"
                  className={`form-control border-start-0 border-dark rounded-end-3 py-2 ${errors.full_name ? 'is-invalid' : ''}`} 
                  placeholder="Enter full name"
                  value={formData.full_name}
                  onChange={handleChange}
                />
              </div>
              {errors.full_name && <small className="text-danger">{errors.full_name}</small>}
            </div>

            {/* Email */}
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

            {/* Password */}
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

            {/* Confirm Password */}
            <div className="mb-4 text-start">
              <label className="form-label fw-bold small mb-1" style={{ color: colors.labelColor }}>
                Confirm Password <span className="text-danger">*</span>
              </label>
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0 border-dark rounded-start-3 px-3">
                  <i className="bi bi-lock text-secondary"></i>
                </span>
                <input 
                  type={showConfirmPassword ? "text" : "password"} 
                  name="password_confirmation"
                  className={`form-control border-start-0 border-end-0 border-dark py-2 ${errors.password_confirmation ? 'is-invalid' : ''}`} 
                  placeholder="Confirm your password"
                  value={formData.password_confirmation}
                  onChange={handleChange}
                />
                <button 
                  className="btn btn-outline-secondary bg-white border-start-0 border-dark rounded-end-3 text-muted px-3" 
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <i className={`bi bi-eye${showConfirmPassword ? '' : '-slash'}`}></i>
                </button>
              </div>
              {errors.password_confirmation && <small className="text-danger">{errors.password_confirmation}</small>}
            </div>

            {/* Checkbox điều khoản */}
            <div className="form-check d-flex align-items-start mb-4 text-start">
              <input 
                className="form-check-input me-2 mt-1 border-secondary" 
                type="checkbox" 
                id="terms" 
                style={{ backgroundColor: colors.btnPrimary, borderColor: colors.btnPrimary, cursor: 'pointer' }}
                required
              />
              <label className="form-check-label text-dark small" htmlFor="terms" style={{ fontSize: '0.85rem', lineHeight: '1.4', cursor: 'pointer' }}>
                Tôi đồng ý với Điều khoản dịch vụ và Chính sách bảo mật của EventHub.
              </label>
            </div>

            {/* Nút Sign Up */}
            <button 
              type="submit" 
              className="btn text-white w-100 py-2.5 fw-bold rounded-3"
              style={{ backgroundColor: colors.btnPrimary }}
              disabled={isLoading}
            >
              {isLoading ? (
                <span>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Signing up...
                </span>
              ) : (
                "Sign up"
              )}
            </button>
          </form>

          {/* Link chuyển sang Login */}
          <div className="text-center mt-3">
            <span className="text-secondary small">Bạn đã có tài khoản? </span>
            <Link 
              to="/login" 
              className="text-decoration-none fw-semibold small"
              style={{ color: colors.btnPrimary }}
            >
              Đăng nhập ngay
            </Link>
          </div>
        </div>

        {/* CỘT BÊN PHẢI: BANNER & ĐIỂM NỔI BẬT */}
        <div className="col-12 col-md-6 d-flex flex-column justify-content-between ps-md-4 mt-4 mt-md-0">
          
          {/* Banner minh họa phía trên */}
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

          {/* Danh sách tính năng nổi bật bên dưới (Căn trái nội dung bên trong) */}
          <div className="p-4 rounded-4 flex-grow-1 d-flex flex-column justify-content-center text-start" style={{ backgroundColor: colors.cardRightBg }}>
            
            {/* Khám phá sự kiện */}
            <div className="d-flex align-items-start mb-4 text-start">
              <div className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 me-3" style={{ backgroundColor: '#D7E4FF', width: '44px', height: '44px' }}>
                <i className="bi bi-calendar-event text-primary fs-5"></i>
              </div>
              <div>
                <h6 className="fw-bold mb-1 text-dark text-start" style={{ fontSize: '0.95rem' }}>Khám phá sự kiện</h6>
                <p className="mb-0 text-secondary small text-start" style={{ fontSize: '0.8rem', color: '#718096' }}>Tìm các sự kiện địa phương phù hợp với sở thích của bạn.</p>
              </div>
            </div>

            {/* Kết nối và chia sẻ */}
            <div className="d-flex align-items-start mb-4 text-start">
              <div className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 me-3" style={{ backgroundColor: '#D7E4FF', width: '44px', height: '44px' }}>
                <i className="bi bi-people text-primary fs-5"></i>
              </div>
              <div>
                <h6 className="fw-bold mb-1 text-dark text-start" style={{ fontSize: '0.95rem' }}>Kết nối và chia sẻ</h6>
                <p className="mb-0 text-secondary small text-start" style={{ fontSize: '0.8rem', color: '#718096' }}>Kết nối với mọi người và chia sẻ những trải nghiệm tuyệt vời.</p>
              </div>
            </div>

            {/* Dễ dàng & an toàn */}
            <div className="d-flex align-items-start text-start">
              <div className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 me-3" style={{ backgroundColor: '#D7E4FF', width: '44px', height: '44px' }}>
                <i className="bi bi-ticket-perforated text-primary fs-5"></i>
              </div>
              <div>
                <h6 className="fw-bold mb-1 text-dark text-start" style={{ fontSize: '0.95rem' }}>Dễ dàng & an toàn</h6>
                <p className="mb-0 text-secondary small text-start" style={{ fontSize: '0.8rem', color: '#718096' }}>Đặt vé dễ dàng và an toàn tại một nơi duy nhất.</p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default Register;