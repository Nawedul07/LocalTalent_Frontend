import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Layout from "../components/layout";

const CreatePost = () => {
  const [formData, setFormData] = useState({
    caption: "",
    image: ""
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("https://localtalent-backend-hhlx.onrender.com/api/posts", formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log("Post created:", res.data);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create post");
    }
  };

  return (
    <Layout>
      <div
        style={{
          padding: "2rem",
          background: "#fff",
          borderRadius: "10px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          maxWidth: "600px",
          width: "100%",
          margin: "auto"
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "1.5rem", color: "#333" }}>
          Create a Post
        </h2>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "1rem" }}>
            <label
              htmlFor="caption"
              style={{ display: "block", marginBottom: "0.5rem", color: "#555" }}
            >
              Caption
            </label>
            <input
              type="text"
              name="caption"
              id="caption"
              placeholder="What's on your mind?"
              value={formData.caption}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "0.75rem",
                borderRadius: "5px",
                border: "1px solid #ccc",
                fontSize: "1rem"
              }}
            />
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <label
              htmlFor="image"
              style={{ display: "block", marginBottom: "0.5rem", color: "#555" }}
            >
              Image URL
            </label>
            <input
              type="text"
              name="image"
              id="image"
              placeholder="Paste your image link"
              value={formData.image}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "0.75rem",
                borderRadius: "5px",
                border: "1px solid #ccc",
                fontSize: "1rem"
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "0.75rem",
              borderRadius: "5px",
              backgroundColor: "#4CAF50",
              color: "white",
              fontWeight: "bold",
              fontSize: "1rem",
              border: "none",
              cursor: "pointer",
              transition: "background 0.3s"
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#45a049")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#4CAF50")}
          >
            Post
          </button>
        </form>

        {error && (
          <p style={{ color: "red", marginTop: "1rem", textAlign: "center" }}>
            {error}
          </p>
        )}
      </div>
    </Layout>
  );
};

export default CreatePost;
