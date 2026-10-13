'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Plus, Trash2 } from 'lucide-react';
import { getRentalById, updateRental } from '@/src/services/mock/rentalService';
import '@/src/styles/components.css';

export default function RentalEdit() {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    const fetchRental = async () => {
      try {
        const data = await getRentalById(id);
        if (data) {
          setFormData(data);
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setFormData(prev => ({ ...prev, image: objectUrl }));
    }
  };

  const handleAddItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [
        ...prev.items, 
        { id: Date.now().toString(), name: '', price: '', unit: '', availability: 'tersedia' }
      ]
    }));
  };

  const handleItemChange = (id, field, value) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map(item => item.id === id ? { ...item, [field]: value } : item)
    }));
  };

  const handleRemoveItem = (id) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== id)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateRental(id, formData);
      router.push(`/admin/rental/${id}`);
    } catch (error) {
      console.error('Error updating rental:', error);
    }
  };

  if (loading) return <div className="page-container">Memuat data...</div>;
  if (!formData) return null;

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h2>Edit Rental</h2>
          <p>Perbarui penyedia rental perlengkapan camping.</p>
        </div>
      </div>

      <div className="form-container card">
        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <h3 className="form-section-title">Informasi Rental</h3>
            
            <div className="form-group">
              <label>Nama Rental *</label>
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
              <div className="form-group">
                <label>Jam Buka *</label>
                <input type="time" name="openingTime" value={formData.openingTime} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Jam Tutup *</label>
                <input type="time" name="closingTime" value={formData.closingTime} onChange={handleChange} required />
              </div>
            </div>

            <div className="form-group" style={{ marginTop: '1.5rem' }}>
              <label>Foto Rental</label>
              <input type="file" accept="image/*" onChange={handleImageChange} />
              {formData.image && (
                <div style={{ marginTop: '1rem' }}>
                  <img src={formData.image} alt="Preview" style={{ width: '200px', borderRadius: '12px', objectFit: 'cover' }} />
                </div>
              )}
            </div>

            <div className="form-group" style={{ marginTop: '1.5rem' }}>
              <label>Status Publikasi</label>
              <select name="status" value={formData.status} onChange={handleChange} style={{ width: '100%', padding: '0.875rem 1rem', borderRadius: '12px', border: '1px solid var(--color-border)' }}>
                <option value="active">Aktif (Tampil di Aplikasi)</option>
                <option value="inactive">Nonaktif (Sembunyikan)</option>
              </select>
            </div>
          </div>

          <div className="form-section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 className="form-section-title" style={{ marginBottom: 0 }}>Item Rental</h3>
              <button type="button" className="btn-secondary" onClick={handleAddItem}>
                <Plus size={16} /> Tambah Item
              </button>
            </div>

            {formData.items.length === 0 ? (
              <p style={{ color: 'var(--color-text-secondary)', fontStyle: 'italic', marginBottom: '1rem' }}>Belum ada item ditambahkan.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {formData.items.map((item, index) => (
                  <div key={item.id} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', background: 'var(--color-background)', padding: '1rem', borderRadius: '12px' }}>
                    <div style={{ flex: 2 }}>
                      <label style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Nama Item *</label>
                      <input type="text" value={item.name} onChange={(e) => handleItemChange(item.id, 'name', e.target.value)} required style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--color-border)' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Harga *</label>
                      <input type="number" value={item.price} onChange={(e) => handleItemChange(item.id, 'price', e.target.value)} required style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--color-border)' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Satuan *</label>
                      <input type="text" value={item.unit} onChange={(e) => handleItemChange(item.id, 'unit', e.target.value)} required style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--color-border)' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Ketersediaan</label>
                      <select value={item.availability} onChange={(e) => handleItemChange(item.id, 'availability', e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                        <option value="tersedia">Tersedia</option>
                        <option value="habis">Habis</option>
                      </select>
                    </div>
                    <div style={{ paddingTop: '1.25rem' }}>
                      <button type="button" onClick={() => handleRemoveItem(item.id)} className="action-icon-btn text-error">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={() => router.push(`/admin/rental/${id}`)}>Batal</button>
            <button type="submit" className="btn-primary">Simpan Perubahan</button>
          </div>
        </form>
      </div>
    </div>
  );
}
