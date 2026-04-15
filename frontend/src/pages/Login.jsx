import React, { useState, useContext, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import RootStoreContext from "../RootStoreContext";
import { Form, Button, Image } from "react-bootstrap";
import { login } from "../API/userAPI";
import "./Auth.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { userStore } = useContext(RootStoreContext);
  const navigate = useNavigate();

  const handleLogin = useCallback(
    async (e) => {
      e.preventDefault();

      if (!email.trim() || !password.trim()) {
        setError("Заполните все поля");
        return;
      }

      setIsLoading(true);
      setError("");

      try {
        const response = await login(email, password);
        const { user, token } = response.data;
        //const { user, access_token } = response.data;
        localStorage.setItem("token", token);
        userStore.mainUser = user;
        sessionStorage.setItem("mainUser", JSON.stringify(user));

        navigate(`/users/${user.id}`);
      } catch (error) {
        if (error.response?.status === 403) {
          setError("Неверный логин или пароль");
        } else {
          setError("Произошла ошибка при авторизации");
          console.error("Ошибка авторизации:", error);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [email, password, userStore, navigate],
  );

  return (
    <div className="auth-container">
      <div className="auth-card fade-in">
        <div className="auth-logo">
          <Image
            src={`${process.env.REACT_APP_BASE_URL}/static/images/logo.jpg`}
            rounded
            alt="Logo"
            className="logo-image"
          />
        </div>

        <h1 className="auth-title">Вход</h1>

        {error && <div className="auth-error">{error}</div>}

        <Form onSubmit={handleLogin} className="auth-form">
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Введите email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoFocus
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Пароль</Form.Label>
            <Form.Control
              type="password"
              placeholder="Введите пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>

          <Button
            type="submit"
            variant="primary"
            className="auth-submit-btn"
            disabled={isLoading}
          >
            {isLoading ? "Вход..." : "Войти"}
          </Button>
        </Form>

        <div className="auth-footer">
          <span>Нет аккаунта?</span>
          <Link to="/register">Зарегистрироваться</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
