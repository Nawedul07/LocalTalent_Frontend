import { Link } from "react-router-dom";

const UserLink = ({ user, size = 30 }) => {
  if (!user) return null;

  return (
    <Link
      to={`/profile/${user._id}`}
      style={{
        textDecoration: "none",
        color: "black",
        display: "flex",
        alignItems: "center",
        gap: "0.5rem"
      }}
    >
      <img
        src={user.avatar}
        alt={user.name}
        width={size}
        height={size}
        style={{ borderRadius: "50%" }}
      />
      <span>{user.name}</span>
    </Link>
  );
};

export default UserLink;
