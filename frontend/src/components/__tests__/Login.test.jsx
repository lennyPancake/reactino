import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import Login from "../../pages/Login";
import RootStoreContext from "../../RootStoreContext";
import { login } from "../../API/userAPI";

jest.mock("../../API/userAPI", () => ({
  login: jest.fn(),
}));

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

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

const mockStore = {
  userStore: {
    mainUser: null,
  },
};

const renderWithProviders = () => {
  return render(
    <RootStoreContext.Provider value={mockStore}>
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    </RootStoreContext.Provider>,
  );
};

afterEach(() => {
  jest.clearAllMocks();
});

test("отображает форму логина", () => {
  renderWithProviders();
  expect(screen.getByText(/Вход/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/Введите email/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/Введите пароль/i)).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /Войти/i })).toBeInTheDocument();
});

test("показывает ошибку когда поля пусты", async () => {
  renderWithProviders();
  const button = screen.getByRole("button", { name: /Войти/i });

  await userEvent.click(button);

  expect(await screen.findByText(/Заполните все поля/i)).toBeInTheDocument();
});

test("успешный вход перенаправляет на страницу пользователя", async () => {
  login.mockResolvedValueOnce({
    data: {
      user: { id: 1 },
      token: "fake-token",
    },
  });

  renderWithProviders();

  await userEvent.type(
    screen.getByPlaceholderText(/Введите email/i),
    "test@example.com",
  );
  await userEvent.type(
    screen.getByPlaceholderText(/Введите пароль/i),
    "password123",
  );

  const button = screen.getByRole("button", { name: /Войти/i });
  await userEvent.click(button);

  await waitFor(() => {
    expect(mockNavigate).toHaveBeenCalledWith("/users/1");
  });
});

test("показывает ошибку при неудачной авторизации", async () => {
  login.mockRejectedValueOnce({ response: { status: 403 } });

  renderWithProviders();

  await userEvent.type(
    screen.getByPlaceholderText(/Введите email/i),
    "test@example.com",
  );
  await userEvent.type(
    screen.getByPlaceholderText(/Введите пароль/i),
    "wrongpassword",
  );

  const button = screen.getByRole("button", { name: /Войти/i });
  await userEvent.click(button);

  expect(await screen.findByText(/Неверный логин или пароль/i)).toBeInTheDocument();
});
