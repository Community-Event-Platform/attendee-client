import { useState } from "react";
import { loginApi } from "../api/authApi";
// Import ảnh từ thư mục assets
import homepageImg from "../assets/homepage.png";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    await loginApi(formData);
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center align-items-stretch shadow rounded-4 overflow-hidden bg-white">
        
        {/* CỘT BÊN TRÁI: FORM ĐĂNG NHẬP */}
        <div className="col-md-6 p-5">
          <h2 className="fw-bold mb-3">Chào mừng bạn quay lại!</h2>
          <p className="text-muted mb-4">Đăng nhập để tiếp tục khám phá sự kiện.</p>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label d-flex align-items-center gap-3">
                <i className="bi bi-envelope"></i>
                Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                className="form-control"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label d-flex align-items-center gap-3">
                <i className="bi bi-lock"></i>
                Password
              </label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                className="form-control"
                value={formData.password}
              onChange={handleChange}
              />
            </div>

            <div className="d-flex justify-content-between mb-4">
              <div className="form-check">
                <input
                  type="checkbox"
                  name="remember"
                  className="form-check-input"
                  id="rememberCheck"
                  checked={formData.remember}
                  onChange={handleChange}
                />
                <label className="form-check-label" htmlFor="rememberCheck">
                  Remember me
                </label>
              </div>
              <a href="#" className="text-decoration-none">Forgot Password?</a>
            </div>

            <button type="submit" className="btn btn-primary w-100 py-2">
              LOG IN
            </button>
          </form>
        </div>

        {/* CỘT BÊN PHẢI */}
<div className="col-md-6 d-none d-md-flex flex-column justify-content-center align-items-center bg-light p-4">

  {/* IMAGE */}
  <div className="w-100 mb-4">
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

  {/* INFO CARDS */}
  <div className="w-100">

    <div className="bg-white rounded-4 shadow-sm p-3 mb-3">
      <h5 className="fw-bold text-primary mb-2 d-flex align-items-center gap-3">
        <i className="bi bi-calendar-event-fill"></i>
        Khám phá sự kiện
      </h5>

      <p className="text-muted small mb-0">
        Tìm kiếm các sự kiện phù hợp với sở thích của bạn.
      </p>
    </div>

    <div className="bg-white rounded-4 shadow-sm p-3 mb-3">
      <h5 className="fw-bold text-primary mb-2 d-flex align-items-center gap-3">
        <i className="bi bi-people-fill"></i>
        Kết nối và chia sẻ
      </h5>

      <p className="text-muted small mb-0">
        Kết nối với mọi người và chia sẻ trải nghiệm tuyệt vời.
      </p>
    </div>

    <div className="bg-white rounded-4 shadow-sm p-3">
      <h5 className="fw-bold text-primary mb-2 d-flex align-items-center gap-3">
        <i className="bi bi-ticket-detailed-fill"></i>
        Dễ dàng & an toàn
      </h5>

      <p className="text-muted small mb-0">
        Đặt vé nhanh chóng và an toàn tại một nơi duy nhất.
      </p>
      </div>
    </div>
  </div>

      </div>
    </div>
  );
}

export default Login;
