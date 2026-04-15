import React, { useState, useContext, useEffect } from "react";
import RootStoreContext from "../RootStoreContext";
import { Form, Button, Alert, Image, Spinner } from "react-bootstrap";
import { loadFile } from "../API/fileAPI";
import "./Setting.css";

function Settings() {
  const { userStore } = useContext(RootStoreContext);
  const [firstName, setFirstName] = useState(
    userStore.mainUser.first_name || "",
  );
  const [lastName, setLastName] = useState(userStore.mainUser.last_name || "");
  const [password, setPassword] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(
    userStore.mainUser.avatar || "",
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    setFirstName(userStore.mainUser.first_name || "");
    setLastName(userStore.mainUser.last_name || "");
    setAvatarPreview(userStore.mainUser.avatar || "");
  }, [userStore.mainUser]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setAvatarPreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      let avatarUrl = userStore.mainUser.avatar;
      if (avatarFile) {
        const formData = new FormData();
        formData.append("file", avatarFile);
        const uploadRes = await loadFile(formData);
        avatarUrl = uploadRes.data.filepath;
      }

      const userData = {
        first_name: firstName,
        last_name: lastName,
        avatar: avatarUrl,
      };

      if (password.trim()) {
        userData.password = password;
      }

      await userStore.updateMainUser(userData);
      setSuccess("Настройки успешно обновлены!");
      console.log(userData);
      setPassword(""); // Очистить пароль после обновления
    } catch (error) {
      setError("Ошибка при обновлении настроек. Попробуйте еще раз.");
      console.error("Error updating user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <h2>Настройки пользователя</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Имя</Form.Label>
          <Form.Control
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Введите имя"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Фамилия</Form.Label>
          <Form.Control
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Введите фамилию"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Аватар</Form.Label>
          <Form.Control
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
          />
          {/*           {avatarPreview && (
            <div className="mt-2">
              <Image
                src={avatarPreview}
                rounded
                style={{ width: "100px", height: "100px" }}
              />
            </div>
          )} */}
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Новый пароль</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Введите новый пароль (оставьте пустым, если не хотите менять)"
          />
        </Form.Group>

        <Button variant="primary" type="submit" disabled={isLoading}>
          {isLoading ? (
            <Spinner animation="border" size="sm" />
          ) : (
            "Сохранить изменения"
          )}
        </Button>
      </Form>
    </div>
  );
}

export default Settings;
