import React from "react";
import { Container, Nav } from "react-bootstrap";
import MainUser from "./MainUser";
import { Navbar, Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./Navbb.css";

const linkStyle = {
  textDecoration: "none",
  color: "white",
  flexDirection: "column",
};

const Navb = () => {
  let id = 1;
  if (sessionStorage.getItem("mainUser")) {
    id = JSON.parse(sessionStorage.getItem("mainUser")).id;
  }

  return (
    <div
      style={{
        width: "300px",
        textAlign: "center",
        height: "100vh",
        position: "fixed",
        borderRight: "1px gray solid",
        paddingTop: "50px",
        marginRight: "100px",
      }}
      className="bg-212529"
    >
      <Image
        style={{ width: "250px", marginBottom: "20px" }}
        src={`${process.env.REACT_APP_BASE_URL}/images/logo.jpg`}
        rounded
      />
      <Navbar className="bg-212529">
        <Container className="bg-212529">
          <Link to="/posts" style={linkStyle}>
            <Navbar.Brand className="bg-212529 mx-auto">Все посты</Navbar.Brand>
          </Link>
        </Container>
      </Navbar>
      <br />
      <Navbar className="bg-212529">
        <Container className="bg-212529">
          <Link to={`/users/${id}`} style={linkStyle}>
            <Navbar.Brand className="bg-212529 mx-auto">Мой блог</Navbar.Brand>
          </Link>
        </Container>
      </Navbar>
      <br />
      <Navbar className="bg-212529">
        <Container className="bg-212529">
          <Link to="/users" style={linkStyle}>
            <Navbar.Brand className="bg-212529 mx-auto">Все блоги</Navbar.Brand>
          </Link>
        </Container>
      </Navbar>
      <br />
      <Navbar className="">
        <MainUser />
      </Navbar>
    </div>
  );
};

export default Navb;
