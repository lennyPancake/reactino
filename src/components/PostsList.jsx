import React, { useContext } from "react";
import { observer } from "mobx-react-lite";
import { RootStoreContext } from "..";
import { Card } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import MainUser from "./MainUser";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";

const PostsList = observer(() => {
  const { userStore, postStore } = useContext(RootStoreContext);

  return (
    <div style={{ marginLeft: "310px" }}>
      {postStore.userPosts.map((post) => {
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
              <Button variant="outline-light">Подробнее...</Button>
            </Card.Body>
          </Card>
        );
      })}
    </div>
  );
});

export default PostsList;
