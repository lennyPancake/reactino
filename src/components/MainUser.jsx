import React, { useEffect } from "react";
import { useContext } from "react";
import { RootStoreContext } from "..";
import { Col } from "react-bootstrap";
import Image from "react-bootstrap/Image";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";
import jwtDecode from "jwt-decode";
const MainUser = (user) => {
  const navigate = useNavigate();
  const { userStore } = useContext(RootStoreContext);
  const decodedToken = jwtDecode(localStorage.getItem("token"));
  const mainUserId = decodedToken.userId;
  console.log("айди пользователя из token'а", mainUserId);
  userStore.fetchUsers();
  userStore.getUser(mainUserId);
  console.log("объект пользователя", userStore.mainUser);
  return (
    <Button
      onClick={() => {
        localStorage.removeItem("token");
        sessionStorage.removeItem("mainUser");
        navigate("/login");
      }}
      variant="outline-secondary"
      style={{
        display: "flex",
        marginTop: "250px",
        marginLeft: "20px",
        position: "fixed",
        color: "white",
        //boxShadow: "0 0 10px rgba(0, 0, 0, 0.5)", // Добавление тени
      }}
    >
      <Col xs={6} md={4} style={{ width: "auto" }}>
        <Image
          style={{ width: "50px", height: "50px" }}
          src={userStore.mainUser.avatar}
          roundedCircle
        />
      </Col>
      <div style={{ marginLeft: "15px" }}>
        {userStore.mainUser.first_name} {userStore.mainUser.last_name}
        <div>{userStore.mainUser.email}</div>
      </div>
    </Button>
  );
};

export default MainUser;
