import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { ShoppingCart, Trash2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { setCart } from "@/redux/productSlice";
import { toast } from "sonner";

const Cart = () => {
  const dispatch = useDispatch();
  const { cart } = useSelector((store) => store.product);
  const navigate = useNavigate();

  const subtotal = cart?.items?.length > 0 ? cart.totalPrice : 0;
  const shipping = subtotal > 299 ? 0 : 10;
  const tax = subtotal * 0.05;
  const total = subtotal + shipping + tax;

  const API = "http://localhost:8000/api/v1/cart";
  const accessToken = localStorage.getItem("accessToken");

  const handleUpdateQuantity = async (productId, type) => {
    try {
      const res = await axios.put(`${API}/update`, { productId, type }, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      if (res.data.success) dispatch(setCart(res.data.cart));
    } catch (e) { console.log(e); }
  };

  const handleRemove = async (productId) => {
    try {
      const res = await axios.delete(`${API}/remove`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        data: { productId }
      });
      if (res.data.success) {
        dispatch(setCart(res.data.cart));
        toast.success('Product removed from cart');
      }
    } catch (e) { console.log(e); }
  };

  const loadCart = async () => {
    try {
      const res = await axios.get(API, { headers: { Authorization: `Bearer ${accessToken}` } });
      if (res.data.success) dispatch(setCart(res.data.cart));
    } catch (e) { console.log(e); }
  };

  useEffect(() => { loadCart(); }, [dispatch]);

  const btnStyle = (variant = 'primary') => ({
    padding: variant === 'outline' ? '6px 14px' : '10px 0',
    width: variant === 'outline' ? 'auto' : '100%',
    background: variant === 'outline' ? '#fff' : '#16a34a',
    color: variant === 'outline' ? '#374151' : '#fff',
    border: variant === 'outline' ? '1px solid #d1d5db' : 'none',
    borderRadius: '8px',
    fontSize: '13.5px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s',
  });

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', fontFamily: 'sans-serif', paddingTop: '32px', paddingBottom: '48px' }}>
      {cart?.items?.length > 0 ? (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 32px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#111827', marginBottom: '28px' }}>
            Shopping Cart
          </h1>

          <div style={{ display: 'flex', gap: '28px', alignItems: 'flex-start', flexWrap: 'wrap' }}>

            {/* Cart Items */}
            <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {cart.items.map((product, index) => (
                <div key={index} style={{
                  background: '#fff', border: '1px solid #e5e7eb',
                  borderRadius: '12px', padding: '16px',
                  display: 'flex', justifyContent: 'space-between',
                  alignItems: 'center', gap: '16px', flexWrap: 'wrap',
                }}>
                  {/* Product Info */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
                    <img
                      src={product?.productId?.productImg?.[0]?.url}
                      alt=""
                      style={{ width: '72px', height: '72px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #e5e7eb' }}
                    />
                    <div>
                      <h2 style={{ fontSize: '14px', fontWeight: 600, color: '#111827', marginBottom: '4px' }}>
                        {product?.productId?.productName}
                      </h2>
                      <p style={{ fontSize: '13px', color: '#6b7280' }}>₹{product?.productId?.productPrice}</p>
                    </div>
                  </div>

                  {/* Quantity */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <button
                      onClick={() => handleUpdateQuantity(product.productId._id, 'decrease')}
                      style={{ width: '32px', height: '32px', border: '1px solid #d1d5db', borderRadius: '6px', background: '#fff', cursor: 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >−</button>
                    <span style={{ fontSize: '14px', fontWeight: 600, minWidth: '20px', textAlign: 'center' }}>{product.quantity}</span>
                    <button
                      onClick={() => handleUpdateQuantity(product.productId._id, 'increase')}
                      style={{ width: '32px', height: '32px', border: '1px solid #d1d5db', borderRadius: '6px', background: '#fff', cursor: 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >+</button>
                  </div>

                  {/* Total */}
                  <p style={{ fontSize: '14px', fontWeight: 700, color: '#111827', minWidth: '80px', textAlign: 'right' }}>
                    ₹{(product.productId.productPrice * product.quantity).toLocaleString('en-IN')}
                  </p>

                  {/* Remove */}
                  <button
                    onClick={() => handleRemove(product?.productId?._id)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', padding: '4px' }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div style={{
              width: '340px', flexShrink: 0,
              background: '#fff', border: '1px solid #e5e7eb',
              borderRadius: '12px', padding: '24px',
            }}>
              <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#111827', marginBottom: '20px' }}>Order Summary</h2>

              {[
                { label: `Subtotal (${cart.items.length} items)`, value: `₹${subtotal}` },
                { label: 'Shipping', value: `₹${shipping}` },
                { label: 'Tax (5%)', value: `₹${tax.toFixed(2)}` },
              ].map(({ label, value }) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ fontSize: '13.5px', color: '#6b7280' }}>{label}</span>
                  <span style={{ fontSize: '13.5px', color: '#374151' }}>{value}</span>
                </div>
              ))}

              <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '14px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '15px', fontWeight: 700, color: '#111827' }}>Total</span>
                <span style={{ fontSize: '15px', fontWeight: 700, color: '#111827' }}>₹{total.toFixed(2)}</span>
              </div>

              <button
                onClick={() => navigate('/address')}
                style={{ ...btnStyle('primary'), display: 'block', textAlign: 'center', marginBottom: '10px' }}
                onMouseEnter={e => e.currentTarget.style.background = '#15803d'}
                onMouseLeave={e => e.currentTarget.style.background = '#16a34a'}
              >
                PLACE ORDER
              </button>

              <Link to="/products" style={{ display: 'block', textAlign: 'center', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '13.5px', fontWeight: 600, color: '#374151', textDecoration: 'none', transition: 'background 0.2s' }}>
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ paddingTop: '120px', textAlign: 'center' }}>
          <div style={{ background: '#dcfce7', padding: '28px', borderRadius: '50%', display: 'inline-block', marginBottom: '24px' }}>
            <ShoppingCart size={56} color="#16a34a" />
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#111827', marginBottom: '8px' }}>Your Cart is Empty</h2>
          <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '24px' }}>Looks like you haven't added anything yet</p>
          <button
            onClick={() => navigate('/products')}
            style={{ padding: '12px 32px', background: '#16a34a', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}
            onMouseEnter={e => e.currentTarget.style.background = '#15803d'}
            onMouseLeave={e => e.currentTarget.style.background = '#16a34a'}
          >
            Start Shopping
          </button>
        </div>
      )}
    </div>
  );
};

export default Cart;
