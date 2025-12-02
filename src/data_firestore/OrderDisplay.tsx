//Display Previous Orders
import React, { useEffect, useState } from "react";
import { getOrdersByUserId, Order } from "./OrderStore";
import { auth } from "../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

export const OrderDisplay: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const fetchedOrders = await getOrdersByUserId(user.uid);
          setOrders(fetchedOrders);
        } catch (err) {
          console.error("Error fetching orders:", err);
          setError("Failed to fetch orders.");
        }
      } else {
        setError("You must be logged in to view orders.");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const toggleOrderDetails = (orderId: string) => {
    setExpandedOrderId(expandedOrderId == orderId ? null : orderId);
  };

  if (loading) {
    return <div>Loading orders...</div>;
  }
  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h2>Previous Orders</h2>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <ul>
          {orders.map((order) => (
            <li
              key={order.id}
              style={{
                marginBottom: "20px",
                border: "1px solid #ccc",
                padding: "10px",
              }}
            >
              <p>
                <strong>Order ID:</strong> {order.id}
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {order.createdAt instanceof Date
                  ? order.createdAt.toLocaleDateString()
                  : "N/A"}
              </p>
              <button
                onClick={() => order.id && toggleOrderDetails(order.id)}
                style={{
                  backgroundColor: "#007bff",
                  color: "white",
                  padding: "8px 12px",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  marginTop: "10px",
                }}
              >
                {expandedOrderId === order.id ? "Hide Details" : "Show Details"}
              </button>

              {expandedOrderId === order.id && (
                <div style={{ marginTop: "15px", paddingLeft: "10px" }}>
                  <p>
                    <strong>Total Amount:</strong> $
                    {order.totalAmount.toFixed(2)}
                  </p>
                  <p>
                    <strong>Total Items:</strong> {order.totalQuantity}
                  </p>
                  <p>
                    <strong>Items:</strong>
                  </p>
                  <ul>
                    {order.items.map((item, idx) => (
                      <li key={idx}>
                        {item.title} - ${item.price} x {item.count}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
