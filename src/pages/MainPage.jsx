import React, { useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import withAuth from "../components/withAuth";
import { RootStoreContext } from "../index";
import PostsList from "../components/PostsList";
import AddPostModal from "../components/AddPostModal";
const MainPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  let mainUserId = undefined;
  const { userStore, postStore } = useContext(RootStoreContext);
  useEffect(() => {
    userStore.fetchUsers();
    postStore.getPostsFromUserId(id);
  }, []);
  if (sessionStorage.getItem("mainUser")) {
    mainUserId = JSON.parse(sessionStorage.getItem("mainUser")).id;
  } else {
    navigate("/login");
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
