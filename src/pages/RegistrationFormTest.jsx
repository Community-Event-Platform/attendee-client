import { useState } from "react";
import FreeRegistrationForm from "../components/registration/FreeRegistrationForm";
import PaidRegistrationForm from "../components/registration/PaidRegistrationForm";

function RegistrationFormTest() {
  const [formType, setFormType] = useState("free");

  const mockFreeEvent = {
    id: 1,
    name: "Free Web Development Workshop",
    price: 0,
    category: { name: "Technology" },
    location: "Downtown Tech Center",
    date_time: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  };

  const mockPaidEvent = {
    id: 2,
    name: "Premium Music Festival",
    price: 45.99,
    category: { name: "Music" },
    location: "Central Park",
    date_time: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
  };

  const handleClose = () => {
    alert("Modal closed!");
  };

  return (
    <div style={{ padding: "20px", backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      <h1>Registration Form Layout Test</h1>
      
      <div style={{ marginBottom: "30px" }}>
        <button
          onClick={() => setFormType("free")}
          style={{
            padding: "10px 20px",
            marginRight: "10px",
            backgroundColor: formType === "free" ? "#14ae5c" : "#ccc",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Test Free Registration
        </button>
        
        <button
          onClick={() => setFormType("paid")}
          style={{
            padding: "10px 20px",
            backgroundColor: formType === "paid" ? "#14ae5c" : "#ccc",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Test Paid Registration
        </button>
      </div>

      <p style={{ color: "#666", marginBottom: "20px" }}>
        Test responsive layout by resizing the browser window. Check padding/margins on all screen sizes.
      </p>

      {formType === "free" ? (
        <FreeRegistrationForm
          event={mockFreeEvent}
          onClose={handleClose}
          addToast={() => {}}
        />
      ) : (
        <PaidRegistrationForm
          event={mockPaidEvent}
          onClose={handleClose}
          addToast={() => {}}
        />
      )}
    </div>
  );
}

export default RegistrationFormTest;
