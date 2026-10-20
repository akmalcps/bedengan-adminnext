'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Edit, ArrowLeft, Trash2 } from 'lucide-react';
import { getWarungById, deleteWarung } from '@/src/services/mock/warungService';
import MobilePreviewFrame from '@/src/components/preview/MobilePreviewFrame';
import MobileWarungPreview from '@/src/components/preview/MobileWarungPreview';

export default function WarungDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [warung, setWarung] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWarung = async () => {
      try {
        const data = await getWarungById(id);
        if (data) {
          setWarung(data);
        } else {
          router.push('/admin/warung');
        }
      } catch (error) {
        console.error('Error fetching warung:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchWarung();
  }, [id, router]);

  const handleDelete = async () => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus Warung ${warung.name}?`)) {
      try {
        await deleteWarung(id);
        router.push('/admin/warung');
      } catch (error) {
        console.error('Error deleting warung:', error);
      }
    }
  };

  if (loading) return <div className="page-container">Memuat data...</div>;
  if (!warung) return null;

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <button className="btn-secondary" onClick={() => router.push('/admin/warung')} style={{ marginBottom: '1rem', border: 'none', padding: '0.5rem 0' }}>
            <ArrowLeft size={18} /> Kembali
          </button>
          <h2>Detail Warung</h2>
          <p>Informasi detail usaha kuliner.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn-danger" onClick={handleDelete}>
            <Trash2 size={18} /> Hapus
          </button>
          <button className="btn-primary" onClick={() => router.push(`/admin/warung/${id}/edit`)}>
            <Edit size={18} /> Edit Warung
          </button>
        </div>
      </div>

      <div className="dashboard-grid-2">
        <div className="card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2rem', alignItems: 'flex-start' }}>
            <img 
              src={warung.image || 'https://via.placeholder.com/150'} 
              alt={warung.name} 
              style={{ width: '120px', height: '120px', borderRadius: '16px', objectFit: 'cover' }} 
            />
            <div>
              <h3 style={{ fontSize: '1.5rem', color: 'var(--color-forest)', marginBottom: '0.25rem' }}>{warung.name}</h3>
              <span className={`status-badge ${warung.status}`} style={{ marginBottom: '1rem' }}>
                {warung.status === 'active' ? 'Aktif' : 'Nonaktif'}
              </span>
            </div>
          </div>

          <div className="form-section">
            <h4 style={{ fontSize: '1rem', color: 'var(--color-text-secondary)', marginBottom: '0.5rem' }}>Deskripsi</h4>
            <p style={{ lineHeight: 1.6 }}>{warung.description}</p>
          </div>

          <div className="form-grid-2" style={{ marginBottom: '1.5rem' }}>
            <div>
              <h4 style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Jam Operasional</h4>
              <p style={{ fontWeight: 500 }}>{warung.openingTime} - {warung.closingTime}</p>
            </div>
            <div>
              <h4 style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Nomor WhatsApp</h4>
              <p style={{ fontWeight: 500 }}>{warung.whatsapp}</p>
            </div>
            <div>
              <h4 style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Alamat</h4>
              <p style={{ fontWeight: 500 }}>{warung.address}</p>
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>Tag Menu</h4>
            <div className="tag-list-inline">
              {warung.tags.map((tag, i) => (
                <span key={i} className="badge-tag">{tag}</span>
              ))}
            </div>
          </div>
        </div>

        <div>
          <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
            <h3 style={{ fontSize: '1rem', color: 'var(--color-forest)' }}>Preview Mobile</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>Tampilan di katalog pengguna</p>
          </div>
          <MobilePreviewFrame title="Detail Kuliner">
            <MobileWarungPreview data={warung} />
          </MobilePreviewFrame>
        </div>
      </div>
    </div>
  );
}
