import React, { useState, useContext, useCallback } from "react";
import { Form, Button } from "react-bootstrap";
import RootStoreContext from "../RootStoreContext";
import "./AddComment.css";

const AddComment = ({ postId }) => {
  const [text, setText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { commentStore } = useContext(RootStoreContext);

  const mainUserId = JSON.parse(sessionStorage.getItem("mainUser"))?.id;

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (text.trim() === "" || isSubmitting) return;

      setIsSubmitting(true);

      const newComment = {
        text: text.trim(),
        postId,
      };

      try {
        await commentStore.addComment(newComment);
        setText("");
      } finally {
        setIsSubmitting(false);
      }
    },
    [text, postId, mainUserId, commentStore, isSubmitting],
  );

  return (
    <div className="add-comment-section">
      <h4 className="add-comment-title">Добавить комментарий</h4>
      <Form onSubmit={handleSubmit} className="add-comment-form">
        <Form.Group controlId="commentText">
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Напишите ваш комментарий..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="comment-textarea"
            disabled={isSubmitting}
          />
        </Form.Group>
        <div className="add-comment-actions">
          <Button
            type="submit"
            variant="success"
            className="btn-custom"
            disabled={!text.trim() || isSubmitting}
          >
            {isSubmitting ? "Отправка..." : "Отправить"}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default AddComment;
