import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ isNavOpen, toggleNav }) => {
  const navigate = useNavigate();
  const [showOptions, setShowOptions] = useState({
    admin: false,
    moderator: false,
    subscriber: false,
  });

  // Function to handle click and toggle navbar state
  const handleLinkClick = () => {
    if (isNavOpen) {
      toggleNav();
    }
  };

  // Toggle dropdown visibility
  const toggleDropdown = (category) => {
    setShowOptions((prevOptions) => ({
      ...prevOptions,
      [category]: !prevOptions[category],
    }));
  };

  // Handle navigation and close the dropdown (if applicable)
  const handleLinkClickAndNavigate = (route) => {
    handleLinkClick(); // Optional: Close navbar or perform any action
    navigate(route); // Navigate to the selected route
  };

  // Navigation items (with admin before profile)
  const navItems = [
    { label: "HOME", route: "/" },
    { label: "ABOUT", route: "/about" },
    { label: "MODERATOR", route: "/moderator" },
    { label: "SUBSCRIBER", route: "/subscriber" },
    
    // ADMIN dropdown here before PROFILE
    { label: "ADMIN", route: "/admin", hasDropdown: true },

    { label: "PROFILE", route: "/profile" },
    { label: "SIGN IN", route: "/signin" },
    { label: "SIGN UP", route: "/signup" },
  ];

  return (
    <header className={`navbar ${isNavOpen ? 'open' : ''}`}>
      {/* Static Navigation Items */}
      {navItems.map((item) => (
        <div className="nav-item" key={item.route}>
          {/* If the item has a dropdown, show the dropdown */}
          {item.hasDropdown ? (
            <div>
              <button
                aria-label="Toggle Admin dropdown"
                aria-expanded={showOptions.admin ? 'true' : 'false'}
                onClick={() => toggleDropdown("admin")}
                className="dropdown-toggle"
              >
                {item.label}
              </button>
              {showOptions.admin && (
                <div className="dropdown-menu">
                  <button onClick={() => handleLinkClickAndNavigate("/admin/dashboard")}>
                    Dashboard
                  </button>
                  <button onClick={() => handleLinkClickAndNavigate("/admin/users")}>
                    Manage Users
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div onClick={() => handleLinkClickAndNavigate(item.route)}>
              {item.label}
            </div>
          )}
        </div>
      ))}
    </header>
  );
};

export default Navbar;
