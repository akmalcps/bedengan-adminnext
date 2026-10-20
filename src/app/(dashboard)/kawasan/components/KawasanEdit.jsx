'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getKawasanById, updateKawasan } from '@/src/services/mock/kawasanService';
import '@/src/styles/components.css';

export default function KawasanEdit() {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState(null);
  const [facilityInput, setFacilityInput] = useState('');

  useEffect(() => {
    const fetchKawasan = async () => {
      try {
        const data = await getKawasanById(id);
        if (data) {
          setFormData(data);
        } else {
          router.push('/admin/kawasan');
        }
      } catch (error) {
        console.error('Error fetching kawasan:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchKawasan();
  }, [id, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddFacility = () => {
    if (facilityInput.trim() && !formData.facilities.includes(facilityInput.trim())) {
      setFormData(prev => ({
        ...prev,
        facilities: [...prev.facilities, facilityInput.trim()]
      }));
      setFacilityInput('');
    }
  };

  const handleRemoveFacility = (facilityToRemove) => {
    setFormData(prev => ({
      ...prev,
      facilities: prev.facilities.filter(f => f !== facilityToRemove)
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setFormData(prev => ({ ...prev, image: objectUrl }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateKawasan(id, formData);
      router.push(`/admin/kawasan/${id}`);
    } catch (error) {
      console.error('Error updating kawasan:', error);
    }
  };

  if (loading) return <div className="page-container">Memuat data...</div>;
  if (!formData) return null;

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h2>Edit Kawasan</h2>
          <p>Perbarui informasi area camping.</p>
        </div>
      </div>

      <div className="form-container card">
        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <h3 className="form-section-title">Informasi Area</h3>
            
            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label>Nomor Area</label>
              <input type="text" value={formData.number} disabled style={{ backgroundColor: 'var(--color-background)' }} />
              <small style={{ color: 'var(--color-text-muted)', display: 'block', marginTop: '0.25rem' }}>Nomor area tidak dapat diubah (Area 1-13 fix).</small>
            </div>

            <div className="form-group">
              <label>Nama Area / Julukan *</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Deskripsi *</label>
              <textarea name="description" value={formData.description} onChange={handleChange} required rows={4} style={{ width: '100%', padding: '0.875rem 1rem', borderRadius: '12px', border: '1px solid var(--color-border)', resize: 'vertical' }} />
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label>Kapasitas (Perkiraan) *</label>
                <input type="text" name="capacity" value={formData.capacity} onChange={handleChange} required placeholder="Contoh: 15-20 Tenda" />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3 className="form-section-title">Fasilitas Terdekat</h3>
            
            <div className="form-group">
              <label>Fasilitas</label>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                <input type="text" value={facilityInput} onChange={(e) => setFacilityInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddFacility())} placeholder="Contoh: Toilet" />
                <button type="button" className="btn-secondary" onClick={handleAddFacility}>Tambah</button>
              </div>
              <div className="tag-list-inline">
                {formData.facilities.map(facility => (
                  <span key={facility} className="badge-tag" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {facility}
                    <button type="button" onClick={() => handleRemoveFacility(facility)} style={{ cursor: 'pointer', color: 'var(--color-text-secondary)', fontSize: '1rem', lineHeight: 1 }}>&times;</button>
                  </span>
                ))}
              </div>
            </div>
          </div>
          
          <div className="form-section">
            <h3 className="form-section-title">Foto Area</h3>
            
            <div className="form-group">
              <label>Upload Foto</label>
              <input type="file" accept="image/*" onChange={handleImageChange} />
              {formData.image && (
                <div style={{ marginTop: '1rem' }}>
                  <img src={formData.image} alt="Preview" style={{ width: '100%', maxWidth: '300px', borderRadius: '12px', objectFit: 'cover' }} />
                </div>
              )}
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={() => router.push(`/admin/kawasan/${id}`)}>Batal</button>
            <button type="submit" className="btn-primary">Simpan Perubahan</button>
          </div>
        </form>
      </div>
    </div>
  );
}
