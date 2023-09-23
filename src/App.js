import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import "./pages/Login";
import Login from "./pages/Login";
import "bootstrap/dist/css/bootstrap.min.css";
import Registration from "./components/Registration";
import MainPage from "./pages/MainPage";
import { RootStoreContext } from "./index";
import { useContext } from "react";
import Navbb from "./components/Navbb";
import AllPosts from "./pages/AllPosts";
import Post from "./pages/Post";
function App() {
  const { userStore } = useContext(RootStoreContext);
  userStore.fetchUsers();
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/register" element={<Registration />} />
          <Route path="/login" element={<Login />} />
          <Route path="/users/:id" element={<MainPage />} />
          <Route path="/posts/" element={<AllPosts />} />
          <Route path="/test/" element={<Navbb />} />
          <Route path="/posts/:id" element={<Post />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
