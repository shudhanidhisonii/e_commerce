import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import FilterSidebar from "@/components/FilterSidebar";
import ProductCard from "@/components/ProductCard";
import { setProducts, setAllProducts } from "../redux/productSlice";
import { SlidersHorizontal, Package } from "lucide-react";

const Products = () => {
  const dispatch = useDispatch();
  const { products = [], allProducts = [] } = useSelector(
    (state) => state.product || {}
  );

  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [brand, setBrand] = useState("All");
  const [priceRange, setPriceRange] = useState([0, 999999]);
  const [sortOrder, setSortOrder] = useState("");

  const getAllProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:8000/api/v1/product/getallproducts");
      if (res.data.success) {
        dispatch(setAllProducts(res.data.products));
        dispatch(setProducts(res.data.products));
      } else {
        dispatch(setAllProducts([]));
        dispatch(setProducts([]));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
      dispatch(setAllProducts([]));
      dispatch(setProducts([]));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = [...allProducts];
    if (search.trim() !== "") {
      filtered = filtered.filter((p) =>
        p.productName?.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (category !== "All") filtered = filtered.filter((p) => p.category === category);
    if (brand !== "All") filtered = filtered.filter((p) => p.brand === brand);
    filtered = filtered.filter(
      (p) => p.productPrice >= priceRange[0] && p.productPrice <= priceRange[1]
    );
    if (sortOrder === "lowToHigh") filtered.sort((a, b) => a.productPrice - b.productPrice);
    else if (sortOrder === "highToLow") filtered.sort((a, b) => b.productPrice - a.productPrice);
    dispatch(setProducts(filtered));
  }, [search, category, brand, priceRange, sortOrder, allProducts, dispatch]);

  useEffect(() => { getAllProducts(); }, []);

  return (
    <div style={{
      minHeight: '100vh',
      background: '#ffffff',
      fontFamily: 'sans-serif',
      paddingBottom: '48px',
    }}>

      {/* Page Header */}
      <div style={{
        background: '#ffffff',
        borderBottom: '1px solid #e5e7eb',
        padding: '24px 40px',
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#111827', margin: '0 0 4px' }}>
                All Products
              </h1>
              <p style={{ fontSize: '13px', color: '#6b7280', margin: 0 }}>
                {loading ? 'Loading...' : `${products.length} product${products.length !== 1 ? 's' : ''} found`}
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {/* Filters button */}
              <button
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '8px 16px',
                  background: '#ffffff',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  color: '#374151',
                  fontSize: '13px',
                  fontWeight: 500,
                  cursor: 'pointer',
                }}
              >
                <SlidersHorizontal size={14} color="#16a34a" />
                Filters
              </button>

              {/* Sort dropdown */}
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                style={{
                  padding: '8px 36px 8px 14px',
                  background: '#ffffff',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  color: '#374151',
                  fontSize: '13px',
                  outline: 'none',
                  cursor: 'pointer',
                  appearance: 'none',
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 12px center',
                }}
              >
                <option value="">Sort By</option>
                <option value="lowToHigh">Price: Low to High</option>
                <option value="highToLow">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '28px 40px 0',
        display: 'flex',
        gap: '24px',
        alignItems: 'flex-start',
      }}>

        {/* Sidebar wrapper */}
        <div style={{
          flexShrink: 0,
          width: '240px',
          background: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          overflow: 'hidden',
        }}>
          {/* Sidebar header */}
          <div style={{
            padding: '14px 18px',
            borderBottom: '1px solid #e5e7eb',
            display: 'flex', alignItems: 'center', gap: '8px',
            background: '#f9fafb',
          }}>
            <SlidersHorizontal size={14} color="#16a34a" />
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#111827' }}>Filters</span>
          </div>
          <div>
            <FilterSidebar
              search={search}
              setSearch={setSearch}
              brand={brand}
              setBrand={setBrand}
              category={category}
              setCategory={setCategory}
              products={allProducts}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
            />
          </div>
        </div>

        {/* Products Grid */}
        <div style={{ flex: 1, minWidth: 0 }}>

          {/* Loading skeletons */}
          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '16px' }}>
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} style={{
                  background: '#f3f4f6',
                  borderRadius: '12px',
                  height: '260px',
                  animation: 'pulse 1.5s ease-in-out infinite',
                  border: '1px solid #e5e7eb',
                }} />
              ))}
            </div>
          ) : products.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '16px' }}>
              {products.map((product) => (
                <ProductCard key={product._id} product={product} loading={loading} />
              ))}
            </div>
          ) : (
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              justifyContent: 'center', padding: '80px 20px', gap: '14px',
            }}>
              <div style={{
                width: '56px', height: '56px', borderRadius: '50%',
                background: '#dcfce7',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Package size={24} color="#16a34a" />
              </div>
              <p style={{ fontSize: '15px', fontWeight: 500, color: '#374151', margin: 0 }}>
                No products found
              </p>
              <p style={{ fontSize: '13px', color: '#9ca3af', margin: 0 }}>
                Try adjusting your filters or search term
              </p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
};

export default Products;