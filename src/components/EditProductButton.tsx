import { useNavigate } from "react-router-dom";
import "../styles/Buttons.css";

export const EditProductButton: React.FC = () => {
  const navigate = useNavigate();
  const handleEditProduct = () => {
    navigate("/manage-product");
  };

  return (
    <button onClick={handleEditProduct} className="edit-product-btn">
      Edit Products
    </button>
  );
};
