import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import "./pages/Login";
import Login from "./pages/Login";
import "bootstrap/dist/css/bootstrap.min.css";
import Registration from "./components/Registration";
import MainPage from "./pages/MainPage";
import { RootStoreContext } from "./index";
import { useContext } from "react";
import AllPosts from "./pages/AllPosts";
import Navb from "./components/Navb";
import Post from "./components/Post";
import AboutPost from "./pages/AboutPost";
import UsersList from "./components/UsersList";
import AllUsers from "./pages/AllUsers";
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/register" element={<Registration />} />
          <Route path="/login" element={<Login />} />
          <Route path="/users/:id" element={<MainPage />} />
          <Route path="/users/" element={<AllUsers />} />
          <Route path="/posts/" element={<AllPosts />} />
          <Route path="/posts/:id" element={<AboutPost />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
