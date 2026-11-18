'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Plus, Trash2, ArrowLeft, Loader2, Upload, Camera, X } from 'lucide-react';
import { rentalService } from '@/src/services/rentalService';
import { Rental, RentalItemSub } from '@/src/types/rental';
import { sanitizePhoneInput, validatePhoneNumber, getImageUrl } from '@/src/utils/format';

export default function RentalEdit() {
  const params = useParams();
  const id = typeof params?.id === 'string' ? params.id : '';
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [itemFiles, setItemFiles] = useState<Record<string, File>>({});
  const [itemPreviews, setItemPreviews] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
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
    if (name === 'whatsapp') {
      const sanitized = sanitizePhoneInput(value);
      setFormData((prev) => (prev ? { ...prev, [name]: sanitized } : prev));
    } else {
      setFormData((prev) => (prev ? { ...prev, [name]: value } : prev));
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
            price: 0,
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
    setItemFiles((prev) => {
      const next = { ...prev };
      delete next[itemId];
      return next;
    });
    setItemPreviews((prev) => {
      const next = { ...prev };
      delete next[itemId];
      return next;
    });
  };

  const handleItemImageChange = (itemId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        alert('Format foto item harus berupa JPG, PNG, atau WEBP.');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert('Ukuran foto item maksimal adalah 5MB.');
        return;
      }

      setItemFiles((prev) => ({ ...prev, [itemId]: file }));
      const objectUrl = URL.createObjectURL(file);
      setItemPreviews((prev) => ({ ...prev, [itemId]: objectUrl }));
    }
  };

  const handleRemoveItemImage = (itemId: string) => {
    setItemFiles((prev) => {
      const next = { ...prev };
      delete next[itemId];
      return next;
    });
    setItemPreviews((prev) => {
      const next = { ...prev };
      delete next[itemId];
      return next;
    });
    setFormData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        items: (prev.items || []).map((it) =>
          it.id === itemId ? { ...it, image: undefined, image_url: null } : it
        ),
      };
    });
  };

  const validateForm = () => {
    if (!formData) return false;
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      newErrors.name = 'Nama rental wajib diisi.';
    }

    if (!formData.description?.trim()) {
      newErrors.description = 'Deskripsi wajib diisi.';
    }

    if (!formData.whatsapp?.trim()) {
      newErrors.whatsapp = 'Nomor WhatsApp wajib diisi.';
    } else if (!validatePhoneNumber(formData.whatsapp.trim())) {
      newErrors.whatsapp = 'Format nomor WhatsApp tidak valid (contoh: 08123456789, 10-14 digit).';
    }

    if (!formData.address?.trim()) {
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

    (formData.items || []).forEach((item, index) => {
      if (!item.name?.trim()) {
        newErrors[`item_${index}_name`] = `Nama item ke-${index + 1} tidak boleh kosong.`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData || !validateForm()) return;

    setIsSubmitting(true);
    try {
      const payload = new FormData();
      payload.append('name', formData.name.trim());
      payload.append('description', formData.description.trim());
      payload.append('whatsapp', formData.whatsapp.trim());
      payload.append('address', formData.address.trim());
      payload.append('openingTime', formData.openingTime);
      payload.append('closingTime', formData.closingTime);
      payload.append('status', formData.status);

      if (imageFile) {
        payload.append('image', imageFile);
      }

      const filesToUpload: File[] = [];
      const sanitizedItems = (formData.items || []).map((it) => {
        const itemFile = itemFiles[it.id];
        let fileIndex: number | null = null;
        if (itemFile) {
          fileIndex = filesToUpload.length;
          filesToUpload.push(itemFile);
        }

        return {
          name: it.name.trim(),
          image_url: it.image_url || it.image || null,
          file_index: fileIndex,
          price: it.price !== undefined && it.price !== '' ? it.price : 0,
          unit: it.unit || 'hari',
          availability: it.availability || 'tersedia',
        };
      });

      payload.append('items', JSON.stringify(sanitizedItems));

      filesToUpload.forEach((file) => {
        payload.append('item_images', file);
      });

      await rentalService.update(id, payload as any);
      router.push('/admin/rental');
    } catch (error: any) {
      console.error('Error updating rental:', error);
      alert(error?.message || 'Gagal mengupdate rental.');
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

            {(formData.items || []).length === 0 ? (
              <p className="text-xs text-[#8b9d91] italic py-2">Belum ada item ditambahkan.</p>
            ) : (
              <div className="space-y-2.5">
                {formData.items?.map((item, index) => {
                  const previewUrl =
                    itemPreviews[item.id] ||
                    (item.image_url ? getImageUrl(item.image_url) : item.image ? getImageUrl(item.image) : '');
                  return (
                    <div
                      key={item.id}
                      className="p-3 bg-[#EEF5EA]/50 rounded-xl border border-[#d4e0d7]/80 space-y-1.5"
                    >
                      <div className="flex items-center gap-3">
                        {/* Thumbnail Foto Item Mini */}
                        <div className="relative shrink-0">
                          {previewUrl ? (
                            <div className="relative group w-11 h-11 rounded-lg overflow-hidden border border-[#d4e0d7] bg-white">
                              <img
                                src={previewUrl}
                                alt={item.name || `Item ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                              <button
                                type="button"
                                onClick={() => handleRemoveItemImage(item.id)}
                                className="absolute inset-0 bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                                title="Hapus foto item"
                              >
                                <X size={14} />
                              </button>
                            </div>
                          ) : (
                            <label className="w-11 h-11 rounded-lg border border-dashed border-[#85BB45] bg-white hover:bg-[#EEF5EA] flex flex-col items-center justify-center text-[#85BB45] cursor-pointer transition">
                              <Camera size={16} />
                              <span className="text-[8px] font-semibold mt-0.5">Foto</span>
                              <input
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                onChange={(e) => handleItemImageChange(item.id, e)}
                                className="hidden"
                              />
                            </label>
                          )}
                        </div>

                        <div className="flex-1">
                          <input
                            type="text"
                            value={item.name}
                            onChange={(e) => handleItemChange(item.id, 'name', e.target.value)}
                            placeholder={`Nama item ke-${index + 1} (contoh: Tenda Dome 4P, Matras, Kompor)`}
                            className={`w-full px-3.5 py-2 bg-white border rounded-lg text-xs text-[#1C2B20] placeholder-[#8b9d91] focus:outline-none focus:border-[#85BB45] transition ${
                              errors[`item_${index}_name`]
                                ? 'border-red-500 focus:border-red-500 ring-1 ring-red-500/20'
                                : 'border-[#d4e0d7]'
                            }`}
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(item.id)}
                          className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition shrink-0"
                          title="Hapus Item"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      {errors[`item_${index}_name`] && (
                        <p className="text-[11px] text-red-500 font-medium pl-1">
                          {errors[`item_${index}_name`]}
                        </p>
                      )}
                    </div>
                  );
                })}
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
