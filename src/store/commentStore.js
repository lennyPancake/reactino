import axios from "axios";
import { makeAutoObservable } from "mobx";

class CommentStore {
  comments = [];

  constructor() {
    makeAutoObservable(this);
  }
  async getCommentsForPost(postId) {
    try {
      const response = await axios.get(
        `http://localhost:8000/comments?postId=${postId}`,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      this.comments = response.data;
      console.log("comments", response.data);
    } catch (error) {
      console.error("Ошибка при получении комментариев:", error);
    }
  }

  // Метод для добавления нового комментария
  async addComment(comment) {
    try {
      const response = await axios.post(
        "http://localhost:8000/comments",
        comment,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      // Обновляем стор после успешного добавления
      this.comments.push(response.data);
    } catch (error) {
      console.error("Ошибка при добавлении комментария:", error);
    }
  }
}
export default CommentStore;
