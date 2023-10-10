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

root.render(
  <RootStoreContext.Provider
    value={{
      userStore: new UserStore(),
      postStore: new PostStore(),
      commentStore: new CommentStore(),
    }}
  >
    <App />
  </RootStoreContext.Provider>
);
