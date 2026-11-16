'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, Upload, Plus, X } from 'lucide-react';
import { kawasanService } from '@/src/services/kawasanService';

export default function KawasanCreate() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [facilityInput, setFacilityInput] = useState('');

  const [formData, setFormData] = useState({
    number: '',
    name: '',
    capacity: 'Kapasitas: Standar',
    description: '',
    status: 'active',
    facilities: ['Dekat Aliran Sungai', 'Tanah Datar Rumput', '100m ke Toilet Umum'] as string[],
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleAddFacility = () => {
    const trimmed = facilityInput.trim();
    if (trimmed && !formData.facilities.includes(trimmed)) {
      setFormData((prev) => ({
        ...prev,
        facilities: [...prev.facilities, trimmed],
      }));
      setFacilityInput('');
    }
  };

  const handleRemoveFacility = (facilityToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      facilities: prev.facilities.filter((f) => f !== facilityToRemove),
    }));
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
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      newErrors.name = 'Nama area camping wajib diisi.';
    }

    if (!formData.description?.trim()) {
      newErrors.description = 'Deskripsi wajib diisi.';
    }

    if (!formData.capacity?.trim()) {
      newErrors.capacity = 'Kapasitas area wajib diisi.';
    }

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
        payload.append('code', formData.number.trim());
        payload.append('name', formData.name.trim());
        payload.append('description', formData.description.trim());
        payload.append('capacity_badge', formData.capacity.trim());
        payload.append('capacity', formData.capacity.trim());
        payload.append('facilities', JSON.stringify(formData.facilities || []));
        payload.append('is_active', formData.status === 'active' ? '1' : '0');
        payload.append('status', formData.status);
        payload.append('image', imageFile);

        if (formData.facilities[0]) payload.append('nearby_facility', formData.facilities[0]);
        if (formData.facilities[1]) payload.append('terrain_feature', formData.facilities[1]);
        if (formData.facilities[2]) payload.append('toilet_distance', formData.facilities[2]);

        await kawasanService.create(payload as any);
      } else {
        await kawasanService.create({
          number: formData.number.trim(),
          name: formData.name.trim(),
          description: formData.description.trim(),
          capacity: formData.capacity.trim(),
          facilities: formData.facilities,
          status: formData.status,
          image: 'https://images.unsplash.com/photo-1537565266751-34feee3794b6?w=800',
        });
      }
      router.push('/admin/kawasan');
    } catch (error: any) {
      console.error('Error creating kawasan:', error);
      alert(error?.message || 'Gagal menambahkan kawasan baru.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <button
          onClick={() => router.push('/admin/kawasan')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#4a5c50] hover:text-[#1C2B20] mb-2"
        >
          <ArrowLeft size={16} /> Kembali ke Daftar
        </button>
        <h2 className="text-xl sm:text-2xl font-bold text-[#1C2B20]">Tambah Kawasan Baru</h2>
        <p className="text-sm text-[#4a5c50]">
          Tambahkan kapling atau area camping ground baru di Bedengan.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-[#d4e0d7] p-6 sm:p-8 shadow-xs">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informasi Dasar */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-[#1C2B20] pb-2 border-b border-[#d4e0d7]">
              Informasi Kawasan
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#1C2B20]">Kode Area (Opsional)</label>
                <input
                  type="text"
                  name="number"
                  value={formData.number}
                  onChange={handleChange}
                  placeholder="Contoh: A-01, B-02"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#d4e0d7] text-sm focus:outline-hidden focus:border-[#85BB45]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#1C2B20]">
                  Nama Area Camping <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Contoh: Area Pine Riverside A"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-hidden ${
                    errors.name ? 'border-red-500' : 'border-[#d4e0d7] focus:border-[#85BB45]'
                  }`}
                />
                {errors.name && <p className="text-xs text-red-500 font-medium">{errors.name}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#1C2B20]">
                  Kapasitas Area <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleChange}
                  placeholder="Contoh: 15-20 Tenda (Medium)"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-hidden ${
                    errors.capacity ? 'border-red-500' : 'border-[#d4e0d7] focus:border-[#85BB45]'
                  }`}
                />
                {errors.capacity && (
                  <p className="text-xs text-red-500 font-medium">{errors.capacity}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#1C2B20]">Status Operasional</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#d4e0d7] text-sm focus:outline-hidden focus:border-[#85BB45] bg-white"
                >
                  <option value="active">Aktif (Tersedia untuk Pengunjung)</option>
                  <option value="inactive">Nonaktif (Pemeliharaan / Tertutup)</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#1C2B20]">
                Deskripsi Area <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleChange}
                placeholder="Jelaskan karakteristik area camping, posisi terhadap sungai/pohon pinus, dll."
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-hidden ${
                  errors.description
                    ? 'border-red-500'
                    : 'border-[#d4e0d7] focus:border-[#85BB45]'
                }`}
              />
              {errors.description && (
                <p className="text-xs text-red-500 font-medium">{errors.description}</p>
              )}
            </div>
          </div>

          {/* Fasilitas & Karakteristik */}
          <div className="space-y-3 pt-2">
            <h3 className="text-base font-bold text-[#1C2B20] pb-2 border-b border-[#d4e0d7]">
              Fasilitas & Karakteristik Terdekat
            </h3>
            <p className="text-xs text-[#8b9d91]">
              Tambahkan poin-poin fasilitas terdekat (misal jarak toilet, sumber air, kontur tanah).
            </p>

            <div className="flex gap-2">
              <input
                type="text"
                value={facilityInput}
                onChange={(e) => setFacilityInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddFacility();
                  }
                }}
                placeholder="Ketik fasilitas dan tekan Enter atau tombol Tambah"
                className="flex-1 px-3.5 py-2.5 rounded-xl border border-[#d4e0d7] text-sm focus:outline-hidden focus:border-[#85BB45]"
              />
              <button
                type="button"
                onClick={handleAddFacility}
                className="px-4 py-2.5 rounded-xl bg-[#85BB45] hover:bg-[#74A934] text-white text-xs font-semibold transition flex items-center gap-1"
              >
                <Plus size={16} />
                <span>Tambah</span>
              </button>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {formData.facilities.map((f) => (
                <span
                  key={f}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#85BB45]/15 text-[#3F6900] text-xs font-semibold"
                >
                  {f}
                  <button
                    type="button"
                    onClick={() => handleRemoveFacility(f)}
                    className="hover:text-red-600 transition"
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Foto */}
          <div className="space-y-3 pt-2">
            <h3 className="text-base font-bold text-[#1C2B20] pb-2 border-b border-[#d4e0d7]">
              Foto Area Camping
            </h3>
            <div className="flex items-center gap-4">
              <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-dashed border-[#85BB45] bg-[#EEF5EA]/40 text-[#3F6900] text-xs font-semibold hover:bg-[#EEF5EA] transition">
                <Upload size={16} />
                <span>Unggah Foto</span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-24 h-16 rounded-xl object-cover border border-[#d4e0d7]"
                />
              )}
            </div>
            {errors.image && <p className="text-xs text-red-500 font-medium">{errors.image}</p>}
          </div>

          <div className="pt-4 border-t border-[#d4e0d7] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => router.push('/admin/kawasan')}
              className="px-5 py-2.5 rounded-full border border-[#d4e0d7] text-sm font-semibold text-[#1C2B20] hover:bg-[#EEF5EA] transition"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#85BB45] hover:bg-[#74A934] text-white text-sm font-semibold shadow-xs transition disabled:opacity-70"
            >
              {isSubmitting && <Loader2 size={16} className="animate-spin" />}
              <span>Simpan Kawasan</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

