import React from "react";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import "./Navbb.css";

const Navbb = () => {
  return (
    <div
      style={{
        height: "100vh",
        position: "fixed",
        borderRight: "2px white solid",
        paddingTop: "50px",
      }}
      className="bg-212529"
    >
      <Navbar className="bg-212529">
        <Container className="bg-212529 ">
          <Navbar.Brand className="bg-212529 mx-auto" href="/posts/">
            Все посты
          </Navbar.Brand>
        </Container>
      </Navbar>
      <br />
      <Navbar className="bg-212529">
        <Container className="bg-212529">
          <Navbar.Brand
            className="bg-212529"
            href={`/users/${JSON.parse(sessionStorage.getItem("mainUser")).id}`}
          >
            Мой блог
          </Navbar.Brand>
        </Container>
      </Navbar>
      <br />
      <Navbar className="bg-212529">
        <Container className="bg-212529">
          <Navbar.Brand className="bg-212529" href="/users/">
            Все блоги
          </Navbar.Brand>
        </Container>
      </Navbar>
      <br />
      <Navbar className="bg-212529">
        <Container className="bg-212529">
          <Navbar.Brand href="#home" className="bg-212529">
            React Bootstrap
          </Navbar.Brand>
        </Container>
      </Navbar>
    </div>
  );
};

export default Navbb;
