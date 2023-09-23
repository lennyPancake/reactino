import React from "react";
import "./index.css";
import { createContext } from "react";
import ReactDOM from "react-dom/client"; // Измените импорт на react-dom
import App from "./App";
import UserStore from "./store/userStore"; // Обновите импорт
import PostStore from "./store/postStore";
import CommentStore from "./store/commentStore";

export const RootStoreContext = createContext();
const root = ReactDOM.createRoot(document.getElementById("root"));
const userStoreInstance = new UserStore(); // Переименуйте переменную
const postStoreInstance = new PostStore();
const commentStoreInstance = new CommentStore();
const stores = {
  userStore: userStoreInstance,
  postStore: postStoreInstance,
  commentStore: commentStoreInstance,
};

root.render(
  <React.StrictMode>
    <RootStoreContext.Provider value={stores}>
      <App />
    </RootStoreContext.Provider>
  </React.StrictMode>
);
