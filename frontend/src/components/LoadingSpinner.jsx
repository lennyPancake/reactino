import React from "react";
import { Spinner } from "react-bootstrap";

const LoadingSpinner = ({ fullPage = true, size = "md" }) => {
  const sizeMap = {
    sm: { width: "1.5rem", height: "1.5rem" },
    md: { width: "2rem", height: "2rem" },
    lg: { width: "3rem", height: "3rem" },
  };

  const containerStyle = fullPage
    ? {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "400px",
        width: "100%",
      }
    : {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "var(--spacing-lg)",
      };

  return (
    <div style={containerStyle}>
      <Spinner
        animation="border"
        role="status"
        variant="light"
        style={sizeMap[size]}
      >
        <span className="visually-hidden">Загрузка...</span>
      </Spinner>
    </div>
  );
};

export default LoadingSpinner;
