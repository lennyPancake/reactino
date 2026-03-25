import { client } from "./index";

export const login = async (username, password) => {
  // OAuth2PasswordRequestForm expects form-url-encoded data
  const formData = new URLSearchParams();
  formData.append("username", username);
  formData.append("password", password);

  const res = await client.post("/login", formData, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
  return res;
};

export const register = async (user) => {
  const formData = new FormData();
  formData.append("email", user.email);
  formData.append("password", user.password);
  if (user.first_name) formData.append("first_name", user.first_name);
  if (user.last_name) formData.append("last_name", user.last_name);
  if (user.avatar) formData.append("avatar", user.avatar);
  const res = await client.post("/register", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res;
};
export const getUsers = async () => {
  const res = await client.get("/users");
  return res;
};
