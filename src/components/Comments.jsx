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
import LoadingSpinner from "./LoadingSpinner";

const Comments = observer((postId) => {
  const { commentStore, userStore } = useContext(RootStoreContext);

  return (
    <div>
      {!commentStore.isLoading ? (
        <div style={{ marginLeft: "310px" }}>
          <div style={{ marginTop: "20px" }}>
            <h3>Комментарии</h3>
            {commentStore.comments.length > 0 ? (
              commentStore.comments.map((comment) => (
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
                          userStore.users.find(
                            (user) => user.id === comment.authorId
                          ).avatar
                        }
                        roundedCircle
                      />
                    </Col>
                    <div>
                      {
                        userStore.users.find(
                          (user) => user.id === comment.authorId
                        ).first_name
                      }{" "}
                      {
                        userStore.users.find(
                          (user) => user.id === comment.authorId
                        ).last_name
                      }
                    </div>
                  </Card.Header>
                  <Card.Body>
                    <Card.Text style={{ color: "white" }}>
                      {comment.text}
                    </Card.Text>
                  </Card.Body>
                </Card>
              ))
            ) : (
              <div>Здесь пока пусто:(</div>
            )}
          </div>{" "}
        </div>
      ) : (
        <LoadingSpinner />
      )}
    </div>
  );
});

export default Comments;
