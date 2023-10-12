import { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import axios from "axios";
import { useContext, useEffect } from "react";
import { RootStoreContext } from "..";
import "../index.css";

const EditPostModal = ({ show, onClose, editPostData }) => {
  const [loaded, setLoaded] = useState(false);
  const { postStore } = useContext(RootStoreContext);
  const [postData, setPostData] = useState(editPostData);
  useEffect(() => {
    setPostData(editPostData);
  }, [editPostData]);

  const handleEditPost = () => {
    // Проверяем, что все необходимые поля заполнены
    if (!postData.title || !postData.content || !postData.image) {
      alert("Заполните все поля");
      console.log("image:", postData.image);
      return;
    }
    postStore.updatePostByData(postData);
  };
  console.log("show:", editPostData);
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setPostData({ ...postData, [name]: value });
    console.log("Имя", name);
    console.log("value", value);
  };
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    axios
      .post("http://localhost:8000/file", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log("Загрузка прошла успешно", response.data);
        setLoaded(true);
        postData.image = response.data.filepath;
      })
      .catch((error) => {
        console.error("Ошибка при загрузке", error);
      });
  };

  return (
    <>
      <Modal
        show={show}
        onHide={() => {
          onClose();
        }}
      >
        <div className="bg-dark mt-0">
          <Modal.Header closeButton>
            <Modal.Title>Редактировать пост</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group
                className=" mb-3"
                controlId="exampleForm.ControlInput1"
              >
                <Form.Label>Изменить изображение: </Form.Label>
                <Form.Control
                  type="file"
                  name="image"
                  onChange={handleImageChange}
                  className="mt-3"
                />
              </Form.Group>
              <Form.Group
                className=" mb-3"
                controlId="exampleForm.ControlInput1"
              >
                <Form.Label>Название поста:</Form.Label>
                <Form.Control
                  type="text"
                  name="title"
                  value={postData.title}
                  onChange={handleInputChange}
                  placeholder="Введите название поста"
                  autoFocus
                />
              </Form.Group>
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlTextarea1"
              >
                <Form.Label>Содержание поста:</Form.Label>
                <Form.Control
                  value={postData.content}
                  onChange={handleInputChange}
                  name="content"
                  type="text"
                  as="textarea"
                  rows={3}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => onClose()}>
              Закрыть
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                handleEditPost();
              }}
            >
              Сохранить изменения
            </Button>
          </Modal.Footer>
        </div>
      </Modal>
    </>
  );
};

export default EditPostModal;
