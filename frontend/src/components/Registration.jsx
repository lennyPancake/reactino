import React, { useState, useContext, useCallback, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { RootStoreContext } from "..";
import { Form, Button, Image } from "react-bootstrap";
import { register } from "../API/userAPI";
import { loadFile } from "../API/fileAPI";
import "../pages/Auth.css";

const INITIAL_USER_DATA = {
  email: "",
  password: "",
  first_name: "",
  last_name: "",
  avatar: "",
};

const Registration = () => {
  const { userStore } = useContext(RootStoreContext);
  const navigate = useNavigate();

  const [userData, setUserData] = useState(INITIAL_USER_DATA);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [avatarLoaded, setAvatarLoaded] = useState(false);
  const [error, setError] = useState("");

  const passwordsMatch = useMemo(() => {
    if (!confirmPassword) return null;
    return userData.password === confirmPassword;
  }, [userData.password, confirmPassword]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleAvatarChange = useCallback(async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await loadFile(formData);
      // Сервер вернет { "filepath": "/static/images/photo.jpg" }
      setUserData((prev) => ({ ...prev, avatar: response.data.filepath }));
      setAvatarLoaded(true);
    } catch (error) {
      console.error("Ошибка при загрузке:", error);
    }
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setError("");

      if (!userData.first_name.trim() || !userData.last_name.trim()) {
        setError("Введите имя и фамилию");
        return;
      }

      if (!userData.email.trim()) {
        setError("Введите email");
        return;
      }

      if (!userData.password || userData.password.length < 4) {
        setError("Пароль должен быть не менее 4 символов");
        return;
      }

      if (userData.password !== confirmPassword) {
        setError("Пароли не совпадают");
        return;
      }

      setIsLoading(true);

      try {
        const response = await register(userData);
        const { user, token } = response.data;

        localStorage.setItem("token", token);
        userStore.mainUser = user;
        sessionStorage.setItem("mainUser", JSON.stringify(user));

        navigate(`/users/${user.id}`);
      } catch (error) {
        setError("Ошибка при регистрации. Попробуйте еще раз.");
        console.error("Ошибка регистрации:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [userData, confirmPassword, userStore, navigate],
  );

  return (
    <div className="auth-register-container">
      <div className="auth-register-card fade-in">
        <h1 className="auth-title">Регистрация</h1>

        {error && <div className="auth-error">{error}</div>}

        <Form onSubmit={handleSubmit} className="auth-form">
          <div className="row">
            <Form.Group className="col-6 mb-3">
              <Form.Label>Имя</Form.Label>
              <Form.Control
                type="text"
                name="first_name"
                value={userData.first_name}
                onChange={handleInputChange}
                placeholder="Имя"
                autoFocus
              />
            </Form.Group>

            <Form.Group className="col-6 mb-3">
              <Form.Label>Фамилия</Form.Label>
              <Form.Control
                type="text"
                name="last_name"
                value={userData.last_name}
                onChange={handleInputChange}
                placeholder="Фамилия"
              />
            </Form.Group>
          </div>

          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={userData.email}
              onChange={handleInputChange}
              placeholder="Введите email"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Пароль</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={userData.password}
              onChange={handleInputChange}
              placeholder="Минимум 4 символа"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Подтвердите пароль</Form.Label>
            <Form.Control
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Повторите пароль"
            />
            {passwordsMatch !== null && (
              <div
                className={`password-match ${passwordsMatch ? "success" : "error"}`}
              >
                {passwordsMatch ? "Пароли совпадают" : "Пароли не совпадают"}
              </div>
            )}
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Аватар</Form.Label>
            <Form.Control
              type="file"
              name="avatar"
              onChange={handleAvatarChange}
              accept="image/*"
            />
            {avatarLoaded && (
              <div className="upload-status success">Изображение загружено</div>
            )}
          </Form.Group>

          <Button
            type="submit"
            variant="success"
            className="auth-submit-btn"
            disabled={isLoading || passwordsMatch === false}
          >
            {isLoading ? "Регистрация..." : "Зарегистрироваться"}
          </Button>
        </Form>

        <div className="auth-footer">
          <span>Уже есть аккаунт?</span>
          <Link to="/login">Войти</Link>
        </div>
      </div>

      <div className="auth-side-image">
        <Image
          src={`${process.env.REACT_APP_BASE_URL}/images/logo.jpg`}
          rounded
          alt="Logo"
        />
      </div>
    </div>
  );
};

export default Registration;
