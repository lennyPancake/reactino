import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import "./pages/Login";
import Login from "./pages/Login";
import "bootstrap/dist/css/bootstrap.min.css";
import Registration from "./components/Registration";
import MainPage from "./pages/MainPage";
import AllPosts from "./pages/AllPosts";
import Navb from "./components/Navb";
import AboutPost from "./pages/AboutPost";
import AllUsers from "./pages/AllUsers";
import { Navigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
function App() {
  return (
    <>
      <BrowserRouter>
        <Navb />
        <Routes>
          <Route path="/register" element={<Registration />} />
          <Route path="/login" element={<Login />} />
          <Route path="/users/:id" element={<MainPage />} />
          <Route path="/users/" element={<AllUsers />} />
          <Route path="/posts/" element={<AllPosts />} />
          <Route path="/posts/:id" element={<AboutPost />} />
          <Route
            path="/*"
            element={<Navigate to="/posts" replace />} // Здесь происходит перенаправление
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
