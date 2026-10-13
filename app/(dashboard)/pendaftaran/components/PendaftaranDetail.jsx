'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react';
import { getApplicationById, approveApplication, rejectApplication } from '@/src/services/mock/applicationService';
import '@/src/styles/components.css';

export default function PendaftaranDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const fetchApplication = async () => {
    try {
      const data = await getApplicationById(id);
      if (data) {
        setApplication(data);
      } else {
        router.push('/admin/pendaftaran');
      }
    } catch (error) {
      console.error('Error fetching application:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplication();
  }, [id]);

  const handleApprove = async () => {
    if (window.confirm('Terima Pendaftaran?\n\nUsaha ini akan siap dipublikasikan ke katalog Bedengan Xplore.')) {
      try {
        await approveApplication(id);
        fetchApplication();
      } catch (error) {
        console.error('Error approving application:', error);
      }
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      alert('Mohon isi alasan penolakan.');
      return;
    }
    
    try {
      await rejectApplication(id, rejectReason);
      setShowRejectModal(false);
      fetchApplication();
    } catch (error) {
      console.error('Error rejecting application:', error);
    }
  };

  if (loading) return <div className="page-container">Memuat data...</div>;
  if (!application) return null;

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <button className="btn-secondary" onClick={() => router.push('/admin/pendaftaran')} style={{ marginBottom: '1rem', border: 'none', padding: '0.5rem 0' }}>
            <ArrowLeft size={18} /> Kembali
          </button>
          <h2>Detail Pendaftaran</h2>
          <p>Review informasi usaha atau jasa yang didaftarkan.</p>
        </div>
        {application.status === 'Pending' && (
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button className="btn-danger" onClick={() => setShowRejectModal(true)}>
              <XCircle size={18} /> Tolak
            </button>
            <button className="btn-primary" onClick={handleApprove}>
              <CheckCircle size={18} /> Terima
            </button>
          </div>
        )}
      </div>

      <div className="card" style={{ padding: '2rem', maxWidth: '800px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--color-border)' }}>
          <div>
            <h3 style={{ fontSize: '1.5rem', color: 'var(--color-forest)', marginBottom: '0.25rem' }}>{application.businessName}</h3>
            <p style={{ color: 'var(--color-text-secondary)' }}>Kategori: {application.category}</p>
          </div>
          <span className={`status-badge ${application.status}`} style={{ fontSize: '0.85rem', padding: '0.4rem 1rem' }}>
            {application.status}
          </span>
        </div>

        {application.status === 'Rejected' && application.rejectionReason && (
          <div style={{ background: 'var(--color-error-light)', padding: '1rem', borderRadius: '12px', marginBottom: '2rem' }}>
            <h4 style={{ color: 'var(--color-error)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Alasan Penolakan:</h4>
            <p style={{ color: 'var(--color-error)', fontSize: '0.9rem' }}>{application.rejectionReason}</p>
          </div>
        )}

        <div className="form-section">
          <h3 className="form-section-title">Informasi Pemohon</h3>
          <div className="form-grid-2">
            <div>
              <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Nama Pemohon</p>
              <p style={{ fontWeight: 500 }}>{application.applicantName}</p>
            </div>
            <div>
              <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Nomor WhatsApp</p>
              <p style={{ fontWeight: 500 }}>{application.whatsapp}</p>
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3 className="form-section-title">Informasi Usaha</h3>
          <div style={{ marginBottom: '1.5rem' }}>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Deskripsi</p>
            <p>{application.description}</p>
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Alamat</p>
            <p>{application.address}</p>
          </div>
          
          {application.images?.length > 0 && (
            <div>
              <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>Foto Pendukung</p>
              <div style={{ display: 'flex', gap: '1rem' }}>
                {application.images.map((img, i) => (
                  <img key={i} src={img} alt="Pendukung" style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '12px' }} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {showRejectModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div className="card" style={{ width: '100%', maxWidth: '400px', padding: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--color-forest)', marginBottom: '1rem' }}>Tolak Pendaftaran?</h3>
            <div className="form-group">
              <label>Alasan Penolakan *</label>
              <textarea 
                value={rejectReason} 
                onChange={(e) => setRejectReason(e.target.value)} 
                rows={3} 
                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-border)', resize: 'vertical' }}
                placeholder="Berikan alasan mengapa pendaftaran ditolak..."
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button className="btn-secondary" onClick={() => setShowRejectModal(false)}>Batal</button>
              <button className="btn-danger" onClick={handleReject}>Tolak Pendaftaran</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
