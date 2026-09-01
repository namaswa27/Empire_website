import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { business } from "../data/business";

const LINKS = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/products", label: "Products" },
  { to: "/gallery", label: "Gallery" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="container nav">
        <Link to="/" className="brand">
          <img src="/images/empire-mark-refined.svg" alt="" className="brand-mark" width={40} height={40} />
          <span>{business.name}</span>
        </Link>

        <nav aria-label="Primary">
          <ul className="nav-links">
            {LINKS.map((link) => (
              <li key={link.to}>
                <NavLink to={link.to} className={({ isActive }) => (isActive ? "is-active" : undefined)} end={link.to === "/"}>
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <Link to="/contact#booking" className="btn btn--primary nav-cta">Book Appointment</Link>

        <button
          className="menu-toggle"
          type="button"
          aria-expanded={open}
          aria-controls="mobileMenu"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="visually-hidden">Toggle menu</span>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M2 5h16M2 10h16M2 15h16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {open ? (
        <nav className="mobile-menu" id="mobileMenu" aria-label="Mobile">
          {LINKS.map((link) => (
            <Link key={link.to} to={link.to} onClick={() => setOpen(false)}>
              {link.label}
            </Link>
          ))}
          <Link to="/contact#booking" className="btn btn--primary" onClick={() => setOpen(false)}>
            Book Appointment
          </Link>
        </nav>
      ) : null}
    </header>
  );
}
