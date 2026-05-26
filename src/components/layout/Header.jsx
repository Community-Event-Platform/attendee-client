import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const API_BASE = 'http://localhost:8000/api';

function Header({ addToast }) {
  const location = useLocation();
  const { user, token, logout } = useAuth();

  // Chỉ thêm duy nhất 1 state này để đếm số lượng thông báo chưa đọc
  const [unreadCount, setUnreadCount] = useState(0);

  const colors = {
    btnPrimary: '#4D5EE3'
  };

  // Hàm gọi API đếm số thông báo chưa đọc (Đáp ứng AC3)
  useEffect(() => {
    if (!token) return;
    
    fetch(`${API_BASE}/notifications`, {
      headers: { 
        Authorization: `Bearer ${token}`, 
        Accept: 'application/json' 
      },
    })
      .then(res => res.json())
      .then(json => {
        if (json.success && json.data) {
          // Lọc xem có bao nhiêu thông báo chưa đọc (is_read === 0 hoặc false)
          const unread = json.data.filter(n => !n.is_read).length;
          setUnreadCount(unread);
        }
      })
      .catch(() => { /* im lặng khi lỗi mạng */ });
  }, [token]);

  const handleLogout = async () => {
    await logout();
    if (addToast) addToast("Logged out successfully!", "success");
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="bg-white border-bottom shadow-sm sticky-top">
      <div className="container-fluid px-4 px-lg-5 d-flex justify-content-between align-items-center py-3">
        <Link to="/" className="d-flex align-items-center text-decoration-none" style={{ cursor: 'pointer' }}>
          <i className="bi bi-lightning-charge-fill" style={{ color: '#14AE5C', fontSize: '38px' }}></i>
          <span className="logo-text" style={{ fontSize: '24px', fontWeight: '700', marginLeft: '8px' }}>EventHub</span>
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
                  fontWeight: '700',
                  backgroundColor: isActive('/') ? 'rgba(77, 94, 227, 0.1)' : 'transparent',
                  transition: 'all 0.2s ease',
                  fontSize: '16px'
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
                  fontWeight: '700',
                  backgroundColor: isActive('/events') ? 'rgba(77, 94, 227, 0.1)' : 'transparent',
                  transition: 'all 0.2s ease',
                  fontSize: '16px'
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
                  fontWeight: '700',
                  backgroundColor: isActive('/contact') ? 'rgba(77, 94, 227, 0.1)' : 'transparent',
                  transition: 'all 0.2s ease',
                  fontSize: '16px'
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
                  fontWeight: '700',
                  backgroundColor: isActive('/about') ? 'rgba(77, 94, 227, 0.1)' : 'transparent',
                  transition: 'all 0.2s ease',
                  fontSize: '16px'
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
              
              {/*  CHỈ THÊM ĐÚNG ICON QUẢ CHUÔNG NÀY (Bấm vào nhảy sang trang thông báo) */}
              <Link 
                to="/notifications" 
                className="position-relative me-2 text-decoration-none"
                style={{ color: '#6c757d' }}
              >
                <i className="bi bi-bell-fill" style={{ fontSize: '22px' }}></i>
                {unreadCount > 0 && (
                  <span 
                    className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger d-flex align-items-center justify-content-center"
                    style={{ fontSize: '10px', minWidth: '18px', height: '18px', marginTop: '4px' }}
                  >
                    {unreadCount}
                  </span>
                )}
              </Link>

              <span className="fw-bold" style={{ fontSize: '16px' }}>
                {user?.full_name || user?.name || 'User'}
              </span>
              <button
                onClick={handleLogout}
                className="btn text-white rounded-3 px-4"
                style={{ 
                  backgroundColor: '#dc3545',
                  border: 'none',
                  fontWeight: '700',
                  fontSize: '16px'
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
                  fontWeight: '700',
                  fontSize: '16px'
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
                  fontWeight: '700',
                  fontSize: '16px'
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