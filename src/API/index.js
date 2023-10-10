import axios from "axios";

const client = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
});

const loggedInClient = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
});

const interceptor = (config) => {
  config.headers.authorization = localStorage.getItem("token");
  return config;
};
loggedInClient.interceptors.request.use(interceptor);

export { client };
export { loggedInClient };
