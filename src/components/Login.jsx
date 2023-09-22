import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { RootStoreContext } from "..";
import { useContext } from "react";
const Login = () => {
  const [login, setLogin] = useState("");
  const { userStore } = useContext(RootStoreContext);
  const [pass, setPass] = useState("");
  const navigate = useNavigate();
  return (
    <div>
      login:{" "}
      <input
        type="text"
        value={login}
        onChange={(event) => {
          setLogin(event.target.value);
        }}
      />
      password:{" "}
      <input
        type="text"
        value={pass}
        onChange={(event) => {
          setPass(event.target.value);
        }}
      />
      <button
        onClick={() => {
          axios
            .post("http://localhost:8000/login", {
              username: login,
              password: pass,
            })
            .then(function (response) {
              // обработка успешного запроса
              const { user, token } = response.data;
              localStorage.setItem("token", token);
              console.log(response);
              console.log(user.id);
              navigate("/users/" + user.id);
              userStore.mainUser = user;
              sessionStorage.setItem(
                "mainUser",
                JSON.stringify(userStore.mainUser)
              );
            })
            .catch(function (error) {
              // обработка ошибки
              console.log(error);
            })
            .finally(function () {
              // выполняется всегда
            });
        }}
      >
        Логин
      </button>
    </div>
  );
};

export default Login;
