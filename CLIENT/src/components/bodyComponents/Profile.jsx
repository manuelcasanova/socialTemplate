import { useContext } from "react";
import AuthContext from "../../context/AuthProvider";

export default function Profile() {
  const { auth, setAuth } = useContext(AuthContext);

  // Log auth to see what is inside
  console.log("auth", auth);

  // Extract userId from auth, or use a default value if undefined
  const userId = auth.userId || "Guest"; // Default to 'Guest' if userId is not available

  return (
    <div>
      <h2>Hello {userId}! - All registered users have access to this profile page</h2>
    </div>
  );
}
