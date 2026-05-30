import { useState, useEffect } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { api } from "../../../services/api";

function NotificationPage() {
  const { token } = useAuth();
  const [notifications, setNotifications] = useState([]);

  // 1. Load notifications list
  useEffect(() => {
    if (!token) return;
    api.get('/notifications')
      .then(res => res.data)
      .then(json => {
        if (json.success) setNotifications(json.data || []);
      })
      .catch(err => console.error(err));
  }, [token]);

  // 2. When clicking a notification -> mark as "Read"
  const handleRead = (id, isRead) => {
    if (isRead) return; // Already read, no need to call API

    api.patch(`/notifications/${id}/read`)
      .then(res => {
        if (res.ok) {
          setNotifications(prev =>
            prev.map(n => n.id === id ? { ...n, is_read: 1 } : n)
          );
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
                    {!notif.is_read ? 'New Message' : 'Read'}
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