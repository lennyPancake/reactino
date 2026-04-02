import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";

describe("Post Component", () => {
  const PostComponent = ({ post, onEdit, onDelete }) => {
    const [isEditing, setIsEditing] = React.useState(false);
    const [editedPost, setEditedPost] = React.useState(post);

    const handleEdit = () => {
      setIsEditing(true);
    };

    const handleSave = () => {
      onEdit(editedPost);
      setIsEditing(false);
    };

    const handleDelete = () => {
      if (window.confirm("Вы уверены?")) {
        onDelete(post.id);
      }
    };

    if (isEditing) {
      return (
        <div data-testid="edit-form">
          <input
            type="text"
            value={editedPost.title}
            onChange={(e) =>
              setEditedPost({ ...editedPost, title: e.target.value })
            }
          />
          <textarea
            value={editedPost.content}
            onChange={(e) =>
              setEditedPost({ ...editedPost, content: e.target.value })
            }
          />
          <button onClick={handleSave}>Сохранить</button>
          <button onClick={() => setIsEditing(false)}>Отменить</button>
        </div>
      );
    }

    return (
      <div data-testid="post-card" className="post-card">
        <h2>{post.title}</h2>
        <p>{post.content}</p>
        {post.image && <img src={post.image} alt="post" />}
        <div className="post-meta">
          <span>Автор: {post.author}</span>
          <span>Дата: {post.date}</span>
        </div>
        <div className="post-actions">
          <button onClick={handleEdit} data-testid="edit-btn">
            Редактировать
          </button>
          <button onClick={handleDelete} data-testid="delete-btn">
            Удалить
          </button>
        </div>
      </div>
    );
  };

  const mockPost = {
    id: 1,
    title: "Test Post",
    content: "This is test content",
    author: "Test User",
    date: "2024-01-01",
    image: null,
  };

  test("отображает пост с корректной информацией", () => {
    render(
      <PostComponent post={mockPost} onEdit={jest.fn()} onDelete={jest.fn()} />,
    );

    expect(screen.getByText("Test Post")).toBeInTheDocument();
    expect(screen.getByText("This is test content")).toBeInTheDocument();
    expect(screen.getByText(/Test User/i)).toBeInTheDocument();
  });

  test("показывает кнопки редактирования и удаления", () => {
    render(
      <PostComponent post={mockPost} onEdit={jest.fn()} onDelete={jest.fn()} />,
    );

    expect(screen.getByTestId("edit-btn")).toBeInTheDocument();
    expect(screen.getByTestId("delete-btn")).toBeInTheDocument();
  });

  test("открывает форму редактирования при клике на кнопку редактирования", async () => {
    render(
      <PostComponent post={mockPost} onEdit={jest.fn()} onDelete={jest.fn()} />,
    );

    const editBtn = screen.getByTestId("edit-btn");
    fireEvent.click(editBtn);

    await waitFor(() => {
      expect(screen.getByTestId("edit-form")).toBeInTheDocument();
    });
  });

  test("сохраняет изменения при редактировании", async () => {
    const onEdit = jest.fn();
    render(
      <PostComponent post={mockPost} onEdit={onEdit} onDelete={jest.fn()} />,
    );

    // Открываем форму редактирования
    fireEvent.click(screen.getByTestId("edit-btn"));

    // Находим инпуты и изменяем их
    const titleInput = screen.getByDisplayValue("Test Post");
    const contentInput = screen.getByDisplayValue("This is test content");

    await userEvent.clear(titleInput);
    await userEvent.type(titleInput, "Updated Title");

    // Сохраняем
    const saveBtn = screen.getByText("Сохранить");
    fireEvent.click(saveBtn);

    await waitFor(() => {
      expect(onEdit).toHaveBeenCalledWith(
        expect.objectContaining({ title: "Updated Title" }),
      );
    });
  });

  test("вызывает callback удаления при клике на удалить", async () => {
    const onDelete = jest.fn();
    window.confirm = jest.fn(() => true);

    render(
      <PostComponent post={mockPost} onEdit={jest.fn()} onDelete={onDelete} />,
    );

    const deleteBtn = screen.getByTestId("delete-btn");
    fireEvent.click(deleteBtn);

    await waitFor(() => {
      expect(onDelete).toHaveBeenCalledWith(1);
    });
  });

  test("показывает изображение если оно есть", () => {
    const postWithImage = {
      ...mockPost,
      image: "/images/test.jpg",
    };

    render(
      <PostComponent
        post={postWithImage}
        onEdit={jest.fn()}
        onDelete={jest.fn()}
      />,
    );

    expect(screen.getByAltText("post")).toHaveAttribute(
      "src",
      "/images/test.jpg",
    );
  });
});
