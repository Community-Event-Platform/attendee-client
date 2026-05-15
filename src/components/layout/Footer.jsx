import "../../styles/footer.css";
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
              Nền tảng kết nối và quản lý sự kiện hàng đầu Việt Nam. 
              Mang đến trải nghiệm tuyệt vời cho cả ban tổ chức và người tham dự.
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
            <h5 className="fw-bold mb-3">Khám phá</h5>
            <ul className="list-unstyled footer-list text-muted small">
              <li className="mb-2">Sự kiện âm nhạc</li>
              <li className="mb-2">Hội thảo công nghệ</li>
              <li className="mb-2">Giải chạy Marathon</li>
              <li className="mb-2">Triển lãm nghệ thuật</li>
            </ul>
          </div>

          {/* Cột 3: Hỗ trợ */}
          <div className="col-md-3 mb-4">
            <h5 className="fw-bold mb-3">Hỗ Trợ</h5>
            <ul className="list-unstyled footer-list text-muted small">
              <li className="mb-2">Trung tâm trợ giúp</li>
              <li className="mb-2">Điều khoản dịch vụ</li>
              <li className="mb-2">Chính sách bảo mật</li>
              <li className="mb-2">Quy định hoàn tiền</li>
            </ul>
          </div>

          {/* Cột 4: Bản tin & Liên hệ */}
          <div className="col-md-3 mb-4">
            <h5 className="fw-bold mb-3">Bản tin & Liên hệ</h5>
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
