'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Loader2, Upload, Plus, X } from 'lucide-react';
import { kawasanService } from '@/src/services/kawasanService';
import { Kawasan } from '@/src/types/kawasan';

export default function KawasanEdit() {
  const params = useParams();
  const id = typeof params?.id === 'string' ? params.id : '';
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<Kawasan | null>(null);
  const [facilityInput, setFacilityInput] = useState('');

  useEffect(() => {
    const fetchKawasan = async () => {
      try {
        if (!id) return;
        const data = await kawasanService.getById(id);
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => (prev ? { ...prev, [name]: value } : prev));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleAddFacility = () => {
    if (!formData) return;
    const trimmed = facilityInput.trim();
    const currentFacilities = Array.isArray(formData.facilities) ? formData.facilities : [];
    if (trimmed && !currentFacilities.includes(trimmed)) {
      setFormData((prev) =>
        prev ? { ...prev, facilities: [...currentFacilities, trimmed] } : prev
      );
      setFacilityInput('');
    }
  };

  const handleRemoveFacility = (facilityToRemove: string) => {
    if (!formData) return;
    const currentFacilities = Array.isArray(formData.facilities) ? formData.facilities : [];
    setFormData((prev) =>
      prev ? { ...prev, facilities: currentFacilities.filter((f) => f !== facilityToRemove) } : prev
    );
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

  const validateForm = () => {
    if (!formData) return false;
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
    if (!formData || !validateForm()) return;

    setIsSubmitting(true);
    try {
      if (imageFile) {
        const payload = new FormData();
        payload.append('name', formData.name.trim());
        payload.append('description', formData.description.trim());
        payload.append('capacity', formData.capacity.trim());
        payload.append('facilities', JSON.stringify(formData.facilities || []));
        payload.append('status', formData.status);
        payload.append('image', imageFile);
        await kawasanService.update(id, payload as any);
      } else {
        await kawasanService.update(id, {
          ...formData,
          name: formData.name.trim(),
          description: formData.description.trim(),
          capacity: formData.capacity.trim(),
        });
      }
      router.push(`/admin/kawasan/${id}`);
    } catch (error: any) {
      console.error('Error updating kawasan:', error);
      alert(error?.message || 'Gagal mengupdate kawasan.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 flex flex-col items-center justify-center gap-3 text-[#4a5c50]">
        <Loader2 className="animate-spin text-[#85BB45]" size={32} />
        <p className="text-sm font-medium">Memuat data kawasan...</p>
      </div>
    );
  }

  if (!formData) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.push(`/admin/kawasan/${id}`)}
          className="p-2 text-[#4a5c50] hover:text-[#1C2B20] hover:bg-white rounded-xl transition border border-[#d4e0d7]"
          title="Kembali"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#1C2B20]">Ubah Data Kawasan</h2>
          <p className="text-sm text-[#4a5c50]">Perbarui informasi area camping dan fasilitasnya.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#d4e0d7] p-6 sm:p-8 shadow-xs">
        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          <div className="space-y-4">
            <h3 className="text-base font-bold text-[#1C2B20] pb-2 border-b border-[#d4e0d7]">
              Informasi Area
            </h3>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#1C2B20]">Nomor Area</label>
              <input
                type="text"
                value={formData.number}
                disabled
                className="w-full px-4 py-2.5 rounded-xl border border-[#d4e0d7] bg-[#EEF5EA]/60 text-sm text-[#4a5c50] cursor-not-allowed"
              />
              <span className="text-[11px] text-[#8b9d91] block">
                Nomor area bersifat permanen (Area 01 - 13).
              </span>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#1C2B20]">Nama Area Camping *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 rounded-xl border text-sm text-[#1C2B20] focus:outline-none transition ${
                  errors.name
                    ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-100'
                    : 'border-[#d4e0d7] focus:border-[#85BB45]'
                }`}
              />
              {errors.name && <p className="text-xs text-red-500 font-medium">{errors.name}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#1C2B20]">Deskripsi *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className={`w-full px-4 py-2.5 rounded-xl border text-sm text-[#1C2B20] focus:outline-none resize-y transition ${
                  errors.description
                    ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-100'
                    : 'border-[#d4e0d7] focus:border-[#85BB45]'
                }`}
              />
              {errors.description && (
                <p className="text-xs text-red-500 font-medium">{errors.description}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#1C2B20]">Kapasitas Perkiraan *</label>
              <input
                type="text"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                placeholder="Contoh: 15-20 Tenda"
                className={`w-full px-4 py-2.5 rounded-xl border text-sm text-[#1C2B20] focus:outline-none transition ${
                  errors.capacity
                    ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-100'
                    : 'border-[#d4e0d7] focus:border-[#85BB45]'
                }`}
              />
              {errors.capacity && (
                <p className="text-xs text-red-500 font-medium">{errors.capacity}</p>
              )}
            </div>
          </div>

          {/* Fasilitas */}
          <div className="space-y-3 pt-2">
            <h3 className="text-base font-bold text-[#1C2B20] pb-2 border-b border-[#d4e0d7]">
              Fasilitas Terdekat
            </h3>
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
                placeholder="Tambah fasilitas (contoh: Sumber Air, Toilet)"
                className="flex-1 px-4 py-2 rounded-xl border border-[#d4e0d7] text-sm focus:outline-none focus:border-[#85BB45]"
              />
              <button
                type="button"
                onClick={handleAddFacility}
                className="px-4 py-2 rounded-xl bg-[#EEF5EA] hover:bg-[#85BB45] hover:text-white text-[#3F6900] text-xs font-semibold transition"
              >
                <Plus size={16} />
              </button>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {(Array.isArray(formData.facilities) ? formData.facilities : []).map((f) => (
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
              Foto Area
            </h3>
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
                  className="w-24 h-16 rounded-xl object-cover border border-[#d4e0d7]"
                />
              )}
            </div>
            {errors.image && <p className="text-xs text-red-500 font-medium">{errors.image}</p>}
          </div>

          <div className="pt-4 border-t border-[#d4e0d7] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => router.push(`/admin/kawasan/${id}`)}
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
              <span>Simpan Perubahan</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
