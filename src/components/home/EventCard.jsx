import { useState } from 'react';
import './style/EventCard.css';

// Import all event images
import event01 from '../../assets/events/event-01.jpg';
import event02 from '../../assets/events/event-02.jpg';
import event03 from '../../assets/events/event-03.jpg';
import event04 from '../../assets/events/event-04.jpg';
import event05 from '../../assets/events/event-05.jpg';
import event06 from '../../assets/events/event-06.jpg';
import event07 from '../../assets/events/event-07.jpg';
import event08 from '../../assets/events/event-08.jpg';
import event09 from '../../assets/events/event-09.jpg';
import event10 from '../../assets/events/event-10.jpg';
import event11 from '../../assets/events/event-11.jpg';
import event12 from '../../assets/events/event-12.jpg';
import event13 from '../../assets/events/event-13.jpg';
import event14 from '../../assets/events/event-14.jpg';
import event15 from '../../assets/events/event-15.jpg';
import event16 from '../../assets/events/event-16.jpg';
import event17 from '../../assets/events/event-17.jpg';
import event18 from '../../assets/events/event-18.jpg';
import event19 from '../../assets/events/event-19.jpg';
import event20 from '../../assets/events/event-20.jpg';

const eventImages = {
  'event-01.jpg': event01,
  'event-02.jpg': event02,
  'event-03.jpg': event03,
  'event-04.jpg': event04,
  'event-05.jpg': event05,
  'event-06.jpg': event06,
  'event-07.jpg': event07,
  'event-08.jpg': event08,
  'event-09.jpg': event09,
  'event-10.jpg': event10,
  'event-11.jpg': event11,
  'event-12.jpg': event12,
  'event-13.jpg': event13,
  'event-14.jpg': event14,
  'event-15.jpg': event15,
  'event-16.jpg': event16,
  'event-17.jpg': event17,
  'event-18.jpg': event18,
  'event-19.jpg': event19,
  'event-20.jpg': event20,
};

function EventCard({ event, navigate, userRegistration }) {
  const [isHovered, setIsHovered] = useState(false);
  const eventCategory = event.category?.name || event.category || 'Event';
  const attendeesCount = event.registrations_count ?? event.attendees ?? 0;
  const capacity = event.capacity || 0;
  const remainingSeats = event.remaining_seats ?? Math.max(0, capacity - attendeesCount);
  const capacityProgress = capacity > 0 ? Math.min(100, Math.round((attendeesCount / capacity) * 100)) : 0;
  const capacityStatusText = remainingSeats > 0 ? `Remaining ${remainingSeats} seats` : 'Sold out';

  const getEventImage = (imageRef) => {
    if (!imageRef) return event01;

    // If imageRef matches a bundled asset filename, return that
    const filename = imageRef.split('/').pop();
    if (eventImages[filename]) return eventImages[filename];

    // If imageRef already looks like a full URL, return it
    if (imageRef.startsWith('http://') || imageRef.startsWith('https://')) return imageRef;

    // If imageRef is a server path like '/storage/events/..', construct absolute URL from VITE_API_URL
    const rawApiUrl = import.meta.env.VITE_API_URL?.replace(/\/$/, '');
    if (!rawApiUrl) return event01;
    const apiBase = rawApiUrl.replace(/\/api$/, '');

    if (imageRef.startsWith('/')) {
      return `${apiBase}${imageRef}`;
    }

    return `${apiBase}/${imageRef}`;
  };

  const formatDate = (dateString) => {
    const options = { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const isFreePrice = (price) => {
    return price == null || Number(price) === 0;
  };

  const getPriceDisplay = (price) => {
    if (isFreePrice(price)) {
      return 'Free Registration';
    }
    return new Intl.NumberFormat('en-US').format(price) + ' VND';
  };

  const getPriceColor = (price) => {
    return isFreePrice(price) ? '#14AE5C' : '#FF6B6B';
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
          src={getEventImage(event.image_url)} 
          alt={event.name}
          className="event-image"
        />

        {/* Category Badge */}
        <div className="category-badge">
          {eventCategory}
        </div>

        {/* Overlay on Hover */}
        {isHovered && (
          <div className="event-overlay">
            <button className="view-details-btn" onClick={handleViewDetails}>View Details</button>
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

        {/* Event Attendees + Price */}
        <div className="event-attendees-price mb-2">
          <div className="event-attendees">
            <i className="bi bi-people text-muted"></i>
            <span className="text-muted small ms-2">
              {attendeesCount} people attending
            </span>
          </div>
          <div className="event-price mt-1">
            <i className="bi bi-ticket-perforated text-muted"></i>
            <span
              className="small ms-2 fw-bold"
              style={{ color: getPriceColor(event.price) }}
            >
              {getPriceDisplay(event.price)}
            </span>
          </div>
        </div>

        {/* Capacity & Status */}
        <div className="event-capacity mb-2">
          <div className="d-flex justify-content-between mb-2">
            <small className="text-muted">Capacity</small>
            <small className="text-muted">
              {attendeesCount}/{capacity}
            </small>
          </div>
          <div className="progress" style={{ height: '6px' }}>
            <div
              className="progress-bar"
              role="progressbar"
              aria-valuenow={capacityProgress}
              aria-valuemin="0"
              aria-valuemax="100"
              style={{
                width: `${capacityProgress}%`,
                backgroundColor: '#4D5EE3',
              }}
            ></div>
          </div>
          <div className={`event-status-text mt-2 ${remainingSeats > 0 ? 'text-success' : 'text-danger'}`}>
            {capacityStatusText}
          </div>
        </div>

        {/* Price or Register Button */}
        <div className="event-footer">
          {userRegistration ? (
            <div className="text-center w-100">
              <div style={{ marginBottom: '8px', fontSize: '14px', color: '#6b6375' }}>
                Status: {userRegistration.status || "Registered"}
              </div>
              <button 
                className="btn w-100 fw-bold" 
                style={{ backgroundColor: '#f1f5f9', color: '#64748b', border: '1px solid #cbd5e1' }} 
                onClick={handleViewDetails}
              >
                Cancel registration
              </button>
            </div>
          ) : (
            <button className="btn btn-primary w-100" onClick={handleViewDetails}>
              {isFreePrice(event.price) ? 'Free Registration' : 'Register'}
            </button>
          )}
          <button className="btn btn-primary w-100" onClick={handleViewDetails}>
            {remainingSeats <= 0 ? 'Sold out' : isFreePrice(event.price) ? 'Free Registration' : 'Register'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default EventCard;
