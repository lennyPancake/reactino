import React from "react";
import { Container, Nav } from "react-bootstrap";
import MainUser from "./MainUser";
import { Navbar } from "react-bootstrap";
import "./Navbb.css";
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
        borderRight: "1px white solid",
        paddingTop: "50px",
        marginRight: "100px",
      }}
      className="bg-212529 "
    >
      <Navbar className="bg-212529 ">
        <Container className="bg-212529">
          <Navbar.Brand className="bg-212529 mx-auto" href="/posts/">
            Все посты
          </Navbar.Brand>
        </Container>
      </Navbar>
      <br />
      <Navbar className="bg-212529">
        <Container className="bg-212529">
          <Navbar.Brand className="bg-212529 mx-auto" href={`/users/${id}`}>
            Мой блог
          </Navbar.Brand>
        </Container>
      </Navbar>
      <br />
      <Navbar className="bg-212529">
        <Container className="bg-212529">
          <Navbar.Brand className="bg-212529 mx-auto" href="/users/">
            Все блоги
          </Navbar.Brand>
        </Container>
      </Navbar>
      <br />
      <Navbar className="bg-212529">
        <Container className="bg-212529">
          <Navbar.Brand href="#home" className="bg-212529 mx-auto">
            React Bootstrap
          </Navbar.Brand>
        </Container>
        <MainUser />
      </Navbar>
    </div>
  );
};

export default Navb;
