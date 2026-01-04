import React, { memo } from 'react';
import './Cart.css';

const CartItem = memo(({ item, removeFromCart, updateQuantity }) => {
  const handleQuantityChange = (e) => {
    const newQuantity = parseInt(e.target.value, 10);
    updateQuantity(item.id, newQuantity);
  };

  const handleIncrement = () => {
    if (item.quantity < item.stock) {
      updateQuantity(item.id, item.quantity + 1);
    }
  };

  const handleDecrement = () => {
    updateQuantity(item.id, item.quantity - 1);
  };

  return (
    <div className="cart-item">
      <img src={item.image} alt={item.name} className="cart-item-image" />
      <div className="cart-item-details">
        <h4 className="cart-item-name">{item.name}</h4>
        <p className="cart-item-price">${item.price.toFixed(2)}</p>
        <div className="quantity-controls">
          <button
            className="quantity-btn"
            onClick={handleDecrement}
            disabled={item.quantity <= 1}
          >
            -
          </button>
          <input
            type="number"
            min="1"
            max={item.stock}
            value={item.quantity}
            onChange={handleQuantityChange}
            className="quantity-input"
          />
          <button
            className="quantity-btn"
            onClick={handleIncrement}
            disabled={item.quantity >= item.stock}
          >
            +
          </button>
        </div>
        {item.quantity >= item.stock && (
          <p className="max-stock">Max stock reached</p>
        )}
      </div>
      <button
        className="remove-btn"
        onClick={() => removeFromCart(item.id)}
        title="Remove from cart"
      >
        ×
      </button>
    </div>
  );
});

CartItem.displayName = 'CartItem';

const Cart = ({ cart, removeFromCart, updateQuantity, totalItems, totalPrice }) => {
  if (cart.length === 0) {
    return (
      <div className="cart">
        <h2>Shopping Cart</h2>
        <div className="empty-cart">
          <div className="empty-cart-icon">🛒</div>
          <p>Your cart is empty</p>
        </div>
      </div>
    );
  }

  return (
    <div className="cart">
      <h2>Shopping Cart</h2>
      <div className="cart-items">
        {cart.map(item => (
          <CartItem
            key={item.id}
            item={item}
            removeFromCart={removeFromCart}
            updateQuantity={updateQuantity}
          />
        ))}
      </div>
      <div className="cart-summary">
        <div className="cart-summary-row">
          <span>Total Items:</span>
          <strong>{totalItems}</strong>
        </div>
        <div className="cart-summary-row total-price">
          <span>Total Price:</span>
          <strong>${totalPrice.toFixed(2)}</strong>
        </div>
      </div>
    </div>
  );
};

export default memo(Cart);
