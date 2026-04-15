import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";
import LoadingSpinner from "./LoadingSpinner";

const withAuth = (WrappedComponent) => {
  const AuthenticatedComponent = (props) => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);

    const validateToken = useCallback(() => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return false;
      }

      try {
        const decodedToken = jwt_decode(token);
        const currentTime = Date.now() / 1000;

        if (decodedToken.exp < currentTime) {
          localStorage.removeItem("token");
          sessionStorage.removeItem("mainUser");
          navigate("/login");
          return false;
        }

        return true;
      } catch (error) {
        console.error("Ошибка декодирования токена:", error);
        localStorage.removeItem("token");
        sessionStorage.removeItem("mainUser");
        navigate("/login");
        return false;
      }
    }, [navigate]);

    useEffect(() => {
      const isValid = validateToken();
      setIsLoading(false);
      if (!isValid) {
        return;
      }
    }, [validateToken]);

    if (isLoading) {
      return <LoadingSpinner />;
    }

    return <WrappedComponent {...props} />;
  };

  AuthenticatedComponent.displayName = `withAuth(${
    WrappedComponent.displayName || WrappedComponent.name || "Component"
  })`;

  return AuthenticatedComponent;
};

export default withAuth;
