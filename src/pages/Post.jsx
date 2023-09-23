import React, { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { RootStoreContext } from "..";
import { Card } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";
import { Link } from "react-router-dom";

const Post = observer(() => {
  const { id } = useParams(); // Получаем id поста из параметров маршрута
  const { userStore, postStore, commentStore } = useContext(RootStoreContext);

  // Получаем информацию о посте по его id
  const post = postStore.posts.find((post) => post.id === parseInt(id));

  useEffect(() => {
    // Загрузка комментариев для данного поста
    commentStore.getCommentsForPost(id);
  }, [id, commentStore]);

  if (!post) {
    return <div>Loading...</div>;
  }

  const author = userStore.users.find((user) => user.id === id);

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
                  src={userStore.posts}
                  roundedCircle
                />
              </Col>
              <div>
                {comment.user.first_name} {comment.user.last_name}
              </div>
            </Card.Header>
            <Card.Body>
              <Card.Text>{comment.text}</Card.Text>
            </Card.Body>
          </Card>
        ))}
      </div>
    </div>
  );
});

export default Post;
