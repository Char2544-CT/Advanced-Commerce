//Reducer to add, update, and remove items from cart
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CartItem {
  title: string;
  price: number;
  image: string;
  count: number;
}

export interface CartState {
  items: CartItem[];
  totalAmount: number;
  totalQuantity: number;
}

const initialState: CartState = {
  items: [],
  totalAmount: 0,
  totalQuantity: 0,
};

//When adding a new item to the cart, you only send the basic item info — you don’t include count,
//because the reducer will handle initializing or incrementing it.
//So the action’s payload should not contain count — that’s managed inside the reducer. I.e., Omit<CartItem, "count">
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Omit<CartItem, "count">>) => {
      const existingItem = state.items.find(
        (item) => item.title === action.payload.title
      );
      if (existingItem) {
        existingItem.count += 1;
      } else {
        state.items.push({ ...action.payload, count: 1 });
      }
      state.totalAmount += action.payload.price;
      state.totalQuantity += 1;
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      const existingItem = state.items.find(
        (item) => item.title === action.payload
      );
      if (existingItem) {
        state.totalAmount -= existingItem.price * existingItem.count;
        state.totalQuantity -= existingItem.count;
        state.items = state.items.filter(
          (item) => item.title !== action.payload
        );
      }
    },
    updateQuantity: (
      state,
      action: PayloadAction<{ title: string; count: number }>
    ) => {
      const existingItem = state.items.find(
        (item) => item.title === action.payload.title
      );
      if (existingItem) {
        const difference = action.payload.count - existingItem.count;
        existingItem.count = action.payload.count;
        state.totalAmount += existingItem.price * difference;
        state.totalQuantity += difference;
      }
    },
    clearCart: (state) => {
      state.items = [];
      state.totalAmount = 0;
      state.totalQuantity = 0;
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } =
  cartSlice.actions;
export default cartSlice.reducer;
