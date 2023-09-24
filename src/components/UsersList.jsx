import React, { useContext } from "react";
import { RootStoreContext } from "..";
import { observer } from "mobx-react-lite";
const UsersList = observer(() => {
  const { userStore } = useContext(RootStoreContext);

  return <div></div>;
});

export default UsersList;
