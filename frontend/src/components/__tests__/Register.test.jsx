import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import Registration from "../Registration";
import RootStoreContext from "../../RootStoreContext";
import { register } from "../../API/userAPI";

jest.mock("../../API/userAPI", () => ({
  register: jest.fn(),
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

const renderWithProviders = () => {
  const mockStore = {
    userStore: {
      mainUser: null,
    },
  };

  return render(
    <RootStoreContext.Provider value={mockStore}>
      <MemoryRouter>
        <Registration />
      </MemoryRouter>
    </RootStoreContext.Provider>,
  );
};

afterEach(() => {
  jest.clearAllMocks();
});

test("отображает форму регистрации", () => {
  renderWithProviders();
  expect(screen.getByPlaceholderText(/Имя/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/Фамилия/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/Введите email/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/^Пароль$/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/Повторите пароль/i)).toBeInTheDocument();
});

test("показывает ошибку на пустые поля", async () => {
  renderWithProviders();
  const button = screen.getByRole("button", { name: /Зарегистрироваться/i });

  await userEvent.click(button);

  expect(await screen.findByText(/Введите имя и фамилию/i)).toBeInTheDocument();
});

test("показывает ошибку когда пароли не совпадают", async () => {
  renderWithProviders();

  await userEvent.type(
    screen.getByPlaceholderText(/Введите email/i),
    "test@example.com",
  );
  await userEvent.type(screen.getByPlaceholderText(/^Пароль$/i), "Password123");
  await userEvent.type(
    screen.getByPlaceholderText(/Повторите пароль/i),
    "DifferentPass",
  );

  const button = screen.getByRole("button", { name: /Зарегистрироваться/i });
  await userEvent.click(button);

  expect(await screen.findByText(/Пароли не совпадают/i)).toBeInTheDocument();
});

test("показывает ошибку для короткого пароля", async () => {
  renderWithProviders();

  await userEvent.type(screen.getByPlaceholderText(/Имя/i), "John");
  await userEvent.type(screen.getByPlaceholderText(/Фамилия/i), "Doe");
  await userEvent.type(
    screen.getByPlaceholderText(/Введите email/i),
    "test@example.com",
  );
  await userEvent.type(screen.getByPlaceholderText(/^Пароль$/i), "sho");
  await userEvent.type(screen.getByPlaceholderText(/Повторите пароль/i), "sho");

  const button = screen.getByRole("button", { name: /Зарегистрироваться/i });
  await userEvent.click(button);

  expect(
    await screen.findByText(/Пароль должен быть не менее 4 символа/i),
  ).toBeInTheDocument();
});

  test("успешная регистрация", async () => {
  register.mockResolvedValueOnce({
    data: {
      user: { id: 1 },
      token: "fake-token",
    },
  });

  renderWithProviders();

  await userEvent.type(
    screen.getByPlaceholderText(/Введите email/i),
    "newuser@example.com",
  );
  await userEvent.type(screen.getByPlaceholderText(/^Пароль$/i), "Password123");
  await userEvent.type(
    screen.getByPlaceholderText(/Повторите пароль/i),
    "Password123",
  );
  await userEvent.type(screen.getByPlaceholderText(/Имя/i), "John");
  await userEvent.type(screen.getByPlaceholderText(/Фамилия/i), "Doe");

  const button = screen.getByRole("button", { name: /Зарегистрироваться/i });
  await userEvent.click(button);

  await waitFor(() => {
    expect(mockNavigate).toHaveBeenCalledWith("/users/1");
  });
});
