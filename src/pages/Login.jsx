import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { RootStoreContext } from "..";
import { useContext } from "react";
import { Form, Button, Container } from "react-bootstrap";
import "../pages/Login.css";
import { login } from "../API/userAPI";
const Login = () => {
  const [logIn, setLogIn] = useState("");
  const { userStore } = useContext(RootStoreContext);
  const [pass, setPass] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await login(logIn, pass);
      console.log("ответ на авторизацию : ", response);
      const { user, token } = response.data;
      localStorage.setItem("token", token);
      userStore.mainUser = user;
      sessionStorage.setItem("mainUser", JSON.stringify(userStore.mainUser));
      navigate("/users/" + user.id);
    } catch (error) {
      if (error.response && error.response.status === 301) {
        alert("Неверный логин или пароль");
      } else {
        console.error("Произошла ошибка при авторизации:", error);
      }
    }
  };

  return (
    <Container
      style={{ width: "35%" }}
      className="border bg-dark login-container"
    >
      <Form className="bg-dark">
        <h2 className="login-title">Вход</h2>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="text"
            placeholder="Введите ваш email"
            value={login}
            onChange={(event) => setLogIn(event.target.value)}
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

        <div className="reg">
          <a href="/register">Зарегистрироваться</a>
        </div>

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
