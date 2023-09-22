import React from "react";
import { useContext } from "react";
import { RootStoreContext } from "..";

const MainUser = () => {
  const { userStore } = useContext(RootStoreContext);
  const storedMainUser = sessionStorage.getItem("mainUser"); //delete
  if (storedMainUser) {
    userStore.mainUser = JSON.parse(storedMainUser);
  }
  return (
    <div
      style={{
        marginTop: "250px",
        marginLeft: "100px",
        position: "fixed",
        color: "white",
      }}
    >
      <div>
        {userStore.mainUser.first_name} {userStore.mainUser.last_name}
      </div>
      <div>{userStore.mainUser.email}</div>
    </div>
  );
};

export default MainUser;
