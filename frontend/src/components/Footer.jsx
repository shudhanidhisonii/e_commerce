import React, { useState } from 'react';
import { Facebook, Twitter, Instagram } from 'lucide-react';

const Footer = () => {
  const [email, setEmail] = useState('');

  return (
    <footer style={{ fontFamily: 'sans-serif' }}>

      {/* Newsletter Banner */}
      <div style={{
        backgroundColor: '#ffffff',
        borderTop: '1px solid #e5e7eb',
        borderBottom: '1px solid #e5e7eb',
        padding: '40px 64px',
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '32px',
          flexWrap: 'wrap',
        }}>
          <div>
            <h3 style={{ fontSize: '22px', fontWeight: 700, color: '#111827', marginBottom: '6px' }}>
              Join Our Community
            </h3>
            <p style={{ fontSize: '13.5px', color: '#6b7280', lineHeight: '1.7', maxWidth: '340px' }}>
              Get the latest deals and offers delivered to your inbox. Stay updated with EcoMart.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <div style={{
              display: 'flex',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              overflow: 'hidden',
            }}>
              <input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={{
                  padding: '11px 18px',
                  border: 'none',
                  outline: 'none',
                  fontSize: '13.5px',
                  color: '#374151',
                  background: '#fff',
                  width: '220px',
                }}
              />
              <button style={{
                padding: '11px 24px',
                background: '#16a34a',
                color: '#fff',
                border: 'none',
                fontSize: '13.5px',
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}>
                Join now
              </button>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              {[
                { Icon: Facebook, bg: '#16a34a' },
                { Icon: Twitter, bg: '#111827' },
                { Icon: Facebook, bg: '#111827' },
                { Icon: Instagram, bg: '#111827' },
              ].map(({ Icon, bg }, i) => (
                <a key={i} href="#" style={{
                  width: '36px', height: '36px', borderRadius: '50%',
                  background: bg, display: 'flex', alignItems: 'center',
                  justifyContent: 'center', textDecoration: 'none',
                }}>
                  <Icon size={16} color="#fff" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Dark Section */}
      <div style={{ backgroundColor: '#111827', color: '#d1d5db' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '56px 64px 40px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr 1fr 1fr 1fr', gap: '40px' }}>

            {/* Brand */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <span style={{ fontSize: '22px' }}>🌿</span>
                <span style={{ fontSize: '22px', fontWeight: 700, color: '#ffffff' }}>EcoMart</span>
              </div>
              <p style={{ fontSize: '13.5px', lineHeight: '1.8', color: '#9ca3af', marginBottom: '12px' }}>
                EcoMart eCommerce platform brings the top quality sustainable products to you with the best offers.
              </p>
              <p style={{ fontSize: '13.5px', lineHeight: '1.8', color: '#9ca3af', marginBottom: '20px' }}>
                We take a step towards sustainability.
              </p>
              <p style={{ fontSize: '14px', color: '#16a34a', marginBottom: '4px', fontWeight: 500 }}>
                +1 (555) 123-4567
              </p>
              <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px' }}>or</p>
              <p style={{ fontSize: '13.5px', color: '#d1d5db' }}>support@ecomart.com</p>
            </div>

            {/* My Account */}
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#ffffff', marginBottom: '20px' }}>My Account</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {['My Account', 'Order History', 'Shopping Cart', 'Wishlist'].map(link => (
                  <li key={link}>
                    <a href="#" style={{ fontSize: '13.5px', color: '#9ca3af', textDecoration: 'none', transition: 'color 0.2s' }}
                      onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                      onMouseLeave={e => e.currentTarget.style.color = '#9ca3af'}>
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Helps */}
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#ffffff', marginBottom: '20px' }}>Helps</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {['Contact', 'FAQs', 'Terms & Conditions', 'Privacy Policy'].map(link => (
                  <li key={link}>
                    <a href="#" style={{ fontSize: '13.5px', color: '#9ca3af', textDecoration: 'none', transition: 'color 0.2s' }}
                      onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                      onMouseLeave={e => e.currentTarget.style.color = '#9ca3af'}>
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quick Links */}
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#ffffff', marginBottom: '20px' }}>Quick Links</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {['About Us', 'Shop', 'Products', 'Track Order'].map(link => (
                  <li key={link}>
                    <a href="#" style={{ fontSize: '13.5px', color: '#9ca3af', textDecoration: 'none', transition: 'color 0.2s' }}
                      onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                      onMouseLeave={e => e.currentTarget.style.color = '#9ca3af'}>
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Categories */}
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#ffffff', marginBottom: '20px' }}>Categories</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {['Handicrafts', 'Candles & Decor', 'Fashion & Apparel', 'Organic & Natural'].map(link => (
                  <li key={link}>
                    <a href="#" style={{ fontSize: '13.5px', color: '#9ca3af', textDecoration: 'none', transition: 'color 0.2s' }}
                      onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                      onMouseLeave={e => e.currentTarget.style.color = '#9ca3af'}>
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{ borderTop: '1px solid #1f2937', padding: '18px 64px' }}>
          <div style={{
            maxWidth: '1200px', margin: '0 auto',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            flexWrap: 'wrap', gap: '12px',
          }}>
            <p style={{ fontSize: '13px', color: '#6b7280', margin: 0 }}>
              EcoMart eCommerce © 2024, All Rights Reserved
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {[
                { label: 'Apple Pay', color: '#111' },
                { label: 'VISA', color: '#1a1f71' },
                { label: 'Discover', color: '#e65c00' },
                { label: 'Mastercard', color: '#eb001b' },
                { label: 'Secure Payment', color: '#16a34a' },
              ].map(({ label, color }) => (
                <div key={label} style={{
                  padding: '5px 12px',
                  background: '#fff',
                  borderRadius: '5px',
                  fontSize: '11px',
                  fontWeight: 700,
                  color,
                  border: '1px solid #e5e7eb',
                  whiteSpace: 'nowrap',
                }}>
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

    </footer>
  );
};

export default Footer;