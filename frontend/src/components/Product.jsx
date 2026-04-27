import React from "react";

const products = [
  {
    id: 1,
    name: "Decorated Clay Pot-Modern",
    price: "₹1,399",
    discount: "10% OFF",
    image: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600&fit=crop&auto=format&q=80",
  },
  {
    id: 2,
    name: "Woolen Dream Catcher Gift",
    price: "₹1,299",
    discount: "10% OFF",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&fit=crop&auto=format&q=80",
  },
  {
    id: 3,
    name: "Scented Candle Gift Set",
    price: "₹799",
    discount: "20% OFF",
    image: "candlegift.webp",
  },
  {
    id: 4,
    name: "Rajasthani Textile Bundle",
    price: "₹1,599",
    discount: "20% OFF",
    image: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=600&fit=crop&auto=format&q=80",
  },
  {
    id: 5,
    name: "Buddha Garden Decor",
    price: "₹899",
    discount: "15% OFF",
    image: "Buddha.jpg",
  },
  {
    id: 6,
    name: "Handwoven Carpet Set",
    price: "₹2,199",
    discount: "10% OFF",
    image: "https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=600&fit=crop&auto=format&q=80",
  },
];

const CartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.4 7h12.8M7 13L5.4 5M10 21a1 1 0 100-2 1 1 0 000 2zm7 0a1 1 0 100-2 1 1 0 000 2z" />
  </svg>
);

const ProductCard = ({ product }) => (
  <div className="rounded-2xl overflow-hidden shadow-sm border border-gray-100 bg-white">
    <div className="relative">
      <img src={product.image} alt={product.name} className="w-full h-52 object-cover" />
      <span className="absolute top-3 left-3 bg-yellow-400 text-yellow-900 text-xs font-semibold px-3 py-1 rounded-full">
        {product.discount}
      </span>
    </div>
    <div className="bg-green-500 px-4 py-3 flex items-center justify-between">
      <div>
        <p className="text-white font-semibold text-sm">{product.name}</p>
        <p className="text-white font-bold text-base">{product.price}</p>
      </div>
      <button className="bg-white text-green-600 rounded-full p-2">
        <CartIcon />
      </button>
    </div>
  </div>
);

const ProductSection = () => {
  return (
    <section className="px-6 py-10 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <h2 className="text-3xl font-bold text-gray-900">
          Explore products <br /> with us!
        </h2>
        <button className="flex items-center gap-2 bg-green-500 text-white font-semibold px-5 py-3 rounded-full text-sm">
          View All Products
        </button>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

    </section>
  );
};

export default ProductSection;