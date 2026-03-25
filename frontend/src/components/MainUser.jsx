import React, { useContext, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { RootStoreContext } from "..";
import { Image, Dropdown } from "react-bootstrap";
import "./MainUser.css";

const MainUser = () => {
  const navigate = useNavigate();
  const { userStore } = useContext(RootStoreContext);

  const mainUser = useMemo(() => {
    const stored = sessionStorage.getItem("mainUser");
    if (stored) {
      const user = JSON.parse(stored);
      userStore.mainUser = user;
      return user;
    }
    return null;
  }, [userStore]);

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

  if (!mainUser) {
    navigate("/login");
    return null;
  }

  return (
    <div className="user-profile-card">
      <div className="user-info" onClick={handleProfileClick}>
        {(mainUser.avatar && (
          <Image
            src={mainUser.avatar}
            className="avatar avatar-md"
            alt={`${mainUser.first_name} ${mainUser.last_name}`}
          />
        )) || (
          <Image
            src={`${process.env.REACT_APP_BASE_URL}/static/images/noavatar.png`}
            className="avatar avatar-md"
            alt="Default Avatar"
          />
        )}
        <div className="user-details">
          <span className="user-name">
            {mainUser.first_name} {mainUser.last_name}
          </span>
          <span className="user-email">{mainUser.email}</span>
        </div>
      </div>

      <Dropdown align="end">
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
          <Dropdown.Divider />
          <Dropdown.Item onClick={handleLogout} className="text-danger">
            Выход
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
};

export default MainUser;
