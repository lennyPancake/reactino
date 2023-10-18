import React, { useContext, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { RootStoreContext } from "..";
import { Card } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";
import { Link } from "react-router-dom";
import Dropdown from "react-bootstrap/Dropdown";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import EditPostModal from "./EditPostModal";
import LoadingSpinner from "./LoadingSpinner";
const PostsList = observer(() => {
  const navigate = useNavigate();
  const { userStore, postStore } = useContext(RootStoreContext);
  let mainUserId = undefined;
  if (sessionStorage.length == 0) {
    navigate("/login");
  } else {
    mainUserId = JSON.parse(sessionStorage.getItem("mainUser")).id;
  }
  const [showModal, setShowModal] = useState(false);
  const [editPostData, setEditPostData] = useState({});
  const handleDeletePost = (postId) => {
    postStore.deletePostById(postId);
  };

  if (postStore.isLoading) {
    return (
      <div style={{ marginLeft: "250px", width: "80%" }}>
        {" "}
        <LoadingSpinner />;
      </div>
    );
  } else {
    if (postStore.posts.length == 0) {
      return (
        <div
          style={{
            fontSize: "22px",
            width: "100%",
            textAlign: "center",
            marginLeft: "0",
          }}
        >
          Здесь пока пусто :(
        </div>
      );
    }
  }

  return (
    <>
      <EditPostModal
        show={showModal}
        onClose={() => {
          setShowModal(false);
        }}
        editPostData={editPostData}
      />
      <div style={{ width: "100%", marginLeft: "310px" }}>
        {postStore.posts.map((post) => {
          const author = userStore.users.find(
            (user) => user.id === post.authorId
          );

          return (
            <Card
              key={post.id}
              style={{
                color: "white",
                backgroundColor: "#3f4653",
                height: "auto",
                maxWidth: "100%",
                marginLeft: "10px",
                width: "80%",
                maxHeight: "none",
                marginTop: "10px",
              }}
            >
              <div className="mb-2">
                {author && (
                  <Card.Header
                    style={{
                      marginTop: "0",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <div className="d-flex mt-0">
                      <Col
                        xs={2}
                        md={1}
                        style={{ marginTop: "0", width: "auto" }}
                      >
                        <Image
                          style={{
                            maxWidth: "35px",
                            maxHeight: "35px",
                            width: "auto",
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
                          alignSelf: "center",
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
              <div style={{ display: "flex", justifyContent: "center" }}>
                {post.image ? (
                  <Card.Img
                    variant="top"
                    style={{
                      maxHeight: "50%",
                      maxWidth: "35%",
                      width: "auto",
                    }}
                    src={post.image}
                  />
                ) : (
                  ""
                )}
              </div>
              <Card.Body>
                <Card.Title>{post.title}</Card.Title>
                <Card.Text
                  style={{
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {post.content}
                </Card.Text>
                <Link to={`/posts/${post.id}`}>
                  <Button variant="outline-light">Подробнее...</Button>
                </Link>
              </Card.Body>
            </Card>
          );
        })}
      </div>
    </>
  );
});

export default PostsList;
