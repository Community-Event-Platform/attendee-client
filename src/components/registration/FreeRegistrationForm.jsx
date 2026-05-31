import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import "./RegistrationForm.css";
import { registerFreeEvent } from "../../services/api";

function FreeRegistrationForm({ event, onClose, addToast = null, onSuccess = null }) {
  const [additionalInfo, setAdditionalInfo] = useState({});
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const parseCustomFormSpec = (spec) => {
    if (!spec) return [];
    const raw = typeof spec === 'string' ? JSON.parse(spec) : spec;
    const fields = Array.isArray(raw) ? raw : raw.questions || [];
    return fields.map((field) => {
      if (typeof field === 'string') {
        return { question: field, type: 'text', is_required: true };
      }
      return {
        question: field.question || field.name || '',
        type: field.type || 'text',
        is_required: field.is_required !== undefined ? field.is_required : true,
        options: field.options || [],
      };
    }).filter((item) => item.question);
  };

  const questions = parseCustomFormSpec(event.custom_form_spec);

  const handleAdditionalInfoChange = (index, value) => {
    setAdditionalInfo((prev) => ({
      ...prev,
      [`additional_info_${index}`]: value,
    }));
  };

  // AC2: Validate required fields
  const validateForm = () => {
    const newErrors = {};

    if (event.require_additional_info && questions.length > 0) {
      questions.forEach((q, index) => {
        const value = additionalInfo[`additional_info_${index}`];
        if (!q.is_required) return;

        if (q.type === 'checkbox') {
          if (q.options && q.options.length > 0) {
            if (!Array.isArray(value) || value.length === 0) {
              newErrors[`additional_info_${index}`] = `Please answer: ${q.question}`;
            }
          } else {
            if (value !== true && value !== 'yes' && value !== 'no') {
              newErrors[`additional_info_${index}`] = `Please answer: ${q.question}`;
            }
          }
        } else {
          if (!value || !String(value).trim()) {
            newErrors[`additional_info_${index}`] = `Please answer: ${q.question}`;
          }
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
      const errorMsg = "Please complete all required fields";
      if (addToast) {
        addToast(errorMsg, 'error');
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
        if (Object.prototype.hasOwnProperty.call(additionalInfo, fieldName)) {
          additionalInfoData[fieldName] = additionalInfo[fieldName];
        }
      });

      const token = localStorage.getItem('token');
      if (!token) {
        const msg = "You need to log in before registering";
        if (addToast) addToast(msg, 'error');
        navigate('/login');
        return;
      }

      console.log("Submitting registration with data:", additionalInfoData);
      // Call API
      const response = await registerFreeEvent(event.id, additionalInfoData);
      console.log("Registration response:", response);

      // AC1: Show success message
      console.log("Registration successful, closing modal...");

      // Close modal first
      onClose();

      // Call success callback to show toast in parent and pass registration data
      if (onSuccess) {
        // response expected shape: { message, data }
        const registration = response?.data ?? response?.data ?? response?.data ?? response?.data;
        // Prefer passing the `data` object if present, otherwise pass whole response
        const payload = response?.data ?? response?.data ?? response ?? null;
        setTimeout(() => {
          onSuccess(payload);
        }, 100);
      }
    } catch (error) {
      if (error.message === 'missing_auth_token') {
        const msg = "Login token not found. Please sign in again";
        if (addToast) addToast(msg, 'error');
        navigate('/login');
        setLoading(false);
        return;
      }
      console.error("Registration error:", error);
      if (error.response?.status === 401) {
        // Not authenticated
        const errorMsg = "Please log in to register for the event";
        if (addToast) {
          addToast(errorMsg, "error");
        } else {
          alert(errorMsg);
        }
      } else if (error.response?.status === 409) {
        // AC3: Duplicate registration - close modal and show message
        const errorMsg = error.response.data?.message || "You have already registered for this event";
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
        const errorMsg = "Please complete all required fields";
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
              {event.require_additional_info && questions.length > 0 ? (
                <>
                  {/* Dynamic Additional Fields from custom_form_spec */}
                  {questions.map((question, index) => (
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
                                      ) : question.type === 'checkbox' ? (
                                      question.options && question.options.length > 0 ? (
                                        <div className="checkbox-options-group">
                                          {question.options.map((opt, optIdx) => (
                                            <div className="form-check" key={optIdx}>
                                              <input
                                                type="checkbox"
                                                id={`additional_info_${index}_opt_${optIdx}`}
                                                name={`additional_info_${index}[]`}
                                                className={`form-check-input ${errors[`additional_info_${index}`] ? 'is-invalid' : ''}`}
                                                value={opt}
                                                checked={Array.isArray(additionalInfo[`additional_info_${index}`]) && additionalInfo[`additional_info_${index}`].includes(opt)}
                                                onChange={(e) => {
                                                  const prev = Array.isArray(additionalInfo[`additional_info_${index}`]) ? [...additionalInfo[`additional_info_${index}`]] : [];
                                                  if (e.target.checked) {
                                                    prev.push(opt);
                                                  } else {
                                                    const idx = prev.indexOf(opt);
                                                    if (idx > -1) prev.splice(idx, 1);
                                                  }
                                                  handleAdditionalInfoChange(index, prev);
                                                }}
                                              />
                                              <label htmlFor={`additional_info_${index}_opt_${optIdx}`} className="form-check-label">
                                                {opt}
                                              </label>
                                            </div>
                                          ))}
                                        </div>
                                      ) : (
                                        <div className="checkbox-yes-no-group">
                                          <div className="form-check form-check-inline">
                                            <input
                                              type="radio"
                                              id={`additional_info_${index}_yes`}
                                              name={`additional_info_${index}`}
                                              className={`form-check-input ${errors[`additional_info_${index}`] ? 'is-invalid' : ''}`}
                                              value="yes"
                                              checked={additionalInfo[`additional_info_${index}`] === 'yes'}
                                              onChange={(e) => handleAdditionalInfoChange(index, e.target.value)}
                                            />
                                            <label htmlFor={`additional_info_${index}_yes`} className="form-check-label">
                                              Yes
                                            </label>
                                          </div>
                                          <div className="form-check form-check-inline">
                                            <input
                                              type="radio"
                                              id={`additional_info_${index}_no`}
                                              name={`additional_info_${index}`}
                                              className={`form-check-input ${errors[`additional_info_${index}`] ? 'is-invalid' : ''}`}
                                              value="no"
                                              checked={additionalInfo[`additional_info_${index}`] === 'no'}
                                              onChange={(e) => handleAdditionalInfoChange(index, e.target.value)}
                                            />
                                            <label htmlFor={`additional_info_${index}_no`} className="form-check-label">
                                              No
                                            </label>
                                          </div>
                                        </div>
                                      )
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
                </>
              ) : (
                <div className="form-group">
                  <p className="no-requirements-text">No additional information is required. Just click register to complete.</p>
                </div>
              )}

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
