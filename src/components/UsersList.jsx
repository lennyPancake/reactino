import React, { useContext, useEffect } from "react";
import { RootStoreContext } from "..";
import { observer } from "mobx-react-lite";
import { ListGroup } from "react-bootstrap";
import Image from "react-bootstrap/Image";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router";

const UsersList = observer(() => {
  const { userStore } = useContext(RootStoreContext);
  //console.log("qq", userStore.users[0].id);
  const navigate = useNavigate();
  useEffect(() => {
    !userStore.isLoading
      ? userStore.fetchUsers()
      : console.log("идет загрузка");
  }, []);

  return (
    <div style={{ marginLeft: "310px" }} className="ml-3">
      <h1>Список Блогов</h1>
      <ListGroup className="bg-dark">
        {userStore.users.map((user) => (
          <div>
            <ListGroup.Item
              key={user.id}
              className=" border-dark bg-secondary bg-opacity-10 d-flex align-items-center"
            >
              <Image
                src={user.avatar}
                alt="Аватар"
                roundedCircle
                style={{ width: "80px", height: "80px", marginRight: "10px" }}
              />
              <div style={{ width: "30%" }}>
                <h5>
                  {user.first_name} {user.last_name}
                </h5>
                <p>Email: {user.email}</p>
                <p>ID: {user.id}</p>
              </div>
              <div
                style={{ width: "100%" }}
                className="d-flex justify-content-end"
              >
                <Button
                  variant="primary"
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
