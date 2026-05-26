import { useState } from "react";
import "./RegistrationForm.css";

function FreeRegistrationForm({ event, onClose, addToast }) {
  const [formData, setFormData] = useState({
    motivation: "",
    idCard: null,
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Kiểm tra loại file
      const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
      if (!allowedTypes.includes(file.type)) {
        if (addToast) addToast("Please upload a valid image file (JPG, PNG, or GIF)", "error");
        return;
      }

      // Kiểm tra kích thước file (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        if (addToast) addToast("File size must be less than 5MB", "error");
        return;
      }

      setFormData((prev) => ({
        ...prev,
        idCard: file,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.motivation.trim()) {
      if (addToast) addToast("Please tell us why you want to attend", "error");
      return;
    }

    if (!formData.idCard) {
      if (addToast) addToast("Please upload your ID card", "error");
      return;
    }

    setLoading(true);
    try {
      // In production, you would send this to your API
      console.log("Submitting free event registration:", {
        eventId: event.id,
        motivation: formData.motivation,
        idCard: formData.idCard,
      });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (addToast) addToast("Registration submitted successfully!", "success");
      onClose();
    } catch (error) {
      console.error("Registration error:", error);
      if (addToast) addToast("Failed to submit registration", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Register for Free Event</h2>
          <button className="modal-close-btn" onClick={onClose}>
            <i className="bi bi-x"></i>
          </button>
        </div>

        <div className="modal-body">
          <div className="registration-form-container">
            <div className="event-info-banner">
              <h3>{event.name}</h3>
              <p className="event-type-badge free-badge">FREE</p>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Motivation Field */}
              <div className="form-group">
                <label htmlFor="motivation" className="form-label">
                  Why do you want to attend? <span className="required">*</span>
                </label>
                <textarea
                  id="motivation"
                  name="motivation"
                  className="form-control"
                  placeholder="Tell us about your interest in this event..."
                  rows="4"
                  value={formData.motivation}
                  onChange={handleInputChange}
                ></textarea>
              </div>

              {/* File Upload Field */}
              <div className="form-group">
                <label htmlFor="idCard" className="form-label">
                  Upload ID Card <span className="required">*</span>
                </label>
                <div className="file-upload-container">
                  <input
                    type="file"
                    id="idCard"
                    name="idCard"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="file-input"
                  />
                  <label htmlFor="idCard" className="file-upload-label">
                    <div className="file-upload-icon">
                      <i className="bi bi-cloud-arrow-up"></i>
                    </div>
                    <div className="file-upload-text">
                      {formData.idCard ? (
                        <>
                          <p className="file-name">{formData.idCard.name}</p>
                          <p className="file-size">({(formData.idCard.size / 1024).toFixed(2)} KB)</p>
                        </>
                      ) : (
                        <>
                          <p>Click or drag to upload</p>
                          <p className="file-hint">JPG, PNG or GIF (max 5MB)</p>
                        </>
                      )}
                    </div>
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="btn-submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Submitting...
                  </>
                ) : (
                  "Submit Registration Request"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FreeRegistrationForm;
