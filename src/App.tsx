import "./App.css";
import Logo from "./assets/Logo.png";
import Products from "./components/Products";
import ViewCartOffCanvas from "./components/OffCanvas";
import Checkout from "./components/Checkout";
import { Routes, Route } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function App() {
  const navigate = useNavigate();

  return (
    <>
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
    </>
  );
}

export default App;
