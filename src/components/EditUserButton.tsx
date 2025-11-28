import { useNavigate } from "react-router-dom";
import "../styles/Buttons.css";

export const EditUserButton: React.FC = () => {
  const navigate = useNavigate();

  const handleEditUser = () => {
    navigate("/user");
  };

  return (
    <button onClick={handleEditUser} className="edit-btn">
      Edit User
    </button>
  );
};
