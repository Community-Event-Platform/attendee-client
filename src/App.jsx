import { useState, useEffect } from 'react'
import axiosClient from './api/axiosClient'

function App() { 
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Hàm này để "chạy đi lấy dữ liệu"
    axiosClient.get('/test-events') 
      .then(res => {
        console.log("Dữ liệu về rồi nè:", res.data);
        setEvents(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Lỗi rồi:", err);
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
  )
}

export default App;