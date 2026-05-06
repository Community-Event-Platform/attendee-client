import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import axiosClient from './api/axiosClient'
import Register from './pages/Register'
import Login from './pages/Login'
import CreateEvent from './pages/CreateEvent'

// Protected Route component (RQ-03)
const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  if (!token || !user) return <Navigate to="/login" />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/403" />;

  return children;
};

function Home() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  useEffect(() => {
    axiosClient.get('/test-events')
      .then(res => { setEvents(res.data); setLoading(false); })
      .catch(err => { setError(err.message); setLoading(false); });
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Danh sách sự kiện</h1>
        {user ? (
          <div>
            <span>Xin chào, {user.name} ({user.role}) </span>
            <button onClick={handleLogout} style={{ marginLeft: '10px', padding: '5px 10px' }}>Đăng xuất</button>
          </div>
        ) : (
          <a href="/login">Đăng nhập</a>
        )}
      </div>
      {loading && <p>Đang tải dữ liệu...</p>}
      {error && <p style={{ color: 'red' }}>Lỗi: {error}</p>}
      {!loading && !error && events.length === 0 && <p>Không có sự kiện nào.</p>}
      {events.map(ev => (
        <div key={ev.id} style={{ border: '1px solid white', margin: '10px', padding: '10px' }}>
          <h3>{ev.name}</h3>
          <p>{ev.description}</p>
          <p>{ev.location}</p>
          <p>{ev.event_date}</p>
        </div>
      ))}
    </div>
  );
}


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/403" element={<div style={{ padding: '50px', textAlign: 'center' }}><h2>403 - Không có quyền truy cập</h2></div>} />
        <Route path="/create-event" element={
          <ProtectedRoute allowedRoles={['organizer']}>
            <CreateEvent />
          </ProtectedRoute>
        } />
        <Route path="/organizer" element={
          <ProtectedRoute allowedRoles={['organizer']}>
            <div style={{ padding: '20px' }}>
              <h2>Organizer Dashboard</h2>
              <p>Chào mừng Organizer! Tại đây bạn có thể quản lý sự kiện của mình.</p>
              <a href="/create-event" style={{ padding: '10px 15px', backgroundColor: '#007bff', color: 'white', textDecoration: 'none', borderRadius: '4px', display: 'inline-block', marginTop: '10px' }}>
                + Tạo sự kiện mới
              </a>
              <br/><br/>
              <a href="/" style={{ textDecoration: 'none', color: '#007bff' }}>&larr; Về trang chủ xem tất cả sự kiện</a>
            </div>
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  )
}


export default App;