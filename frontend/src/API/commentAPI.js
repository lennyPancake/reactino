import { loggedInClient } from ".";

export const getCommentsByPostId = async (id) => {
  const res = await loggedInClient.get(`/posts/${id}/comments`);
  return res;
};

export const add = async (comment) => {
  const res = await loggedInClient.post("/comments", comment);
  return res;
};
