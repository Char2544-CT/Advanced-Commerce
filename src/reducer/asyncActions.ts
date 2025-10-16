import { createAsyncThunk } from "@reduxjs/toolkit";

// Define the async thunk
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch("https://fakestoreapi.com/products");
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "An unknown error occurred";
      return rejectWithValue(message); // Handles errors
    }
  }
);
