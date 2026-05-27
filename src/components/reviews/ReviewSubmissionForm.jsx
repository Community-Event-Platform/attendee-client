import { useState } from "react";
import { submitReview } from "../../services/api";
import "../reviews/ReviewSubmissionForm.css";

function ReviewSubmissionForm({ eventId, addToast, onReviewSubmitted }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [charCount, setCharCount] = useState(0);

  const maxCharacters = 300;

  const handleRatingClick = (value) => {
    setRating(value);
  };

  const handleCommentChange = (e) => {
    const text = e.target.value;
    if (text.length <= maxCharacters) {
      setComment(text);
      setCharCount(text.length);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (rating === 0) {
      if (addToast) addToast("Please select a rating", "error");
      return;
    }

    if (comment.trim().length === 0) {
      if (addToast) addToast("Please write a comment", "error");
      return;
    }

    setIsSubmitting(true);

    try {
      await submitReview(eventId, rating, comment);
      if (addToast) addToast("Review submitted successfully!", "success");

      // Reset form
      setRating(0);
      setComment("");
      setCharCount(0);

      // Callback to parent to refresh reviews
      if (onReviewSubmitted) {
        onReviewSubmitted();
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to submit review";
      if (addToast) addToast(errorMessage, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="review-submission-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="form-label">Your Rating</label>
        <div className="rating-selector">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              className={`star-button ${star <= (hoverRating || rating) ? "active" : ""}`}
              onClick={() => handleRatingClick(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              title={`Rate ${star} star${star !== 1 ? "s" : ""}`}
            >
              <i className="bi bi-star-fill"></i>
            </button>
          ))}
          {rating > 0 && <span className="rating-text">{rating} out of 5</span>}
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Your Comment</label>
        <textarea
          className="form-textarea"
          value={comment}
          onChange={handleCommentChange}
          placeholder="Share your experience with this event..."
          rows="5"
          disabled={isSubmitting}
        />
        <div className="char-counter">
          <span className={charCount > maxCharacters * 0.9 ? "warning" : ""}>
            {charCount} / {maxCharacters}
          </span>
        </div>
      </div>

      <button
        type="submit"
        className="btn-submit-review"
        disabled={isSubmitting || rating === 0 || comment.trim().length === 0}
      >
        {isSubmitting ? (
          <>
            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            Submitting...
          </>
        ) : (
          "Submit Review"
        )}
      </button>
    </form>
  );
}

export default ReviewSubmissionForm;
