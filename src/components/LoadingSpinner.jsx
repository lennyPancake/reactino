import React from "react";
import { Spinner } from "react-bootstrap";
import { useContext } from "react";
import { RootStoreContext } from "..";
const LoadingSpinner = () => {
  const { userStore, postStore } = useContext(RootStoreContext);
  console.log("t/f?", postStore.isLoadingPosts);
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "500px",

        backgroundColor: "#212529", // Цвет фона
      }}
    >
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </div>
  );
};

export default LoadingSpinner;
