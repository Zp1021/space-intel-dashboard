import "../App.css";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function NavBar() {
  const [openDropdown, setOpenDropdown] = useState(false);

  return (
    <nav className="navbar">
      <Link to="/" className="home">
        Home
      </Link>

      <ul className="nav-links">
        {/* Dropdown menu: opens on click, tap or keyboard; closes when the mouse leaves */}
        <li
          className="dropdown"
          onMouseLeave={() => setOpenDropdown(false)}
        >
          <button
            className="dropdown-btn"
            aria-expanded={openDropdown}
            onClick={() => setOpenDropdown(open => !open)}
          >
            Pages ▼
          </button>

          {openDropdown && (
            <ul className="dropdown-menu">
              <li>
                <Link to="/dashboard" onClick={() => setOpenDropdown(false)}>Dashboard</Link>
              </li>
              <li>
                <Link to="/watchlist" onClick={() => setOpenDropdown(false)}>Watchlist</Link>
              </li>
            </ul>
          )}
        </li>
      </ul>
    </nav>
  );
}
