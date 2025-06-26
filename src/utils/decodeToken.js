export const getUserIdFromToken = () => {
  const token = localStorage.getItem("token");

  if (!token) return null;

  try {
    const base64Payload = token.split(".")[1];
    const payload = JSON.parse(atob(base64Payload));
    return payload.id; // Make sure your token payload has "id"
  } catch (err) {
    console.error("Error decoding token:", err);
    return null;
  }
};
