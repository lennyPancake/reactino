import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";
import { Spinner } from "react-bootstrap";
import LoadingSpinner from "./LoadingSpinner";

function withAuth(Component) {
  return function AuthenticatedComponent(props) {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      if (token) {
        const decodedToken = jwt_decode(token);
        const currentTime = Date.now() / 1000;
        console.log("decoded token: ", decodedToken);
        if (decodedToken.exp < currentTime) {
          navigate("/login");
          console.log("Токен истек. redirect...");
        }
      } else {
        navigate("/login");
        console.log("Токен отсутствует. redirect...");
      }
      setIsLoading(false);
    }, [token, navigate]);

    return isLoading ? <LoadingSpinner /> : <Component {...props} />;
  };
}

export default withAuth;
