import React, { useContext, useMemo } from "react";
import { observer } from "mobx-react-lite";
import { RootStoreContext } from "..";
import { Card, Image } from "react-bootstrap";
import LoadingSpinner from "./LoadingSpinner";
import "./Comments.css";

const CommentCard = ({ comment, author }) => {
  if (!author) return null;

  return (
    <Card className="comment-card stagger-item">
      <Card.Header className="comment-header">
        <div className="comment-author">
          <Image
            src={author.avatar}
            className="avatar avatar-sm"
            alt={`${author.first_name} ${author.last_name}`}
          />
          <span className="author-name">
            {author.first_name} {author.last_name}
          </span>
        </div>
      </Card.Header>
      <Card.Body className="comment-body">
        <Card.Text className="comment-text">{comment.text}</Card.Text>
      </Card.Body>
    </Card>
  );
};

const Comments = observer(({ postId }) => {
  const { commentStore, userStore } = useContext(RootStoreContext);

  const commentsWithAuthors = useMemo(() => {
    return commentStore.comments.map((comment) => ({
      comment,
      author: userStore.users.find((user) => user.id === comment.authorId),
    }));
  }, [commentStore.comments, userStore.users]);

  if (commentStore.isLoading) {
    return <LoadingSpinner fullPage={false} />;
  }

  return (
    <div className="comments-section">
      <h3 className="comments-title">
        Комментарии
        {commentsWithAuthors.length > 0 && (
          <span className="comments-count">({commentsWithAuthors.length})</span>
        )}
      </h3>

      {commentsWithAuthors.length > 0 ? (
        <div className="comments-list">
          {commentsWithAuthors.map(({ comment, author }) => (
            <CommentCard key={comment.id} comment={comment} author={author} />
          ))}
        </div>
      ) : (
        <div className="comments-empty">
          <p>Здесь пока нет комментариев. Будьте первым!</p>
        </div>
      )}
    </div>
  );
});

export default Comments;
