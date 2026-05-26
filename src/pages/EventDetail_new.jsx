import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getEventDetail, checkRegistrationStatus } from "../services/api";
import FreeRegistrationForm from "../components/registration/FreeRegistrationForm";
import PaidRegistrationForm from "../components/registration/PaidRegistrationForm";
import "./style/EventDetail.css";
import eventImage from "../assets/event.png";

function EventDetail({ addToast }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);

  // AC3: Track user's registration status for this event
  const [hasRegistered, setHasRegistered] = useState(false);
  const [registrationStatus, setRegistrationStatus] = useState(null);

  // Countdown timer
  const [countdown, setCountdown] = useState({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
    isExpired: false,
  });
  

  // Load event details from API
  useEffect(() => {
    const loadEventDetail = async () => {
      try {
        setLoading(true);
        const data = await getEventDetail(id);
        setEvent(data);

        // AC3: Check if user has already registered for this event
        try {
          const statusData = await checkRegistrationStatus(id);
          setHasRegistered(statusData.has_registered);
          setRegistrationStatus(statusData.status);
        } catch (regErr) {
          // User not logged in or other error - ignore
          console.log("Not logged in or no registration");
        }
      } catch (err) {
        console.error("Failed to load event details:", err);
        setError("Unable to load event details.");
        if (addToast) addToast("Unable to load event details.", "error");
      } finally {
        setLoading(false);
      }
    };

    loadEventDetail();
  }, [id, addToast]);

  // Real-time countdown timer
  useEffect(() => {
    if (!event || !event.date_time) return;

    const timer = setInterval(() => {
      const targetDate = new Date(event.date_time).getTime();
      const now = Date.now();
      const difference = targetDate - now;

      if (difference <= 0) {
        setCountdown({
          days: "00",
          hours: "00",
          minutes: "00",
          seconds: "00",
          isExpired: true,
        });
        clearInterval(timer);
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setCountdown({
          days: String(days).padStart(2, "0"),
          hours: String(hours).padStart(2, "0"),
          minutes: String(minutes).padStart(2, "0"),
          seconds: String(seconds).padStart(2, "0"),
          isExpired: false,
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [event]);

  // Format date and time for display
  const formatDateTime = (value) => {
    if (!value) return "Not available";
    return new Intl.DateTimeFormat("en-US", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(value));
  };

  const getShortDate = (value) => {
    if (!value) return "Chưa cập nhật";
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(value));
  };

  

  // Calculate rating breakdown percentages
  const breakdownPercentages = useMemo(() => {
    if (!event || !event.rating_breakdown || event.reviews_count === 0) {
      return { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    }
    const percent = {};
    for (let i = 1; i <= 5; i++) {
      const count = event.rating_breakdown?.[i] ?? 0;
      percent[i] = Math.round((count / event.reviews_count) * 100);
    }
    return percent;
  }, [event]);



  if (loading) {
    return (
      <div className="container my-5 text-center" style={{ minHeight: "60vh", paddingTop: "15vh" }}>
        <div className="spinner-border text-primary mb-3" role="status" style={{ width: "3rem", height: "3rem" }}></div>
        <p className="lead text-muted">Loading event details...</p>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="container my-5 text-center" style={{ minHeight: "60vh", paddingTop: "15vh" }}>
        <i className="bi bi-exclamation-triangle-fill text-danger" style={{ fontSize: "3rem" }}></i>
        <h2 className="mt-3 text-dark">Data load error</h2>
        <p className="lead text-muted">{error || "Event does not exist."}</p>
        <button className="btn btn-primary mt-3 px-4 py-2 fw-bold" onClick={() => navigate("/events")}>Back to events list</button>
      </div>
    );
  }

  return (
    <main className="event-detail-page">
      {/* Banner / Hero Section */}
      <section 
        className="event-detail-hero"
        style={{ backgroundImage: `url(${eventImage})` }}
      >
        <div className="container-fluid px-4 px-lg-5">
          <div className="event-detail-hero-content">
            <span className="event-category-badge">{event.category?.name || event.category || "General"}</span>
            <h1 className="event-detail-title">{event.name}</h1>
            <div className="event-hero-meta">
              <span>
                <i className="bi bi-calendar3"></i>
                {getShortDate(event.date_time)}
              </span>
              <span>
                <i className="bi bi-geo-alt-fill"></i>
                {event.location}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Grid Content */}
      <div className="container-fluid px-4 px-lg-5">
        <div className="event-detail-grid">
          
          {/* Left column: Event Information */}
          <div className="left-column">
            
            {/* Card 1: Event Information */}
            <div className="event-detail-card">
              <div className="card-title-container">
                <span className="card-title-icon">
                  <i className="bi bi-info-circle-fill"></i>
                </span>
                <h3 className="card-title-text">Event Information</h3>
              </div>
              <p className="description-text mb-4">
                {event.description || "No description available for this event."}
              </p>
              
              <div className="info-items-list">
                <div className="info-item">
                  <div className="info-item-icon">
                    <i className="bi bi-calendar2-check-fill"></i>
                  </div>
                  <div className="info-item-content">
                    <span className="info-item-label">Event Date</span>
                    <span className="info-item-value">{formatDateTime(event.date_time)}</span>
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-item-icon">
                    <i className="bi bi-geo-alt-fill"></i>
                  </div>
                  <div className="info-item-content">
                    <span className="info-item-label">Location</span>
                    <span className="info-item-value">{event.location}</span>
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-item-icon">
                    <i className="bi bi-people-fill"></i>
                  </div>
                  <div className="info-item-content">
                    <span className="info-item-label">Capacity</span>
                    <span className="info-item-value">
                      {event.registrations_count} / {event.capacity} attendees
                    </span>
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-item-icon">
                    <i className="bi bi-check-circle-fill"></i>
                  </div>
                  <div className="info-item-content">
                    <span className="info-item-label">Status</span>
                    <span className="info-item-value text-success">
                      {event.remaining_seats > 0 ? `Remaining ${event.remaining_seats} seats` : "Sold out"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: Attendee Reviews */}
            <div className="event-detail-card">
              <div className="card-title-container">
                <span className="card-title-icon">
                  <i className="bi bi-chat-left-heart-fill"></i>
                </span>
                <h3 className="card-title-text">Attendee Reviews</h3>
              </div>

              <div className="reviews-summary-row">
                <div className="reviews-score-col">
                  <span className="average-score">
                    {event.average_rating}
                    <span> / 5</span>
                  </span>
                  <div className="stars-row">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <i 
                        key={star}
                        className={`bi ${star <= Math.round(event.average_rating) ? "bi-star-fill" : "bi-star"}`}
                      ></i>
                    ))}
                  </div>
                  <span className="reviews-count-text">({event.reviews_count} reviews)</span>
                </div>

                <div className="reviews-bars-col">
                  {[5, 4, 3, 2, 1].map((star) => (
                    <div className="rating-bar-row" key={star}>
                      <div className="rating-bar-label">
                        {star} <i className="bi bi-star-fill"></i>
                      </div>
                      <div className="rating-progress-bg">
                        <div 
                          className="rating-progress-fill" 
                          style={{ width: `${breakdownPercentages[star]}%` }}
                        ></div>
                      </div>
                      <span className="rating-bar-count">
                        {event.rating_breakdown?.[star] || 0}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="reviews-empty-box">
                <span className="reviews-empty-text">No reviews yet.</span>
              </div>
            </div>

          </div>

          {/* Right column: Registration Sticky Sidebar */}
          <div className="right-column">
            <div className="sidebar-sticky">
              
              {/* Registration Card */}
              <div className="event-detail-card">
                <h3 className="sidebar-title">Register to Attend</h3>
                <div className="sidebar-divider"></div>

                <div className="seat-remaining-box">
                  <div className="seat-label">Seats remaining</div>
                  <div className="seat-count">
                    {event.remaining_seats} seats
                  </div>
                  <div className="seat-total">
                    Out of {event.capacity} seats
                  </div>
                </div>

                <div className="sidebar-divider"></div>

                <div className="countdown-section-title">Time remaining</div>
                <div className="countdown-timer-container">
                  <div className="countdown-unit">
                    <div className="countdown-number">{countdown.days}</div>
                    <div className="countdown-label">Days</div>
                  </div>
                  <div className="countdown-unit">
                    <div className="countdown-number">{countdown.hours}</div>
                    <div className="countdown-label">Hours</div>
                  </div>
                  <div className="countdown-unit">
                    <div className="countdown-number">{countdown.minutes}</div>
                    <div className="countdown-label">Minutes</div>
                  </div>
                  <div className="countdown-unit">
                    <div className="countdown-number">{countdown.seconds}</div>
                    <div className="countdown-label">Seconds</div>
                  </div>
                </div>

                <button 
                  type="button" 
                  className="btn-register-event"
                  onClick={() => setShowRegistrationModal(true)}
                  disabled={hasRegistered}
                >
                  {hasRegistered 
                    ? (registrationStatus === 'Pending' ? 'Đang chờ duyệt' : 'Đã đăng ký') 
                    : 'Register now'}
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>

      // AC3: Handle successful registration from modal
  const handleRegistrationSuccess = () => {
    // Show success toast
    if (addToast) {
      addToast("Gửi yêu cầu đăng ký thành công, vui lòng chờ duyệt!", "success");
    }
    // Update registration status
    setHasRegistered(true);
    setRegistrationStatus('Pending');
  };

  {/* Registration Modals */}
      {showRegistrationModal && (
        event.price === null || event.price === 0 ? (
          <FreeRegistrationForm 
            event={event}
            onClose={() => setShowRegistrationModal(false)}
            addToast={addToast}
            handleRegistrationSuccess
          />
        )
      )}
    </main>
  );
}

export default EventDetail;

