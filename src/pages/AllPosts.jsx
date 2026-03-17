import React, { useContext, useEffect } from "react";
import { RootStoreContext } from "..";
import PostsList from "../components/PostsList";
import withAuth from "../components/withAuth";
import "./Pages.css";

const AllPosts = () => {
  const { userStore, postStore } = useContext(RootStoreContext);

  useEffect(() => {
    userStore.fetchUsers();
    postStore.getPosts();
  }, [userStore, postStore]);

  return (
    <div className="page-wrapper">
      <PostsList />
    </div>
  );
};

export default withAuth(AllPosts);
