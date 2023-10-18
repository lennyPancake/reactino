import React, { useEffect } from "react";
import Navb from "../components/Navb";
import { useContext } from "react";
import { RootStoreContext } from "..";
import PostsList from "../components/PostsList";
import withAuth from "../components/withAuth";

const AllPosts = () => {
  const { userStore, postStore } = useContext(RootStoreContext);
  useEffect(() => {
    userStore.fetchUsers();
    postStore.getPosts();
  }, []);
  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        height: "auto",
        background: "#212529",
      }}
    >
      <PostsList />
    </div>
  );
};

export default withAuth(AllPosts);
