import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import PostCard from "../PostCard";
import RootStoreContext from "../../RootStoreContext";

const mockStore = {
  userStore: {
    mainUser: { id: 1 },
  },
  postStore: {},
};

const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === "string" &&
      args[0].includes("Warning: An update to")
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});

const mockPost = {
  id: 1,
  title: "Test Post",
  content: "This is test content",
  image: null,
  author: { id: 1, first_name: "John", last_name: "Doe", avatar: null },
};

const mockAuthor = {
  id: 1,
  first_name: "John",
  last_name: "Doe",
  avatar: null,
};

const renderWithProviders = (props) => {
  return render(
    <RootStoreContext.Provider value={mockStore}>
      <MemoryRouter>
        <PostCard {...props} />
      </MemoryRouter>
    </RootStoreContext.Provider>,
  );
};

afterEach(() => {
  jest.clearAllMocks();
});

test("отображает пост с корректной информацией", () => {
  renderWithProviders({ post: mockPost, author: mockAuthor, isOwner: false });

  expect(screen.getByText("Test Post")).toBeInTheDocument();
  expect(screen.getByText("This is test content")).toBeInTheDocument();
  expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
});

test("показывает кнопку 'Подробнее'", () => {
  renderWithProviders({ post: mockPost, author: mockAuthor, isOwner: false });

  expect(screen.getByRole("link", { name: /Подробнее/i })).toBeInTheDocument();
});

test("не показывает dropdown для не владельца", () => {
  renderWithProviders({ post: mockPost, author: mockAuthor, isOwner: false });

  expect(screen.queryByText(/Изменить/i)).not.toBeInTheDocument();
});

test("вызывает onEdit при клике на 'Изменить'", async () => {
  const onEdit = jest.fn();
  renderWithProviders({
    post: mockPost,
    author: mockAuthor,
    isOwner: true,
    onEdit,
    onDelete: jest.fn(),
  });

  await userEvent.click(screen.getByRole("button"));
  await userEvent.click(screen.getByText(/Изменить/i));

  expect(onEdit).toHaveBeenCalledWith(mockPost);
});

test("вызывает onDelete при клике на 'Удалить'", async () => {
  const onDelete = jest.fn();
  window.confirm = jest.fn(() => true);

  renderWithProviders({
    post: mockPost,
    author: mockAuthor,
    isOwner: true,
    onEdit: jest.fn(),
    onDelete,
  });

  await userEvent.click(screen.getByRole("button"));
  await userEvent.click(screen.getByText(/Удалить/i));

  expect(onDelete).toHaveBeenCalledWith(mockPost.id);
});
