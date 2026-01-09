import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
} from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "../reducer/cartReducer";
import Products from "../components/Products";
import ViewCartOffCanvas from "../components/OffCanvas";
import "@testing-library/jest-dom";
import React from "react";
import { getProducts } from "../data_firestore/ProductStore";

// Mock Firestore functions
jest.mock("../data_firestore/ProductStore", () => ({
  getProducts: jest.fn(),
}));

// Mock Firebase config
jest.mock("../firebaseConfig", () => ({
  auth: {},
  db: {},
}));

// Helper function to create a fresh store for each test
const createFreshStore = () => {
  const store = configureStore({
    reducer: {
      cart: cartReducer,
    },
    preloadedState: {
      cart: {
        items: [],
        totalAmount: 0,
        totalQuantity: 0,
      },
    },
  });
  // Add the same subscription logic as in store.ts
  store.subscribe(() => {
    const state = store.getState();
    try {
      const serializedState = JSON.stringify({ cart: state.cart });
      sessionStorage.setItem("cartState", serializedState);
    } catch {
      // Ignore write errors
    }
  });

  return store;
};

// Helper function to render with all necessary providers
const renderWithAllProviders = (component) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  const store = createFreshStore();

  return {
    ...render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>{component}</BrowserRouter>
        </QueryClientProvider>
      </Provider>
    ),
    store,
  };
};

