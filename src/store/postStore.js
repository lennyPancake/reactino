import axios from "axios";
import { makeAutoObservable } from "mobx";
import { loggedInClient } from "../API";

class PostStore {
  posts = [];
  post = {};
  constructor() {
    makeAutoObservable(this);
    this.isLoadingPost = false;
    this.isLoadingPosts = false;
  }
  async getPost(id) {
    try {
      this.isLoadingPost = true;
      const response = await axios.get(`http://localhost:8000/posts/${id}`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      this.post = response.data;

      console.log("post - ", response.data);
    } catch (error) {
      console.error("Ошибка при получении поста:", error);
    } finally {
      this.isLoadingPost = false;
    }
  }
  async getPosts() {
    try {
      this.isLoadingPosts = true;
      const response = await axios.get(`http://localhost:8000/posts`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      this.posts = response.data;
      console.log("posts", response.data);
    } catch (error) {
      console.error("Ошибка при получении постов:", error);
    } finally {
      this.isLoadingPosts = false;
    }
  }
  async getPostsFromUserId(userId) {
    try {
      this.isLoadingPosts = true;
      const response = await loggedInClient.get(`/posts?authorId=${userId}`);
      this.posts = response.data;
      console.log("posts", response.data);
    } catch (error) {
      console.error("Ошибка при получении постов:", error);
    } finally {
      this.isLoadingPosts = false;
    }
  }
}

export default PostStore;
