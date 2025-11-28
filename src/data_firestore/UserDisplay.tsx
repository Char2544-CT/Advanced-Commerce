import { useState, useEffect } from "react";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { auth, db } from "../firebaseConfig";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";

interface UserDisplayProps {}

export const UserDisplay: React.FC<UserDisplayProps> = () => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [username, setUsername] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [newUsername, setNewUsername] = useState<string>("");
  const [newAddress, setNewAddress] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const usersRef = collection(db, "users");
          const q = query(usersRef, where("uid", "==", currentUser.uid));
          const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) {
            const userData = querySnapshot.docs[0].data();
            setUsername(userData.username || "User");
            setAddress(userData.address || "");
          }
          setLoading(false);
        } catch (error) {
          console.error("Error fetching user data:", error);
          setLoading(false);
        }
      } else {
        setUsername("");
        setAddress("");
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleUpdateAddress = async () => {
    if (user && newAddress) {
      try {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("uid", "==", user.uid));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          await updateDoc(querySnapshot.docs[0].ref, { address: newAddress });
          setAddress(newAddress);
          setNewAddress("");
          alert("Address updated successfully!");
        }
      } catch (error) {
        console.error("Error updating address:", error);
      }
    }
  };

  const handleUpdateUsername = async () => {
    if (user && newUsername) {
      try {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("uid", "==", user.uid));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          await updateDoc(querySnapshot.docs[0].ref, { username: newUsername });
          setUsername(newUsername);
          setNewUsername("");
          alert("Username updated successfully!");
        }
      } catch (error) {
        console.error("Error updating username:", error);
      }
    }
  };

  const handleDeleteAccount = async () => {
    if (
      user &&
      window.confirm("Are you sure you want to delete your account?")
    ) {
      try {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("uid", "==", user.uid));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          await deleteDoc(querySnapshot.docs[0].ref);
        }
        await user.delete();
        alert("Account deleted successfully!");
        navigate("/");
      } catch (error) {
        console.error("Error deleting account:", error);
        alert("Error deleting account. You may need to re-authenticate.");
      }
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>User Info</h2>
      {user ? (
        <div
          style={{ border: "2px solid black", margin: "10px", padding: "20px" }}
        >
          <div>
            <p>
              <strong>Username:</strong> {username}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>Address:</strong> {address}
            </p>
          </div>
          <div style={{ marginTop: "20px" }}>
            <input
              onChange={(e) => setNewUsername(e.target.value)}
              value={newUsername}
              type="text"
              placeholder="Enter new username"
            />
            <button onClick={handleUpdateUsername}>Update Username</button>
          </div>
          <div style={{ marginTop: "10px" }}>
            <input
              onChange={(e) => setNewAddress(e.target.value)}
              value={newAddress}
              type="text"
              placeholder="Enter new address"
            />
            <button onClick={handleUpdateAddress}>Update Address</button>
          </div>
          <div style={{ marginTop: "20px" }}>
            <button
              style={{ backgroundColor: "crimson", color: "white" }}
              onClick={handleDeleteAccount}
            >
              Delete Account
            </button>
          </div>
        </div>
      ) : (
        <p>No user logged in</p>
      )}
    </div>
  );
};
