import React, { useState, useContext } from "react";
import { Form, Button } from "react-bootstrap";
import { RootStoreContext } from "..";

const AddComment = ({ postId }) => {
  const [text, setText] = useState("");
  const { commentStore } = useContext(RootStoreContext);
  const mainUserId = JSON.parse(sessionStorage.getItem("mainUser")).id;
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (text.trim() === "") {
      return;
    }
    const newComment = {
      text: text,
      postId: postId,
      authorId: mainUserId,
      id: Date.now(),
    };
    await commentStore.addComment(newComment);
    setText("");
  };

  return (
    <div style={{ height: "200px", marginLeft: "310px" }}>
      <h4>Добавить комментарий</h4>
      <Form style={{ width: "40%" }} onSubmit={handleAddComment}>
        <Form.Group controlId="commentText">
          <Form.Control
            className="bg-muted"
            as="textarea"
            rows={3}
            placeholder="Введите комментарий"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </Form.Group>
        <Button className="mt-2" type="submit" variant="success">
          Добавить комментарий
        </Button>
      </Form>
    </div>
  );
};

export default AddComment;
