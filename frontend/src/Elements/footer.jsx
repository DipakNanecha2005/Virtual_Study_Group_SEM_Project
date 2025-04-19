import React from "react";
import "./footer.css"; // Link the CSS file

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-left">
        © 2025 <strong>Virtual Study Group</strong> | Learn, Connect & Grow Together
      </div>
      <ul className="footer-links">
        <li><a href="#">Privacy</a></li>
        <li><a href="#">Terms</a></li>
        <li><a href="#">Support</a></li>
      </ul>
    </footer>
  );
};

export default Footer;