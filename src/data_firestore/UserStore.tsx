//Save users in Firestore after registration
import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebaseConfig";

export interface User {
  uid?: string;
  email: string;
  username: string;
  address: string;
}

const saveUserToFirestore = async (user: User) => {
  try {
    await addDoc(collection(db, "users"), {
      uid: user.uid,
      email: user.email,
      username: user.username,
      address: user.address,
    });
  } catch (error) {
    console.error("Error saving user to Firestore: ", error);
  }
};

export { saveUserToFirestore };
