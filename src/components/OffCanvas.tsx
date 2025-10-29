import { Offcanvas } from "react-bootstrap";
import { useState } from "react";
import "../styles/Buttons.css";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../reducer/store";
import { useDispatch } from "react-redux";
import { removeFromCart } from "../reducer/cartReducer";
import { AppDispatch } from "../reducer/store";

const ViewCartOffCanvas = () => {
  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  //Get cart items from redux store
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const dispatch = useDispatch<AppDispatch>();

  const handleShowOffCanvas = () => setShow(true);
  const handleCloseOffCanvas = () => setShow(false);

  const titleSlice = (title: string) => {
    return title.slice(0, 53) + (title.length > 53 ? "..." : "");
  };

  if (!show) {
    return (
      <button onClick={handleShowOffCanvas} className="view-cart-btn">
        View Cart
      </button>
    );
  }

  return (
    <Offcanvas
      show={show}
      onHide={handleCloseOffCanvas}
      className={"offcanvas"}
      scroll={true}
    >
      <Offcanvas.Header>
        <Offcanvas.Title>
          <button onClick={handleCloseOffCanvas} className="close-btn">
            Close
          </button>
        </Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <h1 className="title">Your Cart</h1>
        {/* Display cart items */}
        {cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <ul>
            {cartItems.map((item, idx) => (
              <li key={idx} style={{ marginBottom: "16px", listStyle: "none" }}>
                <img
                  src={item.image}
                  alt={item.title}
                  style={{ width: "60px", marginRight: "12px" }}
                />
                <strong>{titleSlice(item.title)}</strong>
                <div>Price: ${item.price}</div>
                <div>Quantity: {item.count}</div>
                {
                  <button
                    className="remove-item-btn"
                    onClick={() => dispatch(removeFromCart(item.title))}
                  >
                    Remove
                  </button>
                }
              </li>
            ))}
          </ul>
        )}
        <button
          style={{ visibility: cartItems.length === 0 ? "hidden" : "visible" }}
          onClick={() => {
            navigate("/checkout");
            handleCloseOffCanvas();
          }}
          className="go-to-checkout-btn"
        >
          Go to Checkout
        </button>
        <p
          style={{
            visibility: cartItems.length === 0 ? "hidden" : "visible",
            inlineSize: "200px",
            overflowWrap: "break-word",
            marginTop: "30px",
            marginLeft: "40px",
            fontWeight: "bold",
          }}
        >
          Total Amount: $
          {cartItems.reduce(
            (total, item) => total + item.price * item.count,
            0
          )}
        </p>
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default ViewCartOffCanvas;
