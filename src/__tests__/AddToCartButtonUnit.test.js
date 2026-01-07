import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import AddToCartButton from "../components/AddToCartButton";
import cartReducer from "../reducer/cartReducer";
import "@testing-library/jest-dom";
import React from "react";

// Helper function to create a mock store
const createMockStore = (initialState) => {
  return configureStore({
    reducer: {
      cart: cartReducer,
    },
    preloadedState: initialState,
  });
};

// Helper function to render component with providers
const renderWithProviders = (component, initialState) => {
  const store = createMockStore(initialState);
  return {
    ...render(<Provider store={store}>{component}</Provider>),
    store,
  };
};

describe("AddToCartButton Component", () => {
  const mockProduct = {
    title: "Test Product",
    price: 29.99,
    image: "https://example.com/test-image.jpg",
  };

  // Test 1: Button renders correctly
  test("renders Add to Cart button", () => {
    const emptyCartState = {
      cart: {
        items: [],
        totalAmount: 0,
        totalQuantity: 0,
      },
    };

    renderWithProviders(
      <AddToCartButton product={mockProduct} />,
      emptyCartState
    );

    const button = screen.getByRole("button", { name: /add to cart/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass("add-btn");
  });

  // Test 2: Button click dispatches addToCart action
  test("adds product to cart when button is clicked", () => {
    const emptyCartState = {
      cart: {
        items: [],
        totalAmount: 0,
        totalQuantity: 0,
      },
    };

    const { store } = renderWithProviders(
      <AddToCartButton product={mockProduct} />,
      emptyCartState
    );

    const button = screen.getByRole("button", { name: /add to cart/i });
    fireEvent.click(button);

    const state = store.getState();
    expect(state.cart.items.length).toBe(1);
    expect(state.cart.items[0].title).toBe("Test Product");
    expect(state.cart.items[0].price).toBe(29.99);
    expect(state.cart.items[0].image).toBe(
      "https://example.com/test-image.jpg"
    );
    expect(state.cart.items[0].count).toBe(1);
  });

  // Test 3: Multiple clicks increment count
  test("increments product count when added multiple times", () => {
    const emptyCartState = {
      cart: {
        items: [],
        totalAmount: 0,
        totalQuantity: 0,
      },
    };

    const { store } = renderWithProviders(
      <AddToCartButton product={mockProduct} />,
      emptyCartState
    );

    const button = screen.getByRole("button", { name: /add to cart/i });

    // Click button 3 times
    fireEvent.click(button);
    fireEvent.click(button);
    fireEvent.click(button);

    const state = store.getState();
    expect(state.cart.items.length).toBe(1);
    expect(state.cart.items[0].count).toBe(3);
    expect(state.cart.totalQuantity).toBe(3);
  });

  // Test 4: Total amount updates correctly
  test("updates total amount when product is added", () => {
    const emptyCartState = {
      cart: {
        items: [],
        totalAmount: 0,
        totalQuantity: 0,
      },
    };

    const { store } = renderWithProviders(
      <AddToCartButton product={mockProduct} />,
      emptyCartState
    );

    const button = screen.getByRole("button", { name: /add to cart/i });
    fireEvent.click(button);

    const state = store.getState();
    expect(state.cart.totalAmount).toBe(29.99);
  });

  // Test 5: Total amount updates with multiple clicks
  test("updates total amount correctly with multiple additions", () => {
    const emptyCartState = {
      cart: {
        items: [],
        totalAmount: 0,
        totalQuantity: 0,
      },
    };

    const { store } = renderWithProviders(
      <AddToCartButton product={mockProduct} />,
      emptyCartState
    );

    const button = screen.getByRole("button", { name: /add to cart/i });
    fireEvent.click(button);
    fireEvent.click(button);

    const state = store.getState();
    expect(state.cart.totalAmount).toBeCloseTo(59.98, 2);
  });

  // Test 6: Different products are added separately
  test("adds different products separately to cart", () => {
    const emptyCartState = {
      cart: {
        items: [],
        totalAmount: 0,
        totalQuantity: 0,
      },
    };

    const product1 = {
      title: "Product 1",
      price: 10.0,
      image: "https://example.com/image1.jpg",
    };

    const product2 = {
      title: "Product 2",
      price: 20.0,
      image: "https://example.com/image2.jpg",
    };

    const { store, rerender } = renderWithProviders(
      <AddToCartButton product={product1} />,
      emptyCartState
    );

    const button1 = screen.getByRole("button", { name: /add to cart/i });
    fireEvent.click(button1);

    // Re-render with second product
    rerender(
      <Provider store={store}>
        <AddToCartButton product={product2} />
      </Provider>
    );

    const button2 = screen.getByRole("button", { name: /add to cart/i });
    fireEvent.click(button2);

    const state = store.getState();
    expect(state.cart.items.length).toBe(2);
    expect(state.cart.totalAmount).toBe(30.0);
    expect(state.cart.totalQuantity).toBe(2);
  });

  // Test 7: Button works with existing cart items
  test("adds product to cart that already has items", () => {
    const cartWithItems = {
      cart: {
        items: [
          {
            title: "Existing Product",
            price: 15.0,
            image: "https://example.com/existing.jpg",
            count: 1,
          },
        ],
        totalAmount: 15.0,
        totalQuantity: 1,
      },
    };

    const { store } = renderWithProviders(
      <AddToCartButton product={mockProduct} />,
      cartWithItems
    );

    const button = screen.getByRole("button", { name: /add to cart/i });
    fireEvent.click(button);

    const state = store.getState();
    expect(state.cart.items.length).toBe(2);
    expect(state.cart.totalQuantity).toBe(2);
    expect(state.cart.totalAmount).toBeCloseTo(44.99, 2);
  });

  // Test 8: Button displays correct text
  test("button text is case-insensitive 'Add to Cart'", () => {
    const emptyCartState = {
      cart: {
        items: [],
        totalAmount: 0,
        totalQuantity: 0,
      },
    };

    renderWithProviders(
      <AddToCartButton product={mockProduct} />,
      emptyCartState
    );

    const button = screen.getByRole("button", { name: /add to cart/i });
    expect(button.textContent).toMatch(/add to cart/i);
  });

  // Test 9: Product with zero price
  test("handles product with zero price", () => {
    const freeProduct = {
      title: "Free Product",
      price: 0,
      image: "https://example.com/free.jpg",
    };

    const emptyCartState = {
      cart: {
        items: [],
        totalAmount: 0,
        totalQuantity: 0,
      },
    };

    const { store } = renderWithProviders(
      <AddToCartButton product={freeProduct} />,
      emptyCartState
    );

    const button = screen.getByRole("button", { name: /add to cart/i });
    fireEvent.click(button);

    const state = store.getState();
    expect(state.cart.items.length).toBe(1);
    expect(state.cart.totalAmount).toBe(0);
    expect(state.cart.totalQuantity).toBe(1);
  });

  // Test 10: Product with high price
  test("handles product with high price correctly", () => {
    const expensiveProduct = {
      title: "Expensive Product",
      price: 9999.99,
      image: "https://example.com/expensive.jpg",
    };

    const emptyCartState = {
      cart: {
        items: [],
        totalAmount: 0,
        totalQuantity: 0,
      },
    };

    const { store } = renderWithProviders(
      <AddToCartButton product={expensiveProduct} />,
      emptyCartState
    );

    const button = screen.getByRole("button", { name: /add to cart/i });
    fireEvent.click(button);

    const state = store.getState();
    expect(state.cart.totalAmount).toBe(9999.99);
  });
});

/* 
1. Button renders correctly with proper class
2. Clicking button dispatches addToCart action
3. Multiple clicks increment product count
4. Total amount updates with single addition
5. Total amount updates with multiple additions
6. Different products are tracked separately
7. Adding to existing cart works correctly
8. Button text displays correctly
9. Handles edge case of zero price
10. Handles edge case of high price
*/
