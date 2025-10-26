import { NavLink } from "react-router-dom";

export default function Sidebar() {
  const link = ({ isActive }) => "nav-link" + (isActive ? " active" : "");

  return (
    <aside className="sidebar light">
      <div className="brand-simple">HealthyPaw</div>
      <nav className="nav">
        <NavLink to="/profile" className={link}>Profile</NavLink>
      </nav>
    </aside>
  );
}
