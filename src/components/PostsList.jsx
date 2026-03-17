import React, { useContext, useState, useMemo, useCallback } from "react";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";
import { RootStoreContext } from "..";
import PostCard from "./PostCard";
import EditPostModal from "./EditPostModal";
import LoadingSpinner from "./LoadingSpinner";
import "./PostsList.css";

const PostsList = observer(() => {
  const navigate = useNavigate();
  const { userStore, postStore } = useContext(RootStoreContext);
  const [showModal, setShowModal] = useState(false);
  const [editPostData, setEditPostData] = useState({});

  const mainUserId = useMemo(() => {
    const stored = sessionStorage.getItem("mainUser");
    if (!stored) {
      navigate("/login");
      return null;
    }
    return JSON.parse(stored).id;
  }, [navigate]);

  const handleDeletePost = useCallback((postId) => {
    if (window.confirm("Вы уверены, что хотите удалить этот пост?")) {
      postStore.deletePostById(postId);
    }
  }, [postStore]);

  const handleEditPost = useCallback((post) => {
    setEditPostData(post);
    setShowModal(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setShowModal(false);
    setEditPostData({});
  }, []);

  if (postStore.isLoading) {
    return (
      <div className="posts-container">
        <LoadingSpinner />
      </div>
    );
  }

  if (postStore.posts.length === 0) {
    return (
      <div className="posts-container">
        <div className="posts-empty">
          <h3>Здесь пока пусто</h3>
          <p>Посты скоро появятся!</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <EditPostModal
        show={showModal}
        onClose={handleCloseModal}
        editPostData={editPostData}
      />
      
      <div className="posts-container">
        <div className="posts-grid">
          {postStore.posts.map((post) => {
            const author = userStore.users.find(
              (user) => user.id === post.authorId
            );

            return (
              <PostCard
                key={post.id}
                post={post}
                author={author}
                isOwner={mainUserId === author?.id}
                onEdit={handleEditPost}
                onDelete={handleDeletePost}
              />
            );
          })}
        </div>
      </div>
    </>
  );
});

export default PostsList;
