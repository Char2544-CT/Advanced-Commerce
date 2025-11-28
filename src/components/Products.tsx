import { useState } from "react";
import Dropdown from "./Dropdown.tsx";
import "../styles/Products.css";
import { useQuery } from "@tanstack/react-query";
import AddToCartButton from "./AddToCartButton.tsx";
import { getProducts } from "../data_firestore/ProductStore";

export interface Product {
  id?: string;
  title: string;
  price: number;
  category: string;
  description: string;
  rating: {
    rate: number;
    count?: number;
  };
  image: string;
  count: number;
}

const filterByCategory = (products: Product[], category: string) => {
  if (category === "All") {
    return products;
  }
  if (category === "Men's clothing") {
    return products.filter((product) => product.category === "men's clothing");
  }
  if (category === "Women's clothing") {
    return products.filter(
      (product) => product.category === "women's clothing"
    );
  }
  if (category === "Electronics") {
    return products.filter((product) => product.category === "electronics");
  }
  if (category === "Jewelery") {
    return products.filter((product) => product.category === "jewelery");
  }
  return products;
};

const descriptionSlice = (description: string) => {
  return description.slice(0, 100) + (description.length > 100 ? "..." : "");
};

const Products = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const {
    data: products = [],
    error,
    isLoading,
  } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: getProducts, // Use Firestore instead of axios
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading products</div>;

  const filteredProducts = filterByCategory(products, selectedCategory) || [];

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
  };

  return (
    <div>
      <Dropdown
        options={[
          "Men's clothing",
          "Jewelery",
          "Electronics",
          "Women's clothing",
          "All",
        ]}
        onSelect={handleCategorySelect}
      />
      <div className="products-grid">
        {filteredProducts.map((product) => (
          <div key={product.id} className="product">
            <img src={product.image} alt={product.title} />
            <h2>{product.title}</h2>
            <p>{descriptionSlice(product.description)}</p>
            <p>Price: ${product.price}</p>
            <p>Category: {product.category}</p>
            <p>
              Rating: {product.rating.rate} ({product.rating.count} reviews)
            </p>
            <AddToCartButton product={product} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;
