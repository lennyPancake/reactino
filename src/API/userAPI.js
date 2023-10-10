import { client } from "./index";

export const login = async (username, password) => {
  const res = await client.post("/login", {
    username: username,
    password: password,
  });
  return res;
};

export const register = async (user) => {
  const res = await client.post("/register", user);
  return res;
};

export const getUsers = async () => {
  const res = await client.get("/users");
  return res;
};
