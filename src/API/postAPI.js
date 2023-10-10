import { loggedInClient } from "./index";

export const getPosts = async () => {
  const res = await client.get("/posts");
  return res;
};

export const createPost = async (post) => {
  const res = await loggedInClient.post("/post", post);
  return res;
};
