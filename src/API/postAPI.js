import { loggedInClient } from "./index";

export const getPosts = async () => {
  const res = await loggedInClient.get("/posts");
  return res;
};
export const getPostsFromUser = async (id) => {
  const res = await loggedInClient.get(`/posts?authorId=${id}`);
  return res;
};

export const getPost = async (id) => {
  const res = await loggedInClient.get(`/posts/${id}`);
  return res;
};
export const createPost = async (post) => {
  const res = await loggedInClient.post("/post", post);
  return res;
};
export const deletePost = async (id) => {
  const res = await loggedInClient.delete(`/posts/${id}`);
  return res;
};
export const updatePost = async (postData) => {
  const res = await loggedInClient.put(`/posts`, postData);
  return res;
};
