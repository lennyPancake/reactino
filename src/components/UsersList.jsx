import React, { useContext, useCallback } from "react";
import { RootStoreContext } from "..";
import { observer } from "mobx-react-lite";
import { Image, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "./LoadingSpinner";
import "./UsersList.css";

const UserCard = ({ user, onNavigate }) => (
  <div className="user-card stagger-item">
    <div className="user-card-content">
      <Image
        src={user.avatar}
        alt={`${user.first_name} ${user.last_name}`}
        className="user-card-avatar"
        rounded
      />
      <div className="user-card-info">
        <h5 className="user-card-name">
          {user.first_name} {user.last_name}
        </h5>
        <p className="user-card-email">{user.email}</p>
      </div>
    </div>
    <Button
      variant="outline-light"
      className="btn-custom"
      onClick={() => onNavigate(user.id)}
    >
      Перейти
    </Button>
  </div>
);

const UsersList = observer(() => {
  const { userStore } = useContext(RootStoreContext);
  const navigate = useNavigate();

  const handleNavigate = useCallback((userId) => {
    navigate(`/users/${userId}`);
  }, [navigate]);

  if (userStore.isLoading) {
    return (
      <div className="users-container">
        <LoadingSpinner />
      </div>
    );
  }

  if (userStore.users.length === 0) {
    return (
      <div className="users-container">
        <div className="users-empty">
          <h3>Пользователей пока нет</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="users-container">
      <div className="users-list">
        {userStore.users.map((user) => (
          <UserCard
            key={user.id}
            user={user}
            onNavigate={handleNavigate}
          />
        ))}
      </div>
    </div>
  );
});

export default UsersList;
