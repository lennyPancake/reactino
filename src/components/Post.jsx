import React, { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { RootStoreContext } from "..";
import { Card } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";
import { Link } from "react-router-dom";
import AddComment from "./AddComment";
import Navb from "./Navb";

const Post = observer((props) => {
  const { userStore, postStore, commentStore } = useContext(RootStoreContext);
  // Получаем информацию о посте по его id
  const { postId } = props;
  useEffect(() => {
    // Загрузка поста
    postStore.getPost(postId);

    // Загрузка комментариев для данного поста
    commentStore.getCommentsForPost(postId);
  }, [postId, postStore, commentStore]);

  const post = postStore.post;
  if (!post) {
    return <div>Loading...</div>;
  }

  const author = userStore.users.find((user) => user.id === post.authorId);

  return (
    <div style={{ marginLeft: "310px" }}>
      <Card
        key={post.id}
        style={{
          color: "white",
          backgroundColor: "#3f4653",
          width: "80%",
          marginLeft: "10px",
          marginTop: "10px",
        }}
      >
        {author && (
          <Card.Header style={{ display: "flex" }}>
            <Col xs={2} md={1} style={{ width: "auto" }}>
              <Image
                style={{
                  width: "30px",
                  height: "30px",
                  marginRight: "10px",
                }}
                src={author.avatar}
                roundedCircle
              />
            </Col>
            <div>
              {author.first_name} {author.last_name}
            </div>
          </Card.Header>
        )}

        <Card.Img
          variant="top"
          style={{ width: "44%", marginTop: "10px", marginLeft: "25%" }}
          src="http://localhost:8000/images/night.jpg"
        />
        <Card.Body>
          <Card.Title>{post.title}</Card.Title>
          <Card.Text>{post.content}</Card.Text>

          {/* Ссылка для возврата на страницу постов */}
          <Link to="/posts/">
            <Button variant="outline-light">Назад к постам</Button>
          </Link>
        </Card.Body>
      </Card>

      {/* Выводим комментарии */}
      <div style={{ marginTop: "20px" }}>
        <h3>Комментарии</h3>
        {commentStore.comments.map((comment) => (
          <Card
            key={comment.id}
            style={{
              backgroundColor: "#3f4653",
              width: "80%",
              marginLeft: "10px",
              marginTop: "10px",
            }}
          >
            <Card.Header>
              <Col xs={2} md={1} style={{ width: "auto" }}>
                <Image
                  style={{
                    width: "30px",
                    height: "30px",
                    marginRight: "10px",
                  }}
                  src={
                    userStore.users.find((user) => user.id === comment.authorId)
                      .avatar
                  }
                  roundedCircle
                />
              </Col>
              <div>
                {
                  userStore.users.find((user) => user.id === comment.authorId)
                    .first_name
                }{" "}
                {
                  userStore.users.find((user) => user.id === comment.authorId)
                    .last_name
                }
              </div>
            </Card.Header>
            <Card.Body>
              <Card.Text style={{ color: "white" }}>{comment.text}</Card.Text>
            </Card.Body>
          </Card>
        ))}
      </div>
    </div>
  );
});

export default Post;
