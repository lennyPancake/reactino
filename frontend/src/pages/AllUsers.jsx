import React, { useContext, useEffect } from "react";
import { RootStoreContext } from "..";
import UsersList from "../components/UsersList";
import withAuth from "../components/withAuth";
import "./Pages.css";

const AllUsers = () => {
  const { userStore } = useContext(RootStoreContext);

  useEffect(() => {
    if (!userStore.isLoading && userStore.users.length === 0) {
      userStore.fetchUsers();
    }
  }, [userStore]);

  return (
    <div className="page-wrapper">
      <h1 className="page-title">Все блоги</h1>
      <UsersList />
    </div>
  );
};

export default withAuth(AllUsers);
