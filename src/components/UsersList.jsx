import React, { useContext } from "react";
import { RootStoreContext } from "..";

const UsersList = observer(() => {
  const { userStore } = useContext(RootStoreContext);

  return <div></div>;
});

export default UsersList;
