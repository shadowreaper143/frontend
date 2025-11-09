// src/pages/ProductList.jsx
import React, { useState, useCallback, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import ProductForm from "../components/ProductForm";
import {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../api/ProductApi";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // ✅ fixed casing
  const [error, setError] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);

  // Fetch all products
  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getAllProducts();
      setProducts(data);
    } catch (err) {
      setError("Failed to load products. Check console for details.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Create
  const handleCreate = async (productData) => {
    try {
      await createProduct(productData);
      await fetchProducts();
      alert("Product created successfully!");
    } catch (err) {
      setError(err.message || "Error creating product.");
    }
  };

  // Update
  const handleUpdate = async (productData) => {
    try {
      await updateProduct(editingProduct.id, productData);
      setEditingProduct(null);
      await fetchProducts();
      alert("Product updated successfully!");
    } catch (err) {
      setError(err.message || "Error updating product.");
    }
  };

  // Delete
  const handleDelete = async (id) => {
    if (!window.confirm(`Are you sure you want to delete product ${id}?`)) {
      return; // ✅ only cancel if user says no
    }
    try {
      await deleteProduct(id);
      await fetchProducts();
      alert("Product deleted successfully!");
    } catch (err) {
      setError(err.message || "Error deleting product.");
    }
  };

  if (isLoading) return <div className="loading">Loading products...</div>;
  if (error) return <div className="error-message">Error: {error}</div>;

  return (
    <div className="product-page">
      <h1>C O S M E T I C S</h1>

      <section className="form-section">
        <ProductForm
          onSubmit={editingProduct ? handleUpdate : handleCreate}
          initialData={editingProduct || {}}
          isUpdate={!!editingProduct}
        />
        {editingProduct && (
          <button
            className="btn-cancel"
            onClick={() => setEditingProduct(null)}
          >
            Cancel Edit
          </button>
        )}
      </section>

      <section className="list-section">
        <h2>Available Products</h2>
        {products.length === 0 ? (
          <p>No products available.</p>
        ) : (
          <div className="product-grid">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onDelete={handleDelete}
                onEdit={setEditingProduct}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default ProductList;
