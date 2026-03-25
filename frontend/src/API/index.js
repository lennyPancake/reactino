import axios from "axios";

const client = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
});

const loggedInClient = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
});

const interceptor = (config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.authorization = `Bearer ${token}`;
  }
  return config;
};
loggedInClient.interceptors.request.use(interceptor);

export { client };
export { loggedInClient };
