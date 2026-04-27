import axios from 'axios'
import { Edit, Eye, Search } from 'lucide-react'
import UserLogo from "../../assets/user.jpg"
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const getAllUsers = async () => {
    const accessToken = localStorage.getItem("accessToken");
    try {
      const res = await axios.get('http://localhost:8000/api/v1/user/all-user', {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      if (res.data.success) setUsers(res.data.users);
    } catch (e) { console.log(e); }
  };

  const filteredUsers = users.filter(user =>
    `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => { getAllUsers(); }, []);

  return (
    <div style={{ paddingLeft: '300px', minHeight: '100vh', background: '#f9fafb', padding: '32px 32px 48px 300px', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#111827', marginBottom: '4px' }}>User Management</h1>
      <p style={{ fontSize: '13.5px', color: '#6b7280', marginBottom: '20px' }}>View and manage registered users</p>

      {/* Search */}
      <div style={{ position: 'relative', width: '300px', marginBottom: '28px' }}>
        <Search size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          style={{
            width: '100%', padding: '9px 12px 9px 34px',
            border: '1px solid #d1d5db', borderRadius: '8px',
            fontSize: '13.5px', outline: 'none', background: '#fff',
            color: '#374151', boxSizing: 'border-box',
          }}
        />
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
        {filteredUsers.map((user, index) => (
          <div key={index} style={{
            background: '#fff', border: '1px solid #e5e7eb',
            borderRadius: '12px', padding: '20px',
            borderTop: '3px solid #16a34a',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <img
                src={user?.profilePic || UserLogo}
                alt=""
                style={{ width: '52px', height: '52px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #bbf7d0' }}
              />
              <div>
                <h2 style={{ fontSize: '14px', fontWeight: 600, color: '#111827', marginBottom: '2px' }}>
                  {user?.firstName} {user?.lastName}
                </h2>
                <p style={{ fontSize: '12px', color: '#6b7280' }}>{user?.email}</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => navigate(`/dashboard/users/${user?._id}`)}
                style={{
                  flex: 1, padding: '8px', border: '1px solid #d1d5db',
                  borderRadius: '8px', background: '#fff', color: '#374151',
                  fontSize: '13px', fontWeight: 500, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                }}
              >
                <Edit size={14} /> Edit
              </button>
              <button
                onClick={() => navigate(`/dashboard/users/orders/${user?._id}`)}
                style={{
                  flex: 1, padding: '8px', border: 'none',
                  borderRadius: '8px', background: '#16a34a', color: '#fff',
                  fontSize: '13px', fontWeight: 500, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                }}
              >
                <Eye size={14} /> Orders
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminUsers;
