import { useState } from "react";
import "./RegistrationForm.css";
import { registerFreeEvent } from "../../services/api";

function FreeRegistrationForm({ event, onClose, addToast = null, onSuccess = null }) {
  const [formData, setFormData] = useState({
    motivation: "",
    idCard: null,
  });
  const [additionalInfo, setAdditionalInfo] = useState({});
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Parse custom_form_spec if event has requirement form
  const customFormSpec = event.custom_form_spec 
    ? (typeof event.custom_form_spec === 'string' 
        ? JSON.parse(event.custom_form_spec) 
        : event.custom_form_spec)
    : null;
  const questions = customFormSpec?.questions || [];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAdditionalInfoChange = (index, value) => {
    setAdditionalInfo((prev) => ({
      ...prev,
      [`additional_info_${index}`]: value,
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

  // AC2: Validate required fields
  const validateForm = () => {
    const newErrors = {};

    // Check motivation
    if (!formData.motivation.trim()) {
      newErrors.motivation = "Please tell us why you want to attend";
    }

    // Check ID card
    if (!formData.idCard) {
      newErrors.idCard = "Please upload your ID card";
    }

    // Check required fields from custom form
    if (event.require_additional_info && questions.length > 0) {
      questions.forEach((q, index) => {
        if (q.is_required && !additionalInfo[`additional_info_${index}`]?.trim()) {
          newErrors[`additional_info_${index}`] = `Vui lòng trả lời: ${q.question}`;
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // AC2: Validate required fields before submitting
    if (!validateForm()) {
      console.warn("Form validation failed", errors);
      const errorMsg = "Vui lòng điền đầy đủ thông tin bắt buộc";
      if (addToast) {
        addToast(errorMsg, "error");
      } else {
        alert(errorMsg);
      }
      return;
    }

    setLoading(true);
    try {
      // Prepare additional info data
      const additionalInfoData = {};
      questions.forEach((q, index) => {
        const fieldName = `additional_info_${index}`;
        if (additionalInfo[fieldName]) {
          additionalInfoData[fieldName] = additionalInfo[fieldName];
        }
      });

      console.log("Submitting registration with data:", additionalInfoData);
      // Call API
      const response = await registerFreeEvent(event.id, additionalInfoData);
      console.log("Registration response:", response);

      // AC1: Show success message
      console.log("Registration successful, closing modal...");

      // Close modal first
      onClose();

      // Call success callback to show toast in parent
      if (onSuccess) {
        setTimeout(() => {
          onSuccess();
        }, 100);
      }
    } catch (error) {
      console.error("Registration error:", error);
      if (error.response?.status === 401) {
        // Not authenticated
        const errorMsg = "Vui lòng đăng nhập để đăng ký sự kiện";
        if (addToast) {
          addToast(errorMsg, "error");
        } else {
          alert(errorMsg);
        }
      } else if (error.response?.status === 409) {
        // AC3: Duplicate registration - close modal and show message
        const errorMsg = error.response.data?.message || "Bạn đã đăng ký sự kiện này";
        console.log("Duplicate registration - showing error:", errorMsg);
        if (addToast) {
          addToast(errorMsg, "error");
        } else {
          console.error("addToast is not defined!");
          alert(errorMsg);  // Fallback
        }
        // Close modal after showing error
        setTimeout(() => {
          onClose();
        }, 2000);
      } else if (error.response?.data?.errors) {
        // Validation errors
        setErrors(error.response.data.errors);
        console.log("Validation errors:", error.response.data.errors);
        const errorMsg = "Vui lòng điền đầy đủ thông tin";
        if (addToast) {
          addToast(errorMsg, "error");
        } else {
          alert(errorMsg);  // Fallback
        }
      } else {
        const errorMsg = error.response?.data?.message || "Failed to submit registration";
        console.log("Error message:", errorMsg);
        if (addToast) {
          addToast(errorMsg, "error");
        } else {
          alert(errorMsg);  // Fallback
        }
      }
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
                  className={`form-control ${errors.motivation ? 'is-invalid' : ''}`}
                  placeholder="Tell us about your interest in this event..."
                  rows="4"
                  value={formData.motivation}
                  onChange={handleInputChange}
                ></textarea>
                {errors.motivation && <div className="invalid-feedback d-block">{errors.motivation}</div>}
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
                  <label htmlFor="idCard" className={`file-upload-label ${errors.idCard ? 'is-invalid' : ''}`}>
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
                {errors.idCard && <div className="invalid-feedback d-block">{errors.idCard}</div>}
              </div>

              {/* Dynamic Additional Fields from custom_form_spec */}
              {event.require_additional_info && questions.length > 0 && questions.map((question, index) => (
                <div className="form-group" key={index}>
                  <label htmlFor={`additional_info_${index}`} className="form-label">
                    {question.question} {question.is_required && <span className="required">*</span>}
                  </label>
                  {question.type === 'textarea' ? (
                    <textarea
                      id={`additional_info_${index}`}
                      className={`form-control ${errors[`additional_info_${index}`] ? 'is-invalid' : ''}`}
                      rows="3"
                      value={additionalInfo[`additional_info_${index}`] || ''}
                      onChange={(e) => handleAdditionalInfoChange(index, e.target.value)}
                    ></textarea>
                  ) : (
                    <input
                      type={question.type || 'text'}
                      id={`additional_info_${index}`}
                      className={`form-control ${errors[`additional_info_${index}`] ? 'is-invalid' : ''}`}
                      value={additionalInfo[`additional_info_${index}`] || ''}
                      onChange={(e) => handleAdditionalInfoChange(index, e.target.value)}
                    />
                  )}
                  {errors[`additional_info_${index}`] && (
                    <div className="invalid-feedback d-block">{errors[`additional_info_${index}`]}</div>
                  )}
                </div>
              ))}

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
