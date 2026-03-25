import { client } from ".";

export const loadFile = async (file) => {
  const response = await client.post("/file", file, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return response;
};
