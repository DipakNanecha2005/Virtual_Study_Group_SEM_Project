import React from "react";
import "./Navbar.css"; // Import the CSS file

const Navbar = () => {
  const navbarHeight = 70; // Adjust if needed

  return (
    <>
      <nav className="navbar">
        <div className="navbar__brand">Virtual Study Group</div>
        <ul className="navbar__menu">
          <li><a href="#">Home</a></li>
          <li><a href="#">Materials</a></li>
          <li><a href="#">Join Group</a></li>
          <li><a href="#">Contact</a></li>
        </ul>
      </nav>

      {/* Spacer to prevent content overlap */}
      <div style={{ height: `${navbarHeight}px` }}></div>
    </>
  );
};

export default Navbar;
