import { ShoppingCart, Menu, X, Search } from 'lucide-react'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from './ui/button'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { toast } from 'sonner'
import { setUser } from '@/redux/userSlice'

const Navbar = () => {
  const { user } = useSelector(store => store.user)
  const { cart } = useSelector(store => store.product)
  const accessToken = localStorage.getItem('accessToken')

  const admin = user?.role === "admin"
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [mobileOpen, setMobileOpen] = useState(false)

  const logoutHandler = async () => {
    try {
      const res = await axios.post(`http://localhost:8000/api/v1/user/logout`, {}, {
        headers: { Authorization: `Bearer ${accessToken}` }
      })
      if (res.data.success) {
        dispatch(setUser(null))
        toast.success(res.data.message)
        setMobileOpen(false)
      }
    } catch (e) {
      console.log(e)
    }
  }

  const navLinks = [
    { label: 'Home', to: '/' },
    { label: 'Products', to: '/products' },
    ...(user ? [{ label: `Hello, ${user.firstName}`, to: `/profile/${user._id}` }] : []),
    ...(admin ? [{ label: 'Dashboard', to: '/dashboard/sales' }] : []),
  ]

  return (
    <>
      {/* Top announcement bar */}
      <div style={{ backgroundColor: '#16a34a', color: '#fff', textAlign: 'center', fontSize: '12px', padding: '6px 16px', fontWeight: 500, letterSpacing: '0.3px' }}>
        🌿 Free shipping on orders above ₹999 &nbsp;|&nbsp; Sustainable & Eco-Friendly Products
      </div>

      <header
        style={{
          width: '100%',
          zIndex: 50,
          backgroundColor: '#111827',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 40px', height: '64px' }}>

          {/* Logo */}
          <Link to='/' style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
            <span style={{ fontSize: '20px' }}>🌿</span>
            <span style={{ fontSize: '22px', fontWeight: 700, color: '#ffffff', letterSpacing: '-0.3px' }}>EcoMart</span>
          </Link>

          {/* Center Nav — Desktop */}
          <ul style={{ display: 'flex', gap: '32px', alignItems: 'center', listStyle: 'none', margin: 0, padding: 0 }}
            className="hidden md:flex">
            {navLinks.map(({ label, to }) => (
              <li key={to}>
                <Link
                  to={to}
                  style={{ fontSize: '14px', fontWeight: 500, color: '#d1d5db', textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#4ade80'}
                  onMouseLeave={e => e.currentTarget.style.color = '#d1d5db'}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Right Section */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>

            {/* Search — Desktop */}
            <div className="hidden md:flex" style={{
              display: 'flex', alignItems: 'center',
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '20px', padding: '6px 14px', gap: '6px',
            }}>
              <Search size={14} color="#9ca3af" />
              <input
                type="text"
                placeholder="Search products..."
                style={{
                  background: 'transparent', border: 'none', outline: 'none',
                  color: '#fff', fontSize: '13px', width: '160px',
                }}
              />
            </div>

            {/* Cart */}
            <Link to='/cart' style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <ShoppingCart size={20} color="#d1d5db" />
              <span style={{
                position: 'absolute', top: '-8px', right: '-8px',
                background: '#16a34a', borderRadius: '50%',
                color: '#fff', fontSize: '10px', fontWeight: 700,
                width: '18px', height: '18px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {cart?.items?.length || 0}
              </span>
            </Link>

            {/* Auth Button */}
            {user ? (
              <button
                onClick={logoutHandler}
                style={{
                  background: 'transparent',
                  border: '1px solid #16a34a',
                  color: '#4ade80',
                  borderRadius: '6px',
                  padding: '7px 18px',
                  fontSize: '13.5px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#16a34a'; e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#4ade80'; }}
              >
                Logout
              </button>
            ) : (
              <button
                onClick={() => navigate('/login')}
                style={{
                  background: '#16a34a',
                  border: '1px solid #16a34a',
                  color: '#fff',
                  borderRadius: '6px',
                  padding: '7px 18px',
                  fontSize: '13.5px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#15803d'}
                onMouseLeave={e => e.currentTarget.style.background = '#16a34a'}
              >
                Login
              </button>
            )}

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#d1d5db' }}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileOpen && (
          <div style={{
            background: '#1f2937',
            borderTop: '1px solid rgba(255,255,255,0.08)',
            padding: '16px 24px 24px',
          }}>
            {/* Mobile Search */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px', padding: '8px 14px', marginBottom: '16px',
            }}>
              <Search size={14} color="#9ca3af" />
              <input
                type="text"
                placeholder="Search products..."
                style={{ background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontSize: '13px', width: '100%' }}
              />
            </div>

            {/* Mobile Nav Links */}
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {navLinks.map(({ label, to }) => (
                <li key={to}>
                  <Link
                    to={to}
                    onClick={() => setMobileOpen(false)}
                    style={{
                      display: 'block', padding: '10px 8px',
                      fontSize: '14px', fontWeight: 500,
                      color: '#d1d5db', textDecoration: 'none',
                      borderRadius: '6px', transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(22,163,74,0.15)'; e.currentTarget.style.color = '#4ade80'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#d1d5db'; }}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Mobile Auth */}
            <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              {user ? (
                <button
                  onClick={logoutHandler}
                  style={{
                    width: '100%', padding: '10px', background: 'transparent',
                    border: '1px solid #16a34a', color: '#4ade80',
                    borderRadius: '6px', fontSize: '14px', fontWeight: 600, cursor: 'pointer',
                  }}
                >
                  Logout
                </button>
              ) : (
                <button
                  onClick={() => { navigate('/login'); setMobileOpen(false); }}
                  style={{
                    width: '100%', padding: '10px', background: '#16a34a',
                    border: 'none', color: '#fff',
                    borderRadius: '6px', fontSize: '14px', fontWeight: 600, cursor: 'pointer',
                  }}
                >
                  Login
                </button>
              )}
            </div>
          </div>
        )}
      </header>

    </>
  )
}

export default Navbar