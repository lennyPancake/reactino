import React from "react";
import Navb from "../components/Navb";
import AddComment from "../components/AddComment";
import Post from "../components/Post";
import { useParams } from "react-router-dom";
import "./aboutpost.css";
const AboutPost = () => {
  const { id } = useParams();

  return (
    <div>
      <Navb />
      <Post postId={id} />
      <AddComment postId={id} />
    </div>
  );
};

export default AboutPost;
