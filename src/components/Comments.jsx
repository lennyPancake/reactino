import React, { useContext, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { RootStoreContext } from "..";
import { Card } from "react-bootstrap";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";
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
                    <div className="d-flex">
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
              <h5>Здесь пока нет комментариев :(</h5>
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
