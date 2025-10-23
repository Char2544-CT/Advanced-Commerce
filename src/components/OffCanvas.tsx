import { Offcanvas } from "react-bootstrap";
import { useState } from "react";
import "../styles/Buttons.css";
import { useNavigate } from "react-router-dom";

const ViewCartOffCanvas = () => {
  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  const handleShowOffCanvas = () => setShow(true);
  const handleCloseOffCanvas = () => setShow(false);

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
      backdropClassName="canvas"
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
        <button
          onClick={() => {
            navigate("/checkout");
            handleCloseOffCanvas();
          }}
          className="go-to-checkout-btn"
        >
          Go to Checkout
        </button>
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default ViewCartOffCanvas;
