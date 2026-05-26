import { useState } from "react";
import "./RegistrationForm.css";
import { registerPaidEvent } from "../../services/api";

function PaidRegistrationForm({ event, onClose, addToast = null, onSuccess = null }) {
  const [formData, setFormData] = useState({
    quantity: 1,
    paymentMethod: "credit_card",
  });
  const [loading, setLoading] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

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
      console.log("Submitting paid registration with:", formData);
      const response = await registerPaidEvent(event.id, formData.quantity, formData.paymentMethod);
      console.log("Paid registration response:", response);

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
        const errorMsg = "Vui lòng đăng nhập để đăng ký sự kiện";
        if (addToast) {
          addToast(errorMsg, "error");
        } else {
          alert(errorMsg);
        }
      } else if (error.response?.status === 409) {
        const errorMsg = error.response.data?.message || "Bạn đã đăng ký sự kiện này";
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
