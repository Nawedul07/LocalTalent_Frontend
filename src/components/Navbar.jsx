// src/components/Navbar.jsx
import { Link } from "react-router-dom";
import { getUserIdFromToken } from "../utils/decodeToken";

const Navbar = () => {
  const userId = getUserIdFromToken();

  return (
    <nav>
      <Link to="/">Home</Link> |{" "}
      <Link to="/create">Create Post</Link> |{" "}
      <Link to={`/profile/${userId}`}>Profile</Link> |{" "}
      <button
        onClick={() => {
          localStorage.removeItem("token");
          window.location.href = "/login";
        }}
      >
        Logout
      </button>
    </nav>
  );
};

export default Navbar;
