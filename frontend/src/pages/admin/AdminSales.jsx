import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import axios from 'axios'
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts"
import React, { useEffect, useState } from 'react'

const AdminSales = () => {
  const [stats, setStats] = useState({
    totalUsers: 0, totalProducts: 0, totalOrders: 0, totalSales: 0, salesByDate: []
  });

  const fetchSales = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const res = await axios.get(`${import.meta.env.VITE_URL}/api/v1/orders/sales`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      if (res.data.success) setStats(res.data);
    } catch (e) { console.log(e); }
  };

  useEffect(() => { fetchSales(); }, []);

  const statCards = [
    { label: 'Total Users', value: stats.totalUsers, icon: '👤' },
    { label: 'Total Products', value: stats.totalProducts, icon: '📦' },
    { label: 'Total Orders', value: stats.totalOrders, icon: '🛒' },
    { label: 'Total Sales', value: `₹${stats.totalSales?.toLocaleString('en-IN')}`, icon: '💰' },
  ];

  return (
    <div style={{ paddingLeft: '300px', minHeight: '100vh', background: '#f9fafb', paddingTop: '32px', paddingRight: '32px', paddingBottom: '48px', fontFamily: 'sans-serif' }}>

      <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#111827', marginBottom: '24px' }}>Dashboard Overview</h1>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        {statCards.map(({ label, value, icon }) => (
          <div key={label} style={{
            background: '#fff', border: '1px solid #e5e7eb',
            borderRadius: '12px', padding: '20px',
            borderLeft: '4px solid #16a34a',
          }}>
            <div style={{ fontSize: '22px', marginBottom: '8px' }}>{icon}</div>
            <p style={{ fontSize: '12px', color: '#6b7280', fontWeight: 500, marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</p>
            <p style={{ fontSize: '24px', fontWeight: 700, color: '#111827' }}>{value}</p>
          </div>
        ))}
      </div>

      {/* Sales Chart */}
      <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '24px' }}>
        <h2 style={{ fontSize: '15px', fontWeight: 600, color: '#111827', marginBottom: '20px' }}>Sales — Last 30 Days</h2>
        <div style={{ height: '300px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={stats.salesByDate}>
              <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#9ca3af' }} />
              <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} />
              <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '13px' }} />
              <Area type="monotone" dataKey="amount" stroke="#16a34a" fill="#dcfce7" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminSales;
