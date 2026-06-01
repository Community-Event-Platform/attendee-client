import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getEventDetail, checkRegistrationStatus, cancelRegistration } from "../services/api";
import FreeRegistrationForm from "../components/registration/FreeRegistrationForm";
import PaidRegistrationForm from "../components/registration/PaidRegistrationForm";
import ReviewSubmissionForm from "../components/reviews/ReviewSubmissionForm";
import { useAuth } from "../hooks/useAuth";
import "./style/EventDetail.css";
import eventImage from "../assets/event.png";

// Helper function to get event image URL
const getEventImage = (imageRef) => {
  if (!imageRef) return eventImage;

  // If imageRef already looks like a full URL, return it
  if (imageRef.startsWith('http://') || imageRef.startsWith('https://')) return imageRef;

  // Construct base URL from VITE_API_URL
  const rawApiUrl = import.meta.env.VITE_API_URL?.replace(/\/$/, '');
  if (!rawApiUrl) return eventImage;
  const apiBase = rawApiUrl.replace(/\/api$/, '');

  // Determine the image path
  let imagePath;
  if (imageRef.startsWith('/storage/')) {
    // Already has /storage/ prefix
    imagePath = imageRef;
  } else if (imageRef.startsWith('/')) {
    // Has leading slash but not storage (e.g., /events/abc.jpg)
    imagePath = `/storage${imageRef}`;
  } else {
    // Just filename like 'abc.jpg', prepend full storage path
    imagePath = `/storage/events/${imageRef}`;
  }

  return `${apiBase}${imagePath}`;
};

