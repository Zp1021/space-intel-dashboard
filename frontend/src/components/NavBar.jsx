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
        {/* Dropdown Menu */}
        <li
          className="dropdown"
          onMouseEnter={() => setOpenDropdown(true)}
          onMouseLeave={() => setOpenDropdown(false)}
        >
          <button className="dropdown-btn">Pages ▼</button>

          {openDropdown && (
            <ul className="dropdown-menu">
              <li>
                <Link to="/dashboard">Dashboard</Link>
              </li>
              <li>
                <Link to="/launchdetail">Details</Link>
              </li>
              <li>
                <Link to="/briefnotes">BriefNotes</Link>
              </li>
            </ul>
          )}
        </li>
      </ul>
    </nav>
  );
}