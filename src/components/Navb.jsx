import React, { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { Image } from "react-bootstrap";
import MainUser from "./MainUser";
import "./Navbb.css";

const NAV_ITEMS = [
  { path: "/posts", label: "Все посты", icon: "posts" },
  { path: "/users", label: "Все блоги", icon: "users", exact: true },
];

const NavLink = ({ to, label, isActive }) => (
  <Link to={to} className={`nav-link-custom ${isActive ? "active" : ""}`}>
    <span className="nav-link-text">{label}</span>
  </Link>
);

const Navb = () => {
  const location = useLocation();
  
  const mainUserId = useMemo(() => {
    const stored = sessionStorage.getItem("mainUser");
    return stored ? JSON.parse(stored).id : null;
  }, []);

  const hideNavbar = ["/register", "/login"].includes(location.pathname);

  const isActive = (path, exact = false) => {
    if (exact) return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  if (hideNavbar) return null;

  return (
    <aside className="sidebar">
      <div className="sidebar-content">
        <div className="sidebar-logo">
          <Image
            src={`${process.env.REACT_APP_BASE_URL}/images/logo.jpg`}
            rounded
            className="logo-image"
            alt="Logo"
          />
        </div>

        <nav className="sidebar-nav">
          {NAV_ITEMS.map(({ path, label, exact }) => (
            <NavLink
              key={path}
              to={path}
              label={label}
              isActive={isActive(path, exact)}
            />
          ))}
          
          {mainUserId && (
            <NavLink
              to={`/users/${mainUserId}`}
              label="Мой блог"
              isActive={location.pathname === `/users/${mainUserId}`}
            />
          )}
        </nav>

        <div className="sidebar-footer">
          <MainUser />
        </div>
      </div>
    </aside>
  );
};

export default Navb;
