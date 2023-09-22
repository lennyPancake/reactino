import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { RootStoreContext } from "..";
import { useContext } from "react";
import { Form, Button, Container } from "react-bootstrap";
import "../pages/Login.css";

const Login = () => {
  const [login, setLogin] = useState("");
  const { userStore } = useContext(RootStoreContext);
  const [pass, setPass] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    axios
      .post("http://localhost:8000/login", {
        username: login,
        password: pass,
      })
      .then(function (response) {
        // обработка успешного запроса
        const { user, token } = response.data;
        localStorage.setItem("token", token);
        userStore.mainUser = user;
        sessionStorage.setItem("mainUser", JSON.stringify(userStore.mainUser));
        navigate("/users/" + user.id);
      })
      .catch(function (error) {
        // обработка ошибки
        console.log(error);
      });
  };

  return (
    <Container style={{ width: "35%" }} className="login-container">
      <h2 className="login-title">Вход</h2>
      <Form>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="text"
            placeholder="Введите ваш email"
            value={login}
            onChange={(event) => setLogin(event.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="formBasicPassword">
          <Form.Label>Пароль</Form.Label>
          <Form.Control
            type="password"
            placeholder="Введите ваш пароль"
            value={pass}
            onChange={(event) => setPass(event.target.value)}
          />
        </Form.Group>
        <div className="d-flex justify-content-end">
          <Button
            className="me-10 mt-5 "
            variant="primary"
            onClick={handleLogin}
          >
            Войти
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default Login;
