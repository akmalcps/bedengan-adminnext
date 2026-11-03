'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Loader2, Upload, Plus, X } from 'lucide-react';
import { warungService } from '@/src/services/warungService';
import { Warung } from '@/src/types/warung';
import { sanitizePhoneInput, validatePhoneNumber, formatOperatingHours } from '@/src/utils/format';

export default function WarungEdit() {
  const params = useParams();
  const id = typeof params?.id === 'string' ? params.id : '';
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Warung | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    const fetchWarung = async () => {
      try {
        if (!id) return;
        const data = await warungService.getById(id);
        if (data) {
          setFormData(data);
          setImagePreview(data.image || '');
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    let finalValue = value;

    if (name === 'whatsapp') {
      finalValue = sanitizePhoneInput(value);
    }

    setFormData((prev) => (prev ? { ...prev, [name]: finalValue } : prev));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleAddTag = () => {
    if (!formData) return;
    const trimmed = tagInput.trim();
    if (trimmed && !formData.tags.includes(trimmed)) {
      setFormData((prev) => (prev ? { ...prev, tags: [...prev.tags, trimmed] } : prev));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    if (!formData) return;
    setFormData((prev) =>
      prev ? { ...prev, tags: prev.tags.filter((t) => t !== tagToRemove) } : prev
    );
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        image: 'Format file tidak didukung! Hanya .jpg, .jpeg, .png, atau .webp yang diperbolehkan.',
      }));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        image: 'Ukuran file terlalu besar! Maksimal 5MB.',
      }));
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    if (errors.image) {
      setErrors((prev) => ({ ...prev, image: '' }));
    }
  };

  const validate = (): boolean => {
    if (!formData) return false;
    const errs: Record<string, string> = {};

    if (!formData.name.trim()) {
      errs.name = 'Nama warung wajib diisi!';
    }
    if (!formData.description.trim()) {
      errs.description = 'Deskripsi warung wajib diisi!';
    }
    if (!formData.whatsapp.trim()) {
      errs.whatsapp = 'Nomor WhatsApp wajib diisi!';
    } else if (!validatePhoneNumber(formData.whatsapp)) {
      errs.whatsapp = 'Format nomor WhatsApp tidak valid (contoh: 081234567890)!';
    }
    if (!formData.address.trim()) {
      errs.address = 'Alamat lokasi warung wajib diisi!';
    }

    const [openH, openM] = formData.openingTime.split(':').map(Number);
    const [closeH, closeM] = formData.closingTime.split(':').map(Number);
    const openMinutes = openH * 60 + openM;
    const closeMinutes = closeH * 60 + closeM;

    if (closeMinutes <= openMinutes) {
      errs.closingTime = 'Jam tutup harus lebih besar daripada jam buka!';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const dataPayload = new FormData();
      dataPayload.append('category', 'warung');
      dataPayload.append('name', formData.name.trim());
      dataPayload.append('description', formData.description.trim());
      dataPayload.append('contact_phone', formData.whatsapp.trim());
      dataPayload.append('location_note', formData.address.trim());
      dataPayload.append(
        'operating_hours',
        formatOperatingHours(formData.openingTime, formData.closingTime)
      );
      dataPayload.append('status', formData.status === 'active' ? 'approved' : 'pending');
      dataPayload.append('tags', formData.tags.join(', '));

      if (imageFile) {
        dataPayload.append('image', imageFile);
      } else if (formData.image) {
        dataPayload.append('image_url', formData.image);
      }

      await warungService.update(id, dataPayload);
      router.push(`/admin/warung/${id}`);
    } catch (error: any) {
      console.error('Error updating warung:', error);
      setErrors((prev) => ({
        ...prev,
        submit: error?.message || 'Gagal memperbarui data warung.',
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 flex flex-col items-center justify-center gap-3 text-[#4a5c50]">
        <Loader2 className="animate-spin text-[#85BB45]" size={32} />
        <p className="text-sm font-medium">Memuat data warung...</p>
      </div>
    );
  }

  if (!formData) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.push(`/admin/warung/${id}`)}
          className="p-2 text-[#4a5c50] hover:text-[#1C2B20] hover:bg-white rounded-xl transition border border-[#d4e0d7]"
          title="Kembali"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#1C2B20]">Ubah Data Warung</h2>
          <p className="text-sm text-[#4a5c50]">Perbarui informasi menu, jam operasional, dan lokasi.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#d4e0d7] p-6 sm:p-8 shadow-xs">
        {errors.submit && (
          <div className="bg-[#FDEEEA] border border-[#E74C3C]/30 text-[#E74C3C] px-4 py-3 rounded-xl text-xs sm:text-sm font-medium mb-5">
            {errors.submit}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-base font-bold text-[#1C2B20] pb-2 border-b border-[#d4e0d7]">
              Informasi Warung
            </h3>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#1C2B20]">Nama Warung *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 rounded-xl border text-sm text-[#1C2B20] focus:outline-none ${
                  errors.name ? 'border-red-500 focus:border-red-500' : 'border-[#d4e0d7] focus:border-[#85BB45]'
                }`}
              />
              {errors.name && <p className="text-red-500 text-xs font-medium">{errors.name}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#1C2B20]">Deskripsi *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className={`w-full px-4 py-2.5 rounded-xl border text-sm text-[#1C2B20] focus:outline-none resize-y ${
                  errors.description ? 'border-red-500 focus:border-red-500' : 'border-[#d4e0d7] focus:border-[#85BB45]'
                }`}
              />
              {errors.description && (
                <p className="text-red-500 text-xs font-medium">{errors.description}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#1C2B20]">Nomor WhatsApp *</label>
                <input
                  type="tel"
                  name="whatsapp"
                  value={formData.whatsapp}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm text-[#1C2B20] focus:outline-none ${
                    errors.whatsapp ? 'border-red-500 focus:border-red-500' : 'border-[#d4e0d7] focus:border-[#85BB45]'
                  }`}
                />
                {errors.whatsapp && (
                  <p className="text-red-500 text-xs font-medium">{errors.whatsapp}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#1C2B20]">Alamat Lokasi *</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm text-[#1C2B20] focus:outline-none ${
                    errors.address ? 'border-red-500 focus:border-red-500' : 'border-[#d4e0d7] focus:border-[#85BB45]'
                  }`}
                />
                {errors.address && (
                  <p className="text-red-500 text-xs font-medium">{errors.address}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#1C2B20]">Jam Buka *</label>
                <input
                  type="time"
                  name="openingTime"
                  value={formData.openingTime}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#d4e0d7] text-sm text-[#1C2B20] focus:outline-none focus:border-[#85BB45]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#1C2B20]">Jam Tutup *</label>
                <input
                  type="time"
                  name="closingTime"
                  value={formData.closingTime}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm text-[#1C2B20] focus:outline-none ${
                    errors.closingTime ? 'border-red-500 focus:border-red-500' : 'border-[#d4e0d7] focus:border-[#85BB45]'
                  }`}
                />
                {errors.closingTime && (
                  <p className="text-red-500 text-xs font-medium">{errors.closingTime}</p>
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#1C2B20]">Status Operasional</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-[#d4e0d7] bg-white text-sm focus:outline-none focus:border-[#85BB45]"
              >
                <option value="active">Aktif</option>
                <option value="inactive">Nonaktif</option>
              </select>
            </div>
          </div>

          {/* Tags Menu */}
          <div className="space-y-3 pt-2">
            <h3 className="text-base font-bold text-[#1C2B20] pb-2 border-b border-[#d4e0d7]">
              Menu Andalan / Tag
            </h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                placeholder="Tambah menu andalan..."
                className="flex-1 px-4 py-2 rounded-xl border border-[#d4e0d7] text-sm focus:outline-none focus:border-[#85BB45]"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-4 py-2 rounded-xl bg-[#EEF5EA] hover:bg-[#85BB45] hover:text-white text-[#3F6900] text-xs font-semibold transition"
              >
                <Plus size={16} />
              </button>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {Array.isArray(formData.tags) &&
                formData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#85BB45]/15 text-[#3F6900] text-xs font-semibold"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-red-600 transition"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
            </div>
          </div>

          {/* Foto Warung */}
          <div className="space-y-3 pt-2">
            <h3 className="text-base font-bold text-[#1C2B20] pb-2 border-b border-[#d4e0d7]">
              Foto Warung
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
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-24 h-16 rounded-xl object-cover border border-[#d4e0d7]"
                />
              )}
            </div>
            {errors.image && <p className="text-red-500 text-xs font-medium">{errors.image}</p>}
          </div>

          <div className="pt-4 border-t border-[#d4e0d7] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => router.push(`/admin/warung/${id}`)}
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
