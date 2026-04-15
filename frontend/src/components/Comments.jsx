import { useContext } from "react";
import { observer } from "mobx-react-lite";
import RootStoreContext from "../RootStoreContext";
import { Card, Image } from "react-bootstrap";
import LoadingSpinner from "./LoadingSpinner";
import "./Comments.css";

const CommentCard = ({ comment }) => {
  const { author } = comment; // Автор уже внутри комментария
  if (!author) return null;

  return (
    <Card className="comment-card stagger-item">
      <Card.Header className="comment-header d-flex align-items-center">
        <Image
          // Добавляем BASE_URL, если аватар — это относительный путь
          src={
            author.avatar
              ? `${process.env.REACT_APP_BASE_URL}${author.avatar}`
              : `${process.env.REACT_APP_BASE_URL}/static/images/noavatar.png`
          }
          className="avatar-sm rounded-circle me-2"
          alt="avatar"
          style={{ width: "32px", height: "32px", objectFit: "cover" }}
        />
        <span className="author-name fw-bold">
          {author.first_name} {author.last_name}
        </span>
      </Card.Header>
      <Card.Body className="comment-body">
        <Card.Text className="comment-text">{comment.text}</Card.Text>
      </Card.Body>
    </Card>
  );
};

const Comments = observer(({ postId }) => {
  const { commentStore } = useContext(RootStoreContext);

  // Теперь мы просто берем список из стора
  const comments = commentStore.comments;

  if (commentStore.isLoading) return <LoadingSpinner fullPage={false} />;

  return (
    <div className="comments-section">
      <h3 className="comments-title">
        Комментарии {comments.length > 0 && `(${comments.length})`}
      </h3>

      {comments.length > 0 ? (
        <div className="comments-list">
          {comments.map((comment) => (
            <CommentCard key={comment.id} comment={comment} />
          ))}
        </div>
      ) : (
        <div className="comments-empty text-muted">
          <p>Будьте первым, кто оставит комментарий!</p>
        </div>
      )}
    </div>
  );
});

export default Comments;
