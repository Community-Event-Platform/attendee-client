import { useState, useEffect } from "react";
import { useAuth } from "../../../hooks/useAuth";

// Gọi đúng biến môi trường VITE_API_URL 
const API_BASE = import.meta.env.VITE_API_URL;

function NotificationPage() {
  const { token } = useAuth();
  const [notifications, setNotifications] = useState([]);

  // 1. Tải danh sách thông báo về
  useEffect(() => {
    if (!token) return;
    fetch(`${API_BASE}/notifications`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json'
      }
    })
      .then(res => res.json())
      .then(json => {
        if (json.success) setNotifications(json.data || []);
      })
      .catch(err => console.error(err));
  }, [token]);

  // 2. AC4: Khi click vào một thông báo -> Cập nhật thành "Đã đọc"
  const handleRead = (id, isRead) => {
    if (isRead) return; // Đã đọc rồi thì không cần gọi API nữa

    fetch(`${API_BASE}/notifications/${id}/read`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json'
      }
    })
      .then(res => {
        if (res.ok) {
          // Cập nhật giao diện ngay lập tức
          setNotifications(prev =>
            prev.map(n => n.id === id ? { ...n, is_read: 1 } : n)
          );
          // notify header to update unread badge
          try { window.dispatchEvent(new CustomEvent('notification:read', { detail: { id } })); } catch(e){}
        }
      });
  };

  return (
    <div className="container my-5" style={{ maxWidth: '700px' }}>
      <h3 className="fw-bold mb-4">MESSAGES BOX</h3>
      <div className="card shadow-sm rounded-3">
        <div className="list-group list-group-flush">
          {notifications.length === 0 ? (
            <div className="p-5 text-center text-muted">
              <i className="bi bi-bell-slash mb-2" style={{ fontSize: '30px' }}></i>
              <p>You don't have any notifications yet.</p>
            </div>
          ) : (
            notifications.map(notif => (
              <div
                key={notif.id}
                onClick={() => handleRead(notif.id, notif.is_read)}
                className={`list-group-item list-group-item-action p-4 border-bottom transition-all ${!notif.is_read ? 'bg-light fw-bold' : ''}`}
                style={{ cursor: 'pointer', borderLeft: !notif.is_read ? '4px solid #4D5EE3' : '4px solid transparent' }}
              >
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <span className={!notif.is_read ? 'text-primary' : 'text-secondary'}>
                    {!notif.is_read ? '● New Message' : 'Read'}
                  </span>
                  <small className="text-muted">{new Date(notif.created_at).toLocaleDateString()}</small>
                </div>
                <p className="m-0 text-dark" style={{ fontSize: '15px', fontWeight: 'normal' }}>
                  {notif.message}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default NotificationPage;