import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../reducer/store";
import { clearCart } from "../reducer/cartReducer";
import { AppDispatch } from "../reducer/store";

const Checkout: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const cartItems = useSelector((state: RootState) => state.cart.items);

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

  const handleSubmit = (values: typeof initialValues) => {
    // Handle form submission
    console.log("Form values:", values);
    dispatch(clearCart());
    alert("Order placed successfully!");
    sessionStorage.removeItem("cartState");
  };

  return (
    <div className="checkout">
      <h1>Checkout</h1>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {() => (
          <Form>
            <div>
              <label htmlFor="name">Name</label>
              <Field type="text" id="name" name="name" />
              <ErrorMessage name="name" component="div" />
            </div>
            <div>
              <label htmlFor="email">Email</label>
              <Field type="email" id="email" name="email" />
              <ErrorMessage name="email" component="div" />
            </div>
            <div>
              <label htmlFor="address">Address</label>
              <Field type="text" id="address" name="address" />
              <ErrorMessage name="address" component="div" />
            </div>
            <h2>Your Cart Items</h2>
            <ul>
              {cartItems.map((item) => (
                <li key={item.title}>
                  {item.title} - ${item.price} x {item.count}
                </li>
              ))}
            </ul>
            <button type="submit">Place Order</button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Checkout;
