'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Search, Filter, Camera, Edit, Eye, Trash2 } from 'lucide-react';
import { getFotografers, deleteFotografer } from '@/src/services/mock/fotograferService';
import '@/src/styles/components.css';

export default function FotograferList() {
  const [fotografers, setFotografers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const router = useRouter();

  const fetchFotografers = async () => {
    try {
      const data = await getFotografers();
      setFotografers(data);
    } catch (error) {
      console.error('Error fetching fotografers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFotografers();
  }, []);

  

  const handleDelete = async (id, name) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus Fotografer ${name}?`)) {
      try {
        await deleteFotografer(id);
        fetchFotografers();
      } catch (error) {
        console.error('Error deleting fotografer:', error);
      }
    }
  };

  const filteredFotografers = fotografers.filter(f => {
    const matchSearch = f.name.toLowerCase().includes(search.toLowerCase()) || 
                        f.instagramUsername.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || f.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h2>Fotografer</h2>
          <p>Kelola profil, layanan, dan portfolio fotografer Bedengan.</p>
        </div>
        <button className="btn-primary" onClick={() => router.push('/admin/fotografer/create')}>
          <Plus size={18} /> Tambah Fotografer
        </button>
      </div>

      <div className="table-toolbar">
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Cari nama atau username IG..." 
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
      ) : filteredFotografers.length === 0 ? (
        <div className="empty-state card">
          <p>Belum ada data fotografer.</p>
          <button className="btn-primary" onClick={() => router.push('/admin/fotografer/create')}>
            <Plus size={18} /> Tambah Fotografer
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {filteredFotografers.map(fotografer => (
            <div key={fotografer.id} className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
                <img 
                  src={fotografer.profileImage || 'https://via.placeholder.com/80'} 
                  alt={fotografer.name} 
                  style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <div>
                  <h3 style={{ fontSize: '1.125rem', color: 'var(--color-forest)', marginBottom: '0.25rem' }}>{fotografer.name}</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-primary)' }}>{fotografer.instagramUsername}</p>
                </div>
              </div>

              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '1rem', flex: 1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {fotografer.description}
              </p>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', padding: '0.75rem', background: 'var(--color-background)', borderRadius: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Camera size={16} color="var(--color-text-muted)" />
                  <span style={{ fontSize: '0.85rem', color: 'var(--color-text-primary)' }}>{fotografer.services?.length || 0} Layanan</span>
                </div>
                <span className={`status-badge ${fotografer.status}`}>
                  {fotografer.status === 'active' ? 'Aktif' : 'Nonaktif'}
                </span>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                <button className="btn-secondary" style={{ flex: 1, justifyContent: 'center', padding: '0.5rem' }} onClick={() => router.push(`/admin/fotografer/${fotografer.id}`)}>
                  <Eye size={16} /> Detail
                </button>
                <button className="btn-secondary" style={{ flex: 1, justifyContent: 'center', padding: '0.5rem' }} onClick={() => router.push(`/admin/fotografer/${fotografer.id}/edit`)}>
                  <Edit size={16} /> Edit
                </button>
                <button className="btn-danger" style={{ padding: '0.5rem 0.75rem' }} onClick={() => handleDelete(fotografer.id, fotografer.name)}>
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
