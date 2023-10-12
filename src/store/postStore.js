import axios from "axios";
import { makeAutoObservable } from "mobx";
import { loggedInClient } from "../API";
import {
  deletePost,
  getPost,
  getPosts,
  getPostsFromUser,
  getPostsFromUserId,
  updatePost,
} from "../API/postAPI";

class PostStore {
  posts = [];
  post = {};
  constructor() {
    makeAutoObservable(this);
    this.isLoadingPost = false;
    this.isLoadingPosts = false;
  }
  async getPostById(id) {
    try {
      this.isLoadingPost = true;
      const response = await getPost(id);
      this.post = response.data;
      //console.log("post - ", response.data);
    } catch (error) {
      console.error("Ошибка при получении поста:", error);
    } finally {
      this.isLoadingPost = false;
    }
  }
  async getPosts() {
    try {
      this.isLoadingPosts = true;
      const response = await getPosts();
      this.posts = response.data;
      //console.log("posts", response.data);
    } catch (error) {
      console.error("Ошибка при получении постов:", error);
    } finally {
      this.isLoadingPosts = false;
    }
  }
  async getPostsFromUserId(userId) {
    try {
      this.isLoadingPosts = true;
      const response = await getPostsFromUser(userId);
      this.posts = response.data;
      //console.log("posts", response.data);
    } catch (error) {
      console.error("Ошибка при получении постов:", error);
    } finally {
      this.isLoadingPosts = false;
    }
  }
  async deletePostById(id) {
    try {
      const response = await deletePost(id);
      this.posts = this.posts.filter((post) => post.id !== id);
      console.log(`Пост с идентификатором ${id} удален.`);
    } catch (error) {
      console.error("Ошибка при удалении поста:", error);
    }
  }
  async updatePostByData(postData) {
    try {
      const response = await updatePost(postData);
      console.log("Пост обновлен:", response.data);
    } catch (error) {
      console.error("Ошибка при обновлении поста:", error);
    }
  }
}

export default PostStore;
