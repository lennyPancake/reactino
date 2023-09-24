import axios from "axios";
import { makeAutoObservable } from "mobx";

class PostStore {
  posts = [];
  post = {};
  constructor() {
    makeAutoObservable(this);
  }
  async getPost(id) {
    try {
      const response = await axios.get(`http://localhost:8000/posts/${id}`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      this.post = response.data;
      console.log("post - ", response.data);
    } catch (error) {
      console.error("Ошибка при получении поста:", error);
    }
  }
  async getPosts() {
    try {
      const response = await axios.get(`http://localhost:8000/posts`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      this.posts = response.data;
      console.log("posts", response.data);
    } catch (error) {
      console.error("Ошибка при получении постов:", error);
    }
  }
  async getPostsFromUserId(userId) {
    try {
      const response = await axios.get(
        `http://localhost:8000/posts?authorId=${userId}`,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      this.posts = response.data;
      console.log("posts", response.data);
    } catch (error) {
      console.error("Ошибка при получении постов:", error);
    }
  }
}

export default PostStore;
