import { useEffect, useState } from "react";
import axios from "axios";
import { getUserIdFromToken } from "../utils/decodeToken";
import UserLink from "../components/UserLink";
import UserSearch from "../components/UserSearch";
const Home = () => {
  const [posts, setPosts] = useState([]);
  const [showComments, setShowComments] = useState({});
  const [commentInputs, setCommentInputs] = useState({});

  const fetchPosts = async () => {
    try {
      const res = await axios.get("https://localtalent-backend-hhlx.onrender.com/api/posts");
      setPosts(res.data);
    } catch (err) {
      console.error("Error fetching posts:", err);
    }
  };

  const handleLike = async (postId) => {
    const token = localStorage.getItem("token");
    const userId = getUserIdFromToken();

    try {
      await axios.put(
        `https://localtalent-backend-hhlx.onrender.com/api/posts/like/${postId}`,
        { userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setPosts((prevPosts) =>
        prevPosts.map((p) =>
          p._id === postId
            ? {
                ...p,
                likes: p.likes.includes(userId)
                  ? p.likes.filter((id) => id !== userId)
                  : [...p.likes, userId],
              }
            : p
        )
      );
    } catch (err) {
      console.error("Like error:", err);
    }
  };

  const toggleComments = (postId) => {
    setShowComments((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  const handleCommentChange = (e, postId) => {
    setCommentInputs((prev) => ({ ...prev, [postId]: e.target.value }));
  };

  const handleAddComment = async (e, postId) => {
    e.preventDefault();
    const comment = commentInputs[postId]?.trim();
    if (!comment) return;
    const token = localStorage.getItem("token");

    try {
      await axios.post(
        `https://localtalent-backend-hhlx.onrender.com/api/posts/comment/${postId}`,
        {
          userId: getUserIdFromToken(),
          comment,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      fetchPosts();
      setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

  const handleDeleteComment = async (postId, commentId) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(
        `https://localtalent-backend-hhlx.onrender.com/api/posts/comment/${postId}/${commentId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchPosts();
    } catch (err) {
      console.error("Delete comment failed:", err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        width: "100vw",
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
        padding: "2rem",
        boxSizing: "border-box",
      }}
    >
      <div style={{ width: "100%", maxWidth: "600px", margin: "0 auto",
        padding: "1rem", }}>
        <h2 style={{ textAlign: "center", marginBottom: "2rem" }}>All Posts</h2>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1.5rem",
          }}
        >
          <UserSearch/>
          {posts.map((post) => {
            const userId = getUserIdFromToken();
            const isLiked = post.likes.includes(userId);
            const show = showComments[post._id];

            return (
              <div
                key={post._id}
                style={{
                  border: "1px solid #ccc",
                  borderRadius: "10px",
                  padding: "1rem",
                  background: "#fff",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  wordBreak: "break-word",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    marginBottom: "0.5rem",
                  }}
                >
                  <UserLink user={post.userId} size={40} />
                </div>

                <img
                  src={post.image}
                  alt="Post"
                  style={{
                    width: "100%",
                    maxHeight: "300px",
                    objectFit: "cover",
                    borderRadius: "8px",
                    marginBottom: "0.5rem",
                  }}
                />

                <h3 style={{ whiteSpace: "pre-wrap" }}>{post.caption}</h3>
                <p>
                  <small>
                    Posted on: {new Date(post.createdAt).toLocaleString()}
                  </small>
                </p>

                <div
                  style={{ display: "flex", gap: "1rem", marginTop: "0.5rem" }}
                >
                  <button
                    onClick={() => handleLike(post._id)}
                    style={{
                      padding: "6px 12px",
                      borderRadius: "6px",
                      backgroundColor: isLiked ? "#f8d7da" : "#e2e3e5",
                      border: "none",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                    }}
                  >
                    {isLiked ? "💔 Unlike" : "❤️ Like"} ({post.likes.length})
                  </button>

                  <button
                    onClick={() => toggleComments(post._id)}
                    style={{
                      padding: "6px 12px",
                      borderRadius: "6px",
                      backgroundColor: "#e2e3e5",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    💬 Comments ({post.comments.length})
                  </button>
                </div>

                {show && (
                  <div style={{ marginTop: "1rem" }}>
                    <h4>Comments</h4>
                    {post.comments.length === 0 && <p>No comments yet.</p>}

                    {[...post.comments]
                      .sort(
                        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                      )
                      .map((comment, index) => (
                        <div
                          key={index}
                          style={{
                            marginBottom: "0.75rem",
                          }}
                        >
                          <div
                            style={{
                              whiteSpace: "pre-wrap",
                              wordBreak: "break-word",
                              overflowWrap: "break-word",
                            }}
                          >
                            <UserLink user={comment.userId} size={24} />{" "}
                            {comment.comment}
                            <br />
                            <small>
                              {new Date(comment.createdAt).toLocaleString()}
                            </small>
                            {comment.userId?._id === userId && (
                              <button
                                onClick={() =>
                                  handleDeleteComment(post._id, comment._id)
                                }
                                style={{
                                  marginLeft: "1rem",
                                  color: "red",
                                  cursor: "pointer",
                                  background: "none",
                                  border: "none",
                                }}
                              >
                                Delete
                              </button>
                            )}
                          </div>
                        </div>
                      ))}

                    <form
                      onSubmit={(e) => handleAddComment(e, post._id)}
                      style={{
                        display: "flex",
                        gap: "0.5rem",
                        marginTop: "0.5rem",
                      }}
                    >
                      <input
                        type="text"
                        name="comment"
                        value={commentInputs[post._id] || ""}
                        onChange={(e) => handleCommentChange(e, post._id)}
                        placeholder="Write a comment..."
                        style={{
                          flex: 1,
                          padding: "0.5rem",
                          borderRadius: "4px",
                          border: "1px solid #ccc",
                        }}
                      />
                      <button type="submit">Post</button>
                    </form>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Home;
