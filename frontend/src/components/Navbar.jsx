import { Link } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img src="/destination.png" alt="Logo" />
        <span>AI Planner</span>
      </div>
      <div className="navbar-links">
        <Link to="/">Home</Link>
        <Link to="/tripplanner">Trip Planner</Link>
        <Link to="/promotion">Promotion</Link>
        <Link to="/about">About</Link>
      </div>
    </nav>
  );
}
