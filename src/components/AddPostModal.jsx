import { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import axios from "axios";
import { useContext } from "react";
import { RootStoreContext } from "..";
import "../index.css";

function AddPostModal() {
  const [show, setShow] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const { postStore } = useContext(RootStoreContext);
  const [postData, setPostData] = useState({
    title: "",
    content: "",
    authorId: JSON.parse(sessionStorage.getItem("mainUser")).id,
    image: "",
  });
  const handleCreatePost = () => {
    // Проверяем, что все необходимые поля заполнены
    if (!postData.title || !postData.content || !postData.image) {
      alert("Заполните все поля");
      console.log("image:", postData.image);
      return;
    }

    // Отправляем POST-запрос на сервер для создания поста
    axios
      .post("http://localhost:8000/posts", postData, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log("Пост успешно создан", response.data);
        // Очищаем данные формы после успешной отправки
        setPostData({
          title: "",
          content: "",
          authorId: JSON.parse(sessionStorage.getItem("mainUser")).id,
          image: "",
        });
      })
      .catch((error) => {
        console.error("Ошибка при создании поста", error);
      })
      .finally(() => {
        handleClose();
        postStore.getPostsFromUserId(postData.authorId);
      });
  };

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
      <Button
        style={{ marginLeft: "320px", width: "62.4%", height: "50px" }}
        variant="outline-secondary"
        className="text-light"
        onClick={handleShow}
      >
        Создать пост
      </Button>

      <Modal show={show} onHide={handleClose}>
        <div className="bg-dark mt-0">
          <Modal.Header closeButton>
            <Modal.Title>Создать пост</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group
                className=" mb-3"
                controlId="exampleForm.ControlInput1"
              >
                <Form.Label>Загрузить изображение: </Form.Label>
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
            <Button variant="secondary" onClick={handleClose}>
              Закрыть
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                handleCreatePost();
              }}
            >
              Опубликовать пост
            </Button>
          </Modal.Footer>
        </div>
      </Modal>
    </>
  );
}

export default AddPostModal;
