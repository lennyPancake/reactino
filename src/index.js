import React from "react";
import { createContext } from "react";
import ReactDOM from "react-dom"; // Измените импорт на react-dom
import App from "./App";
import UserStore from "./store/userStore"; // Обновите импорт
import PostStore from "./store/postStore";

export const RootStoreContext = createContext();
const root = document.getElementById("root");
const userStoreInstance = new UserStore(); // Переименуйте переменную
const postStoreInstance = new PostStore();
const stores = {
  userStore: userStoreInstance,
  postStore: postStoreInstance,
};

ReactDOM.render(
  <React.StrictMode>
    <RootStoreContext.Provider value={stores}>
      <App />
    </RootStoreContext.Provider>
  </React.StrictMode>,
  root
);
