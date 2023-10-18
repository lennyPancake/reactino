import React, { useContext, useEffect } from "react";
import { RootStoreContext } from "..";
import { observer } from "mobx-react-lite";
import { ListGroup } from "react-bootstrap";
import Image from "react-bootstrap/Image";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router";
import LoadingSpinner from "./LoadingSpinner";

const UsersList = observer(() => {
  const { userStore } = useContext(RootStoreContext);
  const navigate = useNavigate();
  if (userStore.isLoading) {
    return (
      <div style={{ marginLeft: "310px" }}>
        {" "}
        <LoadingSpinner />;
      </div>
    );
  }
  return (
    <div style={{ marginLeft: "310px" }} className="ml-3">
      <ListGroup className="bg-dark">
        {userStore.users.map((user) => (
          <div>
            <ListGroup.Item
              key={user.id}
              className=" border-dark bg-secondary bg-opacity-10 d-flex align-items-center"
              style={{ height: "100px" }}
            >
              <Image
                src={user.avatar}
                alt="Аватар"
                rounded
                style={{
                  maxWidth: "90px",
                  maxHeight: "90px",
                  width: "auto",
                  marginRight: "10px",
                }}
              />
              <div style={{ width: "30%" }}>
                <h5>
                  {user.first_name} {user.last_name}
                </h5>
                <p>Email: {user.email}</p>
                {/*<p>ID: {user.id}</p>*/}
              </div>
              <div
                style={{ width: "100%" }}
                className="d-flex justify-content-end"
              >
                <Button
                  variant="outline-light"
                  onClick={() => {
                    navigate(`/users/${user.id}`);
                  }}
                >
                  Перейти...
                </Button>
              </div>
            </ListGroup.Item>
          </div>
        ))}
      </ListGroup>
    </div>
  );
});

export default UsersList;
