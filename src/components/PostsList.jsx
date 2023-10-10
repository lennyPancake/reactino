import React, { useContext } from "react";
import { observer } from "mobx-react-lite";
import { RootStoreContext } from "..";
import { Card } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import MainUser from "./MainUser";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";
import { Link } from "react-router-dom";
import Dropdown from "react-bootstrap/Dropdown";
import axios from "axios";
import AddPostModal from "./AddPostModal";
import { useState } from "react";
import EditPostModal from "./EditPostModal";
import { toJS } from "mobx";
const PostsList = observer(() => {
  const { userStore, postStore } = useContext(RootStoreContext);
  const mainUserId = JSON.parse(sessionStorage.getItem("mainUser")).id;
  const [showModal, setShowModal] = useState(false);
  const [editPostData, setEditPostData] = useState({});
  const handleUpdatePost = (post) => {
    //setShowModal(true);
    console.log(showModal);
  };
  //console.log("users", userStore.users[0]);
  const handleDeletePost = (postId) => {
    axios
      .delete(`http://localhost:8000/posts/${postId}`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      })
      .then((response) => {
        // Обработка успешного удаления поста
        console.log(`Пост с идентификатором ${postId} удален.`);
        postStore.getPostsFromUserId(mainUserId);
      })
      .catch((error) => {
        // Обработка ошибок при удалении поста
        console.error(`Ошибка при удалении поста: ${error}`);
      });
  };

  return (
    <>
      <EditPostModal
        show={showModal}
        onClose={() => {
          setShowModal(false);
        }}
        editPostData={editPostData}
      />
      <div style={{ marginLeft: "310px" }}>
        {postStore.posts.length > 0 ? (
          postStore.posts.map((post) => {
            const author = userStore.users.find(
              (user) => user.id === post.authorId
            );

            return (
              <Card
                key={post.id}
                style={{
                  color: "white",
                  backgroundColor: "#3f4653",
                  height: "550px",
                  width: "80%",
                  marginLeft: "10px",
                  marginTop: "10px",
                }}
              >
                <div className="mb-2">
                  {author && (
                    <Card.Header style={{ marginTop: "0", display: "flex" }}>
                      <div className="d-flex mt-0">
                        <Col
                          xs={2}
                          md={1}
                          style={{ marginTop: "0", width: "auto" }}
                        >
                          <Image
                            style={{
                              width: "30px",
                              height: "30px",
                              marginRight: "10px",
                              marginTop: "0",
                            }}
                            src={author.avatar}
                            roundedCircle
                          />
                        </Col>
                        <div
                          style={{
                            justifyContent: "center",
                            display: "flex",
                            flexWrap: "nowrap",
                            marginTop: "0",
                          }}
                        >
                          <div>{author.first_name} </div>&nbsp;
                          <div>{author.last_name}</div>
                        </div>
                      </div>

                      <div
                        style={{ marginTop: "0", width: "80%" }}
                        className="d-flex justify-content-end"
                      >
                        {mainUserId == author.id ? (
                          <Dropdown
                            style={{
                              marginTop: "0",
                            }}
                          >
                            <Dropdown.Toggle
                              variant="secondary"
                              id="dropdown-basic"
                            ></Dropdown.Toggle>

                            <Dropdown.Menu>
                              <Dropdown.Item
                                onClick={() => {
                                  setEditPostData(post);
                                  setShowModal(true);
                                }}
                              >
                                Изменить
                              </Dropdown.Item>
                              <Dropdown.Item
                                onClick={() => handleDeletePost(post.id)}
                              >
                                Удалить
                              </Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        ) : (
                          ""
                        )}
                      </div>
                    </Card.Header>
                  )}
                </div>
                <Card.Img
                  variant="top"
                  style={{ width: "44%", marginTop: "10px", marginLeft: "25%" }}
                  src={post.image}
                />
                <Card.Body>
                  <Card.Title>{post.title}</Card.Title>
                  <Card.Text>{post.content}</Card.Text>
                  <Link to={`/posts/${post.id}`}>
                    <Button variant="outline-light">Подробнее...</Button>
                  </Link>
                </Card.Body>
              </Card>
            );
          })
        ) : (
          <h3>Здесь пока пусто</h3>
        )}
      </div>
    </>
  );
});

export default PostsList;
