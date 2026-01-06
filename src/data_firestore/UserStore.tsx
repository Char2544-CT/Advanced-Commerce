//Save users in Firestore after registration
import { setDoc, doc } from "firebase/firestore";
import { db } from "../firebaseConfig";

export interface User {
  uid?: string;
  email: string;
  username: string;
  address: string;
}

const saveUserToFirestore = async (user: User) => {
  try {
    if (!user.uid) {
      throw new Error("User UID is required");
    }

    // Use setDoc with the user's UID as the document ID
    await setDoc(doc(db, "users", user.uid), {
      email: user.email,
      username: user.username,
      address: user.address,
    });
    console.log("User saved successfully!");
  } catch (error) {
    console.error("Error saving user to Firestore: ", error);
  }
};

export { saveUserToFirestore };
