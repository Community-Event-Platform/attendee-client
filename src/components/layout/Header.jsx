import { Link } from "react-router-dom";

function Header() {
  return (
    <header className="bg-light border-bottom">

      <div className="container d-flex justify-content-between align-items-center py-3">

        {/* Logo */}
        <h2 className="text-primary fw-bold">
          EventHub
        </h2>

        {/* Navbar */}
        <nav>
          <ul className="d-flex gap-4 list-unstyled m-0">

            <li>
              <Link to="/" className="text-dark text-decoration-none">
                Home
              </Link>
            </li>

            <li>
              <Link to="/events" className="text-dark text-decoration-none">
                Event
              </Link>
            </li>

            <li>
              <Link to="/about" className="text-dark text-decoration-none">
                About
              </Link>
            </li>

            <li>
              <Link to="/contact" className="text-dark text-decoration-none">
                Contact
              </Link>
            </li>

          </ul>
        </nav>

        {/* Button */}
        <div>
          <Link to="/login" className="btn btn-outline-primary me-2">
            Login
          </Link>

          <Link to="/register" className="btn btn-outline-primary me-2">
            Register
          </Link>
        </div>

      </div>
    </header>
  );
}

export default Header;