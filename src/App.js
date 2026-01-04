import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import ProductList from './components/ProductList';
import CartPage from './components/CartPage';
import Filters from './components/Filters';
import './App.css';

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('');

  // Fetch products from API
  useEffect(() => {
    fetch('https://dummyjson.com/products?limit=20')
      .then(res => res.json())
      .then(data => {
        const formattedProducts = data.products.map(product => ({
          id: product.id,
          name: product.title,
          price: product.price,
          category: product.category,
          stock: product.stock,
          image: product.thumbnail,
          inStock: product.stock > 0
        }));
        setProducts(formattedProducts);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching products:', error);
        setLoading(false);
      });
  }, []);

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem('cart', JSON.stringify(cart));
    } else {
      localStorage.removeItem('cart');
    }
  }, [cart]);

  // Get unique categories
  const categories = useMemo(() => {
    const cats = [...new Set(products.map(p => p.category))];
    return cats;
  }, [products]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = products;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Sort
    if (sortBy === 'price-low') {
      filtered = [...filtered].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      filtered = [...filtered].sort((a, b) => b.price - a.price);
    }

    return filtered;
  }, [products, searchTerm, selectedCategory, sortBy]);

  // Add to cart
  const addToCart = useCallback((product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        // Check if we can increase quantity
        if (existingItem.quantity < product.stock) {
          return prevCart.map(item =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        }
        return prevCart;
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  }, []);

  // Remove from cart
  const removeFromCart = useCallback((productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  }, []);

  // Update cart quantity
  const updateQuantity = useCallback((productId, newQuantity) => {
    const product = products.find(p => p.id === productId);
    
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    if (product && newQuantity <= product.stock) {
      setCart(prevCart =>
        prevCart.map(item =>
          item.id === productId
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    }
  }, [products, removeFromCart]);

  // Clear all filters
  const clearFilters = useCallback(() => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSortBy('');
  }, []);

  // Calculate cart totals
  const cartTotals = useMemo(() => {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    return { totalItems, totalPrice };
  }, [cart]);

  if (loading) {
    return (
      <div className="app">
        <div className="loading">Loading products...</div>
      </div>
    );
  }

  return (
    <Router>
      <div className="app">
        <AppContent
          cartTotals={cartTotals}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          categories={categories}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          sortBy={sortBy}
          setSortBy={setSortBy}
          clearFilters={clearFilters}
          filteredProducts={filteredProducts}
          addToCart={addToCart}
          cart={cart}
          removeFromCart={removeFromCart}
          updateQuantity={updateQuantity}
        />
      </div>
    </Router>
  );
}

const AppContent = ({
  cartTotals,
  searchTerm,
  setSearchTerm,
  categories,
  selectedCategory,
  setSelectedCategory,
  sortBy,
  setSortBy,
  clearFilters,
  filteredProducts,
  addToCart,
  cart,
  removeFromCart,
  updateQuantity
}) => {
  const navigate = useNavigate();

  return (
    <>
      <header className="app-header">
        <h1 onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          Videshi Store
        </h1>
        <button 
          className="cart-badge"
          onClick={() => navigate('/cart')}
        >
          🛒 Cart ({cartTotals.totalItems})
        </button>
      </header>

      <Routes>
        <Route
          path="/"
          element={
            <div className="app-content">
              <aside className="sidebar">
                <Filters
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  categories={categories}
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                  sortBy={sortBy}
                  setSortBy={setSortBy}
                  clearFilters={clearFilters}
                />
              </aside>

              <main className="main-content">
                <ProductList
                  products={filteredProducts}
                  addToCart={addToCart}
                  cart={cart}
                />
              </main>
            </div>
          }
        />
        <Route
          path="/cart"
          element={
            <CartPage
              cart={cart}
              removeFromCart={removeFromCart}
              updateQuantity={updateQuantity}
            />
          }
        />
      </Routes>
    </>
  );
};

export default App;