function EventDetail({ addToast }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuth();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);

  // AC3: Track user's registration status for this event
  const [hasRegistered, setHasRegistered] = useState(false);
  const [registrationStatus, setRegistrationStatus] = useState(null);
  const [registrationId, setRegistrationId] = useState(null);
  const [hasReviewed, setHasReviewed] = useState(false);

  // Countdown timer
  const [countdown, setCountdown] = useState({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
    isExpired: false,
  });
  const [now, setNow] = useState(() => Date.now());
  

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
          setRegistrationId(statusData.registration_id);
        } catch {
          // User not logged in or no registration - ignore
          console.log("Not logged in or no registration");
        }

        // Check if user has already reviewed
        if (user && data.reviews && Array.isArray(data.reviews)) {
          const userReview = data.reviews.find(
            (review) =>
              review.attendee?.id === user.id || review.attendee?.name === user.name
          );
          if (userReview) {
            setHasReviewed(true);
          }
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
  }, [id, addToast, user]);

  // Real-time countdown timer
  useEffect(() => {
    if (!event || !event.date_time) return;

    const timer = setInterval(() => {
      const targetDate = new Date(event.date_time).getTime();
      const currentTime = Date.now();
      const difference = targetDate - currentTime;
      setNow(currentTime);

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

  const attendeesCount = event?.registrations_count ?? event?.attendees ?? 0;
  const capacity = event?.capacity || 0;
  const remainingSeats = event?.remaining_seats ?? Math.max(0, capacity - attendeesCount);
  const capacityProgress = capacity > 0 ? Math.min(100, Math.round((attendeesCount / capacity) * 100)) : 0;
  const capacityStatusText = remainingSeats > 0 ? `Remaining ${remainingSeats} seats` : "Sold out";

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

  // Check if event has ended
  const isEventEnded = () => {
    if (!event) return false;
    const eventEndTime = new Date(event.end_date || event.date_time).getTime();
    const now = new Date().getTime();
    return now > eventEndTime;
  };

  const getCancelDeadline = () => {
    if (!event?.date_time) return null;
    return new Date(new Date(event.date_time).getTime() - 2 * 24 * 60 * 60 * 1000);
  };

  const isFreeEvent = (eventData) => {
    if (!eventData) return false;
    return eventData.price == null || Number(eventData.price) === 0;
  };

  const isPaidEvent = (eventData) => {
    if (!eventData) return false;
    return eventData.price != null && Number(eventData.price) > 0;
  };

  const canCancelRegistration = () => {
    if (!event?.date_time || !registrationId) return false;
    if (isPaidEvent(event)) return false;
    const deadline = getCancelDeadline();
    return deadline ? now <= deadline.getTime() : false;
  };

  // Open registration modal
  const handleOpenRegistration = () => {
    if (!user || !token) {
      if (addToast) addToast("Please login to register for this event", "error");
      navigate("/login");
      return;
    }

    setShowRegistrationModal(true);
  };

  const handleCancelRegistration = async () => {
    if (!registrationId) return;

    if (!canCancelRegistration()) {
      if (addToast) {
        addToast("Cancellation is only allowed at least 2 days before the event", "error");
      }
      return;
    }

    try {
      await cancelRegistration(registrationId);
      if (addToast) addToast("Registration cancelled successfully", "success");
      setHasRegistered(false);
      setRegistrationStatus('Cancelled');
      setRegistrationId(null);
    } catch (err) {
      const message = err?.response?.data?.message || "Cancellation failed";
      if (addToast) addToast(message, "error");
    }
  };

  // Handle review submission success
  const handleReviewSubmitted = async () => {
    setHasReviewed(true);
    // Reload event details to show new review and updated ratings
    try {
      const data = await getEventDetail(id);
      setEvent(data);
    } catch (err) {
      console.error("Failed to reload event details:", err);
    }
  };



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
        style={{ backgroundImage: `url(${getEventImage(event.image || event.image_url)})` }}
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
                    <i className="bi bi-person-badge-fill"></i>
                  </div>
                  <div className="info-item-content">
                    <span className="info-item-label">Organizer</span>
                    <span className="info-item-value">{event.organizer?.name || "EventHub Organizer"}</span>
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-item-icon">
                    <i className="bi bi-people-fill"></i>
                  </div>
                  <div className="info-item-content" style={{ width: "100%" }}>
                    <span className="info-item-label">Capacity</span>
                    <span className="info-item-value">
                      {attendeesCount} / {capacity} attendees
                    </span>
                    <div className="progress mt-2" style={{ height: "8px" }}>
                      <div
                        className="progress-bar"
                        role="progressbar"
                        aria-valuenow={capacityProgress}
                        aria-valuemin="0"
                        aria-valuemax="100"
                        style={{
                          width: `${capacityProgress}%`,
                          backgroundColor: "#4D5EE3",
                        }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-item-icon">
                    <i className="bi bi-check-circle-fill"></i>
                  </div>
                  <div className="info-item-content">
                    <span className="info-item-label">Status</span>
                    <span className={`info-item-value ${remainingSeats > 0 ? "text-success" : "text-danger"}`}>
                      {capacityStatusText}
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

              {/* Review Submission Form - Only show if user is logged in, registered, event ended, and hasn't reviewed */}
              {user && hasRegistered && isEventEnded() && !hasReviewed && (
                <>
                  <div className="sidebar-divider" style={{ margin: "20px 0" }}></div>
                  <h4 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "16px" }}>Share Your Review</h4>
                  <ReviewSubmissionForm 
                    eventId={id}
                    addToast={addToast}
                    onReviewSubmitted={handleReviewSubmitted}
                  />
                </>
              )}

              {/* Display reviews list */}
              {event.reviews && event.reviews.length > 0 ? (
                <div className="reviews-list">
                  <div className="sidebar-divider" style={{ margin: "20px 0" }}></div>
                  <h4 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "16px" }}>Recent Reviews</h4>
                  {event.reviews.map((review) => (
                    <div key={review.id} className="review-item">
                      <div className="review-header">
                        <div className="review-user-info">
                          <span className="review-user-name">{review.attendee?.name || "Anonymous User"}</span>
                          <span className="review-date">{new Date(review.created_at).toLocaleDateString()}</span>
                        </div>
                        <div className="review-rating">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <i
                              key={star}
                              className={`bi ${star <= review.rating ? "bi-star-fill" : "bi-star"}`}
                              style={{ color: star <= review.rating ? "#ffc107" : "#dee2e6", marginRight: "2px" }}
                            ></i>
                          ))}
                          <span style={{ marginLeft: "8px", fontSize: "14px", fontWeight: "600" }}>
                            {review.rating}/5
                          </span>
                        </div>
                      </div>
                      <p className="review-comment">{review.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="reviews-empty-box">
                  <span className="reviews-empty-text">No reviews yet. Be the first to review!</span>
                </div>
              )}
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
                  <div className="seat-label">Capacity</div>
                  <div className="seat-count">
                    {attendeesCount} / {capacity} attendees
                  </div>
                  <div className="progress mt-2" style={{ height: "8px" }}>
                    <div
                      className="progress-bar"
                      role="progressbar"
                      aria-valuenow={capacityProgress}
                      aria-valuemin="0"
                      aria-valuemax="100"
                      style={{
                        width: `${capacityProgress}%`,
                        backgroundColor: "#4D5EE3",
                      }}
                    ></div>
                  </div>
                  <div className="seat-total" style={{ marginTop: "10px" }}>
                    {capacityStatusText}
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

                  {hasRegistered ? (
                    <>
                      <div className="registration-status-label">Status: {registrationStatus || "Registered"}</div>
                      <button
                        type="button"
                        className="btn-register-event"
                        onClick={handleCancelRegistration}
                        disabled={!canCancelRegistration()}
                      >
                        {canCancelRegistration() ? "Cancel registration" : isPaidEvent(event) ? "Cannot cancel (paid event)" : "Cannot cancel"}
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      className="btn-register-event"
                      onClick={handleOpenRegistration}
                      disabled={isPaidEvent(event) && remainingSeats <= 0}
                    >
                      Register now
                    </button>
                  )}
                  {hasRegistered && registrationStatus === "Waitlisted" && (
                    <p className="cancel-disabled-note">You are on the waitlist. You will be notified when a seat becomes available.</p>
                  )}
                  {hasRegistered && isPaidEvent(event) && (
                    <p className="cancel-disabled-note">Paid events cannot be canceled from this app.</p>
                  )}
                  {hasRegistered && !isPaidEvent(event) && !canCancelRegistration() && (
                    <p className="cancel-disabled-note">Cancellation is only available until 2 days before the event.</p>
                  )}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* AC3: Handle successful registration from modal */}
      {(() => {
        if (!showRegistrationModal) return null;
        const handleSuccess = async (payload) => {
          setHasRegistered(true);
          // If payload contains registration data, set registrationId and status accordingly
          try {
            const reg = payload?.data ?? payload ?? null;
            if (reg && reg.id) {
              setRegistrationId(reg.id);
              setRegistrationStatus(reg.status ?? (isFreeEvent(event) ? 'Pending' : 'Approved'));
            } else {
              setRegistrationStatus(isFreeEvent(event) ? 'Pending' : 'Approved');
            }

            // Refresh event detail to update seat counts / remaining seats
            try {
              const updated = await getEventDetail(id);
              setEvent(updated);
            } catch (err) {
              console.warn('Failed to refresh event after registration', err);
            }

            if (addToast) {
              if (isFreeEvent(event)) {
                addToast("Registration request sent successfully. Please wait for approval.", "success");
              } else {
                addToast("Registration completed successfully!", "success");
              }
            }
          } catch (err) {
            console.error('handleSuccess error', err);
          }
        };
        if (isFreeEvent(event)) {
          return <FreeRegistrationForm event={event} onClose={() => setShowRegistrationModal(false)} addToast={addToast} onSuccess={handleSuccess} />;
        }
        return <PaidRegistrationForm event={event} onClose={() => setShowRegistrationModal(false)} addToast={addToast} onSuccess={handleSuccess} />;
      })()}
    </main>
  );
}

export default EventDetail;
