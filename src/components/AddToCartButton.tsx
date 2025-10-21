import { CartItem } from "../reducer/cartReducer";
import React from "react";
import { addToCart } from "../reducer/cartReducer";
import { AppDispatch } from "../reducer/store";
import { useDispatch } from "react-redux";
import "../styles/Buttons.css";

interface AddToCartButtonProps {
  product: CartItem;
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({ product }) => {
  const dispatch = useDispatch<AppDispatch>();

  const handleAddToCart = () => {
    dispatch(addToCart(product));
  };

  return (
    <button onClick={handleAddToCart} className="add-btn">
      Add to Cart
    </button>
  );
};

export default AddToCartButton;
