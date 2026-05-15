// src/components/layout/Header.jsx

import { Link, useNavigate } from "react-router-dom";
import { logoutApi } from "../../api/authApi";

function Header() {

  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = async () => {

    try {

      await logoutApi();

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      alert("Logout thành công!");

      navigate("/login");

    } catch (error) {

      console.log(error);

    }
  };

  return (

    <header className="bg-light border-bottom">

      <div className="container d-flex justify-content-between align-items-center py-3">

        {/* LOGO */}
        <h2 className="text-primary fw-bold">
          EventHub
        </h2>

        {/* NAVBAR */}
        <nav>

          <ul className="d-flex gap-4 list-unstyled m-0">

            <li>
              <Link to="/" className="text-dark text-decoration-none">
                Home
              </Link>
            </li>

            <li>
              <Link to="/events" className="text-dark text-decoration-none">
                Events
              </Link>
            </li>

          </ul>

        </nav>

        {/* AUTH */}
        <div>

          {token ? (

            <div className="d-flex align-items-center gap-3">

              <span className="fw-semibold">
                {user?.name}
              </span>

              <button
                onClick={handleLogout}
                className="btn btn-danger"
              >
                Logout
              </button>

            </div>

          ) : (

            <>
              <Link
                to="/login"
                className="btn btn-outline-primary me-2"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="btn btn-primary"
              >
                Register
              </Link>
            </>

          )}

        </div>

      </div>

    </header>

  );
}

export default Header;