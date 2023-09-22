import React from "react";
import { Container, Nav } from "react-bootstrap";
import classes from "./Navb.module.css";
import MainUser from "./MainUser";
const Navb = () => {
  return (
    <Nav
      style={{
        height: "100vh",
        background: "#212529",
        width: "300px",
        position: "fixed",
        paddingTop: "50px",
      }}
      defaultActiveKey="/home"
      className={classes.nav}
    >
      <Nav.Link
        className={classes.link}
        to={`/users/${JSON.parse(sessionStorage.getItem("mainUser")).id}`}
      >
        Мой блог
      </Nav.Link>
      <Nav.Link className={classes.link} eventKey="link-1">
        Все блоги
      </Nav.Link>
      <Nav.Link className={classes.link} eventKey="link-2">
        Все посты
      </Nav.Link>
      <Nav.Link className={classes.link} eventKey="link-3">
        ---
      </Nav.Link>
      <MainUser />
    </Nav>
  );
};

export default Navb;
