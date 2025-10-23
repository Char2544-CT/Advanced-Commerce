import "./App.css";
import Logo from "./assets/Logo.png";
import Products from "./components/Products";
import ViewCartOffCanvas from "./components/OffCanvas";

function App() {
  return (
    <>
      <img src={Logo} alt="Logo" className="logo" />
      <h1>Fake Store</h1>
      <ViewCartOffCanvas />
      <Products />
    </>
  );
}

export default App;
