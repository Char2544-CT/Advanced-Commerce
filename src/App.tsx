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
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "./firebaseConfig";

function App() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  return (
    <>
      {user ? (
        <div>
          <p>Welcome, {user.email}</p>
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
          </Routes>
          <Logout />
        </div>
      ) : (
        <>
          <Register />
          <Login />
        </>
      )}
    </>
  );
}

export default App;
