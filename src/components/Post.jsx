import React, { useContext, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { RootStoreContext } from "..";
import { Card } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";
import { Link } from "react-router-dom";
import AddComment from "./AddComment";
import LoadingSpinner from "./LoadingSpinner";
import Comments from "./Comments";

const Post = observer((props) => {
  const { userStore, postStore, commentStore } = useContext(RootStoreContext);
  const { postId } = props;
  useEffect(() => {
    postStore.getPostById(postId);
    userStore.fetchUsers();
    commentStore.getCommentsForPost(postId);
  }, []);

  const post = postStore.post;
  const author = userStore.users.find((user) => user.id === post.authorId);
  return (
    <div>
      {!postStore.isLoading ? (
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
            <div style={{ display: "flex", justifyContent: "center" }}>
              {post.image ? (
                <Card.Img
                  variant="top"
                  style={{
                    maxHeight: "50%",
                    maxWidth: "60%",
                    width: "auto",
                    margin: "5%",
                  }}
                  src={post.image}
                />
              ) : (
                ""
              )}
            </div>
            <Card.Body>
              <Card.Title>{post.title}</Card.Title>
              <Card.Text>{post.content}</Card.Text>
              <Link to="/posts/">
                <Button variant="outline-light">Назад к постам</Button>
              </Link>
            </Card.Body>
          </Card>
        </div>
      ) : (
        <LoadingSpinner />
      )}
      {<Comments postId={postId} />}
      <AddComment postId={postId} />{" "}
    </div>
  );
});

export default Post;
