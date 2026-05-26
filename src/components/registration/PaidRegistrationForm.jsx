import { useState } from "react";
import "./RegistrationForm.css";

function PaidRegistrationForm({ event, onClose, addToast }) {
  const [formData, setFormData] = useState({
    quantity: 1,
    paymentMethod: "credit_card",
  });
  const [loading, setLoading] = useState(false);

  const ticketPrice = event.price || 0;
  const totalAmount = ticketPrice * formData.quantity;

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
      if (addToast) addToast("Please select at least one ticket", "error");
      return;
    }

    setLoading(true);
    try {
      // In production, you would redirect to a payment gateway
      console.log("Proceeding to payment:", {
        eventId: event.id,
        quantity: formData.quantity,
        amount: totalAmount,
        paymentMethod: formData.paymentMethod,
      });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (addToast) addToast("Proceeding to payment...", "success");
      // In a real app, you would redirect to a payment gateway here
      onClose();
    } catch (error) {
      console.error("Payment error:", error);
      if (addToast) addToast("Failed to proceed with payment", "error");
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
            {/* Left Column: Ticket Selection */}
            <div className="paid-left-col">
              <div className="event-info-banner">
                <h3>{event.name}</h3>
                <p className="event-type-badge paid-badge">${ticketPrice.toFixed(2)}</p>
              </div>

              <div className="ticket-selection-section">
                <h4 className="section-title">Select Tickets</h4>
                <div className="ticket-option">
                  <div className="ticket-info">
                    <h5>Standard Pass</h5>
                    <p className="ticket-price">${ticketPrice.toFixed(2)}</p>
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

              {/* Payment Method */}
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

            {/* Right Column: Order Summary */}
            <div className="paid-right-col">
              <div className="order-summary">
                <h4 className="summary-title">Order Summary</h4>

                <div className="summary-item">
                  <span className="summary-label">Standard Pass</span>
                  <span className="summary-value">${ticketPrice.toFixed(2)}</span>
                </div>

                <div className="summary-item">
                  <span className="summary-label">Quantity</span>
                  <span className="summary-value">× {formData.quantity}</span>
                </div>

                <div className="summary-divider"></div>

                <div className="summary-item subtotal">
                  <span className="summary-label">Subtotal</span>
                  <span className="summary-value">${(ticketPrice * formData.quantity).toFixed(2)}</span>
                </div>

                <div className="summary-item fee">
                  <span className="summary-label">Fees & Taxes</span>
                  <span className="summary-value">${(totalAmount * 0.1).toFixed(2)}</span>
                </div>

                <div className="summary-divider"></div>

                <div className="summary-item total">
                  <span className="summary-label">Total Amount</span>
                  <span className="summary-value">${(totalAmount * 1.1).toFixed(2)}</span>
                </div>

                {/* Benefits */}
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

                {/* Submit Button */}
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