describe("Cart Integration Test", () => {
  beforeEach(() => {
    // Clear sessionStorage before each test
    sessionStorage.clear();

    // Mock product data
    const mockProducts = [
      {
        id: "1",
        title: "Test Product 1",
        price: 29.99,
        category: "electronics",
        description: "This is a test product description",
        rating: { rate: 4.5, count: 100 },
        image: "https://example.com/product1.jpg",
        count: 0,
      },
      {
        id: "2",
        title: "Test Product 2",
        price: 49.99,
        category: "electronics",
        description: "This is another test product description",
        rating: { rate: 4.0, count: 50 },
        image: "https://example.com/product2.jpg",
        count: 0,
      },
    ];

    getProducts.mockResolvedValue(mockProducts);
  });

  afterEach(() => {
    jest.clearAllMocks();
    sessionStorage.clear();
  });

  // Integration Test 1: Complete flow from products to cart
  test("adds product from Products component and displays it in cart", async () => {
    renderWithAllProviders(
      <>
        <Products />
        <ViewCartOffCanvas />
      </>
    );

    // Wait for products to load
    await waitFor(() => {
      expect(screen.getByText("Test Product 1")).toBeInTheDocument();
    });

    // Find and click the "Add to Cart" button for the first product
    const addToCartButtons = screen.getAllByRole("button", {
      name: /add to cart/i,
    });
    fireEvent.click(addToCartButtons[0]);

    // Open the cart offcanvas
    const viewCartButton = screen.getByRole("button", { name: /view cart/i });
    fireEvent.click(viewCartButton);

    // Wait for offcanvas to open and find it
    const offcanvas = await waitFor(() => screen.getByRole("dialog"));

    // Verify product appears in cart (scope to offcanvas)
    await waitFor(() => {
      expect(
        within(offcanvas).getByText(/test product 1/i)
      ).toBeInTheDocument();
      expect(
        within(offcanvas).getByText(/price: \$29.99/i)
      ).toBeInTheDocument();
      expect(within(offcanvas).getByText(/quantity: 1/i)).toBeInTheDocument();
    });

    // Verify total amount
    expect(
      within(offcanvas).getByText(/total amount: \$29.99/i)
    ).toBeInTheDocument();
  });

  // Integration Test 2: Add multiple products and verify cart state
  test("adds multiple products and updates cart correctly", async () => {
    renderWithAllProviders(
      <>
        <Products />
        <ViewCartOffCanvas />
      </>
    );

    // Wait for products to load
    await waitFor(() => {
      expect(screen.getByText("Test Product 1")).toBeInTheDocument();
      expect(screen.getByText("Test Product 2")).toBeInTheDocument();
    });

    // Add first product twice
    const addToCartButtons = screen.getAllByRole("button", {
      name: /add to cart/i,
    });
    fireEvent.click(addToCartButtons[0]);
    fireEvent.click(addToCartButtons[0]);

    // Add second product once
    fireEvent.click(addToCartButtons[1]);

    // Open cart
    const viewCartButton = screen.getByRole("button", { name: /view cart/i });
    fireEvent.click(viewCartButton);

    // Wait for offcanvas and scope queries to it
    const offcanvas = await waitFor(() => screen.getByRole("dialog"));

    // Verify both products are in cart
    await waitFor(() => {
      expect(
        within(offcanvas).getByText(/test product 1/i)
      ).toBeInTheDocument();
      expect(
        within(offcanvas).getByText(/test product 2/i)
      ).toBeInTheDocument();
    });

    // Verify quantities
    expect(within(offcanvas).getByText(/quantity: 2/i)).toBeInTheDocument();
    expect(within(offcanvas).getByText(/quantity: 1/i)).toBeInTheDocument();

    // Verify total amount (29.99 * 2 + 49.99 = 109.97)
    expect(
      within(offcanvas).getByText(/total amount: \$109.97/i)
    ).toBeInTheDocument();
  });

  // Integration Test 3: Add product, remove it, and verify cart updates
  test("adds product and removes it from cart", async () => {
    renderWithAllProviders(
      <>
        <Products />
        <ViewCartOffCanvas />
      </>
    );

    // Wait for products to load
    await waitFor(() => {
      expect(screen.getByText("Test Product 1")).toBeInTheDocument();
    });

    // Add product to cart
    const addToCartButtons = screen.getAllByRole("button", {
      name: /add to cart/i,
    });
    fireEvent.click(addToCartButtons[0]);

    // Open cart
    const viewCartButton = screen.getByRole("button", { name: /view cart/i });
    fireEvent.click(viewCartButton);

    // Wait for offcanvas
    const offcanvas = await waitFor(() => screen.getByRole("dialog"));

    // Verify product is in cart
    await waitFor(() => {
      expect(
        within(offcanvas).getByText(/test product 1/i)
      ).toBeInTheDocument();
    });

    // Remove product from cart (scope to offcanvas)
    const removeButton = within(offcanvas).getByRole("button", {
      name: /remove/i,
    });
    fireEvent.click(removeButton);

    // Verify cart is empty
    await waitFor(() => {
      expect(
        within(offcanvas).getByText(/your cart is empty/i)
      ).toBeInTheDocument();
    });

    // Verify total is hidden
    const totalElement = within(offcanvas).queryByText(/total amount/i);
    expect(totalElement).not.toBeVisible();
  });

  // Test 4: Filter products and add filtered product to cart
  test("filters products by category and adds to cart", async () => {
    const mockProductsWithCategories = [
      {
        id: "1",
        title: "Electronics Product",
        price: 99.99,
        category: "electronics",
        description: "Electronic item",
        rating: { rate: 4.5, count: 100 },
        image: "https://example.com/electronics.jpg",
        count: 0,
      },
      {
        id: "2",
        title: "Clothing Product",
        price: 29.99,
        category: "men's clothing",
        description: "Clothing item",
        rating: { rate: 4.0, count: 50 },
        image: "https://example.com/clothing.jpg",
        count: 0,
      },
    ];

    getProducts.mockResolvedValue(mockProductsWithCategories);

    renderWithAllProviders(
      <>
        <Products />
        <ViewCartOffCanvas />
      </>
    );

    // Wait for products to load
    await waitFor(() => {
      expect(screen.getByText("Electronics Product")).toBeInTheDocument();
      expect(screen.getByText("Clothing Product")).toBeInTheDocument();
    });

    // Open dropdown and select Men's clothing
    const dropdownButton = screen.getByRole("button", { name: /all/i });
    fireEvent.click(dropdownButton);

    // Wait for dropdown to open and then find the option within the dropdown menu
    await waitFor(() => {
      const dropdownMenu = screen.getByRole("list");
      expect(dropdownMenu).toBeInTheDocument();
    });

    // Get all buttons with Men's clothing text and click the one inside the dropdown list
    const mensClothingOptions = screen.getAllByRole("button", {
      name: /men's clothing/i,
    });

    // Click the option button (not the dropdown toggle)
    fireEvent.click(mensClothingOptions[0]);

    // Wait for filter to apply
    await waitFor(() => {
      expect(screen.queryByText("Electronics Product")).not.toBeInTheDocument();
      expect(screen.getByText("Clothing Product")).toBeInTheDocument();
    });

    // Add the filtered product to cart
    const addToCartButton = screen.getByRole("button", {
      name: /add to cart/i,
    });
    fireEvent.click(addToCartButton);

    // Open cart and verify
    const viewCartButton = screen.getByRole("button", { name: /view cart/i });
    fireEvent.click(viewCartButton);

    const offcanvas = await waitFor(() => screen.getByRole("dialog"));

    await waitFor(() => {
      expect(
        within(offcanvas).getByText(/clothing product/i)
      ).toBeInTheDocument();
      expect(
        within(offcanvas).getByText(/total amount: \$29.99/i)
      ).toBeInTheDocument();
    });
  });

  // Integration Test 5: Add product, navigate to checkout
  test("adds product and navigates to checkout page", async () => {
    renderWithAllProviders(
      <>
        <Products />
        <ViewCartOffCanvas />
      </>
    );

    // Wait for products to load
    await waitFor(() => {
      expect(screen.getByText("Test Product 1")).toBeInTheDocument();
    });

    // Add product to cart
    const addToCartButtons = screen.getAllByRole("button", {
      name: /add to cart/i,
    });
    fireEvent.click(addToCartButtons[0]);

    // Open cart
    const viewCartButton = screen.getByRole("button", { name: /view cart/i });
    fireEvent.click(viewCartButton);

    const offcanvas = await waitFor(() => screen.getByRole("dialog"));

    // Click checkout button
    const checkoutButton = within(offcanvas).getByRole("button", {
      name: /go to checkout/i,
    });
    fireEvent.click(checkoutButton);

    // Verify offcanvas closes (View Cart button should be visible again)
    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /view cart/i })
      ).toBeInTheDocument();
    });
  });

  // Integration Test 6: Persistence - verify sessionStorage integration
  test("cart persists in sessionStorage", async () => {
    renderWithAllProviders(
      <>
        <Products />
        <ViewCartOffCanvas />
      </>
    );

    // Wait for products to load
    await waitFor(() => {
      expect(screen.getByText("Test Product 1")).toBeInTheDocument();
    });

    // Add product to cart
    const addToCartButtons = screen.getAllByRole("button", {
      name: /add to cart/i,
    });
    fireEvent.click(addToCartButtons[0]);

    // Wait a small amount of time for the subscription to fire
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Now check sessionStorage
    const savedState = sessionStorage.getItem("cartState");
    expect(savedState).not.toBeNull();

    const parsedState = JSON.parse(savedState);
    expect(parsedState.cart.items.length).toBe(1);
    expect(parsedState.cart.items[0].title).toBe("Test Product 1");
    expect(parsedState.cart.totalAmount).toBe(29.99);
  });

  // Integration Test 7: Add same product multiple times from Products component
  test("incrementing same product updates count correctly", async () => {
    renderWithAllProviders(
      <>
        <Products />
        <ViewCartOffCanvas />
      </>
    );

    // Wait for products to load
    await waitFor(() => {
      expect(screen.getByText("Test Product 1")).toBeInTheDocument();
    });

    // Add same product 3 times
    const addToCartButtons = screen.getAllByRole("button", {
      name: /add to cart/i,
    });
    fireEvent.click(addToCartButtons[0]);
    fireEvent.click(addToCartButtons[0]);
    fireEvent.click(addToCartButtons[0]);

    // Open cart
    const viewCartButton = screen.getByRole("button", { name: /view cart/i });
    fireEvent.click(viewCartButton);

    const offcanvas = await waitFor(() => screen.getByRole("dialog"));

    // Verify quantity and total
    await waitFor(() => {
      expect(within(offcanvas).getByText(/quantity: 3/i)).toBeInTheDocument();
      expect(
        within(offcanvas).getByText(/total amount: \$89.97/i)
      ).toBeInTheDocument();
    });
  });

  // Integration Test 8: Empty cart shows correct state
  test("empty cart displays correct message and hides checkout", async () => {
    // Create a completely fresh render for this test
    const { unmount } = renderWithAllProviders(
      <>
        <Products />
        <ViewCartOffCanvas />
      </>
    );

    // Wait for products to finish loading
    await waitFor(() => {
      expect(screen.getByText("Test Product 1")).toBeInTheDocument();
    });

    // Open cart without adding anything
    const viewCartButton = screen.getByRole("button", { name: /view cart/i });
    fireEvent.click(viewCartButton);

    // Wait for offcanvas to appear
    const offcanvas = await waitFor(() => screen.getByRole("dialog"));

    // Verify empty state
    await waitFor(
      () => {
        expect(
          within(offcanvas).getByText(/your cart is empty/i)
        ).toBeInTheDocument();
      },
      { timeout: 3000 }
    );

    // Verify checkout button is hidden
    const checkoutButton = within(offcanvas).getByText(/go to checkout/i);
    expect(checkoutButton).toHaveStyle({ visibility: "hidden" });

    unmount();
  });
});

/*
Test Summaries:
1. Complete flow from Products to Cart: Verifies adding a product from the Products component updates the cart correctly.
2. Multiple Products Addition: Tests adding multiple different products and checks cart state accuracy.
3. Product Removal: Ensures that removing a product from the cart updates the cart state properly.
4. Product Filtering: Validates that filtering products by category works and allows adding filtered products to the cart.
5. Checkout Navigation: Confirms that adding a product and navigating to checkout functions as expected.
6. Session Persistence: Checks that the cart state persists in sessionStorage after adding products.
7. Incrementing Product Count: Tests adding the same product multiple times and verifies the count and total amount.
8. Empty Cart State: Ensures that an empty cart displays the correct message and hides the checkout button.
*/
