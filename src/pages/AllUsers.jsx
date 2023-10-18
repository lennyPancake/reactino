import React from "react";
import UsersList from "../components/UsersList";
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
    <>
      <h1 style={{ marginLeft: "310px" }}>Список Блогов</h1>
      <UsersList />
    </>
  );
};

export default withAuth(AllUsers);
