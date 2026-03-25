import React, { useMemo, useState } from "react";
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
    {/* Иконка (заглушка, добавь свои иконки тут) */}
    <span className="nav-icon">📍</span>
    <span className="nav-link-text">{label}</span>
  </Link>
);

const Navb = () => {
  const location = useLocation();
  // 1. Состояние для разворота меню
  const [isExpanded, setIsExpanded] = useState(false);

  const mainUserId = useMemo(() => {
    const stored = sessionStorage.getItem("mainUser");
    try {
      return stored ? JSON.parse(stored).id : null;
    } catch (e) {
      return null;
    }
  }, []);

  const hideNavbar = ["/register", "/login"].includes(location.pathname);

  const isActive = (path, exact = false) => {
    if (exact) return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  if (hideNavbar) return null;

  return (
    // 2. Добавляем класс 'expanded' динамически
    <aside className={`sidebar ${isExpanded ? "expanded" : ""}`}>
      <div className="sidebar-content">
        {/* 3. Кнопка теперь просто меняет состояние */}
        <div className="diva">
          <button
            className="toggle-btn"
            onClick={() => setIsExpanded(!isExpanded)}
            type="button"
          >
            {isExpanded ? "✕" : "☰"}
          </button>
        </div>
        <div className="sidebar-logo">
          <Image
            src={`${process.env.REACT_APP_BASE_URL}/static/images/logo.jpg`}
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
              isActive={isActive(`/users/${mainUserId}`)}
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
