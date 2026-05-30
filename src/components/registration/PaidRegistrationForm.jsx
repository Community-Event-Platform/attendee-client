import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import "./RegistrationForm.css";
import { registerPaidEvent } from "../../services/api";

function PaidRegistrationForm({ event, onClose, addToast = null, onSuccess = null }) {
  const [formData, setFormData] = useState({
    quantity: 1,
    paymentMethod: "credit_card",
  });
  const [additionalInfo, setAdditionalInfo] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
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
      };
    }).filter((item) => item.question);
  };

  const questions = parseCustomFormSpec(event.custom_form_spec);

  const ticketPrice = event.price || 0;
  const feesAndTaxes = event.fees_and_taxes || 0;

  const handleQuantityChange = (change) => {
    const newQuantity = formData.quantity + change;
    if (newQuantity >= 1 && newQuantity <= event.remaining_seats) {
      setFormData((prev) => ({
        ...prev,
        quantity: newQuantity,
      }));
    }
  };

  const handlePaymentMethodChange = (method) => {
    setFormData((prev) => ({
      ...prev,
      paymentMethod: method,
    }));
  };

  const handleAdditionalInfoChange = (index, value) => {
    setAdditionalInfo((prev) => ({
      ...prev,
      [`additional_info_${index}`]: value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (formData.quantity <= 0) {
      newErrors.quantity = 'Please select at least one ticket';
    }

    if (event.require_additional_info && questions.length > 0) {
      questions.forEach((q, index) => {
        const value = additionalInfo[`additional_info_${index}`];
        if (!q.is_required) return;

        if (q.type === 'checkbox') {
          if (value !== true && value !== 'yes' && value !== 'no') {
            newErrors[`additional_info_${index}`] = `Please answer: ${q.question}`;
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

    if (!validateForm()) {
      const errorMsg = "Please complete all required fields";
      if (addToast) {
        addToast(errorMsg, "error");
      } else {
        alert(errorMsg);
      }
      return;
    }

    if (formData.quantity <= 0) {
      const errorMsg = "Please select at least one ticket";
      if (addToast) {
        addToast(errorMsg, "error");
      } else {
        alert(errorMsg);
      }
      return;
    }

    setLoading(true);
    
    try {
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

      console.log("Submitting paid registration with:", { ...formData, additionalInfoData });
      const response = await registerPaidEvent(event.id, formData.quantity, formData.paymentMethod, additionalInfoData);
      console.log("Paid registration response:", response);

      // If backend returns payment_url, redirect to payment gateway
      if (response.data?.payment_url) {
        window.location.href = response.data.payment_url;
        return;
      }

      console.log("Paid registration successful, closing modal...");
      onClose();

      if (onSuccess) {
        setTimeout(() => {
          onSuccess();
        }, 100);
      }
    } catch (error) {
      console.error("Payment error:", error);
      if (error.response?.status === 401) {
        const errorMsg = "Please log in to register for the event";
        if (addToast) {
          addToast(errorMsg, "error");
        } else {
          alert(errorMsg);
        }
      } else if (error.response?.status === 409) {
        const errorMsg = error.response.data?.message || "You have already registered for this event";
        console.log("Duplicate registration - showing error:", errorMsg);
        if (addToast) {
          addToast(errorMsg, "error");
        } else {
          alert(errorMsg);
        }
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        const errorMsg = error.response?.data?.message || "Failed to proceed with payment";
        console.log("Error message:", errorMsg);
        if (addToast) {
          addToast(errorMsg, "error");
        } else {
          alert(errorMsg);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Register for Paid Event</h2>
          <button className="modal-close-btn" onClick={onClose}>
            <i className="bi bi-x"></i>
          </button>
        </div>

        <div className="modal-body">
          <div className="paid-registration-container">
            <div className="paid-left-col">
              <div className="event-info-banner">
                <h3>{event.name}</h3>
                <p className="event-type-badge paid-badge">{new Intl.NumberFormat('en-US').format(ticketPrice)} VND</p>
              </div>

              <div className="ticket-selection-section">
                <h4 className="section-title">Select Tickets</h4>
                <div className="ticket-option">
                  <div className="ticket-info">
                    <h5>Standard Pass </h5>
                    <p className="ticket-price">{new Intl.NumberFormat('en-US').format(ticketPrice)} VND</p>
                    <p className="ticket-description">Full access to the event</p>
                  </div>
                  <div className="quantity-selector">
                    <button
                      type="button"
                      className="qty-btn"
                      onClick={() => handleQuantityChange(-1)}
                      disabled={formData.quantity <= 1}
                    >
                      <i className="bi bi-dash"></i>
                    </button>
                    <input
                      type="number"
                      className="qty-input"
                      value={formData.quantity}
                      readOnly
                    />
                    <button
                      type="button"
                      className="qty-btn"
                      onClick={() => handleQuantityChange(1)}
                      disabled={formData.quantity >= event.remaining_seats}
                    >
                      <i className="bi bi-plus"></i>
                    </button>
                  </div>
                </div>
              </div>

              <div className="payment-method-section">
                <h4 className="section-title">Payment Method</h4>
                <div className="payment-options">
                  <button
                    type="button"
                    className={`payment-option ${
                      formData.paymentMethod === "credit_card" ? "active" : ""
                    }`}
                    onClick={() => handlePaymentMethodChange("credit_card")}
                  >
                    <i className="bi bi-credit-card"></i>
                    <span>Credit Card</span>
                  </button>
                  <button
                    type="button"
                    className={`payment-option ${
                      formData.paymentMethod === "paypal" ? "active" : ""
                    }`}
                    onClick={() => handlePaymentMethodChange("paypal")}
                  >
                    <i className="bi bi-paypal"></i>
                    <span>PayPal</span>
                  </button>
                </div>
              </div>

              {event.require_additional_info && questions.length > 0 && (
                <div className="custom-additional-fields">
                  <h4 className="section-title">Additional Information</h4>
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
                </div>
              )}
            </div>

            <div className="paid-right-col">
              <div className="order-summary">
                <h4 className="summary-title">Order Summary</h4>

                <div className="summary-item">
                  <span className="summary-label">Standard Pass </span>
                  <span className="summary-value">{new Intl.NumberFormat('en-US').format(ticketPrice)} VND</span>
                </div>

                <div className="summary-item">
                  <span className="summary-label">Quantity</span>
                  <span className="summary-value">× {formData.quantity}</span>
                </div>

                <div className="summary-divider"></div>

                <div className="summary-item subtotal">
                  <span className="summary-label">Subtotal </span>
                  <span className="summary-value">{new Intl.NumberFormat('en-US').format(ticketPrice * formData.quantity)} VND</span>
                </div>

                <div className="summary-item fee">
                  <span className="summary-label">Fees & Taxes </span>
                  <span className="summary-value">{new Intl.NumberFormat('en-US').format(feesAndTaxes)} VND</span>
                </div>

                <div className="summary-divider"></div>

                <div className="summary-item total">
                  <span className="summary-label">Total Amount </span>
                  <span className="summary-value">{new Intl.NumberFormat('en-US').format((ticketPrice * formData.quantity) + feesAndTaxes)} VND</span>
                </div>

                <div className="summary-benefits">
                  <div className="benefit-item">
                    <i className="bi bi-check-circle-fill"></i>
                    <span>Secure Payment</span>
                  </div>
                  <div className="benefit-item">
                    <i className="bi bi-check-circle-fill"></i>
                    <span>Instant Confirmation</span>
                  </div>
                  <div className="benefit-item">
                    <i className="bi bi-check-circle-fill"></i>
                    <span>24/7 Support</span>
                  </div>
                </div>

                <button
                  type="button"
                  className="btn-submit-payment"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Processing...
                    </>
                  ) : (
                    <>
                      <span>Proceed to Payment & Confirm Ticket</span>
                    </>
                  )}
                </button>

                <p className="payment-note">Paid tickets are non-refundable</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaidRegistrationForm;
