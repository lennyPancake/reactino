import React from "react";
import UsersList from "../components/UsersList";
import Navb from "../components/Navb";
import withAuth from "../components/withAuth";
import { useContext, useEffect } from "react";
import { RootStoreContext } from "..";

const AllUsers = () => {
  const { userStore } = useContext(RootStoreContext);
  useEffect(() => {
    !userStore.isLoading
      ? userStore.fetchUsers()
      : console.log("идет загрузка");
  }, []);
  return (
    <div>
      <Navb />
      <UsersList />
    </div>
  );
};

export default withAuth(AllUsers);
