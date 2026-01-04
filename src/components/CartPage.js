import React from 'react';
import { useNavigate } from 'react-router-dom';
import Cart from './Cart';
import './CartPage.css';

const CartPage = ({ cart, removeFromCart, updateQuantity }) => {
  const navigate = useNavigate();
  
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="cart-page">
      <div className="cart-page-header">
        <button className="back-button" onClick={() => navigate('/')}>
          ← Back to Shop
        </button>
        <h1>Shopping Cart</h1>
      </div>
      
      <div className="cart-page-content">
        <Cart
          cart={cart}
          removeFromCart={removeFromCart}
          updateQuantity={updateQuantity}
          totalItems={totalItems}
          totalPrice={totalPrice}
        />
        
        {cart.length > 0 && (
          <div className="checkout-section">
            <button className="checkout-button">
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
