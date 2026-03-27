import React, { useContext, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { RootStoreContext } from "..";
import { Image, Dropdown } from "react-bootstrap";
import { useState, useEffect } from "react";
import "./MainUser.css";
import { observer } from "mobx-react-lite";

const MainUser = observer(({ isExpanded }) => {
  const navigate = useNavigate();
  const { userStore } = useContext(RootStoreContext);
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      setIsOpen(false);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const { mainUser } = userStore;

  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("mainUser");
    navigate("/login");
  }, [navigate]);

  const handleProfileClick = useCallback(() => {
    if (mainUser) {
      navigate(`/users/${mainUser.id}`);
    }
  }, [navigate, mainUser]);
  const handleSettingsClick = useCallback(() => {
    if (mainUser) {
      navigate(`/users/${mainUser.id}/settings`);
    }
  }, [navigate, mainUser]);
  useEffect(() => {
    if (!mainUser && !sessionStorage.getItem("mainUser")) {
      navigate("/login");
    }
  }, [mainUser, navigate]);
  return (
    <div className="user-profile-card">
      <div className="user-info" onClick={handleProfileClick}>
        {mainUser.avatar && (
          <Image
            src={
              mainUser.avatar
                ? `${process.env.REACT_APP_BASE_URL}${mainUser.avatar}`
                : `${process.env.REACT_APP_BASE_URL}/static/images/noavatar.png`
            }
            className={`avatar ${isExpanded ? "avatar-lg" : "avatar-sm"}`}
            alt={`${mainUser.first_name} ${mainUser.last_name}`}
          />
        )}
        <div className="user-details">
          <span className="user-name">
            {mainUser.first_name} {mainUser.last_name}
          </span>
          <span className="user-email">{mainUser.email}</span>
        </div>
      </div>

      <Dropdown
        show={isOpen}
        onToggle={(isOpen) => setIsOpen(isOpen)}
        align="end"
      >
        <Dropdown.Toggle
          variant="link"
          id="user-dropdown"
          className="user-dropdown-toggle"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="1" />
            <circle cx="12" cy="5" r="1" />
            <circle cx="12" cy="19" r="1" />
          </svg>
        </Dropdown.Toggle>
        <Dropdown.Menu className="bg-dark">
          <Dropdown.Item onClick={handleProfileClick} className="text-white">
            Мой профиль
          </Dropdown.Item>
          <Dropdown.Item onClick={handleSettingsClick} className="text-white">
            Настройки
          </Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item onClick={handleLogout} className="text-danger">
            Выход
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
});

export default MainUser;
