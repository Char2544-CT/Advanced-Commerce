import React from "react";
import { addToCart } from "../reducer/cartReducer";
import { AppDispatch } from "../reducer/store";
import { useDispatch } from "react-redux";
import "../styles/Buttons.css";

interface AddToCartButtonProps {
  product: {
    title: string;
    price: number;
    image: string;
  };
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({ product }) => {
  const dispatch = useDispatch<AppDispatch>();

  const handleAddToCart = () => {
    const { title, price, image } = product;
    dispatch(addToCart({ title, price, image }));
  };

  return (
    <button onClick={handleAddToCart} className="add-btn">
      Add to Cart
    </button>
  );
};

export default AddToCartButton;
