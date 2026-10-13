'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Plus, Search, Filter, MoreVertical, Edit, Eye, Trash2, Power, PowerOff } from 'lucide-react';
import { getWarungs, deleteWarung, toggleWarungStatus } from '@/src/services/mock/warungService';
import '@/src/styles/components.css';

export default function WarungList() {
  const [warungs, setWarungs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const router = useRouter();

  const fetchWarungs = async () => {
    try {
      const data = await getWarungs();
      setWarungs(data);
    } catch (error) {
      console.error('Error fetching warungs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWarungs();
  }, []);

  

  const handleDelete = async (id, name) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus Warung ${name}?`)) {
      try {
        await deleteWarung(id);
        fetchWarungs();
        // Here you would normally show a toast
      } catch (error) {
        console.error('Error deleting warung:', error);
      }
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await toggleWarungStatus(id);
      fetchWarungs();
    } catch (error) {
      console.error('Error toggling status:', error);
    }
  };

  const filteredWarungs = warungs.filter(w => {
    const matchSearch = w.name.toLowerCase().includes(search.toLowerCase()) || 
                        w.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    const matchStatus = statusFilter === 'all' || w.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h2>Warung & Kuliner</h2>
          <p>Kelola usaha kuliner lokal yang ditampilkan di katalog Bedengan.</p>
        </div>
        <button className="btn-primary" onClick={() => router.push('/admin/warung/create')}>
          <Plus size={18} /> Tambah Warung
        </button>
      </div>

      <div className="table-toolbar">
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Cari nama warung, tag..." 
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

      <div className="table-container card">
        {loading ? (
          <div className="table-loading">Memuat data...</div>
        ) : filteredWarungs.length === 0 ? (
          <div className="empty-state">
            <p>Belum ada data warung.</p>
            <button className="btn-primary" onClick={() => router.push('/admin/warung/create')}>
              <Plus size={18} /> Tambah Warung
            </button>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Foto</th>
                <th>Nama Warung</th>
                <th>Jam Operasional</th>
                <th>Tag Menu</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredWarungs.map(warung => (
                <tr key={warung.id}>
                  <td>
                    <img 
                      src={warung.image || 'https://via.placeholder.com/60'} 
                      alt={warung.name} 
                      className="table-img"
                    />
                  </td>
                  <td>
                    <div className="table-cell-title">{warung.name}</div>
                    <div className="table-cell-subtitle">{warung.whatsapp}</div>
                  </td>
                  <td>{warung.openingTime} - {warung.closingTime}</td>
                  <td>
                    <div className="tag-list-inline">
                      {warung.tags.slice(0, 2).map((tag, i) => (
                        <span key={i} className="badge-tag">{tag}</span>
                      ))}
                      {warung.tags.length > 2 && <span className="badge-tag">+{warung.tags.length - 2}</span>}
                    </div>
                  </td>
                  <td>
                    <span className={`status-badge ${warung.status}`}>
                      {warung.status === 'active' ? 'Aktif' : 'Nonaktif'}
                    </span>
                  </td>
                  <td>
                    <div className="table-actions">
                      <button className="action-icon-btn" onClick={() => router.push(`/admin/warung/${warung.id}`)} title="Lihat Detail">
                        <Eye size={18} />
                      </button>
                      <button className="action-icon-btn" onClick={() => router.push(`/admin/warung/${warung.id}/edit`)} title="Edit">
                        <Edit size={18} />
                      </button>
                      <button 
                        className={`action-icon-btn ${warung.status === 'active' ? 'text-warning' : 'text-success'}`} 
                        onClick={() => handleToggleStatus(warung.id)}
                        title={warung.status === 'active' ? 'Nonaktifkan' : 'Aktifkan'}
                      >
                        {warung.status === 'active' ? <PowerOff size={18} /> : <Power size={18} />}
                      </button>
                      <button className="action-icon-btn text-error" onClick={() => handleDelete(warung.id, warung.name)} title="Hapus">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
