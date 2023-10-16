import { loggedInClient } from ".";

export const getCommentsByPostId = async (id) => {
  const res = await loggedInClient.get(`/comments?postId=${id}`);
  return res;
};

export const add = async (comment) => {
  const res = await loggedInClient.post("/comments", comment);
  return res;
};
