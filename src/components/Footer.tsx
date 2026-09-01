import { Link } from "react-router-dom";
import { business } from "../data/business";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <p className="footer-brand">
          <img src="/images/empire-mark-refined.svg" alt="" width={24} height={24} style={{ borderRadius: "50%" }} />
          © {new Date().getFullYear()} {business.name}. All rights reserved.
        </p>
        <ul className="footer-links">
          <li><Link to="/about">About</Link></li>
          <li><Link to="/services">Services</Link></li>
          <li><Link to="/products">Products</Link></li>
          <li><Link to="/contact">Contact</Link></li>
        </ul>
      </div>
    </footer>
  );
}
