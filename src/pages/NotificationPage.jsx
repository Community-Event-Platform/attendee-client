import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import "./style/NotificationPage.css";

const API_BASE = import.meta.env.VITE_API_URL;

function NotificationPage() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const authToken = token || localStorage.getItem('token');
    if (!authToken) {
      return;
    }

    fetch(`${API_BASE}/notifications`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
        Accept: 'application/json',
      },
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          setNotifications(json.data || []);
        } else {
          setNotifications([]);
        }
      })
      .catch((err) => {
        console.error("Notification fetch error:", err);
        setNotifications([]);
      })
      .finally(() => setLoading(false));
  }, [token]);

  const handleRead = (id, isRead) => {
    if (isRead) return;
    const authToken = token || localStorage.getItem('token');
    if (!authToken) return;

    fetch(`${API_BASE}/notifications/${id}/read`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${authToken}`,
        Accept: 'application/json',
      },
    })
      .then((res) => {
        if (res.ok) {
          setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, is_read: 1 } : n))
          );
          try {
            window.dispatchEvent(
              new CustomEvent('notification:read', { detail: { id } })
            );
          } catch (e) {
            console.warn(e);
          }
        }
      })
      .catch((err) => {
        console.error("Mark notification read error:", err);
      });
  };

  const formatDate = (value) => {
    if (!value) return "";
    const date = new Date(value);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const handleViewEvent = (eventId) => {
    if (!eventId) return;
    navigate(`/events/${eventId}`);
  };

  return (
    <main className="notification-page">
      <section className="notification-hero">
        <div>
          <p className="notification-hero__eyebrow">Notifications</p>
          <h1 className="notification-hero__title">Latest Updates</h1>
          <p className="notification-hero__description">
            View your latest event updates and ticket confirmations.
          </p>
        </div>
      </section>

      <section className="notification-list">
        {loading ? (
          <div className="notification-empty">
            <span className="notification-empty__icon">⏳</span>
            <p>Loading notifications...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="notification-empty">
            <span className="notification-empty__icon">🔔</span>
            <p>You have no new notifications.</p>
            <small>Check again later or return to the events page.</small>
          </div>
        ) : (
          notifications.map((notif) => (
            <article
              key={notif.id}
              className={`notification-card ${!notif.is_read ? 'notification-card--unread' : ''}`}
              onClick={() => handleRead(notif.id, notif.is_read)}
            >
              <div className="notification-card__header">
                <div className="notification-card__status">
                  {!notif.is_read ? 'New' : 'Read'}
                </div>
                <span className="notification-card__timestamp">
                  {formatDate(notif.created_at)}
                </span>
              </div>

              <div className="notification-card__body">
                <div className="notification-card__emoji">🎉</div>
                <div className="notification-card__text">
                  <h2 className="notification-card__title">Congratulations! Your ticket is confirmed</h2>
                  <p className="notification-card__message">{notif.message}</p>
                </div>
              </div>

              <div className="notification-card__footer">
                <span className="notification-card__detail">View event details and participation information.</span>
                <button
                  className="notification-card__button"
                  type="button"
                  onClick={() => handleViewEvent(notif.event_id)}
                  disabled={!notif.event_id}
                >
                  View Event
                </button>
              </div>
            </article>
          ))
        )}
      </section>
    </main>
  );
}

export default NotificationPage;
