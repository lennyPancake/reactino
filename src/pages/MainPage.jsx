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
import AddPostModal from "../components/AddPostModal";
const MainPage = () => {
  const { id } = useParams();
  let mainUserId = undefined;
  const { userStore, postStore } = useContext(RootStoreContext);
  useEffect(() => {
    postStore.getPostsFromUserId(id);
    userStore.fetchUsers();
  }, []);
  if (sessionStorage.getItem("mainUser")) {
    mainUserId = JSON.parse(sessionStorage.getItem("mainUser")).id;
  }
  return (
    <div
      style={{
        display: "flex",
        height: "auto",
        background: "#212529",
        flexWrap: "wrap",
      }}
    >
      <Navb />
      {id == mainUserId ? (
        <AddPostModal
          showButton={true}
          show={false}
          postData={{
            title: "",
            content: "",
            authorId: JSON.parse(sessionStorage.getItem("mainUser")).id,
            image: "",
          }}
        />
      ) : (
        ""
      )}
      <PostsList />
    </div>
  );
};
export default withAuth(MainPage);
