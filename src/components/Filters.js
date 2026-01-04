import React, { useState, useEffect, memo } from 'react';
import './Filters.css';

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const Filters = ({
  searchTerm,
  setSearchTerm,
  categories,
  selectedCategory,
  setSelectedCategory,
  sortBy,
  setSortBy,
  clearFilters
}) => {
  const [inputValue, setInputValue] = useState(searchTerm);
  const debouncedSearch = useDebounce(inputValue, 300);

  useEffect(() => {
    setSearchTerm(debouncedSearch);
  }, [debouncedSearch, setSearchTerm]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleClearFilters = () => {
    setInputValue('');
    clearFilters();
  };

  const hasActiveFilters = searchTerm || selectedCategory !== 'all' || sortBy;

  return (
    <div className="filters">
      <div className="filters-header">
        <h2>Filters</h2>
        {hasActiveFilters && (
          <button className="clear-filters-btn" onClick={handleClearFilters}>
            Clear All
          </button>
        )}
      </div>

      <div className="filter-group">
        <label htmlFor="search">Search Products</label>
        <input
          id="search"
          type="text"
          placeholder="Search by name..."
          value={inputValue}
          onChange={handleInputChange}
          className="search-input"
        />
      </div>

      <div className="filter-group">
        <label htmlFor="category">Category</label>
        <select
          id="category"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="filter-select"
        >
          <option value="all">All Categories</option>
          {categories.map(category => (
            <option key={category} value={category}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="sort">Sort by Price</label>
        <select
          id="sort"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="filter-select"
        >
          <option value="">Default</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
        </select>
      </div>
    </div>
  );
};

export default memo(Filters);
