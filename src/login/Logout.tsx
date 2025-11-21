import { auth } from "../firebaseConfig";
import { signOut } from "firebase/auth";
import "../styles/Buttons.css";

const Logout = () => {
  const handleLogout = async () => {
    try {
      await signOut(auth);
      alert("Logged out!");
    } catch (err: any) {
      console.error("Logout error:", err.message);
    }
  };

  return (
    <button onClick={handleLogout} className="logout-button">
      Logout
    </button>
  );
};

export default Logout;
