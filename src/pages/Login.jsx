// src/pages/Login.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginApi } from "../api/authApi";
import homepageImg from "../assets/homepage.png";

function Login() {

  const navigate = useNavigate();

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

    try {

      const response = await loginApi(formData);

      console.log(response.data);

      // Lưu token
      localStorage.setItem(
        "token",
        response.data.access_token
      );

      // Lưu user
      localStorage.setItem(
        "user",
        JSON.stringify(response.data.data)
      );

      alert("Đăng nhập thành công!");

      // Chuyển trang Home
      navigate("/");

    } catch (error) {

      console.log(error);

      alert("Sai email hoặc mật khẩu!");

    }
  };

  return (
    <div className="container-fluid py-5">

      <div className="row justify-content-center align-items-stretch shadow rounded-4 overflow-hidden bg-white">

        {/* LEFT */}
        <div className="col-md-6 p-5">

          <h2 className="fw-bold mb-3">
            Chào mừng bạn quay lại!
          </h2>

          <p className="text-muted mb-4">
            Đăng nhập để tiếp tục khám phá sự kiện.
          </p>

          <form onSubmit={handleSubmit}>

          {/* EMAIL */}
          <div className="mb-3 text-start"> {/* Thêm text-start vào đây */}
            <label className="form-label d-block text-start">
              Email
            </label>
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="Nhập email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          {/* PASSWORD */}
          <div className="mb-3 text-start">
            <label className="form-label d-block text-start">
              Password
            </label>
            <input
              type="password"
              name="password"
              className="form-control"
              placeholder="Nhập mật khẩu"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          {/* REMEMBER */}
          <div className="form-check mb-4 text-start"> {/* Thêm text-start ở đây */}
            <input
              type="checkbox"
              name="remember"
              className="form-check-input"
              checked={formData.remember}
              onChange={handleChange}
              id="rememberMe"
            />
            <label className="form-check-label" htmlFor="rememberMe">
              Remember me
            </label>
          </div>

            <button
              type="submit"
              className="btn btn-primary w-100 py-2"
            >
              LOGIN
            </button>

          </form>

        </div>

        {/* RIGHT */}
        <div className="col-md-6 d-none d-md-flex flex-column justify-content-center align-items-center bg-light p-4">

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

          <div className="w-100">

            <div className="bg-white rounded-4 shadow-sm p-3 mb-3">

              <h5 className="fw-bold text-primary">
                Khám phá sự kiện
              </h5>

              <p className="text-muted small mb-0">
                Tìm kiếm các sự kiện phù hợp với sở thích của bạn.
              </p>

            </div>

            <div className="bg-white rounded-4 shadow-sm p-3 mb-3">

              <h5 className="fw-bold text-primary">
                Kết nối và chia sẻ
              </h5>

              <p className="text-muted small mb-0">
                Kết nối với mọi người và chia sẻ trải nghiệm.
              </p>

            </div>

            <div className="bg-white rounded-4 shadow-sm p-3">

              <h5 className="fw-bold text-primary">
                Dễ dàng & an toàn
              </h5>

              <p className="text-muted small mb-0">
                Đặt vé nhanh chóng và an toàn.
              </p>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Login;