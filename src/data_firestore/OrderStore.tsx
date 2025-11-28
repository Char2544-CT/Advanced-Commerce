import { collection, addDoc, getDocs, doc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { CartState } from "../reducer/CartReducer";
import { useState, useEffect } from "react";

interface Order {
  id: string;
  items: CartState["items"];
  totalAmount: number;
  totalQuantity: number;
  createdAt: Date;
}

// Save order to Firestore
export const saveOrder = async (order: CartState): Promise<void> => {
  try {
    await addDoc(collection(db, "orders"), {
      id: doc(collection(db, "orders")).id,
      items: order.items,
      totalAmount: order.totalAmount,
      totalQuantity: order.totalQuantity,
      createdAt: new Date(),
    });
    console.log("Order saved successfully!");
  } catch (error) {
    console.error("Error saving order: ", error);
  }
};
// Fetch all orders from Firestore
export const getOrders = async (): Promise<Order[]> => {
  try {
    const ordersRef = collection(db, "orders");
    const querySnapshot = await getDocs(ordersRef);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Order[];
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
};
