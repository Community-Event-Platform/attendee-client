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
              <a href="#" className="text-dark text-decoration-none">
                Home
              </a>
            </li>

            <li>
              <a href="#" className="text-dark text-decoration-none">
                Event
              </a>
            </li>

            <li>
              <a href="#" className="text-dark text-decoration-none">
                About
              </a>
            </li>

            <li>
              <a href="#" className="text-dark text-decoration-none">
                Contact
              </a>
            </li>

          </ul>
        </nav>

        {/* Button */}
        <div>
          <button className="btn btn-outline-primary me-2">
            Login
          </button>

          <button className="btn btn-outline-primary me-2">
            Register
          </button>
        </div>

      </div>
    </header>
  );
}

export default Header;