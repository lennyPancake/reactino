import { makeAutoObservable } from "mobx";
import {
  deletePost,
  getPost,
  getPosts,
  getPostsFromUser,
  updatePost,
  createPost,
} from "../API/postAPI";

class PostStore {
  posts = [];
  post = {};
  isLoading = false;

  constructor() {
    makeAutoObservable(this);
  }
  async getPostById(id) {
    try {
      this.isLoading = true;
      const response = await getPost(id);
      this.post = response.data;
      //console.log("post - ", res  ponse.data);
    } catch (error) {
      console.error("Ошибка при получении поста:", error);
    } finally {
      this.isLoading = false;
    }
  }
  async getPosts() {
    try {
      this.isLoading = true;
      const response = await getPosts();
      this.posts = response.data;
    } catch (error) {
      console.error("Ошибка при получении постов:", error);
    } finally {
      this.isLoading = false;
    }
  }
  async getPostsFromUserId(userId) {
    try {
      this.isLoading = true;
      const response = await getPostsFromUser(userId);
      this.posts = response.data;
    } catch (error) {
      console.error("Ошибка при получении постов:", error);
    } finally {
      this.isLoading = false;
    }
  }
  async deletePostById(id) {
    try {
      await deletePost(id);
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
      const postIndex = this.posts.findIndex((post) => post.id === postData.id);
      if (postIndex !== -1) {
        this.posts[postIndex] = { ...this.posts[postIndex], ...postData };
      }
    } catch (error) {
      console.error("Ошибка при обновлении поста:", error);
    }
  }
  async createPostByData(postData) {
    try {
      console.log("дата:", postData);
      const response = await createPost(postData);
      this.posts = [...this.posts, response.data];
      console.log("Пост создан: ", response.data);
    } catch (error) {
      console.error("Ошибка при создании поста:", error);
    }
  }
}

export default PostStore;
