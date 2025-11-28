import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import { Product } from "../components/Products";

// Fetch all products from Firestore
export const getProducts = async (): Promise<Product[]> => {
  try {
    const productsRef = collection(db, "products");
    const querySnapshot = await getDocs(productsRef);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Product[];
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

// Add a new product to Firestore
export const addProduct = async (
  product: Omit<Product, "id">
): Promise<void> => {
  try {
    await addDoc(collection(db, "products"), product);
    console.log("Product added successfully!");
  } catch (error) {
    console.error("Error adding product:", error);
    throw error;
  }
};

// Update an existing product
export const updateProduct = async (
  productId: string,
  updatedData: Partial<Product>
): Promise<void> => {
  try {
    const productRef = doc(db, "products", productId);
    await updateDoc(productRef, updatedData);
    console.log("Product updated successfully!");
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
};

// Delete a product
export const deleteProduct = async (productId: string): Promise<void> => {
  try {
    const productRef = doc(db, "products", productId);
    await deleteDoc(productRef);
    console.log("Product deleted successfully!");
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
};
