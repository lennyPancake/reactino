import React, { useContext, useEffect, useMemo } from "react";
import { observer } from "mobx-react-lite";
import RootStoreContext from "../RootStoreContext";
import PostCard from "./PostCard";
import AddComment from "./AddComment";
import LoadingSpinner from "./LoadingSpinner";
import Comments from "./Comments";
import "./Post.css";

const Post = observer(({ postId }) => {
  const { userStore, postStore, commentStore } = useContext(RootStoreContext);

  useEffect(() => {
    postStore.getPostById(postId);
    userStore.fetchUsers();
    commentStore.getCommentsForPost(postId);
  }, [postId, postStore, userStore, commentStore]);

  const author = useMemo(() => {
    return userStore.users.find((user) => user.id === postStore.post?.authorId);
  }, [userStore.users, postStore.post?.authorId]);

  if (postStore.isLoading) {
    return (
      <div className="post-detail-container">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="post-detail-container">
      <div className="post-detail-content">
        <PostCard
          post={postStore.post}
          author={author}
          isOwner={false}
          showFullContent={true}
          showBackButton={true}
        />

        <Comments postId={postId} />
        <AddComment postId={postId} />
      </div>
    </div>
  );
});

export default Post;
