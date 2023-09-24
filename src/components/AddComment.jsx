import React, { useState, useContext } from "react";
import { Form, Button } from "react-bootstrap";
import { observer } from "mobx-react-lite";
import { RootStoreContext } from "..";

const AddComment = observer(({ postId }) => {
  const [text, setText] = useState("");
  const { commentStore } = useContext(RootStoreContext);
  const mainUserId = JSON.parse(sessionStorage.getItem("mainUser")).id;
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (text.trim() === "") {
      return;
    }

    // Создаем объект комментария
    const newComment = {
      text: text,
      postId: postId,
      authorId: mainUserId,
      id: Date.now(),
    };

    // Добавляем комментарий
    await commentStore.addComment(newComment);

    // Очищаем поле ввода после добавления
    setText("");
  };

  return (
    <div style={{ marginLeft: "310px" }}>
      <h4>Добавить комментарий</h4>
      <Form onSubmit={handleAddComment}>
        <Form.Group controlId="commentText">
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Введите комментарий"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </Form.Group>
        <Button type="submit" variant="success">
          Добавить комментарий
        </Button>
      </Form>
    </div>
  );
});

export default AddComment;
