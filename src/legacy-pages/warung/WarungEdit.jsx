'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getWarungById, updateWarung } from '@/src/services/mock/warungService';

export default function WarungEdit() {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState(null);
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    const fetchWarung = async () => {
      try {
        const data = await getWarungById(id);
        if (data) {
          setFormData(data);
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
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
      await updateWarung(id, formData);
      router.push(`/admin/warung/${id}`);
    } catch (error) {
      console.error('Error updating warung:', error);
    }
  };

  if (loading) return <div className="page-container">Memuat data...</div>;
  if (!formData) return null;

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h2>Edit Warung</h2>
          <p>Perbarui informasi warung atau kuliner.</p>
        </div>
      </div>

      <div className="form-container card">
        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <h3 className="form-section-title">Informasi Warung</h3>
            
            <div className="form-group">
              <label>Nama Warung *</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Deskripsi *</label>
              <textarea name="description" value={formData.description} onChange={handleChange} required rows={4} style={{ width: '100%', padding: '0.875rem 1rem', borderRadius: '12px', border: '1px solid var(--color-border)', resize: 'vertical' }} />
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label>Nomor WhatsApp *</label>
                <input type="tel" name="whatsapp" value={formData.whatsapp} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Alamat *</label>
                <input type="text" name="address" value={formData.address} onChange={handleChange} required />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3 className="form-section-title">Jam Operasional</h3>
            <div className="form-grid-2">
              <div className="form-group">
                <label>Jam Buka *</label>
                <input type="time" name="openingTime" value={formData.openingTime} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Jam Tutup *</label>
                <input type="time" name="closingTime" value={formData.closingTime} onChange={handleChange} required />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3 className="form-section-title">Foto & Tag Menu</h3>
            
            <div className="form-group">
              <label>Foto Warung</label>
              <input type="file" accept="image/*" onChange={handleImageChange} />
              {formData.image && (
                <div style={{ marginTop: '1rem' }}>
                  <img src={formData.image} alt="Preview" style={{ width: '200px', borderRadius: '12px', objectFit: 'cover' }} />
                </div>
              )}
            </div>

            <div className="form-group">
              <label>Tag Menu</label>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                <input type="text" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())} />
                <button type="button" className="btn-secondary" onClick={handleAddTag}>Tambah</button>
              </div>
              <div className="tag-list-inline">
                {formData.tags.map(tag => (
                  <span key={tag} className="badge-tag" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {tag}
                    <button type="button" onClick={() => handleRemoveTag(tag)} style={{ cursor: 'pointer', color: 'var(--color-text-secondary)', fontSize: '1rem', lineHeight: 1 }}>&times;</button>
                  </span>
                ))}
              </div>
            </div>

            <div className="form-group" style={{ marginTop: '1.5rem' }}>
              <label>Status Publikasi</label>
              <select name="status" value={formData.status} onChange={handleChange} style={{ width: '100%', padding: '0.875rem 1rem', borderRadius: '12px', border: '1px solid var(--color-border)' }}>
                <option value="active">Aktif (Tampil di Aplikasi)</option>
                <option value="inactive">Nonaktif (Sembunyikan)</option>
              </select>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={() => router.push(`/admin/warung/${id}`)}>Batal</button>
            <button type="submit" className="btn-primary">Simpan Perubahan</button>
          </div>
        </form>
      </div>
    </div>
  );
}
