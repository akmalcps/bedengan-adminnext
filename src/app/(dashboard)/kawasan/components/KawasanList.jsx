'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Filter, Eye, Edit, Power, PowerOff } from 'lucide-react';
import { getKawasans, toggleKawasanStatus } from '@/src/services/mock/kawasanService';
import '@/src/styles/components.css';

export default function KawasanList() {
  const [kawasans, setKawasans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const router = useRouter();

  const fetchKawasans = async () => {
    try {
      const data = await getKawasans();
      setKawasans(data);
    } catch (error) {
      console.error('Error fetching kawasans:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKawasans();
  }, []);

  

  const handleToggleStatus = async (id) => {
    try {
      await toggleKawasanStatus(id);
      fetchKawasans();
    } catch (error) {
      console.error('Error toggling status:', error);
    }
  };

  const filteredKawasans = kawasans.filter(k => {
    const matchSearch = k.name.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || k.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h2>Kawasan Bedengan</h2>
          <p>Kelola daftar 13 area camping di Bedengan.</p>
        </div>
      </div>

      <div className="table-toolbar">
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Cari nama area..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="filter-box">
          <Filter size={18} className="filter-icon" />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">Semua Status</option>
            <option value="active">Aktif</option>
            <option value="inactive">Nonaktif</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="table-loading">Memuat data...</div>
      ) : filteredKawasans.length === 0 ? (
        <div className="empty-state card">
          <p>Belum ada data kawasan.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {filteredKawasans.map(kawasan => (
            <div key={kawasan.id} className="card" style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <div style={{ position: 'relative', height: '160px' }}>
                <img src={kawasan.image || 'https://via.placeholder.com/300x200'} alt={kawasan.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', top: '12px', left: '12px', background: 'rgba(255,255,255,0.9)', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-forest)' }}>
                  No. {kawasan.number}
                </div>
                <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
                  <span className={`status-badge ${kawasan.status}`} style={{ boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                    {kawasan.status === 'active' ? 'Aktif' : 'Nonaktif'}
                  </span>
                </div>
              </div>
              <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <h3 style={{ fontSize: '1.125rem', color: 'var(--color-forest)', marginBottom: '0.5rem' }}>{kawasan.name}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '1rem', flex: 1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {kawasan.description}
                </p>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button className="btn-secondary" style={{ flex: 1, justifyContent: 'center', padding: '0.5rem' }} onClick={() => router.push(`/admin/kawasan/${kawasan.id}`)}>
                    <Eye size={16} /> Detail
                  </button>
                  <button className="btn-secondary" style={{ flex: 1, justifyContent: 'center', padding: '0.5rem' }} onClick={() => router.push(`/admin/kawasan/${kawasan.id}/edit`)}>
                    <Edit size={16} /> Edit
                  </button>
                  <button 
                    className={`btn-secondary ${kawasan.status === 'active' ? 'text-warning' : 'text-success'}`} 
                    style={{ padding: '0.5rem' }} 
                    onClick={() => handleToggleStatus(kawasan.id)}
                    title={kawasan.status === 'active' ? 'Nonaktifkan' : 'Aktifkan'}
                  >
                    {kawasan.status === 'active' ? <PowerOff size={16} color="var(--color-warning)" /> : <Power size={16} color="var(--color-success)" />}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
