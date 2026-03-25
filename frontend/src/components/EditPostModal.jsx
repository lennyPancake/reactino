import React, { useState, useContext, useEffect, useCallback } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { RootStoreContext } from "..";
import { loadFile } from "../API/fileAPI";
import "./PostModal.css";

const EditPostModal = ({ show, onClose, editPostData }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { postStore } = useContext(RootStoreContext);
  const [postData, setPostData] = useState(editPostData);

  useEffect(() => {
    setPostData(editPostData);
    setImageLoaded(false);
  }, [editPostData]);

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
      setPostData((prev) => ({ ...prev, image: response.data.filepath }));
      setImageLoaded(true);
    } catch (error) {
      console.error("Ошибка при загрузке изображения:", error);
    }
  }, []);

  const handleEditPost = useCallback(async () => {
    const isUnchanged =
      postData.title === editPostData.title &&
      postData.content === editPostData.content &&
      postData.image === editPostData.image;

    if (isUnchanged) {
      onClose();
      return;
    }

    if (!postData.title?.trim() || !postData.content?.trim()) {
      alert("Заполните название и содержимое поста!");
      return;
    }

    setIsLoading(true);
    try {
      await postStore.updatePostByData(postData);
      onClose();
    } catch (error) {
      console.error("Ошибка при обновлении поста:", error);
    } finally {
      setIsLoading(false);
    }
  }, [postData, editPostData, postStore, onClose]);

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Редактировать пост</Modal.Title>
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
              <div className="upload-success">
                Новое изображение загружено
              </div>
            )}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Название поста</Form.Label>
            <Form.Control
              type="text"
              name="title"
              value={postData.title || ""}
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
              value={postData.content || ""}
              onChange={handleInputChange}
              rows={4}
              placeholder="О чем хотите рассказать?"
            />
          </Form.Group>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Отмена
        </Button>
        <Button 
          variant="primary" 
          onClick={handleEditPost}
          disabled={isLoading}
        >
          {isLoading ? "Сохранение..." : "Сохранить"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditPostModal;
