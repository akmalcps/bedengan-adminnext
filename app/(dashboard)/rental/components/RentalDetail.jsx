'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Edit, ArrowLeft, Trash2 } from 'lucide-react';
import { getRentalById, deleteRental } from '@/src/services/mock/rentalService';
import MobilePreviewFrame from '@/src/components/preview/MobilePreviewFrame';
import { formatRupiah } from '@/src/utils/format';

export default function RentalDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [rental, setRental] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRental = async () => {
      try {
        const data = await getRentalById(id);
        if (data) {
          setRental(data);
        } else {
          router.push('/admin/rental');
        }
      } catch (error) {
        console.error('Error fetching rental:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRental();
  }, [id, router]);

  const handleDelete = async () => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus Rental ${rental.name}?`)) {
      try {
        await deleteRental(id);
        router.push('/admin/rental');
      } catch (error) {
        console.error('Error deleting rental:', error);
      }
    }
  };

  if (loading) return <div className="page-container">Memuat data...</div>;
  if (!rental) return null;

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <button className="btn-secondary" onClick={() => router.push('/admin/rental')} style={{ marginBottom: '1rem', border: 'none', padding: '0.5rem 0' }}>
            <ArrowLeft size={18} /> Kembali
          </button>
          <h2>Detail Rental</h2>
          <p>Informasi detail penyedia dan item rental.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn-danger" onClick={handleDelete}>
            <Trash2 size={18} /> Hapus
          </button>
          <button className="btn-primary" onClick={() => router.push(`/admin/rental/${id}/edit`)}>
            <Edit size={18} /> Edit Rental
          </button>
        </div>
      </div>

      <div className="dashboard-grid-2">
        <div className="card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2rem', alignItems: 'flex-start' }}>
            <img 
              src={rental.image || 'https://via.placeholder.com/150'} 
              alt={rental.name} 
              style={{ width: '120px', height: '120px', borderRadius: '16px', objectFit: 'cover' }} 
            />
            <div>
              <h3 style={{ fontSize: '1.5rem', color: 'var(--color-forest)', marginBottom: '0.25rem' }}>{rental.name}</h3>
              <span className={`status-badge ${rental.status}`} style={{ marginBottom: '1rem' }}>
                {rental.status === 'active' ? 'Aktif' : 'Nonaktif'}
              </span>
            </div>
          </div>

          <div className="form-section">
            <h4 style={{ fontSize: '1rem', color: 'var(--color-text-secondary)', marginBottom: '0.5rem' }}>Deskripsi</h4>
            <p style={{ lineHeight: 1.6 }}>{rental.description}</p>
          </div>

          <div className="form-grid-2" style={{ marginBottom: '1.5rem' }}>
            <div>
              <h4 style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Jam Operasional</h4>
              <p style={{ fontWeight: 500 }}>{rental.openingTime} - {rental.closingTime}</p>
            </div>
            <div>
              <h4 style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Nomor WhatsApp</h4>
              <p style={{ fontWeight: 500 }}>{rental.whatsapp}</p>
            </div>
            <div>
              <h4 style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Alamat</h4>
              <p style={{ fontWeight: 500 }}>{rental.address}</p>
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: '1rem', color: 'var(--color-text-secondary)', marginBottom: '1rem' }}>Daftar Item ({rental.items?.length || 0})</h4>
            {rental.items?.length > 0 ? (
              <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))' }}>
                {rental.items.map(item => (
                  <div key={item.id} style={{ border: '1px solid var(--color-border)', borderRadius: '12px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontWeight: 600, color: 'var(--color-forest)' }}>{item.name}</span>
                      <span className={`status-badge ${item.availability === 'tersedia' ? 'active' : 'inactive'}`}>
                        {item.availability}
                      </span>
                    </div>
                    <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
                      {formatRupiah(item.price)} / {item.unit}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: 'var(--color-text-muted)', fontStyle: 'italic' }}>Tidak ada item.</p>
            )}
          </div>
        </div>

        <div>
          <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
            <h3 style={{ fontSize: '1rem', color: 'var(--color-forest)' }}>Preview Mobile</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>Tampilan di katalog pengguna</p>
          </div>
          <MobilePreviewFrame title="Detail Rental">
            <div className="mobile-view-inner">
              <div className="mobile-card">
                <div className="mobile-card-img-wrapper">
                  <img src={rental.image || 'https://via.placeholder.com/400x300'} alt={rental.name} className="mobile-card-img" />
                </div>
                <div className="mobile-card-body">
                  <h3 className="mobile-card-title">{rental.name}</h3>
                  <p className="mobile-card-desc" style={{ marginBottom: '1.5rem' }}>{rental.description}</p>
                  
                  <h4 style={{ fontSize: '0.9rem', marginBottom: '0.75rem', color: 'var(--color-forest)' }}>Perlengkapan Tersedia</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                    {rental.items?.map(item => (
                      <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.75rem', borderBottom: '1px dashed var(--color-border)' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>{item.name}</span>
                        <span style={{ fontSize: '0.85rem', color: 'var(--color-primary-dark)', fontWeight: 600 }}>{formatRupiah(item.price)}</span>
                      </div>
                    ))}
                  </div>

                  <button className="mobile-btn-primary" style={{ width: '100%' }}>Hubungi via WhatsApp</button>
                </div>
              </div>
            </div>
          </MobilePreviewFrame>
        </div>
      </div>
    </div>
  );
}
