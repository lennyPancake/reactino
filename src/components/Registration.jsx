import MainUser from "./MainUser";
import { React, useState } from "react";
import axios from "axios";
import withAuth from "./withAuth";
import "./Registration.module.css";
import { useContext } from "react";
import { RootStoreContext } from "..";
import { useNavigate } from "react-router-dom";
import { Container, Form, Button } from "react-bootstrap";

const Registration = () => {
  const { userStore } = useContext(RootStoreContext);
  const navigate = useNavigate();
  const [match, setMatch] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const [retryPass, setRetryPass] = useState("");
  const [userData, setUserData] = useState({
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    avatar: "",
  });
  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    axios
      .post("http://localhost:8000/file", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log("Загрузка прошла успешно", response.data);
        setLoaded(true);
        userData.avatar = response.data.filepath;
      })
      .catch((error) => {
        console.error("Ошибка при загрузке", error);
      });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Отправляем данные на сервер
    axios
      .post("http://localhost:8000/register", userData)
      .then((response) => {
        console.log("Регистрация прошла успешно", response.data);
        const { user, token } = response.data;
        localStorage.setItem("token", token);
        userStore.mainUser = user;
        console.log(
          "Айди зарегистрированного пользователя: ",
          userStore.mainUser.id
        );
        sessionStorage.setItem("mainUser", JSON.stringify(userStore.mainUser));
        navigate("/users/" + userStore.mainUser.id);
      })
      .catch((error) => {
        console.error("Ошибка при регистрации", error);
      });
  };

  return (
    <Container className="d-flex justify-content-center align-items-center">
      <Form
        className="border bg-black bg-opacity-10 p-4 mt-5 rounded"
        style={{ width: "50%", minWidth: "500px " }}
        onSubmit={handleSubmit}
      >
        <h2>Регистрация</h2>
        <div>
          Имя:
          <Form.Control
            type="text"
            name="first_name"
            value={userData.first_name}
            onChange={handleInputChange}
            className="mt-3"
            placeholder="Имя"
          />
        </div>
        <div>
          Фамилия:
          <Form.Control
            type="text"
            name="last_name"
            value={userData.last_name}
            onChange={handleInputChange}
            className="mt-3"
            placeholder="Фамилия"
          />
        </div>
        <div>
          {" "}
          Email:
          <Form.Control
            type="text"
            name="email"
            value={userData.email}
            onChange={handleInputChange}
            className="mt-3"
            placeholder="email"
          />
        </div>
        <div>
          Пароль:
          <Form.Control
            type="password"
            name="password"
            value={userData.password}
            onChange={handleInputChange}
            className="mt-3"
            placeholder="Password"
          />
        </div>
        <div>
          Повторите пароль:
          {!match ? (
            <div style={{ color: "red" }}>Пароли не совпадают</div>
          ) : (
            ""
          )}
          <Form.Control
            type="password"
            name="passwordRepeat"
            value={retryPass}
            onChange={(event) => {
              setRetryPass(event.target.value);
              setMatch(event.target.value === userData.password);
            }}
            className="mt-3"
            placeholder="Password"
          />
        </div>
        <div>
          Аватар:
          <Form.Control
            type="file"
            name="avatar"
            onChange={handleAvatarChange}
            className="mt-3"
          />
          {loaded ? (
            <div style={{ color: "green" }}>Изображение успешно загружено</div>
          ) : (
            ""
          )}
        </div>
        <div>
          Уже зарегистрированы? <a href="/login">Войти</a>
        </div>
        <div className="d-flex justify-content-end align-items-start mt-3">
          <Button variant="success" className="mt-1" type="submit">
            {" "}
            Зарегистрироваться
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default Registration;
