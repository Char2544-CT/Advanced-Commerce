import { configureStore } from "@reduxjs/toolkit";
import cartReducer, { CartState } from "./cartReducer";

const loadState = (): { cart: CartState } | undefined => {
  try {
    const serializedState = sessionStorage.getItem("cartState");
    if (serializedState === null) {
      return undefined;
    }

    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
};

const saveState = (state: { cart: CartState }) => {
  try {
    const serializedState = JSON.stringify(state);
    sessionStorage.setItem("cartState", serializedState);
  } catch {
    // Ignore write errors
  }
};

const persistedState = loadState();

export const store = configureStore({
  reducer: {
    cart: cartReducer,
  },
  preloadedState: persistedState,
});

store.subscribe(() => {
  const state = store.getState();
  saveState({
    cart: state.cart,
  });
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
// Inferred type: {cart: CartState}
