import React from "react";
import { Card, Image, Dropdown, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./PostCard.css";

const PostCard = ({
  post,
  author,
  isOwner,
  onEdit,
  onDelete,
  showFullContent = false,
  showBackButton = false,
}) => {
  if (!post) return null;

  return (
    <Card className="post-card stagger-item">
      {author && (
        <Card.Header className="post-card-header">
          <div className="post-author">
            <Image
              src={author.avatar}
              className="avatar avatar-sm"
              alt={`${author.first_name} ${author.last_name}`}
            />
            <span className="author-name">
              {author.first_name} {author.last_name}
            </span>
          </div>

          {isOwner && onEdit && onDelete && (
            <Dropdown align="end">
              <Dropdown.Toggle
                variant="link"
                className="post-actions-toggle"
                id={`post-dropdown-${post.id}`}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="1" />
                  <circle cx="19" cy="12" r="1" />
                  <circle cx="5" cy="12" r="1" />
                </svg>
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => onEdit(post)}>
                  Изменить
                </Dropdown.Item>
                <Dropdown.Item 
                  onClick={() => onDelete(post.id)}
                  className="text-danger"
                >
                  Удалить
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          )}
        </Card.Header>
      )}

      {post.image && (
        <div className="post-image-container">
          <Card.Img
            variant="top"
            src={post.image}
            className="post-image"
            alt={post.title}
          />
        </div>
      )}

      <Card.Body className="post-card-body">
        <Card.Title className="post-title">{post.title}</Card.Title>
        <Card.Text className={`post-content ${!showFullContent ? "truncated" : ""}`}>
          {post.content}
        </Card.Text>

        <div className="post-actions">
          {showBackButton ? (
            <Link to="/posts/">
              <Button variant="outline-light" className="btn-custom">
                Назад к постам
              </Button>
            </Link>
          ) : (
            <Link to={`/posts/${post.id}`}>
              <Button variant="outline-light" className="btn-custom">
                Подробнее
              </Button>
            </Link>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

export default PostCard;
