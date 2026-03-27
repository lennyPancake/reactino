import React, { useContext, useState, useMemo, useCallback } from "react";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";
import { RootStoreContext } from "..";
import PostCard from "./PostCard";
import EditPostModal from "./EditPostModal";
import LoadingSpinner from "./LoadingSpinner";
import { useEffect } from "react";
import "./PostsList.css";

const PostsList = observer(() => {
  const navigate = useNavigate();
  const { userStore, postStore } = useContext(RootStoreContext);
  const [showModal, setShowModal] = useState(false);
  const [editPostData, setEditPostData] = useState({});

  // Берем ID текущего пользователя из стора (так надежнее)
  const currentUserId = userStore.mainUser?.id;

  // Если нужно строго выкидывать неавторизованных:
  useEffect(() => {
    if (!sessionStorage.getItem("mainUser")) {
      navigate("/login");
    }
  }, [navigate]);

  const handleDeletePost = useCallback(
    (postId) => {
      if (window.confirm("Вы уверены?")) {
        postStore.deletePostById(postId);
      }
    },
    [postStore],
  );

  const handleEditPost = useCallback((post) => {
    setEditPostData(post);
    setShowModal(true);
  }, []);

  if (postStore.isLoading) return <LoadingSpinner />;
  return (
    <>
      <EditPostModal
        show={showModal}
        onClose={() => setShowModal(false)}
        editPostData={editPostData}
      />

      <div className="posts-list">
        <div className="posts-grid">
          {postStore.posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              // Автор уже "сидит" в посте благодаря бэкенду
              author={post.author}
              // Сверяем ID владельца для кнопок "Редактировать/Удалить"
              isOwner={currentUserId == post.author?.id}
              onEdit={handleEditPost}
              onDelete={handleDeletePost}
            />
          ))}
        </div>
      </div>
    </>
  );
});

export default PostsList;
