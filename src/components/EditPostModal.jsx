import { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { useContext, useEffect } from "react";
import { RootStoreContext } from "..";
import { loadFile } from "../API/fileAPI";

const EditPostModal = ({ show, onClose, editPostData }) => {
  const [loaded, setLoaded] = useState(false);
  const { postStore } = useContext(RootStoreContext);
  const [postData, setPostData] = useState(editPostData);
  useEffect(() => {
    setPostData(editPostData);
  }, [editPostData]);

  const handleEditPost = () => {
    if (
      postData.title === editPostData.title &&
      postData.content === editPostData.content &&
      postData.image === editPostData.image
    ) {
      onClose();
    } else {
      postStore.updatePostByData(postData);
      onClose();
    }
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
                {loaded && postData.image ? (
                  <div style={{ color: "green" }}>
                    Изображение успешно загружено
                  </div>
                ) : (
                  ""
                )}
              </Form.Group>
              <Form.Group
                className="mb-3"
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
