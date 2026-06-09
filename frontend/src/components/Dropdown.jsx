import React, { useState, useRef, useEffect } from "react";

export default function DropdownNavbar() {
  const [openMenu, setOpenMenu] = useState(null);
  const menuRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenu(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.logo}>MyApp</div>

      <ul style={styles.navLinks} ref={menuRef}>
        {/* Home */}
        <li style={styles.navItem}>
          <a href="/" style={styles.link}>
            Home
          </a>
        </li>

        {/* Services Dropdown */}
        <li style={styles.navItem}>
          <button
            style={styles.dropdownButton}
            onClick={() => toggleMenu("services")}
          >
            Services ▼
          </button>

          {openMenu === "services" && (
            <ul style={styles.dropdown}>
              <li>
                <a href="/web-design" style={styles.dropdownLink}>
                  Web Design
                </a>
              </li>
              <li>
                <a href="/seo" style={styles.dropdownLink}>
                  SEO
                </a>
              </li>
              <li>
                <a href="/marketing" style={styles.dropdownLink}>
                  Marketing
                </a>
              </li>
            </ul>
          )}
        </li>

        {/* About */}
        <li style={styles.navItem}>
          <a href="/about" style={styles.link}>
            About
          </a>
        </li>

        {/* Account Dropdown */}
        <li style={styles.navItem}>
          <button
            style={styles.dropdownButton}
            onClick={() => toggleMenu("account")}
          >
            Account ▼
          </button>

          {openMenu === "account" && (
            <ul style={styles.dropdown}>
              <li>
                <a href="/profile" style={styles.dropdownLink}>
                  Profile
                </a>
              </li>
              <li>
                <a href="/settings" style={styles.dropdownLink}>
                  Settings
                </a>
              </li>
              <li>
                <a href="/logout" style={styles.dropdownLink}>
                  Logout
                </a>
              </li>
            </ul>
          )}
        </li>
      </ul>
    </nav>
  );
};