import React, { useEffect } from "react";
import { useContext } from "react";
import { RootStoreContext } from "..";
import { Col } from "react-bootstrap";
import Image from "react-bootstrap/Image";
import Dropdown from "react-bootstrap/Dropdown";
import SplitButton from "react-bootstrap/SplitButton";
import { useNavigate } from "react-router-dom";
const MainUser = () => {
  const navigate = useNavigate();
  const { userStore } = useContext(RootStoreContext);

  userStore.mainUser = JSON.parse(sessionStorage.getItem("mainUser"));

  console.log("объект пользователя", userStore.mainUser);
  return (
    <SplitButton
      onClick={() => {
        navigate(`/users/${userStore.mainUser.id}`);
      }}
      title={
        <div>
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
        </div>
      }
      id="dropdown-menu-align-right"
      variant="outline-secondary"
      style={{
        display: "flex",
        marginTop: "33%",
        marginLeft: "20px",
        position: "fixed",
        color: "white",
        width: "19%",
      }}
    >
      <Dropdown.Item
        onClick={() => {
          localStorage.removeItem("token");
          sessionStorage.removeItem("mainUser");
          navigate("/login");
        }}
      >
        Выход
      </Dropdown.Item>
    </SplitButton>
  );
};

export default MainUser;
