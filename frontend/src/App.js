import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Login from "./pages/Login";
import Registration from "./components/Registration";
import MainPage from "./pages/MainPage";
import AllPosts from "./pages/AllPosts";
import Navb from "./components/Navb";
import AboutPost from "./pages/AboutPost";
import AllUsers from "./pages/AllUsers";
import Settings from "./pages/Settings";

function App() {
  return (
    <BrowserRouter>
      <Navb />
      <Routes>
        <Route path="/register" element={<Registration />} />
        <Route path="/login" element={<Login />} />
        <Route path="/users/:id" element={<MainPage />} />
        <Route path="/users/" element={<AllUsers />} />
        <Route path="/posts/" element={<AllPosts />} />
        <Route path="/posts/:id" element={<AboutPost />} />
        <Route path="/users/:id/settings" element={<Settings />} />
        <Route path="/*" element={<Navigate to="/posts" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
