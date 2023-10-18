import { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { useContext } from "react";
import { RootStoreContext } from "..";
import "../index.css";
import { loadFile } from "../API/fileAPI";

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
    if (!postData.title || !postData.content) {
      alert("Заполните название и содержимое поста!");
      return;
    }
    postStore
      .createPostByData(postData)
      .then((response) => {
        console.log("Пост успешно создан", response.data);
        setPostData({
          title: "",
          content: "",
          authorId: JSON.parse(sessionStorage.getItem("mainUser")).id,
          image: "",
        });
        setLoaded(true);
      })
      .catch((error) => {
        console.error("Ошибка при создании поста", error);
      })
      .finally(() => {
        handleClose();
      });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setPostData({ ...postData, [name]: value });
  };
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    loadFile(formData)
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
        style={{
          marginTop: "15px",
          marginLeft: "320px",
          width: "62.4%",
          height: "50px",
        }}
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
            <Form onSubmit={handleCreatePost}>
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
                {loaded && postData.image ? (
                  <div style={{ color: "green" }}>
                    Изображение успешно загружено
                  </div>
                ) : (
                  ""
                )}
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
