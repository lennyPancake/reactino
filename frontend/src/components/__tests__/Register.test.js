import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";

describe("Register Component", () => {
  const RegisterComponent = () => {
    const [formData, setFormData] = React.useState({
      email: "",
      password: "",
      password_repeat: "",
      first_name: "",
      last_name: "",
    });
    const [error, setError] = React.useState("");
    const [success, setSuccess] = React.useState("");

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    };

    const handleRegister = async (e) => {
      e.preventDefault();

      // Валидация
      if (!formData.email || !formData.password || !formData.password_repeat) {
        setError("Заполните все обязательные поля");
        return;
      }

      if (formData.password !== formData.password_repeat) {
        setError("Пароли не совпадают");
        return;
      }

      if (formData.password.length < 8) {
        setError("Пароль должен быть минимум 8 символов");
        return;
      }

      // Имитация успешной регистрации
      setSuccess("Регистрация успешна!");
      setError("");
    };

    return (
      <form onSubmit={handleRegister}>
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />
        <input
          name="password"
          type="password"
          placeholder="Пароль"
          value={formData.password}
          onChange={handleChange}
        />
        <input
          name="password_repeat"
          type="password"
          placeholder="Повторите пароль"
          value={formData.password_repeat}
          onChange={handleChange}
        />
        <input
          name="first_name"
          type="text"
          placeholder="Имя"
          value={formData.first_name}
          onChange={handleChange}
        />
        <input
          name="last_name"
          type="text"
          placeholder="Фамилия"
          value={formData.last_name}
          onChange={handleChange}
        />
        {error && (
          <div data-testid="error-msg" className="error">
            {error}
          </div>
        )}
        {success && (
          <div data-testid="success-msg" className="success">
            {success}
          </div>
        )}
        <button type="submit">Зарегистрироваться</button>
      </form>
    );
  };

  test("отображает форму регистрации", () => {
    render(<RegisterComponent />);
    expect(screen.getByPlaceholderText(/Email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Пароль/i)).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/Повторите пароль/i),
    ).toBeInTheDocument();
  });

  test("показывает ошибку на пустые поля", async () => {
    render(<RegisterComponent />);
    const button = screen.getByRole("button", { name: /Зарегистрироваться/i });

    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByTestId("error-msg")).toHaveTextContent(
        "Заполните все обязательные поля",
      );
    });
  });

  test("показывает ошибку когда пароли не совпадают", async () => {
    render(<RegisterComponent />);

    await userEvent.type(
      screen.getByPlaceholderText(/Email/i),
      "test@example.com",
    );
    await userEvent.type(screen.getByPlaceholderText("Пароль"), "Password123");
    await userEvent.type(
      screen.getByPlaceholderText(/Повторите пароль/i),
      "DifferentPass",
    );

    const button = screen.getByRole("button", { name: /Зарегистрироваться/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByTestId("error-msg")).toHaveTextContent(
        "Пароли не совпадают",
      );
    });
  });

  test("показывает ошибку для короткого пароля", async () => {
    render(<RegisterComponent />);

    await userEvent.type(
      screen.getByPlaceholderText(/Email/i),
      "test@example.com",
    );
    await userEvent.type(screen.getByPlaceholderText("Пароль"), "short");
    await userEvent.type(
      screen.getByPlaceholderText(/Повторите пароль/i),
      "short",
    );

    const button = screen.getByRole("button", { name: /Зарегистрироваться/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByTestId("error-msg")).toHaveTextContent(
        "минимум 8 символов",
      );
    });
  });

  test("успешная регистрация", async () => {
    render(<RegisterComponent />);

    await userEvent.type(
      screen.getByPlaceholderText(/Email/i),
      "newuser@example.com",
    );
    await userEvent.type(screen.getByPlaceholderText("Пароль"), "Password123");
    await userEvent.type(
      screen.getByPlaceholderText(/Повторите пароль/i),
      "Password123",
    );
    await userEvent.type(screen.getByPlaceholderText(/Имя/i), "John");
    await userEvent.type(screen.getByPlaceholderText(/Фамилия/i), "Doe");

    const button = screen.getByRole("button", { name: /Зарегистрироваться/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByTestId("success-msg")).toHaveTextContent(
        "Регистрация успешна!",
      );
    });
  });
});
