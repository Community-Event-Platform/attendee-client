import "./Footer.css";
import logoIcon from "../../assets/iconhomepage.png";

function Footer() {
  return (
    <footer className="footer py-5" style={{ backgroundColor: "#e1f0ff" }}>
      <div className="container-fluid px-4 px-lg-5">
        <div className="row">

          {/* Cột 1: Logo + Description + Social Icons */}
          <div className="col-md-3 mb-4">
            <div className="d-flex align-items-center mb-3">
              <img 
                src={logoIcon} 
                alt="EventHub Logo" 
                style={{ width: '30px', height: '30px', objectFit: 'contain', marginRight: '10px' }} 
              />
              <h4 className="fw-bold mb-0" style={{ color: "#000" }}>
                EventHub
              </h4>
            </div>

            <p className="text-muted small mb-4">
              Leading event connection and management platform in Vietnam.
              Bringing great experiences to both organizers and attendees.
            </p>

            <div className="d-flex gap-3 social-icons">
              <i className="bi bi-facebook fs-4" style={{ color: "#3b5998" }}></i>
              <i className="bi bi-twitter-x fs-4" style={{ color: "#111827" }}></i>
              <i className="bi bi-instagram fs-4" style={{ color: "#E1306C" }}></i>
              <i className="bi bi-youtube fs-4" style={{ color: "#FF0000" }}></i>
            </div>
          </div>

          {/* Cột 2: Khám phá */}
          <div className="col-md-3 mb-4 ps-md-5">
            <h5 className="fw-bold mb-3">Explore</h5>
            <ul className="list-unstyled footer-list text-muted small">
              <li className="mb-2">Music Events</li>
              <li className="mb-2">Tech Conferences</li>
              <li className="mb-2">Marathon</li>
              <li className="mb-2">Art Exhibitions</li>
            </ul>
          </div>

          {/* Cột 3: Hỗ trợ */}
          <div className="col-md-3 mb-4">
            <h5 className="fw-bold mb-3">Support</h5>
            <ul className="list-unstyled footer-list text-muted small">
              <li className="mb-2">Help Center</li>
              <li className="mb-2">Terms of Service</li>
              <li className="mb-2">Privacy Policy</li>
              <li className="mb-2">Refund Policy</li>
            </ul>
          </div>

          {/* Cột 4: Bản tin & Liên hệ */}
          <div className="col-md-3 mb-4">
            <h5 className="fw-bold mb-3">Newsletter & Contact</h5>
            <ul className="list-unstyled text-muted small">
              <li className="mb-3 d-flex align-items-center">
                <i className="bi bi-envelope-fill me-2 text-primary"></i>
                Email: support@eventhub.com
              </li>
              <li className="mb-3 d-flex align-items-center">
                <i className="bi bi-telephone-fill me-2 text-primary"></i>
                Phone: +84 999 999 999
              </li>
              <li className="d-flex align-items-center">
                <i className="bi bi-geo-alt-fill me-2 text-primary"></i>
                Da Nang, Viet Nam
              </li>
            </ul>
          </div>

        </div>
      </div>
    </footer>
  );
}

export default Footer;
