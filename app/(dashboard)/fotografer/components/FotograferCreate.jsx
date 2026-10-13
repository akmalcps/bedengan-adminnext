'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Trash2 } from 'lucide-react';
import { createFotografer } from '@/src/services/mock/fotograferService';
import '@/src/styles/components.css';

export default function FotograferCreate() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    instagramUsername: '',
    instagramUrl: '',
    whatsapp: '',
    location: 'Malang Raya',
    description: '',
    status: 'active',
    profileImage: '',
    gallery: [],
    services: []
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setFormData(prev => ({ ...prev, profileImage: objectUrl }));
    }
  };

  const handleGalleryChange = (e) => {
    const files = Array.from(e.target.files);
    const objectUrls = files.map(file => URL.createObjectURL(file));
    setFormData(prev => ({ ...prev, gallery: [...prev.gallery, ...objectUrls] }));
  };

  const handleRemoveGalleryImage = (indexToRemove) => {
    setFormData(prev => ({
      ...prev,
      gallery: prev.gallery.filter((_, index) => index !== indexToRemove)
    }));
  };

  const handleAddService = () => {
    setFormData(prev => ({
      ...prev,
      services: [
        ...prev.services, 
        { id: Date.now().toString(), name: '', description: '', startingPrice: '', status: 'active' }
      ]
    }));
  };

  const handleServiceChange = (id, field, value) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.map(service => service.id === id ? { ...service, [field]: value } : service)
    }));
  };

  const handleRemoveService = (id) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.filter(service => service.id !== id)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createFotografer(formData);
      router.push('/admin/fotografer');
    } catch (error) {
      console.error('Error creating fotografer:', error);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h2>Tambah Fotografer</h2>
          <p>Tambahkan profil dan portofolio fotografer baru.</p>
        </div>
      </div>

      <div className="form-container card">
        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <h3 className="form-section-title">Profil Fotografer</h3>
            
            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label>Foto Profil *</label>
              <input type="file" accept="image/*" onChange={handleProfileImageChange} required={!formData.profileImage} />
              {formData.profileImage && (
                <div style={{ marginTop: '1rem' }}>
                  <img src={formData.profileImage} alt="Profile Preview" style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover' }} />
                </div>
              )}
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label>Nama / Display Name *</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Contoh: Alan Picture" />
              </div>
              <div className="form-group">
                <label>Username Instagram *</label>
                <input type="text" name="instagramUsername" value={formData.instagramUsername} onChange={handleChange} required placeholder="Contoh: @alanpicture.id" />
              </div>
              <div className="form-group">
                <label>URL Instagram</label>
                <input type="url" name="instagramUrl" value={formData.instagramUrl} onChange={handleChange} placeholder="https://instagram.com/alanpicture.id" />
              </div>
              <div className="form-group">
                <label>Nomor WhatsApp *</label>
                <input type="tel" name="whatsapp" value={formData.whatsapp} onChange={handleChange} required />
              </div>
            </div>

            <div className="form-group" style={{ marginTop: '1.5rem' }}>
              <label>Deskripsi *</label>
              <textarea name="description" value={formData.description} onChange={handleChange} required rows={3} style={{ width: '100%', padding: '0.875rem 1rem', borderRadius: '12px', border: '1px solid var(--color-border)', resize: 'vertical' }} />
            </div>
            
            <div className="form-group" style={{ marginTop: '1.5rem' }}>
              <label>Lokasi Basis</label>
              <input type="text" name="location" value={formData.location} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 className="form-section-title" style={{ marginBottom: 0 }}>Layanan (Services)</h3>
              <button type="button" className="btn-secondary" onClick={handleAddService}>
                <Plus size={16} /> Tambah Layanan
              </button>
            </div>

            {formData.services.length === 0 ? (
              <p style={{ color: 'var(--color-text-secondary)', fontStyle: 'italic', marginBottom: '1rem' }}>Belum ada layanan ditambahkan.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {formData.services.map((service) => (
                  <div key={service.id} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', background: 'var(--color-background)', padding: '1rem', borderRadius: '12px', flexWrap: 'wrap' }}>
                    <div style={{ flex: '1 1 200px' }}>
                      <label style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Nama Layanan *</label>
                      <input type="text" value={service.name} onChange={(e) => handleServiceChange(service.id, 'name', e.target.value)} required placeholder="Contoh: Prewedding" style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--color-border)' }} />
                    </div>
                    <div style={{ flex: '2 1 300px' }}>
                      <label style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Deskripsi *</label>
                      <input type="text" value={service.description} onChange={(e) => handleServiceChange(service.id, 'description', e.target.value)} required style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--color-border)' }} />
                    </div>
                    <div style={{ flex: '1 1 150px' }}>
                      <label style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Mulai Dari (Harga)</label>
                      <input type="number" value={service.startingPrice} onChange={(e) => handleServiceChange(service.id, 'startingPrice', e.target.value)} placeholder="500000" style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--color-border)' }} />
                    </div>
                    <div style={{ paddingTop: '1.25rem' }}>
                      <button type="button" onClick={() => handleRemoveService(service.id)} className="action-icon-btn text-error">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="form-section">
            <h3 className="form-section-title">Gallery Portfolio</h3>
            
            <div className="form-group">
              <label>Pilih Foto (Bisa lebih dari 1)</label>
              <input type="file" accept="image/*" multiple onChange={handleGalleryChange} />
            </div>

            {formData.gallery.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
                {formData.gallery.map((img, index) => (
                  <div key={index} style={{ position: 'relative' }}>
                    <img src={img} alt={`Gallery ${index}`} style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: '8px' }} />
                    <button 
                      type="button" 
                      onClick={() => handleRemoveGalleryImage(index)}
                      style={{ position: 'absolute', top: '4px', right: '4px', background: 'var(--color-error)', color: '#fff', border: 'none', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="form-section">
            <div className="form-group">
              <label>Status Publikasi</label>
              <select name="status" value={formData.status} onChange={handleChange} style={{ width: '100%', padding: '0.875rem 1rem', borderRadius: '12px', border: '1px solid var(--color-border)' }}>
                <option value="active">Aktif (Tampil di Aplikasi)</option>
                <option value="inactive">Nonaktif (Sembunyikan)</option>
              </select>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={() => router.push('/admin/fotografer')}>Batal</button>
            <button type="submit" className="btn-primary">Simpan Fotografer</button>
          </div>
        </form>
      </div>
    </div>
  );
}
