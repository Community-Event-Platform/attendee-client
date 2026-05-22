import contactImage from "../assets/contact.png";
import "./style.css/Contact.css";

function Contact() {
  const contactItems = [
    {
      icon: "bi-telephone",
      title: "Phone",
      lines: ["(+84) 123 456 789", "Mon - Sat: 8:00 AM - 7:00 PM"],
      tone: "purple",
    },
    {
      icon: "bi-envelope",
      title: "Email",
      lines: ["support@eventhub.com", "We will respond within 24 hours"],
      tone: "blue",
    },
    {
      icon: "bi-geo-alt",
      title: "Address",
      lines: ["123 Event Street, District 1,", "Ho Chi Minh City, Viet Nam"],
      tone: "orange",
    },
    {
      icon: "bi-clock",
      title: "Business Hours",
      lines: ["Mon - Sat: 8:00 AM - 6:00 PM", "Sunday: 9:00 AM - 3:00 PM"],
      tone: "yellow",
    },
  ];

  return (
    <main className="contact-page">
      <section className="contact-hero">
        <div className="container-fluid px-4 px-lg-5">
          <div className="row align-items-center g-4">
            <div className="col-lg-7">
              <h1>
                Contact us
              </h1>
              <p>
                We are always ready to listen and support you. Reach out to
                EventHub through any of the channels below.
              </p>
            </div>
            <div className="col-lg-5">
              <img
                src={contactImage}
                alt="EventHub support team"
                className="contact-hero-image"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="contact-section">
        <div className="container-fluid px-4 px-lg-5">
          <div className="row g-5">
            <div className="col-lg-5">
              <h2>Contact Information</h2>

              <div className="contact-list">
                {contactItems.map((item) => (
                  <article className="contact-item" key={item.title}>
                    <div className={`contact-icon contact-icon-${item.tone}`}>
                      <i className={`bi ${item.icon}`}></i>
                    </div>
                    <div>
                      <h3>{item.title}</h3>
                      {item.lines.map((line) => (
                        <p key={line}>{line}</p>
                      ))}
                    </div>
                  </article>
                ))}
              </div>

              <div className="contact-social-panel">
                <h3>Connect with us</h3>
                <div className="contact-social-row">
                  <a href="#" aria-label="Facebook">
                    <i className="bi bi-facebook"></i>
                  </a>
                  <a href="#" aria-label="Instagram">
                    <i className="bi bi-instagram"></i>
                  </a>
                  <a href="#" aria-label="YouTube">
                    <i className="bi bi-youtube"></i>
                  </a>
                  <a href="#" aria-label="LinkedIn">
                    <i className="bi bi-linkedin"></i>
                  </a>
                </div>
              </div>
            </div>

            <div className="col-lg-7">
              <form className="contact-form">
                <h2>Send us a message</h2>

                <label>
                  Full name
                  <input type="text" placeholder="Enter your full name ..." />
                </label>

                <label>
                  Email
                  <input type="email" placeholder="Enter your email ..." />
                </label>

                <label>
                  Subject
                  <select defaultValue="">
                    <option value="" disabled>
                      Select a subject
                    </option>
                    <option>Account support</option>
                    <option>Event feedback</option>
                    <option>Partner with EventHub</option>
                  </select>
                </label>

                <label>
                  Message
                  <textarea placeholder="Enter your message ..." />
                </label>

                <button type="button">
                  <i className="bi bi-send-fill"></i>
                  Send message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Contact;
