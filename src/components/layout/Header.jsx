import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import "./style/Header.css";

/**
 * Header - Top navigation bar
 * Shows: Logo, nav links, user profile (when logged in) or Login/Register buttons
 * Features: Avatar dropdown with logout, active tab highlighting
 */
const API_BASE = import.meta.env.VITE_API_URL;

function Header({ addToast }) {
  const location = useLocation();
  const { user, token, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Get user initials for avatar
  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name[0].toUpperCase();
  };

  const colors = {
    btnPrimary: '#4D5EE3'
  };

  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const authToken = token || localStorage.getItem('token');
    if (!authToken) return;
    
    fetch(`${API_BASE}/notifications`, {
      headers: { 
        Authorization: `Bearer ${authToken}`, 
        Accept: 'application/json' 
      },
    })
      .then(res => res.json())
      .then(json => {
        if (json.success && json.data) {
          const unread = json.data.filter(n => !n.is_read).length;
          setUnreadCount(unread);
        }
      })
      .catch(() => { });
  }, [token]);

  // Listen for mark-read events to update unread badge immediately
  useEffect(() => {
    const handler = (e) => {
      setUnreadCount((c) => Math.max(0, c - 1));
    };
    window.addEventListener('notification:read', handler);
    return () => window.removeEventListener('notification:read', handler);
  }, []);

  const handleLogout = async () => {
    setIsDropdownOpen(false);
    await logout();
    if (addToast) addToast("Logged out successfully!", "success");
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo */}
        <Link to="/" className="header-logo">
          <i className="bi bi-lightning-charge-fill header-logo-icon"></i>
          <span className="header-logo-text">EventHub</span>
        </Link>

        {/* Navigation */}
        <nav>
          <ul className="header-nav">
            <li className="header-nav-item">
              <Link 
                to="/" 
                className={isActive('/') ? 'active' : ''}
              >
                Home
              </Link>
            </li>

            <li className="header-nav-item">
              <Link 
                to="/events" 
                className={isActive('/events') ? 'active' : ''}
              >
                Events
              </Link>
            </li>

            <li className="header-nav-item">
              <Link 
                to="/contact" 
                className={isActive('/contact') ? 'active' : ''}
              >
                Contact
              </Link>
            </li>

            <li className="header-nav-item">
              <Link 
                to="/about" 
                className={isActive('/about') ? 'active' : ''}
              >
                About
              </Link>
            </li>
          </ul>
        </nav>

        {/* Auth */}
        <div className="header-auth">
          {token ? (
            <div className="user-profile" ref={dropdownRef} onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
              <div className="d-flex align-items-center gap-3">
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
                <div className="user-avatar">
                  <i className="bi bi-person-fill user-avatar-icon"></i>
                </div>
                <i className={`bi bi-caret-down-fill dropdown-arrow ${isDropdownOpen ? 'open' : ''}`}></i>
              </div>

              {/* Dropdown menu */}
              {isDropdownOpen && (
                <div className="user-dropdown" onClick={(e) => e.stopPropagation()}>
                  <div className="dropdown-header">
                    <div className="dropdown-avatar">{getInitials(user?.full_name || user?.name || 'U')}</div>
                    <div className="dropdown-info">
                      <span className="dropdown-name">{user?.full_name || user?.name || 'User'}</span>
                      <span className="dropdown-email">{user?.email || 'user@email.com'}</span>
                    </div>
                  </div>
                  <div className="dropdown-divider"></div>
                  <Link to="/profile" className="dropdown-item" onClick={() => setIsDropdownOpen(false)}>
                    <i className="bi bi-person-circle"></i>
                    My Profile
                  </Link>
                  <div className="dropdown-divider"></div>
                  <button className="dropdown-item" onClick={() => { handleLogout(); }}>
                    <i className="bi bi-box-arrow-right"></i>
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className={`btn-link ${isActive('/login') ? 'active' : ''}`}
              >
                Login
              </Link>

              <Link
                to="/register"
                className={`btn-link ${isActive('/register') ? 'active' : ''}`}
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
