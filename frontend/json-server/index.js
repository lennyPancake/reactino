const jwt = require("jsonwebtoken");
const fs = require("fs");
const jsonServer = require("json-server");
const path = require("path");
const multer = require("multer");
const short = require("short-uuid");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "static/images"));
  },
  filename: function (req, file, cb) {
    cb(null, short().new() + file.originalname);
  },
});
const upload = multer({ storage });
const staticFolder = path.join(path.resolve(__dirname, "static"));
const jwtSecretKey = "pagan_very_long_random_string_at_least_64_chars";
const server = jsonServer.create();
const router = jsonServer.router(path.resolve(__dirname, "db.json"));
server.use(jsonServer.defaults({ static: staticFolder }));
server.use(jsonServer.bodyParser);

function generateToken(user) {
  const token = jwt.sign({ userId: user.id }, jwtSecretKey, {
    expiresIn: "3h",
  });
  return token;
}
function generateNumericId() {
  const timestamp = new Date().getTime();
  const random = Math.floor(Math.random() * 1000);
  const numericId = parseInt(`${timestamp}${random}`);
  return numericId;
}
// Нужно для небольшой задержки, чтобы запрос проходил не мгновенно, имитация реального апи
server.use(async (req, res, next) => {
  await new Promise((res) => {
    setTimeout(res, 800);
  });
  next();
});

server.post("/file", upload.single("file"), function (req, res) {
  res.json({
    filepath: `http://localhost:8000/images/${req.file.filename}`,
  });
});

// Эндпоинт для логина
server.post("/login", (req, res) => {
  try {
    const { username, password } = req.body;
    const db = JSON.parse(
      fs.readFileSync(path.resolve(__dirname, "db.json"), "UTF-8"),
    );
    const { users = [] } = db;

    // Находим в бд пользователя с таким username и password
    const userFromBd = users.find(
      (user) => user.email === username && user.password === password,
    );

    if (userFromBd) {
      // Генерируем токен и отправляем его пользователю
      const token = generateToken(userFromBd);
      return res.json({ user: userFromBd, token });
    }

    return res.status(403).json({ message: "User not found" });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: e.message });
  }
});
// Эндпоинт для регистрации новых пользователей
server.post("/register", (req, res) => {
  try {
    const { email, password, first_name, last_name, avatar } = req.body;
    const db = JSON.parse(
      fs.readFileSync(path.resolve(__dirname, "db.json"), "UTF-8"),
    );
    const { users = [] } = db;

    // Проверяем, что пользователь с таким email не существует
    const userExists = users.some((user) => user.email === email);

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Генерируем уникальный ID для нового пользователя (просто для примера, в реальном приложении используйте UUID или другой метод)
    const id = generateNumericId();
    // Создаем нового пользователя
    const newUser = {
      id,
      email,
      password,
      first_name,
      last_name,
      avatar,
    };

    // Добавляем пользователя в базу данных
    users.push(newUser);
    fs.writeFileSync(
      path.resolve(__dirname, "db.json"),
      JSON.stringify(db, null, 2),
      "UTF-8",
    );

    // Генерируем токен для нового пользователя
    const token = generateToken(newUser);
    // Отправляем успешный ответ с токеном
    return res.json({ user: newUser, token });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: e.message });
  }
});
server.post("/posts", (req, res) => {
  try {
    const { title, content, authorId, image } = req.body;
    const db = JSON.parse(
      fs.readFileSync(path.resolve(__dirname, "db.json"), "UTF-8"),
    );
    const { posts = [] } = db;
    const id = generateNumericId();
    // Создаем новый пост
    const newPost = {
      id,
      title,
      content,
      authorId,
      image,
    };

    // Добавляем пост в базу данных
    posts.push(newPost);

    // Обновляем базу данных
    fs.writeFileSync(
      path.resolve(__dirname, "db.json"),
      JSON.stringify(db, null, 2),
      "UTF-8",
    );

    // Отправляем успешный ответ
    return res.json(newPost);
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: e.message });
  }
});
// проверяем, авторизован ли пользователь
server.use((req, res, next) => {
  // разрешаем публичный доступ без авторизации
  if (req.path === "/users") {
    return next();
  }

  const token = req.headers.authorization;

  if (!token) {
    return res.status(403).json({ message: "AUTH ERROR" });
  }

  // Проверяем токен
  jwt.verify(token, jwtSecretKey, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }

    // Если токен валиден, добавляем информацию о пользователе в объект запроса
    req.user = decoded;
    next();
  });
});
server.post("/comments", (req, res) => {
  try {
    const { text, authorId, postId } = req.body;
    const db = JSON.parse(
      fs.readFileSync(path.resolve(__dirname, "db.json"), "UTF-8"),
    );
    const { comments = [] } = db;
    const newCommentId = generateNumericId();

    // Создаем новый комментарий
    const newComment = {
      id: newCommentId,
      text,
      authorId,
      postId,
    };

    // Добавляем комментарий в базу данных
    comments.push(newComment);

    // Обновляем базу данных
    fs.writeFileSync(
      path.resolve(__dirname, "db.json"),
      JSON.stringify(db, null, 2),
      "UTF-8",
    );

    // Отправляем успешный ответ
    return res.json(newComment);
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: e.message });
  }
});
server.delete("/posts/:id", (req, res) => {
  try {
    const postId = req.params.id;
    const db = JSON.parse(
      fs.readFileSync(path.resolve(__dirname, "db.json"), "UTF-8"),
    );
    const { posts = [], comments = [] } = db;

    // Находим индекс поста, который нужно удалить
    const postIndex = posts.findIndex((post) => post.id == postId);

    if (postIndex === -1) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Получаем путь к изображению поста
    const imagePath = path.join(
      __dirname,
      "static",
      "images",
      posts[postIndex].image.replace("http://localhost:8000/images/", ""),
    );
    if (posts[postIndex].image !== "") {
      fs.unlinkSync(imagePath);
    }

    // Удаляем пост из массива
    posts.splice(postIndex, 1);

    // Удаляем все комментарии связанные с этим постом
    const updatedComments = comments.filter(
      (comment) => comment.postId !== postId,
    );

    // Обновляем базу данных с обновленными данными
    db.comments = updatedComments;

    fs.writeFileSync(
      path.resolve(__dirname, "db.json"),
      JSON.stringify(db, null, 2),
      "UTF-8",
    );

    // Отправляем успешный ответ
    return res.status(204).send();
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: e.message });
  }
});
// Эндпоинт для обновления поста
server.put("/posts", (req, res) => {
  try {
    const postId = parseInt(req.body.id);
    const { title, content, image } = req.body;
    const db = JSON.parse(
      fs.readFileSync(path.resolve(__dirname, "db.json"), "UTF-8"),
    );
    const { posts = [] } = db;

    // Находим индекс поста, который нужно обновить
    const postIndex = posts.findIndex((post) => post.id === postId);

    if (postIndex === -1) {
      return res
        .status(404)
        .json({ message: "Post not found" + req.params.title });
    }

    // Обновляем данные поста
    posts[postIndex].title = title || posts[postIndex].title;
    posts[postIndex].content = content || posts[postIndex].content;
    posts[postIndex].image = image || posts[postIndex].image;

    // Обновляем базу данных
    fs.writeFileSync(
      path.resolve(__dirname, "db.json"),
      JSON.stringify(db, null, 2),
      "UTF-8",
    );

    // Отправляем обновленный пост
    return res.json(posts[postIndex]);
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: e.message });
  }
});
server.use(router);

// запуск сервера
server.listen(8000, () => {
  console.log("server is running on 8000 port");
});
