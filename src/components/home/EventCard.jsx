import { useState } from 'react';
import './style/EventCard.css';

function EventCard({ event, navigate }) {
  const [isHovered, setIsHovered] = useState(false);

  const formatDate = (dateString) => {
    const options = { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('vi-VN', options);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const getEventTypeColor = (type) => {
    return type === 'Free' ? '#14AE5C' : '#FF6B6B';
  };

  const getEventTypeLabel = (type) => {
    return type === 'Free' ? 'Miễn Phí' : 'Trả Phí';
  };

  const handleViewDetails = () => {
    if (navigate) {
      navigate(`/events/${event.id}`);
    }
  };

  return (
    <div 
      className="event-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Event Image Container */}
      <div className="event-image-container">
        <img 
          src={event.image_url} 
          alt={event.name}
          className="event-image"
        />

        {/* Category Badge */}
        <div className="category-badge">
          {event.category}
        </div>

        {/* Event Type Badge (Free/Paid) */}
        <div 
          className="event-type-badge"
          style={{ backgroundColor: getEventTypeColor(event.event_type) }}
        >
          {getEventTypeLabel(event.event_type)}
        </div>

        {/* Overlay on Hover */}
        {isHovered && (
          <div className="event-overlay">
            <button className="view-details-btn" onClick={handleViewDetails}>Xem Chi Tiết</button>
          </div>
        )}
      </div>

      {/* Event Details */}
      <div className="event-details p-3">
        {/* Event Name */}
        <h5 className="event-title text-truncate" title={event.name}>
          {event.name}
        </h5>

        {/* Event Location */}
        <div className="event-location mb-2">
          <i className="bi bi-geo-alt text-muted"></i>
          <span className="text-muted small ms-2">{event.location}</span>
        </div>

        {/* Event Date & Time */}
        <div className="event-datetime mb-2">
          <i className="bi bi-calendar-event text-muted"></i>
          <span className="text-muted small ms-2">{formatDate(event.date_time)}</span>
        </div>

        {/* Event Attendees */}
        <div className="event-attendees mb-3">
          <i className="bi bi-people text-muted"></i>
          <span className="text-muted small ms-2">{event.attendees} người tham gia</span>
        </div>

        {/* Capacity Progress Bar */}
        <div className="event-capacity mb-3">
          <div className="d-flex justify-content-between mb-2">
            <small className="text-muted">Công suất</small>
            <small className="text-muted">
              {event.attendees}/{event.capacity}
            </small>
          </div>
          <div className="progress" style={{ height: '6px' }}>
            <div
              className="progress-bar"
              role="progressbar"
              style={{
                width: `${(event.attendees / event.capacity) * 100}%`,
                backgroundColor: '#4D5EE3',
              }}
            ></div>
          </div>
        </div>

        {/* Price or Register Button */}
        <div className="event-footer">
          {event.event_type === 'Paid' && event.price ? (
            <div className="d-flex justify-content-between align-items-center">
              <span className="price-text fw-bold" style={{ color: '#4D5EE3' }}>
                {formatPrice(event.price)}
              </span>
              <button className="btn btn-primary btn-sm" onClick={handleViewDetails}>Đăng Ký</button>
            </div>
          ) : (
            <button className="btn btn-primary w-100" onClick={handleViewDetails}>Đăng Ký Miễn Phí</button>
          )}
        </div>
      </div>
    </div>
  );
}

export default EventCard;