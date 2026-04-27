import React from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

const FilterSidebar = ({ search, setSearch, category, setCategory, brand, setBrand, setPriceRange, products = [], priceRange }) => {

  const safeProducts = Array.isArray(products) ? products : [];

  const categories = safeProducts.map((p) => p.category);
  const uniqueCategories = ["All", ...new Set(categories)];

  const brands = safeProducts.map((p) => p.brand);
  const uniqueBrands = ["All", ...new Set(brands)];

  const handleCategoryClick = (val) => setCategory(val);
  const handleBrandChange = (e) => setBrand(e.target.value);

  const handleMinChange = (e) => {
    const value = Number(e.target.value);
    if (value <= priceRange[1]) setPriceRange([value, priceRange[1]]);
  };

  const handleMaxChange = (e) => {
    const value = Number(e.target.value);
    if (value >= priceRange[0]) setPriceRange([priceRange[0], value]);
  };

  const resetFilters = () => {
    setSearch("");
    setCategory("All");
    setBrand("All");
    setPriceRange([0, 999999]);
  };

  return (
    <div className="bg-white mt-10 p-4 rounded-xl border border-gray-200 h-max hidden md:block w-64 shadow-sm">

      {/* Search */}
      <Input
        type="text"
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="bg-white p-2 rounded-md border-gray-300 border w-full focus:outline-none focus:ring-2 focus:ring-green-500"
      />

      {/* Category */}
      <h1 className="mt-5 font-semibold text-base text-gray-800">Category</h1>
      <div className="flex flex-col gap-2 mt-3">
        {uniqueCategories.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <input
              type="radio"
              name="category"
              checked={category === item}
              onChange={() => handleCategoryClick(item)}
              style={{ accentColor: '#16a34a' }}
            />
            <label className="text-sm text-gray-700 cursor-pointer">{item}</label>
          </div>
        ))}
      </div>

      {/* Brand */}
      <h1 className="mt-5 font-semibold text-base text-gray-800">Brand</h1>
      <select
        className="bg-white w-full p-2 border border-gray-300 rounded-md mt-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
        value={brand}
        onChange={handleBrandChange}
      >
        {uniqueBrands.map((item, index) => (
          <option key={index} value={item}>{item.toUpperCase()}</option>
        ))}
      </select>

      {/* Price Range */}
      <h1 className="mt-5 font-semibold text-base text-gray-800 mb-3">Price Range</h1>
      <div className="flex flex-col gap-2">
        <label className="text-xs text-gray-500">
          ₹{priceRange?.[0]} — ₹{priceRange?.[1]}
        </label>

        <div className="flex gap-2 items-center">
          <input
            type="number"
            min="0"
            value={priceRange[0]}
            onChange={handleMinChange}
            className="w-20 p-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
          />
          <span className="text-gray-400">-</span>
          <input
            type="number"
            min="0"
            value={priceRange[1]}
            onChange={handleMaxChange}
            className="w-20 p-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
          />
        </div>

        <input
          type="range"
          min="0"
          max="5000"
          step="100"
          className="w-full"
          value={priceRange[0]}
          onChange={handleMinChange}
          style={{ accentColor: '#16a34a' }}
        />
        <input
          type="range"
          min="0"
          max="999999"
          step="100"
          className="w-full"
          value={priceRange[1]}
          onChange={handleMaxChange}
          style={{ accentColor: '#16a34a' }}
        />
      </div>

      {/* Reset */}
      <button
        onClick={resetFilters}
        style={{
          width: '100%',
          marginTop: '20px',
          padding: '10px',
          background: '#16a34a',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          fontSize: '13.5px',
          fontWeight: 600,
          cursor: 'pointer',
          transition: 'background 0.2s',
        }}
        onMouseEnter={e => e.currentTarget.style.background = '#15803d'}
        onMouseLeave={e => e.currentTarget.style.background = '#16a34a'}
      >
        Reset Filters
      </button>
    </div>
  );
};

export default FilterSidebar;
