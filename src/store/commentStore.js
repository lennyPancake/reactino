import axios from "axios";
import { makeAutoObservable } from "mobx";
import { add, getCommentsByPostId } from "../API/commentAPI";

class CommentStore {
  comments = [];

  constructor() {
    makeAutoObservable(this);
    this.isLoading = false;
  }
  async getCommentsForPost(postId) {
    try {
      this.isLoading = true;
      const response = await getCommentsByPostId(postId);
      this.comments = response.data;
      console.log("comments", response.data);
    } catch (error) {
      console.error("Ошибка при получении комментариев:", error);
    } finally {
      this.isLoading = false;
    }
  }

  // Метод для добавления нового комментария
  async addComment(comment) {
    try {
      const response = await add(comment);
      // Обновляем стор после успешного добавления
      this.comments.push(response.data);
    } catch (error) {
      console.error("Ошибка при добавлении комментария:", error);
    }
  }
}
export default CommentStore;
