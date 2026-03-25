import React, { useState, useContext, useCallback } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { RootStoreContext } from "..";
import { loadFile } from "../API/fileAPI";
import "./PostModal.css";

const INITIAL_POST_DATA = {
  title: "",
  content: "",
  image: "",
};

const AddPostModal = () => {
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const { postStore } = useContext(RootStoreContext);

  const [postData, setPostData] = useState(() => ({
    ...INITIAL_POST_DATA,
    authorId: JSON.parse(sessionStorage.getItem("mainUser"))?.id,
  }));

  const handleClose = useCallback(() => {
    setShow(false);
    setPostData({
      ...INITIAL_POST_DATA,
      authorId: JSON.parse(sessionStorage.getItem("mainUser"))?.id,
    });
    setImageLoaded(false);
  }, []);

  const handleShow = useCallback(() => setShow(true), []);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setPostData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleImageChange = useCallback(async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await loadFile(formData);
      // Сервер вернет { "filepath": "/static/images/photo.jpg" }
      setPostData((prev) => ({ ...prev, image: response.data.filepath }));
      setImageLoaded(true);
    } catch (error) {
      console.error("Ошибка при загрузке:", error);
    }
  }, []);

  const handleCreatePost = useCallback(async () => {
    if (!postData.title.trim() || !postData.content.trim()) {
      alert("Заполните название и содержимое поста!");
      return;
    }

    setIsLoading(true);
    try {
      await postStore.createPostByData(postData);
      handleClose();
    } catch (error) {
      console.error("Ошибка при создании поста:", error);
    } finally {
      setIsLoading(false);
    }
  }, [postData, postStore, handleClose]);

  return (
    <>
      <button className="add-post-button" onClick={handleShow}>
        + Создать новый пост
      </button>

      <Modal
        show={show}
        onHide={handleClose}
        contentClassName="bg-dark text-white"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Создать пост</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Изображение</Form.Label>
              <Form.Control
                type="file"
                name="image"
                onChange={handleImageChange}
                accept="image/*"
              />
              {imageLoaded && (
                <div className="upload-success">Изображение загружено</div>
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Название поста</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={postData.title}
                onChange={handleInputChange}
                placeholder="Введите название"
                autoFocus
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Содержание</Form.Label>
              <Form.Control
                as="textarea"
                name="content"
                value={postData.content}
                onChange={handleInputChange}
                rows={4}
                placeholder="О чем хотите рассказать?"
              />
            </Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Отмена
          </Button>
          <Button
            variant="primary"
            onClick={handleCreatePost}
            disabled={isLoading}
            className="bg-purple"
          >
            {isLoading ? "Публикация..." : "Опубликовать"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AddPostModal;
