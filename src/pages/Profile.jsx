import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { getUserIdFromToken } from "../utils/decodeToken";
import UserLink from "../components/UserLink";
import Layout from "../components/Layout";

const Profile = () => {
  const { id } = useParams();
  const loggedInUserId = getUserIdFromToken();

  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: "", bio: "", avatar: "" });
  const [showList, setShowList] = useState(""); // to show "followers" or "following"

  useEffect(() => {
    if (!id || !loggedInUserId) return;

    setIsOwnProfile(id === loggedInUserId);

    const fetchUser = async () => {
      try {
        const res = await axios.get(`https://localtalent-backend-hhlx.onrender.com/api/users/${id}`);
        setUser(res.data);
        setEditForm({
          name: res.data.name,
          bio: res.data.bio || "",
          avatar: res.data.avatar || "",
        });
      } catch (err) {
        console.error("Error fetching user profile:", err);
      }
    };

    const fetchUserPosts = async () => {
      try {
        const res = await axios.get(`https://localtalent-backend-hhlx.onrender.com/api/posts/user/${id}`);
        setPosts(res.data);
      } catch (err) {
        console.error("Error fetching user posts:", err);
      }
    };

    fetchUser();
    fetchUserPosts();
  }, [id, loggedInUserId]);

  const handleFollowToggle = async () => {
    const token = localStorage.getItem("token");
    if (!token || !user || !loggedInUserId) return;

    try {
      const endpoint = user.followers.some(
        (f) => f._id === loggedInUserId || f === loggedInUserId
      )
        ? `https://localtalent-backend-hhlx.onrender.com/api/users/unfollow/${id}`
        : `https://localtalent-backend-hhlx.onrender.com/api/users/follow/${id}`;

      await axios.put(endpoint, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser((prev) => {
        const isFollowing = prev.followers.some(
          (f) => f._id === loggedInUserId || f === loggedInUserId
        );
        return {
          ...prev,
          followers: isFollowing
            ? prev.followers.filter((f) => (f._id || f) !== loggedInUserId)
            : [...prev.followers, loggedInUserId],
        };
      });
    } catch (err) {
      console.error("Follow/Unfollow error:", err);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const res = await axios.put(
        `https://localtalent-backend-hhlx.onrender.com/api/users/update/${id}`,
        editForm,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("Submitting edit:", editForm);
      setUser(res.data);
      setIsEditing(false);
    } catch (err) {
      console.error("Error updating profile:", err);
    }
  };

  if (!user) return <p>Loading...</p>;

  return (
    <Layout>
      <div style={{ padding: "1rem", maxWidth: "800px", margin: "0 auto" }}>

        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <img
            src={user.avatar}
            alt="avatar"
            width="80"
            height="80"
            style={{ borderRadius: "50%" }}
          />
          <div>
            {isEditing ? (
              <form onSubmit={handleEditSubmit}>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) =>
                    setEditForm({ ...editForm, name: e.target.value })
                  }
                  placeholder="Name"
                />
                <br />
                <input
                  type="text"
                  value={editForm.bio}
                  onChange={(e) =>
                    setEditForm({ ...editForm, bio: e.target.value })
                  }
                  placeholder="Bio"
                />
                <br />
                <input
                  type="text"
                  value={editForm.avatar}
                  onChange={(e) =>
                    setEditForm({ ...editForm, avatar: e.target.value })
                  }
                  placeholder="Avatar URL"
                />
                <br />
                <button type="submit">Save</button>
                <button type="button" onClick={() => setIsEditing(false)}>
                  Cancel
                </button>
              </form>
            ) : (
              <>
                <h2>{user.name}</h2>
                <p style={{
                  wordWrap: "break-word",
                  whiteSpace: "pre-wrap",
                  maxWidth: "100%",
                  marginTop: "0.5rem",
                }}>
                  {user.bio}
                </p>

                <p>
                  <span
                    style={{ cursor: "pointer", color: "blue" }}
                    onClick={() =>
                      setShowList(showList === "followers" ? null : "followers")
                    }
                  >
                    {user.followers.length} Followers
                  </span>{" "}
                  |{" "}
                  <span
                    style={{ cursor: "pointer", color: "blue" }}
                    onClick={() =>
                      setShowList(showList === "following" ? null : "following")
                    }
                  >
                    {user.following.length} Following
                  </span>
                </p>

                {isOwnProfile ? (
                  <button onClick={() => setIsEditing(true)}>Edit Profile</button>
                ) : (
                  <button onClick={handleFollowToggle}>
                    {user.followers.includes(loggedInUserId) ? "Unfollow" : "Follow"}
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        {showList && (
          <div
            style={{
              marginTop: "1rem",
              padding: "1rem",
              border: "1px solid #ccc",
            }}
          >
            <h4>{showList === "followers" ? "Followers" : "Following"}</h4>
            <ul style={{ paddingLeft: "0", listStyle: "none" }}>
              {(showList === "followers" ? user.followers : user.following).map(
                (u) => (
                  <li key={u._id} style={{ marginBottom: "0.5rem" }}>
                    <UserLink user={u} size={30} />
                  </li>
                )
              )}
            </ul>
            <button onClick={() => setShowList(null)}>Close</button>
          </div>
        )}

        <hr style={{ margin: "2rem 0" }} />
        <h3 style={{ textAlign: "center", margin: "2rem 0 1rem" }}>
          Posts by {user.name}
        </h3>

        {posts.length === 0 ? (
          <p>No posts yet.</p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {posts.map((post) => (
              <div
                key={post._id}
                style={{
                  border: "1px solid #ccc",
                  borderRadius: "10px",
                  padding: "1rem",
                  background: "#fff",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                }}
              >
                <img
                  src={post.image}
                  alt="post"
                  style={{
                    width: "100%",
                    maxHeight: "300px",
                    objectFit: "cover",
                    borderRadius: "8px",
                    marginBottom: "0.5rem",
                  }}
                />
                <h4>{post.caption}</h4>
                <p>
                  <small>{new Date(post.createdAt).toLocaleString()}</small>
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Profile;
