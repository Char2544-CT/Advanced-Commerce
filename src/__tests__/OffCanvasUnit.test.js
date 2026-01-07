import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { BrowserRouter } from "react-router-dom";
import ViewCartOffCanvas from "../components/OffCanvas";
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
    ...render(
      <Provider store={store}>
        <BrowserRouter>{component}</BrowserRouter>
      </Provider>
    ),
    store,
  };
};

describe("ViewCartOffCanvas Component", () => {
  // Test 1: Initial rendering with closed offcanvas
  test('renders "View Cart" button when offcanvas is closed', () => {
    const emptyCartState = {
      cart: {
        items: [],
        totalAmount: 0,
        totalQuantity: 0,
      },
    };

    renderWithProviders(<ViewCartOffCanvas />, emptyCartState);

    const viewCartButton = screen.getByRole("button", { name: /view cart/i });
    expect(viewCartButton).toBeInTheDocument();
    expect(viewCartButton).toHaveClass("view-cart-btn");
  });

  // Test 2: Opening the offcanvas
  test('opens offcanvas when "View Cart" button is clicked', () => {
    const emptyCartState = {
      cart: {
        items: [],
        totalAmount: 0,
        totalQuantity: 0,
      },
    };

    renderWithProviders(<ViewCartOffCanvas />, emptyCartState);

    const viewCartButton = screen.getByRole("button", { name: /view cart/i });
    fireEvent.click(viewCartButton);

    expect(
      screen.getByRole("heading", { name: /your cart/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /close/i })).toBeInTheDocument();
  });

  // Test 3: Closing the offcanvas
  test('closes offcanvas when "Close" button is clicked', () => {
    const emptyCartState = {
      cart: {
        items: [],
        totalAmount: 0,
        totalQuantity: 0,
      },
    };

    renderWithProviders(<ViewCartOffCanvas />, emptyCartState);

    // Open offcanvas
    const viewCartButton = screen.getByRole("button", { name: /view cart/i });
    fireEvent.click(viewCartButton);

    // Close offcanvas
    const closeButton = screen.getByRole("button", { name: /close/i });
    fireEvent.click(closeButton);

    // Check that "View Cart" button is visible again
    expect(
      screen.getByRole("button", { name: /view cart/i })
    ).toBeInTheDocument();
  });

  // Test 4: Display empty cart message
  test('displays "Your cart is empty" message when cart has no items', () => {
    const emptyCartState = {
      cart: {
        items: [],
        totalAmount: 0,
        totalQuantity: 0,
      },
    };

    renderWithProviders(<ViewCartOffCanvas />, emptyCartState);

    fireEvent.click(screen.getByRole("button", { name: /view cart/i }));

    expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument();
  });

  // Test 5: Display cart items
  test("displays cart items when cart is not empty", () => {
    const cartWithItems = {
      cart: {
        items: [
          {
            title: "Test Product 1",
            price: 29.99,
            image: "https://example.com/image1.jpg",
            count: 2,
          },
          {
            title: "Test Product 2",
            price: 49.99,
            image: "https://example.com/image2.jpg",
            count: 1,
          },
        ],
        totalAmount: 109.97,
        totalQuantity: 3,
      },
    };

    renderWithProviders(<ViewCartOffCanvas />, cartWithItems);

    fireEvent.click(screen.getByRole("button", { name: /view cart/i }));

    expect(screen.getByText(/test product 1/i)).toBeInTheDocument();
    expect(screen.getByText(/test product 2/i)).toBeInTheDocument();
    expect(screen.getByText(/price: \$29.99/i)).toBeInTheDocument();
    expect(screen.getByText(/price: \$49.99/i)).toBeInTheDocument();
    expect(screen.getByText(/quantity: 2/i)).toBeInTheDocument();
    expect(screen.getByText(/quantity: 1/i)).toBeInTheDocument();
  });

  // Test 6: Display total amount
  test("displays correct total amount", () => {
    const cartWithItems = {
      cart: {
        items: [
          {
            title: "Test Product",
            price: 25.5,
            image: "https://example.com/image.jpg",
            count: 3,
          },
        ],
        totalAmount: 76.5,
        totalQuantity: 3,
      },
    };

    renderWithProviders(<ViewCartOffCanvas />, cartWithItems);

    fireEvent.click(screen.getByRole("button", { name: /view cart/i }));

    expect(screen.getByText(/total amount: \$76.50/i)).toBeInTheDocument();
  });

  // Test 7: Remove item from cart
  test('removes item from cart when "Remove" button is clicked', async () => {
    const cartWithItems = {
      cart: {
        items: [
          {
            title: "Test Product",
            price: 29.99,
            image: "https://example.com/image.jpg",
            count: 1,
          },
        ],
        totalAmount: 29.99,
        totalQuantity: 1,
      },
    };

    const { store } = renderWithProviders(<ViewCartOffCanvas />, cartWithItems);

    fireEvent.click(screen.getByRole("button", { name: /view cart/i }));

    const removeButton = screen.getByRole("button", { name: /remove/i });
    fireEvent.click(removeButton);

    await waitFor(() => {
      const state = store.getState();
      expect(state.cart.items.length).toBe(0);
    });
  });

  // Test 8: Navigate to checkout
  test('navigates to checkout when "Go to Checkout" button is clicked', () => {
    const cartWithItems = {
      cart: {
        items: [
          {
            title: "Test Product",
            price: 29.99,
            image: "https://example.com/image.jpg",
            count: 1,
          },
        ],
        totalAmount: 29.99,
        totalQuantity: 1,
      },
    };

    renderWithProviders(<ViewCartOffCanvas />, cartWithItems);

    fireEvent.click(screen.getByRole("button", { name: /view cart/i }));

    const checkoutButton = screen.getByRole("button", {
      name: /go to checkout/i,
    });
    fireEvent.click(checkoutButton);

    // After clicking, the offcanvas should close
    expect(
      screen.getByRole("button", { name: /view cart/i })
    ).toBeInTheDocument();
  });

  // Test 9: Hide checkout button when cart is empty
  test('hides "Go to Checkout" button when cart is empty', () => {
    const emptyCartState = {
      cart: {
        items: [],
        totalAmount: 0,
        totalQuantity: 0,
      },
    };

    renderWithProviders(<ViewCartOffCanvas />, emptyCartState);

    fireEvent.click(screen.getByRole("button", { name: /view cart/i }));

    const checkoutButton = screen.getByText(/Go to Checkout/i);
    expect(checkoutButton).toHaveStyle({ visibility: "hidden" });
  });

  // Test 10: Truncate long product titles
  test("truncates product titles longer than 53 characters", () => {
    const longTitle =
      "This is a very long product title that should be truncated to fit";
    const cartWithItems = {
      cart: {
        items: [
          {
            title: longTitle,
            price: 29.99,
            image: "https://example.com/image.jpg",
            count: 1,
          },
        ],
        totalAmount: 29.99,
        totalQuantity: 1,
      },
    };

    renderWithProviders(<ViewCartOffCanvas />, cartWithItems);

    fireEvent.click(screen.getByRole("button", { name: /view cart/i }));

    const displayedTitle = screen.getByText(
      /this is a very long product title/i
    );
    expect(displayedTitle.textContent).toContain("...");
    expect(displayedTitle.textContent.length).toBeLessThanOrEqual(56);
  });

  // Test 11: Display product images
  test("displays product images with correct attributes", () => {
    const cartWithItems = {
      cart: {
        items: [
          {
            title: "Test Product",
            price: 29.99,
            image: "https://example.com/test-image.jpg",
            count: 1,
          },
        ],
        totalAmount: 29.99,
        totalQuantity: 1,
      },
    };

    renderWithProviders(<ViewCartOffCanvas />, cartWithItems);

    fireEvent.click(screen.getByRole("button", { name: /view cart/i }));

    const image = screen.getByAltText("Test Product");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", "https://example.com/test-image.jpg");
    expect(image).toHaveStyle({ width: "60px" });
  });
});

/* 
Initial rendering - Tests that the "View Cart" button renders correctly
Opening offcanvas - Tests state change when opening
Closing offcanvas - Tests state change when closing
Empty cart display - Tests the empty cart message
Cart items display - Tests that items are rendered correctly
Total amount calculation - Tests the total amount display
Remove item functionality - Tests Redux dispatch for removing items
Navigation to checkout - Tests the navigation behavior
Conditional rendering - Tests visibility of checkout button
Title truncation - Tests the titleSlice function
Image rendering - Tests product images are displayed correctly */
