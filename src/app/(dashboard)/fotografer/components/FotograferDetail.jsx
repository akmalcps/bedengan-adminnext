'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Edit, ArrowLeft, Trash2, Link as LinkIcon } from 'lucide-react';
import { getFotograferById, deleteFotografer } from '@/src/services/mock/fotograferService';
import MobilePreviewFrame from '@/src/components/preview/MobilePreviewFrame';
import { formatRupiah } from '@/src/utils/format';

export default function FotograferDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [fotografer, setFotografer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFotografer = async () => {
      try {
        const data = await getFotograferById(id);
        if (data) {
          setFotografer(data);
        } else {
          router.push('/admin/fotografer');
        }
      } catch (error) {
        console.error('Error fetching fotografer:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFotografer();
  }, [id, router]);

  const handleDelete = async () => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus Fotografer ${fotografer.name}?`)) {
      try {
        await deleteFotografer(id);
        router.push('/admin/fotografer');
      } catch (error) {
        console.error('Error deleting fotografer:', error);
      }
    }
  };

  if (loading) return <div className="page-container">Memuat data...</div>;
  if (!fotografer) return null;

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <button className="btn-secondary" onClick={() => router.push('/admin/fotografer')} style={{ marginBottom: '1rem', border: 'none', padding: '0.5rem 0' }}>
            <ArrowLeft size={18} /> Kembali
          </button>
          <h2>Detail Fotografer</h2>
          <p>Profil, portofolio, dan layanan.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn-danger" onClick={handleDelete}>
            <Trash2 size={18} /> Hapus
          </button>
          <button className="btn-primary" onClick={() => router.push(`/admin/fotografer/${id}/edit`)}>
            <Edit size={18} /> Edit Fotografer
          </button>
        </div>
      </div>

      <div className="dashboard-grid-2">
        <div className="card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2rem', alignItems: 'flex-start' }}>
            <img 
              src={fotografer.profileImage || 'https://via.placeholder.com/150'} 
              alt={fotografer.name} 
              style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover' }} 
            />
            <div>
              <h3 style={{ fontSize: '1.5rem', color: 'var(--color-forest)', marginBottom: '0.25rem' }}>{fotografer.name}</h3>
              <p style={{ color: 'var(--color-primary)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <LinkIcon size={16} /> {fotografer.instagramUsername}
              </p>
              <span className={`status-badge ${fotografer.status}`}>
                {fotografer.status === 'active' ? 'Aktif' : 'Nonaktif'}
              </span>
            </div>
          </div>

          <div className="form-section">
            <h4 style={{ fontSize: '1rem', color: 'var(--color-text-secondary)', marginBottom: '0.5rem' }}>Deskripsi</h4>
            <p style={{ lineHeight: 1.6 }}>{fotografer.description}</p>
          </div>

          <div className="form-grid-2" style={{ marginBottom: '1.5rem' }}>
            <div>
              <h4 style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Lokasi Basis</h4>
              <p style={{ fontWeight: 500 }}>{fotografer.location}</p>
            </div>
            <div>
              <h4 style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Nomor WhatsApp</h4>
              <p style={{ fontWeight: 500 }}>{fotografer.whatsapp}</p>
            </div>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h4 style={{ fontSize: '1rem', color: 'var(--color-text-secondary)', marginBottom: '1rem' }}>Layanan ({fotografer.services?.length || 0})</h4>
            {fotografer.services?.length > 0 ? (
              <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))' }}>
                {fotografer.services.map(service => (
                  <div key={service.id} style={{ border: '1px solid var(--color-border)', borderRadius: '12px', padding: '1rem' }}>
                    <div style={{ fontWeight: 600, color: 'var(--color-forest)', marginBottom: '0.25rem' }}>{service.name}</div>
                    <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>{service.description}</div>
                    <div style={{ color: 'var(--color-primary-dark)', fontSize: '0.9rem', fontWeight: 600 }}>Mulai {formatRupiah(service.startingPrice)}</div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: 'var(--color-text-muted)', fontStyle: 'italic' }}>Tidak ada layanan.</p>
            )}
          </div>

          <div>
            <h4 style={{ fontSize: '1rem', color: 'var(--color-text-secondary)', marginBottom: '1rem' }}>Gallery Portfolio</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '1rem' }}>
              {fotografer.gallery?.map((img, i) => (
                <img key={i} src={img} alt={`Gallery ${i}`} style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '12px' }} />
              ))}
            </div>
          </div>
        </div>

        <div>
          <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
            <h3 style={{ fontSize: '1rem', color: 'var(--color-forest)' }}>Preview Mobile</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>Tampilan di katalog pengguna</p>
          </div>
          <MobilePreviewFrame title="Fotografer">
            <div className="mobile-view-inner">
              <div className="mobile-card" style={{ padding: '1.25rem' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
                  <img src={fotografer.profileImage || 'https://via.placeholder.com/80'} alt={fotografer.name} style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover' }} />
                  <div>
                    <h3 className="mobile-card-title">{fotografer.name}</h3>
                    <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>{fotografer.location} • {fotografer.services?.length || 0} Layanan</p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                  {fotografer.gallery?.slice(0, 3).map((img, i) => (
                    <img key={i} src={img} alt={`Gallery ${i}`} style={{ flex: 1, height: '80px', objectFit: 'cover', borderRadius: '8px' }} />
                  ))}
                </div>

                <p className="mobile-card-desc">{fotografer.description}</p>
                
                <button className="btn-secondary" style={{ width: '100%', justifyContent: 'center', margin: '1rem 0' }}>
                  <LinkIcon size={16} /> Lihat Instagram
                </button>

                <button className="mobile-btn-primary" style={{ width: '100%' }}>Hubungi via WhatsApp</button>
              </div>
            </div>
          </MobilePreviewFrame>
        </div>
      </div>
    </div>
  );
}
