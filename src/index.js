import React from "react";
import "./index.css";
import { createContext } from "react";
import ReactDOM from "react-dom/client"; // Измените импорт на react-dom
import App from "./App";
import UserStore from "./store/userStore"; // Обновите импорт
import PostStore from "./store/postStore";

export const RootStoreContext = createContext();
const root = ReactDOM.createRoot(document.getElementById("root"));
const userStoreInstance = new UserStore(); // Переименуйте переменную
const postStoreInstance = new PostStore();
const stores = {
  userStore: userStoreInstance,
  postStore: postStoreInstance,
};

root.render(
  <React.StrictMode>
    <RootStoreContext.Provider value={stores}>
      <App />
    </RootStoreContext.Provider>
  </React.StrictMode>
);
