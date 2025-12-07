import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  Timestamp,
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import { CartState } from "../reducer/cartReducer";

export interface Order {
  id?: string;
  userId?: string;
  items: CartState["items"];
  totalAmount: number;
  totalQuantity: number;
  createdAt: Timestamp | Date;
}

// Save order to Firestore
export const saveOrder = async (
  order: Omit<Order, "id" | "createdAt">,
  userId: string
): Promise<void> => {
  try {
    await addDoc(collection(db, "orders"), {
      userId: userId,
      items: order.items,
      totalAmount: order.totalAmount,
      totalQuantity: order.totalQuantity,
      createdAt: Timestamp.now(),
    });
    console.log("Order saved successfully!");
  } catch (error) {
    console.error("Error saving order: ", error);
    throw error;
  }
};
// Fetch all orders from Firestore
export const getOrdersByUserId = async (userId: string): Promise<Order[]> => {
  try {
    const ordersRef = collection(db, "orders");
    const q = query(ordersRef, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate() || new Date(), //convert Firestore Timestamp to Javascript Date
    })) as Order[];
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
};
