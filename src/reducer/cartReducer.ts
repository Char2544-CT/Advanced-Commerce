//Reducer to add, update, and remove items from cart
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchProducts } from "./asyncActions";

interface CartItem {
  id: number;
  title: string;
  price: number;
  category: string;
  description: string;
  rating: number;
  image: string;
  count: number;
}
