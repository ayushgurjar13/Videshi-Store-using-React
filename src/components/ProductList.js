import React, { memo } from 'react';
import './ProductList.css';

const ProductCard = memo(({ product, addToCart, isInCart }) => {
  const handleAddToCart = () => {
    addToCart(product);
  };

  return (
    <div className="product-card">
      <div className="product-image">
        <img src={product.image} alt={product.name} />
        <span className={`stock-badge ${product.inStock ? 'in-stock' : 'out-of-stock'}`}>
          {product.inStock ? 'In Stock' : 'Out of Stock'}
        </span>
      </div>
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-category">{product.category}</p>
        <div className="product-footer">
          <span className="product-price">${product.price.toFixed(2)}</span>
          <button
            className="add-to-cart-btn"
            onClick={handleAddToCart}
            disabled={!product.inStock}
          >
            {isInCart ? 'Add More' : 'Add to Cart'}
          </button>
        </div>
        {product.stock < 10 && product.inStock && (
          <p className="low-stock">Only {product.stock} left!</p>
        )}
      </div>
    </div>
  );
});

ProductCard.displayName = 'ProductCard';

const ProductList = ({ products, addToCart, cart }) => {
  if (products.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">🔍</div>
        <h2>No products found</h2>
        <p>Try adjusting your filters or search term</p>
      </div>
    );
  }

  return (
    <div className="product-list">
      <div className="product-count">
        Showing {products.length} {products.length === 1 ? 'product' : 'products'}
      </div>
      <div className="product-grid">
        {products.map(product => {
          const isInCart = cart.some(item => item.id === product.id);
          return (
            <ProductCard
              key={product.id}
              product={product}
              addToCart={addToCart}
              isInCart={isInCart}
            />
          );
        })}
      </div>
    </div>
  );
};

export default memo(ProductList);
