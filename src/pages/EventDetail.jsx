import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getEventDetail, submitReview } from "../services/api";
import "./style/EventDetail.css";
import eventImage from "../assets/event.png";

function EventDetail({ addToast }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Đếm ngược thời gian
  const [countdown, setCountdown] = useState({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
    isExpired: false,
  });
  const [selectedRating, setSelectedRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewMessage, setReviewMessage] = useState("");

  // Tải chi tiết sự kiện từ API
  useEffect(() => {
    const loadEventDetail = async () => {
      try {
        setLoading(true);
        const data = await getEventDetail(id);
        setEvent(data);
      } catch (err) {
        console.error("Failed to load event details:", err);
        setError("Không thể tải thông tin chi tiết sự kiện.");
        if (addToast) addToast("Không thể tải thông tin chi tiết sự kiện.", "error");
      } finally {
        setLoading(false);
      }
    };

    loadEventDetail();
  }, [id, addToast]);

  // Bộ đếm ngược thời gian thực (Real-time countdown)
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

  // Định dạng ngày giờ hiển thị
  const formatDateTime = (value) => {
    if (!value) return "Chưa cập nhật";
    return new Intl.DateTimeFormat("vi-VN", {
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

  const handleSelectRating = (rating) => {
    setSelectedRating(rating);
  };

  const handleReviewSubmit = async (eventSubmit) => {
    eventSubmit.preventDefault();
    if (!selectedRating || !reviewComment.trim()) {
      const message = "Vui lòng chọn đánh giá sao và nhập nhận xét.";
      setReviewMessage(message);
      if (addToast) addToast(message, "warning");
      return;
    }

    try {
      setIsSubmittingReview(true);
      await submitReview(id, selectedRating, reviewComment.trim());
      setReviewMessage("Gửi đánh giá thành công!");
      setSelectedRating(0);
      setReviewComment("");
      if (addToast) addToast("Gửi đánh giá thành công!", "success");
    } catch (err) {
      console.error("Review submit failed:", err);
      const message = err?.response?.data?.message || "Không thể gửi đánh giá.";
      setReviewMessage(message);
      if (addToast) addToast(message, "error");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  // Tính phần trăm thanh biểu đồ đánh giá
  const breakdownPercentages = useMemo(() => {
    if (!event || !event.rating_breakdown || event.reviews_count === 0) {
      return { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    }
    const percent = {};
    for (let i = 1; i <= 5; i++) {
      percent[i] = Math.round((event.rating_breakdown[i] / event.reviews_count) * 100);
    }
    return percent;
  }, [event]);



  if (loading) {
    return (
      <div className="container my-5 text-center" style={{ minHeight: "60vh", paddingTop: "15vh" }}>
        <div className="spinner-border text-primary mb-3" role="status" style={{ width: "3rem", height: "3rem" }}></div>
        <p className="lead text-muted">Đang tải thông tin chi tiết sự kiện...</p>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="container my-5 text-center" style={{ minHeight: "60vh", paddingTop: "15vh" }}>
        <i className="bi bi-exclamation-triangle-fill text-danger" style={{ fontSize: "3rem" }}></i>
        <h2 className="mt-3 text-dark">Lỗi tải dữ liệu</h2>
        <p className="lead text-muted">{error || "Sự kiện không tồn tại."}</p>
        <button className="btn btn-primary mt-3 px-4 py-2 fw-bold" onClick={() => navigate("/events")}>
          Quay lại danh sách sự kiện
        </button>
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
            <span className="event-category-badge">{event.category || "General"}</span>
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
          
          {/* Cột trái: Chi tiết Sự kiện */}
          <div className="left-column">
            
            {/* Thẻ 1: Thông tin sự kiện */}
            <div className="event-detail-card">
              <div className="card-title-container">
                <span className="card-title-icon">
                  <i className="bi bi-info-circle-fill"></i>
                </span>
                <h3 className="card-title-text">Thông tin sự kiện</h3>
              </div>
              <p className="description-text mb-4">
                {event.description || "Không có mô tả cho sự kiện này."}
              </p>
              
              <div className="info-items-list">
                <div className="info-item">
                  <div className="info-item-icon">
                    <i className="bi bi-calendar2-check-fill"></i>
                  </div>
                  <div className="info-item-content">
                    <span className="info-item-label">Ngày tổ chức</span>
                    <span className="info-item-value">{formatDateTime(event.date_time)}</span>
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-item-icon">
                    <i className="bi bi-geo-alt-fill"></i>
                  </div>
                  <div className="info-item-content">
                    <span className="info-item-label">Địa điểm</span>
                    <span className="info-item-value">{event.location}</span>
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-item-icon">
                    <i className="bi bi-people-fill"></i>
                  </div>
                  <div className="info-item-content">
                    <span className="info-item-label">Sức chứa</span>
                    <span className="info-item-value">
                      {event.registrations_count} / {event.capacity} người tham gia
                    </span>
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-item-icon">
                    <i className="bi bi-check-circle-fill"></i>
                  </div>
                  <div className="info-item-content">
                    <span className="info-item-label">Trạng thái</span>
                    <span className="info-item-value text-success">
                      {event.remaining_seats > 0 ? `Còn lại ${event.remaining_seats} ghế` : "Hết ghế trống"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Thẻ 2: Đánh giá từ người tham gia */}
            <div className="event-detail-card">
              <div className="card-title-container">
                <span className="card-title-icon">
                  <i className="bi bi-chat-left-heart-fill"></i>
                </span>
                <h3 className="card-title-text">Đánh giá từ người tham gia</h3>
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
                  <span className="reviews-count-text">({event.reviews_count} đánh giá)</span>
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
                <span className="reviews-empty-text">Chưa có nhận xét nào.</span>
              </div>
            </div>

          </div>

          {/* Cột phải: Khung Đăng ký Sticky Sidebar */}
          <div className="right-column">
            <div className="sidebar-sticky">
              
              {/* Thẻ đăng ký */}
              <div className="event-detail-card">
                <h3 className="sidebar-title">Đăng kí tham gia</h3>
                <div className="sidebar-divider"></div>

                <div className="seat-remaining-box">
                  <div className="seat-label">Số lượng còn lại</div>
                  <div className="seat-count">
                    {event.remaining_seats} ghế
                  </div>
                  <div className="seat-total">
                    Trong tổng số {event.capacity} ghế
                  </div>
                </div>

                <div className="sidebar-divider"></div>

                <div className="countdown-section-title">Thời gian còn lại</div>
                <div className="countdown-timer-container">
                  <div className="countdown-unit">
                    <div className="countdown-number">{countdown.days}</div>
                    <div className="countdown-label">Ngày</div>
                  </div>
                  <div className="countdown-unit">
                    <div className="countdown-number">{countdown.hours}</div>
                    <div className="countdown-label">Giờ</div>
                  </div>
                  <div className="countdown-unit">
                    <div className="countdown-number">{countdown.minutes}</div>
                    <div className="countdown-label">Phút</div>
                  </div>
                  <div className="countdown-unit">
                    <div className="countdown-number">{countdown.seconds}</div>
                    <div className="countdown-label">Giây</div>
                  </div>
                </div>

                <button 
                  type="button" 
                  className="btn-register-event"
                >
                  Đăng ký ngay
                </button>
              </div>

              <div className="event-detail-card review-form-card">
                <h3 className="card-title-text" style={{ marginBottom: "18px" }}>Submit Review Form</h3>
                <form onSubmit={handleReviewSubmit}>
                  <div className="form-group">
                    <label className="form-label-custom" style={{ display: "block", marginBottom: "10px", fontWeight: 700, color: "#3b3742" }}>
                      Chọn số sao
                    </label>
                    <div className="star-rating-input">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <i
                          key={star}
                          className={`bi ${star <= selectedRating ? "bi-star-fill" : "bi-star"}`}
                          onClick={() => handleSelectRating(star)}
                          style={{ cursor: "pointer" }}
                        ></i>
                      ))}
                    </div>
                  </div>

                  <div className="form-group" style={{ marginTop: "18px" }}>
                    <label className="form-label-custom" style={{ display: "block", marginBottom: "10px", fontWeight: 700, color: "#3b3742" }}>
                      Nhận xét của bạn
                    </label>
                    <textarea
                      className="textarea-review"
                      rows="4"
                      placeholder="Viết nhận xét..."
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                    />
                  </div>

                  {reviewMessage && (
                    <div className="review-form-message" style={{ marginBottom: "12px", color: "#5b5b65", fontSize: "14px" }}>
                      {reviewMessage}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="btn-register-event"
                    disabled={isSubmittingReview}
                    style={{ width: "100%", marginTop: "8px" }}
                  >
                    {isSubmittingReview ? "Đang gửi..." : "Gửi đánh giá"}
                  </button>
                </form>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}

export default EventDetail;
