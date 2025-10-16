//Display Products

import React, { useState } from "react";
import Dropdown from "./Dropdown.tsx";
import axios from "axios";
import "./Products.css";

interface Product {
  id?: number;
  title: string;
  price: number;
  category: string;
  description: string;
  rating: {
    rate: number;
    count?: number;
  };
  image: string;
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
};

const descriptionSlice = (description: string) => {
  return description.slice(0, 100) + (description.length > 100 ? "..." : "");
};

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  React.useEffect(() => {
    const fetchProducts = async () => {
      const response = await axios.get("https://fakestoreapi.com/products");
      setProducts(response.data);
    };
    fetchProducts();
  }, []);

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
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;
