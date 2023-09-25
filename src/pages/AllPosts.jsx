import React from "react";
import Navb from "../components/Navb";
import { useContext } from "react";
import { RootStoreContext } from "..";
import PostsList from "../components/PostsList";
import withAuth from "../components/withAuth";

const AllPosts = () => {
  const { postStore, userStore } = useContext(RootStoreContext);
  postStore.getPosts();
  userStore.fetchUsers();
  return (
    <div style={{ display: "flex", height: "auto", background: "#212529" }}>
      <Navb />
      <PostsList />
    </div>
  );
};

export default withAuth(AllPosts);
