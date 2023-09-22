import React, { useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import jwt_decode from "jwt-decode";
import withAuth from "../components/withAuth";
import { observer } from "mobx-react-lite";
import Navb from "../components/Navb";
import { RootStoreContext } from "../index";
import Registration from "../components/Registration";
import PostsList from "../components/PostsList";
import MainUser from "../components/MainUser";
const MainPage = () => {
  const { id } = useParams();
  const { userStore, postStore } = useContext(RootStoreContext);
  postStore.getPostsFromUserId(
    JSON.parse(sessionStorage.getItem("mainUser")).id
  );
  console.log("userMain");
  return (
    <div style={{ display: "flex", height: "auto", background: "#212529" }}>
      <Navb />
      <PostsList />
      {/* <div style={{ marginTop: "150px" }}>
        {userStore.users.map((user) => (
          <div
            key={user.id}
            style={{ border: "1px solid green ", padding: "5  px" }}
          >
            <div>name: {user.first_name}</div>
            <div>surname: {user.last_name}</div>
            <div>email: {user.email}</div>
            <div>id: {user.id}</div>
            <button onClick={() => userStore.removeUser(user.id)}>
              Удалить пользователя
            </button>
          </div>
        ))}
      </div> */}
    </div>
  );
};
export default withAuth(MainPage);
