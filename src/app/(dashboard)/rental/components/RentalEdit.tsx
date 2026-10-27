'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Plus, Trash2, ArrowLeft, Loader2, Upload } from 'lucide-react';
import { rentalService } from '@/src/services/rentalService';
import { Rental, RentalItemSub } from '@/src/types/rental';

export default function RentalEdit() {
  const params = useParams();
  const id = typeof params?.id === 'string' ? params.id : '';
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Rental | null>(null);

  useEffect(() => {
    const fetchRental = async () => {
      try {
        if (!id) return;
        const data = await rentalService.getById(id);
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

  if (loading) {
    return (
      <div className="p-12 flex flex-col items-center justify-center gap-3 text-[#4a5c50]">
        <Loader2 className="animate-spin text-[#85BB45]" size={32} />
        <p className="text-sm font-medium">Memuat data rental...</p>
      </div>
    );
  }

  if (!formData) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => (prev ? { ...prev, [name]: value } : prev));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setFormData((prev) => (prev ? { ...prev, image: objectUrl } : prev));
    }
  };

  const handleAddItem = () => {
    setFormData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        items: [
          ...(prev.items || []),
          {
            id: Date.now().toString(),
            name: '',
            price: '',
            unit: 'hari',
            availability: 'tersedia',
          },
        ],
      };
    });
  };

  const handleItemChange = (
    itemId: string,
    field: keyof RentalItemSub,
    value: string | number
  ) => {
    setFormData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        items: (prev.items || []).map((item) =>
          item.id === itemId ? { ...item, [field]: value } : item
        ),
      };
    });
  };

  const handleRemoveItem = (itemId: string) => {
    setFormData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        items: (prev.items || []).filter((item) => item.id !== itemId),
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;
    setIsSubmitting(true);
    try {
      await rentalService.update(id, formData);
      router.push('/admin/rental');
    } catch (error) {
      console.error('Error updating rental:', error);
      alert('Gagal mengupdate rental.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.push('/admin/rental')}
          className="p-2 text-[#4a5c50] hover:text-[#1C2B20] hover:bg-white rounded-xl transition border border-[#d4e0d7]"
          title="Kembali"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#1C2B20]">Ubah Data Rental</h2>
          <p className="text-sm text-[#4a5c50]">Perbarui informasi rental dan inventarisnya.</p>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-2xl border border-[#d4e0d7] p-6 sm:p-8 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section 1: Info Rental */}
          <div className="space-y-5">
            <h3 className="text-base font-bold text-[#1C2B20] pb-2 border-b border-[#d4e0d7]">
              Informasi Umum
            </h3>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-[#1C2B20]">Nama Rental *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-[#d4e0d7] focus:outline-none focus:border-[#85BB45] focus:ring-2 focus:ring-[#85BB45]/15 text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-[#1C2B20]">Deskripsi *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={3}
                className="w-full px-4 py-2.5 rounded-xl border border-[#d4e0d7] focus:outline-none focus:border-[#85BB45] focus:ring-2 focus:ring-[#85BB45]/15 text-sm resize-y"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-[#1C2B20]">Nomor WhatsApp *</label>
                <input
                  type="tel"
                  name="whatsapp"
                  value={formData.whatsapp}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-[#d4e0d7] focus:outline-none focus:border-[#85BB45] focus:ring-2 focus:ring-[#85BB45]/15 text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-[#1C2B20]">Alamat Lokasi *</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-[#d4e0d7] focus:outline-none focus:border-[#85BB45] focus:ring-2 focus:ring-[#85BB45]/15 text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-[#1C2B20]">Jam Buka *</label>
                <input
                  type="time"
                  name="openingTime"
                  value={formData.openingTime}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-[#d4e0d7] focus:outline-none focus:border-[#85BB45] focus:ring-2 focus:ring-[#85BB45]/15 text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-[#1C2B20]">Jam Tutup *</label>
                <input
                  type="time"
                  name="closingTime"
                  value={formData.closingTime}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-[#d4e0d7] focus:outline-none focus:border-[#85BB45] focus:ring-2 focus:ring-[#85BB45]/15 text-sm"
                />
              </div>
            </div>

            {/* Status selection */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-[#1C2B20]">Status Operasional</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-[#d4e0d7] bg-white text-sm focus:outline-none focus:border-[#85BB45]"
              >
                <option value="active">Aktif (Bisa disewa)</option>
                <option value="inactive">Nonaktif</option>
              </select>
            </div>

            {/* Upload Foto */}
            <div className="space-y-2 pt-2">
              <label className="text-sm font-semibold text-[#1C2B20]">Foto Banner Rental</label>
              <div className="flex items-center gap-4">
                <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-dashed border-[#85BB45] bg-[#EEF5EA]/40 text-[#3F6900] text-xs font-semibold hover:bg-[#EEF5EA] transition">
                  <Upload size={16} />
                  <span>Ganti Foto</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
                {formData.image && (
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="w-20 h-14 rounded-lg object-cover border border-[#d4e0d7]"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Section 2: Item Rental */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between pb-2 border-b border-[#d4e0d7]">
              <h3 className="text-base font-bold text-[#1C2B20]">Daftar Item / Peralatan</h3>
              <button
                type="button"
                onClick={handleAddItem}
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-[#EEF5EA] text-[#3F6900] hover:bg-[#85BB45] hover:text-white transition"
              >
                <Plus size={14} /> Tambah Item
              </button>
            </div>

            {(formData.items || []).length === 0 ? (
              <p className="text-xs text-[#8b9d91] italic py-2">Belum ada item ditambahkan.</p>
            ) : (
              <div className="space-y-3">
                {formData.items?.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 bg-[#EEF5EA]/50 rounded-xl border border-[#d4e0d7]/80 grid grid-cols-1 sm:grid-cols-12 gap-3 items-end"
                  >
                    <div className="sm:col-span-4 space-y-1">
                      <label className="text-[11px] font-semibold text-[#8b9d91]">Nama Item</label>
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => handleItemChange(item.id, 'name', e.target.value)}
                        required
                        className="w-full px-3 py-1.5 bg-white border border-[#d4e0d7] rounded-lg text-xs"
                      />
                    </div>
                    <div className="sm:col-span-3 space-y-1">
                      <label className="text-[11px] font-semibold text-[#8b9d91]">Harga (Rp)</label>
                      <input
                        type="number"
                        value={item.price}
                        onChange={(e) => handleItemChange(item.id, 'price', e.target.value)}
                        required
                        className="w-full px-3 py-1.5 bg-white border border-[#d4e0d7] rounded-lg text-xs"
                      />
                    </div>
                    <div className="sm:col-span-2 space-y-1">
                      <label className="text-[11px] font-semibold text-[#8b9d91]">Satuan</label>
                      <input
                        type="text"
                        value={item.unit}
                        onChange={(e) => handleItemChange(item.id, 'unit', e.target.value)}
                        required
                        className="w-full px-3 py-1.5 bg-white border border-[#d4e0d7] rounded-lg text-xs"
                      />
                    </div>
                    <div className="sm:col-span-2 space-y-1">
                      <label className="text-[11px] font-semibold text-[#8b9d91]">Status</label>
                      <select
                        value={item.availability}
                        onChange={(e) =>
                          handleItemChange(item.id, 'availability', e.target.value)
                        }
                        className="w-full px-3 py-1.5 bg-white border border-[#d4e0d7] rounded-lg text-xs"
                      >
                        <option value="tersedia">Tersedia</option>
                        <option value="habis">Habis</option>
                      </select>
                    </div>
                    <div className="sm:col-span-1 flex justify-end pb-0.5">
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(item.id)}
                        className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition"
                        title="Hapus Item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-[#d4e0d7] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => router.push('/admin/rental')}
              className="px-5 py-2.5 rounded-full border border-[#d4e0d7] text-sm font-semibold text-[#1C2B20] hover:bg-[#EEF5EA] transition"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#85BB45] hover:bg-[#74A934] text-white text-sm font-semibold shadow-sm transition disabled:opacity-70"
            >
              {isSubmitting && <Loader2 size={16} className="animate-spin" />}
              <span>Simpan Perubahan</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
