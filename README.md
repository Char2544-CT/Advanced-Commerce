# Advanced E-Commerce App Using FakeStoreAPI

## Home Page, React Query, Products, Cart, Redux

### Display Products

- Using React Query, I display my array of Product Objects. Async/Await function, along with axios calls the fake store API and displays all products. However, There is a dropdown component that filters the Products displayed according to their category (based on the JSON category data from FakeStoreAPI). The filtered products are mapped using the map method along with my AddToCartButton component under each product. Description for each product is sliced to 100 characters just to keep things neat.

### Add To Cart

- An add to cart Button is mapped to each product. My reducer handles the action which is called addToCart. My store also saves a running price, total quantity, and an Array of Cart Items in local storage for use in other pages/components.

### OffCanvas

- The offcanvas is actually what displays the items in the cart. Using redux and my store, I can get all my cart items and add them to my offcanvas. A button styled with css along with simple state to handle opening and closing of the off canvas is what shows cart. A remove from cart button is mapped under each product with another reducer action, to remove a product. If there are products in your cart, a button is shown to go to checkout, using the React Router. Total amount is also displayed which just shows item price times count to a fixed decimal place of 2.

### Checkout Component

- Once at checkout, I import yup for form validation, setting up the schema, along with Formik, which I don't use too much. Very simple form, diplaying products, and total price. Upon Placing order, the Redux cart is cleared, along with sessionStorage. A message is displayed to the user. Another button is displayed, which again, just uses the reducer to clearCart and sessionStorage. A simple function is used to display -No Items In Cart- or if there are items, calculates the total.
