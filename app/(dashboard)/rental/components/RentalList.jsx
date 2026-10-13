'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Search, Filter, Edit, Eye, Trash2, Power, PowerOff } from 'lucide-react';
import { getRentals, deleteRental, toggleRentalStatus } from '@/src/services/mock/rentalService';
import '@/src/styles/components.css';

export default function RentalList() {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const router = useRouter();

  const fetchRentals = async () => {
    try {
      const data = await getRentals();
      setRentals(data);
    } catch (error) {
      console.error('Error fetching rentals:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRentals();
  }, []);

  

  const handleDelete = async (id, name) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus Rental ${name}?`)) {
      try {
        await deleteRental(id);
        fetchRentals();
      } catch (error) {
        console.error('Error deleting rental:', error);
      }
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await toggleRentalStatus(id);
      fetchRentals();
    } catch (error) {
      console.error('Error toggling status:', error);
    }
  };

  const filteredRentals = rentals.filter(r => {
    const matchSearch = r.name.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || r.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h2>Rental Camping</h2>
          <p>Kelola penyedia dan peralatan camping yang tersedia.</p>
        </div>
        <button className="btn-primary" onClick={() => router.push('/admin/rental/create')}>
          <Plus size={18} /> Tambah Rental
        </button>
      </div>

      <div className="table-toolbar">
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Cari nama rental..." 
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
        ) : filteredRentals.length === 0 ? (
          <div className="empty-state">
            <p>Belum ada data rental.</p>
            <button className="btn-primary" onClick={() => router.push('/admin/rental/create')}>
              <Plus size={18} /> Tambah Rental
            </button>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Foto</th>
                <th>Nama Rental</th>
                <th>Jumlah Item</th>
                <th>Jam Operasional</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredRentals.map(rental => (
                <tr key={rental.id}>
                  <td>
                    <img 
                      src={rental.image || 'https://via.placeholder.com/60'} 
                      alt={rental.name} 
                      className="table-img"
                    />
                  </td>
                  <td>
                    <div className="table-cell-title">{rental.name}</div>
                    <div className="table-cell-subtitle">{rental.whatsapp}</div>
                  </td>
                  <td>{rental.items?.length || 0} item</td>
                  <td>{rental.openingTime} - {rental.closingTime}</td>
                  <td>
                    <span className={`status-badge ${rental.status}`}>
                      {rental.status === 'active' ? 'Aktif' : 'Nonaktif'}
                    </span>
                  </td>
                  <td>
                    <div className="table-actions">
                      <button className="action-icon-btn" onClick={() => router.push(`/admin/rental/${rental.id}`)} title="Lihat Detail">
                        <Eye size={18} />
                      </button>
                      <button className="action-icon-btn" onClick={() => router.push(`/admin/rental/${rental.id}/edit`)} title="Edit">
                        <Edit size={18} />
                      </button>
                      <button 
                        className={`action-icon-btn ${rental.status === 'active' ? 'text-warning' : 'text-success'}`} 
                        onClick={() => handleToggleStatus(rental.id)}
                        title={rental.status === 'active' ? 'Nonaktifkan' : 'Aktifkan'}
                      >
                        {rental.status === 'active' ? <PowerOff size={18} /> : <Power size={18} />}
                      </button>
                      <button className="action-icon-btn text-error" onClick={() => handleDelete(rental.id, rental.name)} title="Hapus">
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
