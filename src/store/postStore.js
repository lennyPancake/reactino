import axios from "axios";
import { makeAutoObservable } from "mobx";

class PostStore {
  posts = [];
  userPosts = [];
  constructor() {
    makeAutoObservable(this);
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
      this.userPosts = response.data;
      console.log("posts", response.data);
    } catch (error) {
      console.error("Ошибка при получении постов:", error);
    }
  }
}

export default PostStore;
