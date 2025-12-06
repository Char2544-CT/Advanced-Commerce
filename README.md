# Advanced E-Commerce App Using Firebase Auth and Firestore

## Home Page, sessionStorage, Firestore db, Firebase auth, cart, order history

### Firebase Auth

- There is a register and login component. Both use Firebase to save user to Firestore and sign in user with auth.

### Firestore

- Users, Products, and Orders are all saved to firestore, with interfaces for each. Various CRUD operations/functions are written for each.

### Filtering and Items

- With the current state of the app, a user is pretty much being shown an admin view. They can not only alter their personal login credentials but are also able to manage products. I have a filtering function in Products.tsx so in order to still use it. Users can only add new products into a select few categories.

### Checkout Component

- During checkout, users can view previous orders that are linked to them personally. An OrderID and Date are intially shown, with a mapped -Show Details- button mapped to each order. Unpon clicking the button, total amount, total items, and what items are shown to the user.
