import React from "react";
import { useParams } from "react-router-dom";
import Post from "../components/Post";
import withAuth from "../components/withAuth";
import "./Pages.css";

const AboutPost = () => {
  const { id } = useParams();

  return (
    <div className="page-wrapper">
      <Post postId={id} />
    </div>
  );
};

export default withAuth(AboutPost);
