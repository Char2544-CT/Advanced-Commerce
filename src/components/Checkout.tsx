import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../reducer/store";
import { clearCart } from "../reducer/cartReducer";
import { AppDispatch } from "../reducer/store";
import "../styles/Checkout.css";
import { useNavigate } from "react-router-dom";
import { saveOrder } from "../data_firestore/OrderStore";
import { auth } from "../firebaseConfig";

const Checkout: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const totalAmount = useSelector((state: RootState) => state.cart.totalAmount);
  const totalQuantity = useSelector(
    (state: RootState) => state.cart.totalQuantity
  );
  const navigate = useNavigate();
  const user = auth.currentUser;

  const initialValues = {
    name: "",
    email: "",
    address: "",
    cartItems: cartItems,
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    address: Yup.string().required("Address is required"),
  });

  const handleSubmit = async (values: typeof initialValues) => {
    if (!user) {
      alert("You must be logged in to place an order");
      return;
    }

    try {
      // Save order to Firestore BEFORE clearing cart
      await saveOrder(
        {
          items: cartItems,
          totalAmount: totalAmount,
          totalQuantity: totalQuantity,
        },
        user.uid
      );

      // Then clear cart and session storage
      dispatch(clearCart());
      sessionStorage.removeItem("cartState");

      alert("Order placed successfully!");
      console.log("Form values:", values);
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place order. Please try again.");
    }
  };

  const handleTotalDisplay = () => {
    if (cartItems.length === 0) return "No Items In Cart";

    return (
      <strong className="total">
        Total: $
        {cartItems
          .reduce((total, item) => total + item.price * item.count, 0)
          .toFixed(2)}
      </strong>
    );
  };

  return (
    <div className="checkout">
      <h2>Checkout</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {() => (
          <Form className="checkout-form">
            <div className="customer-info">
              <div>
                <label htmlFor="name">Name: </label>
                <Field type="text" id="name" name="name" />
                <ErrorMessage name="name" component="div" />
              </div>
              <div>
                <label htmlFor="email">Email: </label>
                <Field type="email" id="email" name="email" />
                <ErrorMessage name="email" component="div" />
              </div>
              <div>
                <label htmlFor="address">Address: </label>
                <Field type="text" id="address" name="address" />
                <ErrorMessage name="address" component="div" />
              </div>
            </div>
            <h2>Your Cart Items</h2>
            <ul>
              {cartItems.map((item) => (
                <li key={item.title}>
                  {item.title} - ${item.price} x {item.count}
                </li>
              ))}
              <strong className="total">{handleTotalDisplay()}</strong>
            </ul>
            <button type="submit" className="place-order-button">
              Place Order
            </button>
            <button
              type="button"
              className="clear-button"
              onClick={() => {
                dispatch(clearCart());
                sessionStorage.removeItem("cartState");
              }}
            >
              Clear Cart
            </button>
            <button
              type="button"
              className="view-order"
              onClick={() => {
                navigate("/orders");
              }}
            >
              View Previous Orders
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Checkout;
