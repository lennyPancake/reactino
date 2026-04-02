import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";

describe("Login Component", () => {
  // Mock компонента для тестирования
  const LoginComponent = () => {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [error, setError] = React.useState("");

    const handleLogin = async (e) => {
      e.preventDefault();

      if (!email || !password) {
        setError("Email и пароль обязательны");
        return;
      }

      if (!email.includes("@")) {
        setError("Некорректный формат email");
        return;
      }

      // Успешный вход
      localStorage.setItem("token", "fake-token-123");
      setError("");
    };

    return (
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Введите email"
          />
        </div>
        <div>
          <label htmlFor="password">Пароль:</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Введите пароль"
          />
        </div>
        {error && (
          <div className="error" data-testid="error-message">
            {error}
          </div>
        )}
        <button type="submit">Войти</button>
      </form>
    );
  };

  test("отображает форму логина", () => {
    render(<LoginComponent />);
    expect(screen.getByLabelText(/Email:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Пароль:/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Войти/i })).toBeInTheDocument();
  });

  test("показывает ошибку когда поля пусты", async () => {
    render(<LoginComponent />);
    const loginButton = screen.getByRole("button", { name: /Войти/i });

    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(screen.getByTestId("error-message")).toHaveTextContent(
        "Email и пароль обязательны",
      );
    });
  });

  test("показывает ошибку для некорректного email", async () => {
    render(<LoginComponent />);

    const emailInput = screen.getByLabelText(/Email:/i);
    const passwordInput = screen.getByLabelText(/Пароль:/i);
    const loginButton = screen.getByRole("button", { name: /Войти/i });

    await userEvent.type(emailInput, "notanemail");
    await userEvent.type(passwordInput, "password123");
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(screen.getByTestId("error-message")).toHaveTextContent(
        "Некорректный формат email",
      );
    });
  });

  test("сохраняет токен при успешной авторизации", async () => {
    render(<LoginComponent />);

    const emailInput = screen.getByLabelText(/Email:/i);
    const passwordInput = screen.getByLabelText(/Пароль:/i);
    const loginButton = screen.getByRole("button", { name: /Войти/i });

    await userEvent.type(emailInput, "test@example.com");
    await userEvent.type(passwordInput, "password123");
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(localStorage.getItem("token")).toBe("fake-token-123");
    });
  });
});
