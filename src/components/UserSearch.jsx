import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const UserSearch = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    if (!query.trim()) return;
    try {
      const res = await axios.get(
        `https://localtalent-backend-hhlx.onrender.com/api/users/search?name=${encodeURIComponent(
          query
        )}`
      );

      setResults(res.data);
    } catch (err) {
      console.error("Search failed:", err);
    }
  };

  return (
    <div style={{ padding: "1rem", marginBottom: "1rem" }}>
      <input
        type="text"
        placeholder="Search users by name..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSearch();
        }}
        style={{
          padding: "0.5rem",
          width: "60%",
          marginRight: "0.5rem",
          borderRadius: "5px",
          border: "1px solid #ccc",
        }}
      />
      <button onClick={handleSearch}>Search</button>

      <div style={{ marginTop: "1rem" }}>
        {results.map((user) => (
          <div key={user._id} style={{ marginBottom: "0.5rem" }}>
            <Link to={`/profile/${user._id}`}>
              <img
                src={user.avatar}
                alt="avatar"
                width="30"
                height="30"
                style={{ borderRadius: "50%", marginRight: "0.5rem" }}
              />
              {user.name}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserSearch;
