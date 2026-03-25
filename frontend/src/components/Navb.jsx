import React, { useMemo, useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { Image } from "react-bootstrap";
import MainUser from "./MainUser";
import "./Navbb.css";

const BREAKPOINT = 1080;

const NAV_ITEMS = [
  {
    path: "/posts",
    label: "Все посты",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
  },
  {
    path: "/users",
    label: "Все блоги",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    exact: true,
  },
];

const MY_BLOG_ICON = (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const MenuOpenIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const MenuCloseIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const NavLink = ({ to, label, icon, isActive, isCollapsed }) => (
  <Link
    to={to}
    className={`nav-link-custom ${isActive ? "active" : ""}`}
    title={isCollapsed ? label : undefined}
  >
    <span className="nav-icon">{icon}</span>
    <span className="nav-link-text">{label}</span>
  </Link>
);

const Navb = () => {
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= BREAKPOINT);

  // Отслеживаем изменение ширины экрана
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= BREAKPOINT;
      setIsMobile(mobile);
      // Автосворачиваем при расширении до десктопа
      if (!mobile) {
        setIsExpanded(true);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Закрываем при смене маршрута (только на мобиле)
  useEffect(() => {
    if (isMobile) {
      setIsExpanded(false);
    }
  }, [location.pathname, isMobile]);

  const mainUserId = useMemo(() => {
    const stored = sessionStorage.getItem("mainUser");
    try {
      return stored ? JSON.parse(stored).id : null;
    } catch {
      return null;
    }
  }, []);

  const hideNavbar = ["/register", "/login"].includes(location.pathname);

  const isActive = useCallback(
    (path, exact = false) => {
      if (exact) return location.pathname === path;
      return location.pathname.startsWith(path);
    },
    [location.pathname],
  );

  const handleToggle = useCallback(() => {
    setIsExpanded((v) => !v);
  }, []);

  const handleBackdropClick = useCallback(() => {
    setIsExpanded(false);
  }, []);

  if (hideNavbar) return null;

  const collapsed = isMobile && !isExpanded;

  return (
    <>
      {/* Затемнение при открытом меню на мобиле */}
      <div
        className={`sidebar-backdrop ${isMobile && isExpanded ? "visible" : ""}`}
        onClick={handleBackdropClick}
        aria-hidden="true"
      />

      <aside
        className={`sidebar ${isExpanded ? "expanded" : ""}`}
        aria-label="Навигация"
      >
        <div className="sidebar-content">
          {/* Кнопка тоггла */}
          <div className="sidebar-toggle-row">
            <button
              className="toggle-btn"
              onClick={handleToggle}
              type="button"
              aria-label={isExpanded ? "Свернуть меню" : "Развернуть меню"}
            >
              {isExpanded || !isMobile ? <MenuCloseIcon /> : <MenuOpenIcon />}
            </button>
          </div>

          {/* Логотип */}
          <div className="sidebar-logo">
            <Image
              src={`${process.env.REACT_APP_BASE_URL}/static/images/logo.jpg`}
              rounded
              className="logo-image"
              alt="Логотип"
            />
          </div>

          {/* Навигация */}
          <nav className="sidebar-nav">
            {NAV_ITEMS.map(({ path, label, icon, exact }) => (
              <NavLink
                key={path}
                to={path}
                label={label}
                icon={icon}
                isActive={isActive(path, exact)}
                isCollapsed={collapsed}
              />
            ))}

            {mainUserId && (
              <NavLink
                to={`/users/${mainUserId}`}
                label="Мой блог"
                icon={MY_BLOG_ICON}
                isActive={isActive(`/users/${mainUserId}`)}
                isCollapsed={collapsed}
              />
            )}
          </nav>

          {/* Пользователь */}
          <div className="sidebar-footer">
            <MainUser />
          </div>
        </div>
      </aside>
    </>
  );
};

export default Navb;
