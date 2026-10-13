'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Edit, ArrowLeft, Power, PowerOff } from 'lucide-react';
import { getKawasanById, toggleKawasanStatus } from '@/src/services/mock/kawasanService';
import MobilePreviewFrame from '@/src/components/preview/MobilePreviewFrame';
import MobileAreaPreview from '@/src/components/preview/MobileAreaPreview';

export default function KawasanDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [kawasan, setKawasan] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchKawasan = async () => {
    try {
      const data = await getKawasanById(id);
      if (data) {
        setKawasan(data);
      } else {
        router.push('/admin/kawasan');
      }
    } catch (error) {
      console.error('Error fetching kawasan:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKawasan();
  }, [id]);

  const handleToggleStatus = async () => {
    try {
      await toggleKawasanStatus(id);
      fetchKawasan();
    } catch (error) {
      console.error('Error toggling status:', error);
    }
  };

  if (loading) return <div className="page-container">Memuat data...</div>;
  if (!kawasan) return null;

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <button className="btn-secondary" onClick={() => router.push('/admin/kawasan')} style={{ marginBottom: '1rem', border: 'none', padding: '0.5rem 0' }}>
            <ArrowLeft size={18} /> Kembali
          </button>
          <h2>Detail Kawasan</h2>
          <p>Informasi detail area camping Bedengan.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn-secondary" onClick={handleToggleStatus}>
            {kawasan.status === 'active' ? <PowerOff size={18} className="text-warning" /> : <Power size={18} className="text-success" />}
            {kawasan.status === 'active' ? ' Nonaktifkan' : ' Aktifkan'}
          </button>
          <button className="btn-primary" onClick={() => router.push(`/admin/kawasan/${id}/edit`)}>
            <Edit size={18} /> Edit Kawasan
          </button>
        </div>
      </div>

      <div className="dashboard-grid-2">
        <div className="card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2rem', alignItems: 'flex-start' }}>
            <img 
              src={kawasan.image || 'https://via.placeholder.com/150'} 
              alt={kawasan.name} 
              style={{ width: '120px', height: '120px', borderRadius: '16px', objectFit: 'cover' }} 
            />
            <div>
              <div style={{ display: 'inline-block', background: 'rgba(133, 187, 69, 0.1)', color: 'var(--color-primary-dark)', padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                Area {kawasan.number}
              </div>
              <h3 style={{ fontSize: '1.5rem', color: 'var(--color-forest)', marginBottom: '0.25rem' }}>{kawasan.name}</h3>
              <span className={`status-badge ${kawasan.status}`} style={{ marginBottom: '1rem' }}>
                {kawasan.status === 'active' ? 'Aktif' : 'Nonaktif'}
              </span>
            </div>
          </div>

          <div className="form-section">
            <h4 style={{ fontSize: '1rem', color: 'var(--color-text-secondary)', marginBottom: '0.5rem' }}>Deskripsi</h4>
            <p style={{ lineHeight: 1.6 }}>{kawasan.description}</p>
          </div>

          <div className="form-grid-2" style={{ marginBottom: '1.5rem' }}>
            <div>
              <h4 style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Kapasitas Perkiraan</h4>
              <p style={{ fontWeight: 500 }}>{kawasan.capacity}</p>
            </div>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h4 style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>Fasilitas Terdekat</h4>
            <div className="tag-list-inline">
              {kawasan.facilities?.map((facility, i) => (
                <span key={i} className="badge-tag">{facility}</span>
              ))}
            </div>
          </div>
          
          <div style={{ background: 'var(--color-background)', padding: '2rem', borderRadius: '16px', textAlign: 'center', border: '2px dashed var(--color-border)' }}>
            <p style={{ color: 'var(--color-text-secondary)', fontWeight: 500 }}>[ Placeholder Denah / Peta Area ]</p>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>(Untuk prototype tidak ada peta aktif)</p>
          </div>
        </div>

        <div>
          <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
            <h3 style={{ fontSize: '1rem', color: 'var(--color-forest)' }}>Preview Mobile</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>Tampilan di eksplorasi area</p>
          </div>
          <MobilePreviewFrame title="Detail Area">
            <MobileAreaPreview data={kawasan} />
          </MobilePreviewFrame>
        </div>
      </div>
    </div>
  );
}
