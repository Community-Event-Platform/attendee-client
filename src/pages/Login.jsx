import homepageImg from "../assets/homepage.png";
import { useState } from "react";
import { loginApi } from "../services/api";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  // Bảng màu chính xác từ thiết kế (giống Register)
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
    // Clear error for this field
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
      const response = await loginApi(formData);

      // Lưu token
      localStorage.setItem("token", response.data.access_token);

      // Lưu user
      localStorage.setItem("user", JSON.stringify(response.data.data));

      alert("Đăng nhập thành công!");

      // Chuyển trang Home
      navigate("/");

    } catch (error) {
      if (error.response && error.response.data) {
        const errorData = error.response.data;
        if (errorData.message) {
          setApiError(errorData.message);
        }
      } else {
        setApiError("Sai email hoặc mật khẩu!");
      }
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
        
        {/* CỘT BÊN TRÁI: FORM ĐĂNG NHẬP */}
        <div className="col-12 col-md-6 d-flex flex-column justify-content-center pe-md-5 text-start">
          <h2 className="fw-bold text-dark mb-2 fs-3 text-start">Chào mừng bạn quay lại!</h2>
          <p className="text-secondary small mb-4 text-start" style={{ lineHeight: '1.5' }}>
            Đăng nhập để tiếp tục khám phá những sự kiện tuyệt vời.
          </p>

          {/* API Error Alert */}
          {apiError && (
            <div className="alert alert-danger py-2 mb-3 text-start" role="alert">
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="w-100">
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

            {/* Remember me */}
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

            {/* Nút Login */}
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
          </form>

          {/* Link chuyển sang Register */}
          <div className="text-center mt-3">
            <span className="text-secondary small">Bạn chưa có tài khoản? </span>
            <Link 
              to="/register" 
              className="text-decoration-none fw-semibold small"
              style={{ color: colors.btnPrimary }}
            >
              Đăng ký ngay
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

export default Login;