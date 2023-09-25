import React from "react";
import Navb from "../components/Navb";
import { useContext } from "react";
import { RootStoreContext } from "..";
import PostsList from "../components/PostsList";
import withAuth from "../components/withAuth";
const AllPosts = () => {
  const { postStore } = useContext(RootStoreContext);
  postStore.getPosts();
  return (
    <div style={{ display: "flex", height: "auto", background: "#212529" }}>
      <Navb />
      <PostsList userPosts={postStore.posts} />
    </div>
  );
};

export default withAuth(AllPosts);
