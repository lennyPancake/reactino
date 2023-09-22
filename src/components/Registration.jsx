import MainUser from "./MainUser";
import { React, useState } from "react";
import axios from "axios";
import withAuth from "./withAuth";
import classes from "./Registration.module.css";
import { useContext } from "react";
import { RootStoreContext } from "..";
import { useNavigate } from "react-router-dom";
import userEvent from "@testing-library/user-event";
const Registration = () => {
  const { userStore } = useContext(RootStoreContext);
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    email: "",
    password: "",
    first_name: "",
    last_name: "",
  });

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
        userStore.mainUser = response.data.user;
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
    <div className={classes.registration_container}>
      <MainUser />
      <h2 className={classes.registration_title}>Форма регистрации</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={userData.email}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Пароль:</label>
          <input
            type="password"
            name="password"
            value={userData.password}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Имя:</label>
          <input
            type="text"
            name="first_name"
            value={userData.first_name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Фамилия:</label>
          <input
            type="text"
            name="last_name"
            value={userData.last_name}
            onChange={handleInputChange}
            required
          />
        </div>
        <button className={classes.registration_button} type="submit">
          Зарегистрироваться
        </button>
      </form>
    </div>
  );
};

export default withAuth(Registration);
