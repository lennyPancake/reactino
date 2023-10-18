import React from "react";
import Post from "../components/Post";
import { useParams } from "react-router-dom";
import "./aboutpost.css";
import withAuth from "../components/withAuth";
const AboutPost = () => {
  const { id } = useParams();
  return (
    <div>
      <Post postId={id} />
    </div>
  );
};

export default withAuth(AboutPost);
