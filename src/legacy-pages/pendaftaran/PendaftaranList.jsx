'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Filter, Eye } from 'lucide-react';
import { getApplications } from '@/src/services/mock/applicationService';
import '@/src/styles/components.css';

export default function PendaftaranList() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const router = useRouter();

  const fetchApplications = async () => {
    try {
      const data = await getApplications();
      setApplications(data);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  

  const filteredApplications = applications.filter(a => {
    const matchSearch = a.businessName.toLowerCase().includes(search.toLowerCase()) || 
                        a.applicantName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || a.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h2>Pendaftaran Usaha/Jasa</h2>
          <p>Review dan kelola usaha atau jasa yang mendaftar ke katalog Bedengan.</p>
        </div>
      </div>

      <div className="table-toolbar">
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Cari nama usaha atau pendaftar..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="filter-box">
          <Filter size={18} className="filter-icon" />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">Semua Status</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div className="table-container card">
        {loading ? (
          <div className="table-loading">Memuat data...</div>
        ) : filteredApplications.length === 0 ? (
          <div className="empty-state">
            <p>Belum ada data pendaftaran.</p>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Usaha / Jasa</th>
                <th>Pemohon</th>
                <th>Kategori</th>
                <th>Tanggal Masuk</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredApplications.map(app => (
                <tr key={app.id}>
                  <td>
                    <div className="table-cell-title">{app.businessName}</div>
                  </td>
                  <td>{app.applicantName}</td>
                  <td>{app.category}</td>
                  <td>{new Date(app.submittedAt).toLocaleDateString('id-ID')}</td>
                  <td>
                    <span className={`status-badge ${app.status}`}>
                      {app.status}
                    </span>
                  </td>
                  <td>
                    <div className="table-actions">
                      <button className="btn-secondary" style={{ padding: '0.4rem 0.75rem', fontSize: '0.75rem' }} onClick={() => router.push(`/admin/pendaftaran/${app.id}`)}>
                        <Eye size={14} style={{ marginRight: '4px' }}/> Review
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
