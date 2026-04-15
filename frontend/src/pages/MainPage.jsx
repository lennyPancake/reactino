import React, { useContext, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import RootStoreContext from "../RootStoreContext";
import PostsList from "../components/PostsList";
import AddPostModal from "../components/AddPostModal";
import withAuth from "../components/withAuth";
import "./Pages.css";

const MainPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userStore, postStore } = useContext(RootStoreContext);

  const mainUserId = useMemo(() => {
    const stored = sessionStorage.getItem("mainUser");
    if (!stored) {
      navigate("/login");
      return null;
    }
    return JSON.parse(stored).id;
  }, [navigate]);

  const isOwnProfile = useMemo(() => {
    return String(id) === String(mainUserId);
  }, [id, mainUserId]);

  useEffect(() => {
    userStore.fetchUsers();
    postStore.getPostsFromUserId(id);
  }, [id, userStore, postStore]);

  return (
    <div className="page-wrapper">
      <div className="posts-container">
        {isOwnProfile && <AddPostModal />}
        <PostsList />
      </div>
    </div>
  );
};

export default withAuth(MainPage);
