import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";

describe("Comments Component", () => {
  const CommentsComponent = ({
    postId,
    comments,
    onAddComment,
    onDeleteComment,
  }) => {
    const [newComment, setNewComment] = React.useState("");
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState("");

    const handleSubmit = async (e) => {
      e.preventDefault();

      if (!newComment.trim()) {
        setError("Комментарий не может быть пустым");
        return;
      }

      if (newComment.length > 500) {
        setError("Комментарий не может быть больше 500 символов");
        return;
      }

      setLoading(true);
      try {
        await onAddComment({
          text: newComment,
          postId: postId,
          timestamp: new Date().toISOString(),
        });
        setNewComment("");
        setError("");
      } catch (err) {
        setError("Ошибка при отправке комментария");
      } finally {
        setLoading(false);
      }
    };

    return (
      <div data-testid="comments-section">
        <h3>Комментарии ({comments.length})</h3>

        <form onSubmit={handleSubmit} data-testid="comment-form">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Напишите комментарий..."
            data-testid="comment-input"
          />
          {error && <div className="error">{error}</div>}
          <button type="submit" disabled={loading} data-testid="submit-btn">
            {loading ? "Отправка..." : "Отправить"}
          </button>
        </form>

        <div className="comments-list" data-testid="comments-list">
          {comments.length === 0 ? (
            <p>Нет комментариев</p>
          ) : (
            comments.map((comment) => (
              <div
                key={comment.id}
                className="comment-item"
                data-testid={`comment-${comment.id}`}
              >
                <div className="comment-header">
                  <strong>{comment.author}</strong>
                  <span className="comment-date">{comment.date}</span>
                </div>
                <p>{comment.text}</p>
                {comment.isOwn && (
                  <button
                    onClick={() => onDeleteComment(comment.id)}
                    className="delete-btn"
                    data-testid={`delete-comment-${comment.id}`}
                  >
                    Удалить
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  const mockComments = [
    {
      id: 1,
      author: "User 1",
      text: "Great post!",
      date: "2024-01-01 10:00",
      isOwn: false,
    },
    {
      id: 2,
      author: "Current User",
      text: "My comment",
      date: "2024-01-01 11:00",
      isOwn: true,
    },
  ];

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("отображает список комментариев", () => {
    render(
      <CommentsComponent
        postId={1}
        comments={mockComments}
        onAddComment={jest.fn()}
        onDeleteComment={jest.fn()}
      />,
    );

    expect(screen.getByText(/Комментарии \(2\)/i)).toBeInTheDocument();
    expect(screen.getByText("Great post!")).toBeInTheDocument();
    expect(screen.getByText("My comment")).toBeInTheDocument();
  });

  test("показывает форму добавления комментария", () => {
    render(
      <CommentsComponent
        postId={1}
        comments={mockComments}
        onAddComment={jest.fn()}
        onDeleteComment={jest.fn()}
      />,
    );

    expect(screen.getByTestId("comment-input")).toBeInTheDocument();
    expect(screen.getByTestId("submit-btn")).toBeInTheDocument();
  });

  test("показывает ошибку при попытке отправить пустой комментарий", async () => {
    render(
      <CommentsComponent
        postId={1}
        comments={mockComments}
        onAddComment={jest.fn()}
        onDeleteComment={jest.fn()}
      />,
    );

    const submitBtn = screen.getByTestId("submit-btn");
    await userEvent.click(submitBtn);

    expect(
      await screen.findByText("Комментарий не может быть пустым"),
    ).toBeInTheDocument();
  });

  test("показывает ошибку если комментарий слишком длинный", async () => {
    render(
      <CommentsComponent
        postId={1}
        comments={mockComments}
        onAddComment={jest.fn()}
        onDeleteComment={jest.fn()}
      />,
    );

    const input = screen.getByTestId("comment-input");
    const longText = "a".repeat(501);

    await userEvent.type(input, longText);
    await userEvent.click(screen.getByTestId("submit-btn"));

    expect(
      await screen.findByText(/больше 500 символов/i),
    ).toBeInTheDocument();
  });

  test("отправляет комментарий при нажатии на кнопку", async () => {
    const mockAddComment = jest.fn().mockResolvedValue(true);

    render(
      <CommentsComponent
        postId={1}
        comments={mockComments}
        onAddComment={mockAddComment}
        onDeleteComment={jest.fn()}
      />,
    );

    const input = screen.getByTestId("comment-input");
    await userEvent.type(input, "New comment text");
    await userEvent.click(screen.getByTestId("submit-btn"));

    expect(mockAddComment).toHaveBeenCalledWith(
      expect.objectContaining({
        text: "New comment text",
        postId: 1,
      }),
    );
  });

  test("показывает кнопку удаления только для собственных комментариев", () => {
    render(
      <CommentsComponent
        postId={1}
        comments={mockComments}
        onAddComment={jest.fn()}
        onDeleteComment={jest.fn()}
      />,
    );

    expect(screen.getByTestId("delete-comment-2")).toBeInTheDocument();
    expect(screen.queryByTestId("delete-comment-1")).not.toBeInTheDocument();
  });

  test("удаляет комментарий при клике на кнопку удаления", async () => {
    const mockDeleteComment = jest.fn();

    render(
      <CommentsComponent
        postId={1}
        comments={mockComments}
        onAddComment={jest.fn()}
        onDeleteComment={mockDeleteComment}
      />,
    );

    const deleteBtn = screen.getByTestId("delete-comment-2");
    await userEvent.click(deleteBtn);

    expect(mockDeleteComment).toHaveBeenCalledWith(2);
  });

  test("показывает сообщение когда нет комментариев", () => {
    render(
      <CommentsComponent
        postId={1}
        comments={[]}
        onAddComment={jest.fn()}
        onDeleteComment={jest.fn()}
      />,
    );

    expect(screen.getByText("Нет комментариев")).toBeInTheDocument();
    expect(screen.getByText(/Комментарии \(0\)/i)).toBeInTheDocument();
  });

  test("очищает форму после успешной отправки", async () => {
    const mockAddComment = jest.fn().mockResolvedValue(true);

    render(
      <CommentsComponent
        postId={1}
        comments={mockComments}
        onAddComment={mockAddComment}
        onDeleteComment={jest.fn()}
      />,
    );

    const input = screen.getByTestId("comment-input");
    await userEvent.type(input, "New comment");
    await userEvent.click(screen.getByTestId("submit-btn"));

    expect(await screen.findByDisplayValue("")).toBeInTheDocument();
  });
});
