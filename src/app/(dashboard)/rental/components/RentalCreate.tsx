'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Trash2, ArrowLeft, Loader2, Upload } from 'lucide-react';
import { rentalService } from '@/src/services/rentalService';
import { RentalItemSub } from '@/src/types/rental';
import { sanitizePhoneInput, validatePhoneNumber } from '@/src/utils/format';

export default function RentalCreate() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    whatsapp: '',
    address: '',
    openingTime: '08:00',
    closingTime: '17:00',
    status: 'active',
    image: '',
    items: [] as RentalItemSub[],
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === 'whatsapp') {
      const sanitized = sanitizePhoneInput(value);
      setFormData((prev) => ({ ...prev, [name]: sanitized }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        setErrors((prev) => ({
          ...prev,
          image: 'Format foto harus berupa JPG, PNG, atau WEBP.',
        }));
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          image: 'Ukuran foto maksimal adalah 5MB.',
        }));
        return;
      }

      setErrors((prev) => {
        const next = { ...prev };
        delete next.image;
        return next;
      });
      setImageFile(file);
      const objectUrl = URL.createObjectURL(file);
      setFormData((prev) => ({ ...prev, image: objectUrl }));
    }
  };

  const handleAddItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          id: Date.now().toString(),
          name: '',
          price: '',
          unit: 'hari',
          availability: 'tersedia',
        },
      ],
    }));
  };

  const handleItemChange = (
    id: string,
    field: keyof RentalItemSub,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
  };

  const handleRemoveItem = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== id),
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nama rental wajib diisi.';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Deskripsi wajib diisi.';
    }

    if (!formData.whatsapp.trim()) {
      newErrors.whatsapp = 'Nomor WhatsApp wajib diisi.';
    } else if (!validatePhoneNumber(formData.whatsapp.trim())) {
      newErrors.whatsapp = 'Format nomor WhatsApp tidak valid (contoh: 08123456789, 10-14 digit).';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Alamat lokasi wajib diisi.';
    }

    if (!formData.openingTime) {
      newErrors.openingTime = 'Jam buka wajib diisi.';
    }
    if (!formData.closingTime) {
      newErrors.closingTime = 'Jam tutup wajib diisi.';
    }
    if (formData.openingTime && formData.closingTime && formData.closingTime <= formData.openingTime) {
      newErrors.closingTime = 'Jam tutup harus lebih besar dari jam buka.';
    }

    formData.items.forEach((item, index) => {
      if (!item.name.trim()) {
        newErrors[`item_${index}_name`] = `Nama item ke-${index + 1} tidak boleh kosong.`;
      }
      const priceNum = Number(item.price);
      if (isNaN(priceNum) || priceNum <= 0) {
        newErrors[`item_${index}_price`] = `Harga item ke-${index + 1} harus lebih besar dari 0.`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      if (imageFile) {
        const payload = new FormData();
        payload.append('name', formData.name.trim());
        payload.append('description', formData.description.trim());
        payload.append('whatsapp', formData.whatsapp.trim());
        payload.append('address', formData.address.trim());
        payload.append('openingTime', formData.openingTime);
        payload.append('closingTime', formData.closingTime);
        payload.append('status', formData.status);
        payload.append('items', JSON.stringify(formData.items));
        payload.append('image', imageFile);
        await rentalService.create(payload as any);
      } else {
        await rentalService.create({
          ...formData,
          name: formData.name.trim(),
          description: formData.description.trim(),
          whatsapp: formData.whatsapp.trim(),
          address: formData.address.trim(),
        });
      }
      router.push('/admin/rental');
    } catch (error: any) {
      console.error('Error creating rental:', error);
      alert(error?.message || 'Gagal menambahkan rental.');
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
          <h2 className="text-xl sm:text-2xl font-bold text-[#1C2B20]">Tambah Rental</h2>
          <p className="text-sm text-[#4a5c50]">Tambahkan penyedia rental dan inventaris baru.</p>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-2xl border border-[#d4e0d7] p-6 sm:p-8 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-8" noValidate>
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
                placeholder="Contoh: Bedengan Camp Rental"
                className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none transition ${
                  errors.name
                    ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-100'
                    : 'border-[#d4e0d7] focus:border-[#85BB45] focus:ring-2 focus:ring-[#85BB45]/15'
                }`}
              />
              {errors.name && <p className="text-xs text-red-500 font-medium">{errors.name}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-[#1C2B20]">Deskripsi *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                placeholder="Deskripsi layanan atau fasilitas penyewaan..."
                className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none transition resize-y ${
                  errors.description
                    ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-100'
                    : 'border-[#d4e0d7] focus:border-[#85BB45] focus:ring-2 focus:ring-[#85BB45]/15'
                }`}
              />
              {errors.description && (
                <p className="text-xs text-red-500 font-medium">{errors.description}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-[#1C2B20]">Nomor WhatsApp *</label>
                <input
                  type="tel"
                  name="whatsapp"
                  value={formData.whatsapp}
                  onChange={handleChange}
                  placeholder="08123456789"
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none transition ${
                    errors.whatsapp
                      ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-100'
                      : 'border-[#d4e0d7] focus:border-[#85BB45] focus:ring-2 focus:ring-[#85BB45]/15'
                  }`}
                />
                {errors.whatsapp && (
                  <p className="text-xs text-red-500 font-medium">{errors.whatsapp}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-[#1C2B20]">Alamat Lokasi *</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Contoh: Pos Penjagaan Bedengan"
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none transition ${
                    errors.address
                      ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-100'
                      : 'border-[#d4e0d7] focus:border-[#85BB45] focus:ring-2 focus:ring-[#85BB45]/15'
                  }`}
                />
                {errors.address && (
                  <p className="text-xs text-red-500 font-medium">{errors.address}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-[#1C2B20]">Jam Buka *</label>
                <input
                  type="time"
                  name="openingTime"
                  value={formData.openingTime}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none transition ${
                    errors.openingTime
                      ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-100'
                      : 'border-[#d4e0d7] focus:border-[#85BB45] focus:ring-2 focus:ring-[#85BB45]/15'
                  }`}
                />
                {errors.openingTime && (
                  <p className="text-xs text-red-500 font-medium">{errors.openingTime}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-[#1C2B20]">Jam Tutup *</label>
                <input
                  type="time"
                  name="closingTime"
                  value={formData.closingTime}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none transition ${
                    errors.closingTime
                      ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-100'
                      : 'border-[#d4e0d7] focus:border-[#85BB45] focus:ring-2 focus:ring-[#85BB45]/15'
                  }`}
                />
                {errors.closingTime && (
                  <p className="text-xs text-red-500 font-medium">{errors.closingTime}</p>
                )}
              </div>
            </div>

            {/* Upload Foto */}
            <div className="space-y-2 pt-2">
              <label className="text-sm font-semibold text-[#1C2B20]">Foto Banner Rental</label>
              <div className="flex items-center gap-4">
                <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-dashed border-[#85BB45] bg-[#EEF5EA]/40 text-[#3F6900] text-xs font-semibold hover:bg-[#EEF5EA] transition">
                  <Upload size={16} />
                  <span>Pilih Foto</span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
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
              {errors.image && <p className="text-xs text-red-500 font-medium">{errors.image}</p>}
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

            {formData.items.length === 0 ? (
              <p className="text-xs text-[#8b9d91] italic py-2">
                Belum ada item ditambahkan. Klik &quot;Tambah Item&quot; untuk menambahkan peralatan
                sewa.
              </p>
            ) : (
              <div className="space-y-3">
                {formData.items.map((item, index) => (
                  <div
                    key={item.id}
                    className="p-3.5 bg-[#EEF5EA]/50 rounded-xl border border-[#d4e0d7]/80 space-y-2"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                      <div className="sm:col-span-4 space-y-1">
                        <label className="text-[11px] font-semibold text-[#8b9d91]">Nama Item</label>
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) => handleItemChange(item.id, 'name', e.target.value)}
                          placeholder="Contoh: Tenda 4P"
                          className={`w-full px-3 py-1.5 bg-white border rounded-lg text-xs ${
                            errors[`item_${index}_name`] ? 'border-red-500' : 'border-[#d4e0d7]'
                          }`}
                        />
                      </div>
                      <div className="sm:col-span-3 space-y-1">
                        <label className="text-[11px] font-semibold text-[#8b9d91]">Harga (Rp)</label>
                        <input
                          type="number"
                          value={item.price}
                          onChange={(e) => handleItemChange(item.id, 'price', e.target.value)}
                          placeholder="50000"
                          className={`w-full px-3 py-1.5 bg-white border rounded-lg text-xs ${
                            errors[`item_${index}_price`] ? 'border-red-500' : 'border-[#d4e0d7]'
                          }`}
                        />
                      </div>
                      <div className="sm:col-span-2 space-y-1">
                        <label className="text-[11px] font-semibold text-[#8b9d91]">Satuan</label>
                        <input
                          type="text"
                          value={item.unit}
                          onChange={(e) => handleItemChange(item.id, 'unit', e.target.value)}
                          placeholder="malam/set"
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
                    {(errors[`item_${index}_name`] || errors[`item_${index}_price`]) && (
                      <div className="text-[11px] text-red-500 font-medium">
                        {errors[`item_${index}_name`]} {errors[`item_${index}_price`]}
                      </div>
                    )}
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
              <span>Simpan Rental</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
