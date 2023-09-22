import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./components/Login";
import Login from "./components/Login";
import "bootstrap/dist/css/bootstrap.min.css";
import Registration from "./components/Registration";
import MainPage from "./pages/MainPage";
import PostsList from "./components/PostsList";
import userStore from "./store/userStore";
import { RootStoreContext } from "./index";
import { useContext } from "react";
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
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
