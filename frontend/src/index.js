import React from "react";
import "./index.css";
import ReactDOM from "react-dom/client";
import App from "./App";
import UserStore from "./store/userStore";
import PostStore from "./store/postStore";
import CommentStore from "./store/commentStore";
import RootStoreContext from "./RootStoreContext";

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
  </RootStoreContext.Provider>,
);
