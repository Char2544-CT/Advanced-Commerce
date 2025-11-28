import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from "./ProductStore";
import { Product } from "../components/Products";

export const ProductManagement = () => {
  const queryClient = useQueryClient();
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<Omit<Product, "id">>({
    title: "",
    price: 0,
    category: "",
    description: "",
    rating: { rate: 0, count: 0 },
    image: "",
    count: 0,
  });

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  const addMutation = useMutation({
    mutationFn: addProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      resetForm();
      alert("Product added successfully!");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Product> }) =>
      updateProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setEditingProduct(null);
      resetForm();
      alert("Product updated successfully!");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      alert("Product deleted successfully!");
    },
  });

  const resetForm = () => {
    setFormData({
      title: "",
      price: 0,
      category: "",
      description: "",
      rating: { rate: 0, count: 0 },
      image: "",
      count: 0,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct && editingProduct.id) {
      updateMutation.mutate({ id: editingProduct.id, data: formData });
    } else {
      addMutation.mutate(formData);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      title: product.title,
      price: product.price,
      category: product.category,
      description: product.description,
      rating: product.rating,
      image: product.image,
      count: product.count,
    });
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Product Management</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: "30px" }}>
        <h2>{editingProduct ? "Edit Product" : "Add New Product"}</h2>
        <input
          type="text"
          placeholder="Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Price"
          value={formData.price}
          onChange={(e) =>
            setFormData({ ...formData, price: parseFloat(e.target.value) })
          }
          required
        />
        <input
          type="text"
          placeholder="Category"
          value={formData.category}
          onChange={(e) =>
            setFormData({ ...formData, category: e.target.value })
          }
          required
        />
        <textarea
          placeholder="Description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          required
        />
        <input
          type="text"
          placeholder="Image URL"
          value={formData.image}
          onChange={(e) => setFormData({ ...formData, image: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Rating"
          value={formData.rating.rate}
          onChange={(e) =>
            setFormData({
              ...formData,
              rating: { ...formData.rating, rate: parseFloat(e.target.value) },
            })
          }
        />
        <button type="submit">
          {editingProduct ? "Update Product" : "Add Product"}
        </button>
        {editingProduct && (
          <button
            type="button"
            onClick={() => {
              setEditingProduct(null);
              resetForm();
            }}
          >
            Cancel
          </button>
        )}
      </form>

      <h2>All Products</h2>
      <div>
        {products.map((product) => (
          <div
            key={product.id}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              marginBottom: "10px",
            }}
          >
            <h3>{product.title}</h3>
            <p>Price: ${product.price}</p>
            <p>Category: {product.category}</p>
            <button onClick={() => handleEdit(product)}>Edit</button>
            <button
              onClick={() => product.id && deleteMutation.mutate(product.id)}
              style={{ marginLeft: "10px", backgroundColor: "red" }}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
