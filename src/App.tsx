import "./App.css";
import Logo from "./assets/Logo.png";
import Products from "./components/Products";

function App() {
  return (
    <>
      <img src={Logo} alt="Logo" className="logo" />
      <h1>Fake Store</h1>
      <Products />
    </>
  );
}

export default App;
