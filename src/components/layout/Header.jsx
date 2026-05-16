import { Link, useLocation } from "react-router-dom";
import { logoutApi } from "../../api/authApi";
import logoIcon from "../../assets/iconhomepage.png";

function Header() {
  const location = useLocation();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const colors = {
    btnPrimary: '#4D5EE3'
  };

  const handleLogout = async () => {
    try {
      await logoutApi();
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      alert("Logout thành công!");
      window.location.href = "/login";
    } catch (error) {
      console.log(error);
    }
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="bg-white border-bottom shadow-sm sticky-top">
      <div className="container-fluid px-4 px-lg-5 d-flex justify-content-between align-items-center py-3">
        {/* LOGO */}
        <Link to="/" className="d-flex align-items-center text-decoration-none">
          <img 
            src={logoIcon} 
            alt="EventHub Logo" 
            className="me-2" 
            style={{ width: '40px', height: '40px', objectFit: 'contain' }} 
          />
          <h2 className="m-0" style={{ color: colors.btnPrimary, fontWeight: '700' }}>
            EventHub
          </h2>
        </Link>

        {/* NAVBAR */}
        <nav>
          <ul className="d-flex gap-4 list-unstyled m-0 align-items-center">
            <li>
              <Link 
                to="/" 
                className="text-decoration-none py-2 px-3 rounded-3 transition-all"
                style={{ 
                  color: isActive('/') ? colors.btnPrimary : '#6c757d',
                  fontWeight: isActive('/') ? '600' : '400',
                  backgroundColor: isActive('/') ? 'rgba(77, 94, 227, 0.1)' : 'transparent',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  if (!isActive('/')) {
                    e.target.style.color = colors.btnPrimary;
                    e.target.style.backgroundColor = 'rgba(77, 94, 227, 0.05)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive('/')) {
                    e.target.style.color = '#6c757d';
                    e.target.style.backgroundColor = 'transparent';
                  }
                }}
              >
                Home
              </Link>
            </li>

            <li>
              <Link 
                to="/events" 
                className="text-decoration-none py-2 px-3 rounded-3 transition-all"
                style={{ 
                  color: isActive('/events') ? colors.btnPrimary : '#6c757d',
                  fontWeight: isActive('/events') ? '600' : '400',
                  backgroundColor: isActive('/events') ? 'rgba(77, 94, 227, 0.1)' : 'transparent',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  if (!isActive('/events')) {
                    e.target.style.color = colors.btnPrimary;
                    e.target.style.backgroundColor = 'rgba(77, 94, 227, 0.05)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive('/events')) {
                    e.target.style.color = '#6c757d';
                    e.target.style.backgroundColor = 'transparent';
                  }
                }}
              >
                Events
              </Link>
            </li>

            <li>
              <Link 
                to="/contact" 
                className="text-decoration-none py-2 px-3 rounded-3 transition-all"
                style={{ 
                  color: isActive('/contact') ? colors.btnPrimary : '#6c757d',
                  fontWeight: isActive('/contact') ? '600' : '400',
                  backgroundColor: isActive('/contact') ? 'rgba(77, 94, 227, 0.1)' : 'transparent',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  if (!isActive('/contact')) {
                    e.target.style.color = colors.btnPrimary;
                    e.target.style.backgroundColor = 'rgba(77, 94, 227, 0.05)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive('/contact')) {
                    e.target.style.color = '#6c757d';
                    e.target.style.backgroundColor = 'transparent';
                  }
                }}
              >
                Contact
              </Link>
            </li>

            <li>
              <Link 
                to="/about" 
                className="text-decoration-none py-2 px-3 rounded-3 transition-all"
                style={{ 
                  color: isActive('/about') ? colors.btnPrimary : '#6c757d',
                  fontWeight: isActive('/about') ? '600' : '400',
                  backgroundColor: isActive('/about') ? 'rgba(77, 94, 227, 0.1)' : 'transparent',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  if (!isActive('/about')) {
                    e.target.style.color = colors.btnPrimary;
                    e.target.style.backgroundColor = 'rgba(77, 94, 227, 0.05)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive('/about')) {
                    e.target.style.color = '#6c757d';
                    e.target.style.backgroundColor = 'transparent';
                  }
                }}
              >
                About
              </Link>
            </li>
          </ul>
        </nav>

        {/* AUTH */}
        <div>
          {token ? (
            <div className="d-flex align-items-center gap-3">
              <span className="fw-semibold text-dark">
                {user?.full_name || user?.name || 'User'}
              </span>
              <button
                onClick={handleLogout}
                className="btn text-white rounded-3 px-4"
                style={{ 
                  backgroundColor: '#dc3545',
                  border: 'none',
                  fontWeight: '500'
                }}
              >
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="btn rounded-3 me-2 px-4"
                style={{ 
                  color: isActive('/login') ? 'white' : colors.btnPrimary,
                  backgroundColor: isActive('/login') ? colors.btnPrimary : 'transparent',
                  border: `2px solid ${colors.btnPrimary}`,
                  fontWeight: '500'
                }}
              >
                Login
              </Link>

              <Link
                to="/register"
                className="btn rounded-3 px-4"
                style={{ 
                  color: isActive('/register') ? 'white' : colors.btnPrimary,
                  backgroundColor: isActive('/register') ? colors.btnPrimary : 'transparent',
                  border: `2px solid ${colors.btnPrimary}`,
                  fontWeight: '500'
                }}
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