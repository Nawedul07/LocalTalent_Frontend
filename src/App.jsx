// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import CreatePost from "./pages/CreatePost";
import Navbar from "./components/Navbar";

const App = () => {
  const user = localStorage.getItem("token");

  return (
    <>
      {user && <Navbar />}
      <Routes>
        <Route path="/" element={user ? <Home /> : <Navigate to="/login" />} />
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
        <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
        <Route path="/profile/:id" element={user ? <Profile /> : <Navigate to="/login" />} />
        <Route path="/create" element={user ? <CreatePost /> : <Navigate to="/login" />} />
      </Routes>
    </>
  );
};

export default App;
