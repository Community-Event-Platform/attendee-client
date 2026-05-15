import "../../styles/footer.css";

function Footer() {
  return (
    <footer className="footer">

      <div className="container-fluid">

        <div className="row">

          {/* Logo + Description */}
          <div className="col-md-4 mb-4">
            <h2 className="footer-logo">
              EventHub
            </h2>

            <p className="footer-text">
              Nền tảng kết nối và quản lý sự kiện hiện đại,
              giúp bạn khám phá các sự kiện nổi bật
              và tham gia cộng đồng năng động.
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-md-2 mb-4">
            <h5 className="footer-title">
              Khám phá
            </h5>

            <ul className="footer-list">
              <li>Sự kiện âm nhạc</li>
              <li>Hội thảo công nghệ</li>
              <li>Giải chạy Marathon</li>
              <li>Triển lãm tranh</li>
            </ul>
          </div>

          {/* Categories */}
          <div className="col-md-3 mb-4">
            <h5 className="footer-title">
              Hỗ trợ
            </h5>

            <ul className="footer-list">
              <li>Trung tâm trợ giúp</li>
              <li>Điều khoản dịch vụ</li>
              <li>Chính sách bảo mật</li>
              <li>Quy định hoàn tiền</li>
            </ul>
          </div>

          {/* Contact */}
          <div className="col-md-3 mb-4">
            <h5 className="footer-title">
              Bản tin & Liên hệ
            </h5>

            <ul className="footer-list">
              <li>Email: support@eventhub.com</li>
              <li>Phone: +84 999 999 999</li>
              <li>Da Nang, Viet Nam</li>
            </ul>
          </div>

        </div>

        {/* Bottom */}
        <div className="footer-bottom">
          © 2026 EventHub. All rights reserved.
        </div>

      </div>
    </footer>
  );
}

export default Footer;