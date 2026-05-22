import aboutImage from "../assets/about.png";
import aboutDashboardImage from "../assets/aboutDes.png";
import "./style.css/About.css";

function About() {
  const features = [
    {
      icon: "bi-calendar2-check",
      title: "Create events easily",
      text: "Publish and manage your events in just a few simple steps.",
    },
    {
      icon: "bi-megaphone",
      title: "Promote effectively",
      text: "Reach the right audience with powerful promotion tools.",
    },
    {
      icon: "bi-people",
      title: "Manage attendees",
      text: "Track registrations, check-ins, and attendee engagement.",
    },
    {
      icon: "bi-bar-chart",
      title: "Detailed analytics",
      text: "Reports and insights help you measure event performance.",
    },
    {
      icon: "bi-shield-check",
      title: "Safe and secure",
      text: "Your event information and data are always protected.",
    },
  ];

  return (
    <main className="about-page">
      <section className="about-hero">
        <div className="container-fluid px-4 px-lg-5">
          <div className="row align-items-center g-4">
            <div className="col-lg-7">
              <h1>
                Want to organize <span>an event?</span>
              </h1>
              <p>
                Become an organizer on EventHub to create and manage events
                professionally while reaching thousands of attendees.
              </p>
            </div>
            <div className="col-lg-5">
              <img
                src={aboutImage}
                alt="Organizer managing events on EventHub"
                className="about-hero-image"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="about-section">
        <div className="container-fluid px-4 px-lg-5">
          <div className="row g-5 align-items-center">
            <div className="col-lg-5">
              <div className="organizer-panel">
                <h2>EventHub for Organizers</h2>

                <div className="feature-list">
                  {features.map((feature) => (
                    <article className="feature-item" key={feature.title}>
                      <div className="feature-icon">
                        <i className={`bi ${feature.icon}`}></i>
                      </div>
                      <div>
                        <h3>{feature.title}</h3>
                        <p>{feature.text}</p>
                      </div>
                    </article>
                  ))}
                </div>

                <button
                type="button"
                onClick={() => {
                    window.location.href = "http://localhost:5174/";
                }}
                >
                Become an Organizer
                <i className="bi bi-link-45deg"></i>
                </button>

                <p className="panel-note">
                  <i className="bi bi-shield-check"></i>
                  A trusted platform for thousands of organizers
                </p>
              </div>
            </div>

            <div className="col-lg-7">
              <div className="dashboard-preview">
                <img
                  src={aboutDashboardImage}
                  alt="EventHub event management dashboard"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default About;
