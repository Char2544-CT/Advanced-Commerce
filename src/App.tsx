import "./App.css";
import Logo from "./assets/Logo.png";
import Products from "./components/Products";
import ViewCartOffCanvas from "./components/OffCanvas";
import Checkout from "./components/Checkout";
import { Routes, Route } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Register from "./login/Register";
import Login from "./login/Login";
import Logout from "./login/Logout";
import { useState, useEffect } from "react";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { auth, db } from "./firebaseConfig";
import { collection, query, where, getDoc, doc } from "firebase/firestore";
import { UserDisplay } from "./data_firestore/UserDisplay";
import { EditUserButton } from "./components/EditUserButton";
import { EditProductButton } from "./components/EditProductButton";
import { ProductManagement } from "./data_firestore/ProductManage";
import { OrderDisplay } from "./data_firestore/OrderDisplay";

function App() {
  const navigate = useNavigate();
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        try {
          // Fetch user Document directly from 'users' collection using UID
          const userDocRef = doc(db, "users", currentUser.uid);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            setUsername(userData.username || "User");
            console.log("Logged in user:", userData.username);
          } else {
            console.log("No user document found");
            setUsername("User");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        setUsername(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <>
      {user ? (
        <div>
          <p>
            <strong>Welcome {username + "!" || "User!"}</strong>
          </p>
          <img
            src={Logo}
            alt="Logo"
            className="logo"
            onClick={() => navigate("/")}
          />
          <h1>Fake Store</h1>
          <ViewCartOffCanvas />
          <Routes>
            <Route path="/" element={<Products />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/user" element={<UserDisplay />} />
            <Route path="/manage-product" element={<ProductManagement />} />
            <Route path="/orders" element={<OrderDisplay />} />
          </Routes>
          <Logout />
          <EditUserButton />
          <EditProductButton />
        </div>
      ) : (
        <>
          <img src={Logo} alt="Logo" className="logo" />
          <Register />
          <Login />
        </>
      )}
    </>
  );
}

export default App;
