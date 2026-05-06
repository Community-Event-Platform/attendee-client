import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import axiosClient from './api/axiosClient'
import Register from './pages/Register'

function Home() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axiosClient.get('/test-events') 
      .then(res => {
        setEvents(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Danh sách sự kiện</h1>
      {loading && <p>Đang tải dữ liệu...</p>}
      {error && <p style={{ color: 'red' }}>Lỗi: {error}</p>}
      {!loading && !error && events.length === 0 && <p>Không có sự kiện nào.</p>}
      {events.map(ev => (
        <div key={ev.id} style={{ border: '1px solid white', margin: '10px', padding: '10px' }}>
          <h3>{ev.name}</h3>
          <p>{ev.description}</p>
          <p>📍 {ev.location}</p>
          <p>📅 {ev.event_date}</p>
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
        {/* Placeholder for Login */}
        <Route path="/login" element={<div>Trang Đăng nhập (Sắp ra mắt)</div>} />
      </Routes>
    </Router>
  )
}

export default App;