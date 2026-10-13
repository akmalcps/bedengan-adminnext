'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Trash2 } from 'lucide-react';
import { createRental } from '@/src/services/mock/rentalService';
import '@/src/styles/components.css';

export default function RentalCreate() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    whatsapp: '',
    address: '',
    openingTime: '08:00',
    closingTime: '17:00',
    status: 'active',
    image: '',
    items: []
  });

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
      await createRental(formData);
      router.push('/admin/rental');
    } catch (error) {
      console.error('Error creating rental:', error);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h2>Tambah Rental</h2>
          <p>Tambahkan penyedia rental perlengkapan camping baru.</p>
        </div>
      </div>

      <div className="form-container card">
        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <h3 className="form-section-title">Informasi Rental</h3>
            
            <div className="form-group">
              <label>Nama Rental *</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Contoh: Bedengan Camp Rental" />
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
                      <input type="text" value={item.name} onChange={(e) => handleItemChange(item.id, 'name', e.target.value)} required placeholder="Contoh: Tenda Dome 4P" style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--color-border)' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Harga *</label>
                      <input type="number" value={item.price} onChange={(e) => handleItemChange(item.id, 'price', e.target.value)} required placeholder="60000" style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--color-border)' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Satuan *</label>
                      <input type="text" value={item.unit} onChange={(e) => handleItemChange(item.id, 'unit', e.target.value)} required placeholder="malam/pcs/set" style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--color-border)' }} />
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
            <button type="button" className="btn-secondary" onClick={() => router.push('/admin/rental')}>Batal</button>
            <button type="submit" className="btn-primary">Simpan Rental</button>
          </div>
        </form>
      </div>
    </div>
  );
}
