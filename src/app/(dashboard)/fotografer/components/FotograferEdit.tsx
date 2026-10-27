'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Plus, Trash2, ArrowLeft, Loader2, Upload } from 'lucide-react';
import { fotograferService } from '@/src/services/fotograferService';
import { Fotografer, FotograferServiceItem } from '@/src/types/fotografer';

export default function FotograferEdit() {
  const params = useParams();
  const id = typeof params?.id === 'string' ? params.id : '';
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Fotografer | null>(null);

  useEffect(() => {
    const fetchFotografer = async () => {
      try {
        if (!id) return;
        const data = await fotograferService.getById(id);
        if (data) {
          setFormData(data);
        } else {
          router.push('/admin/fotografer');
        }
      } catch (error) {
        console.error('Error fetching fotografer:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFotografer();
  }, [id, router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => (prev ? { ...prev, [name]: value } : prev));
  };

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setFormData((prev) => (prev ? { ...prev, profileImage: objectUrl } : prev));
    }
  };

  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const objectUrls = files.map((file) => URL.createObjectURL(file));
    setFormData((prev) =>
      prev ? { ...prev, gallery: [...(prev.gallery || []), ...objectUrls] } : prev
    );
  };

  const handleRemoveGalleryImage = (indexToRemove: number) => {
    setFormData((prev) =>
      prev
        ? {
            ...prev,
            gallery: prev.gallery.filter((_, index) => index !== indexToRemove),
          }
        : prev
    );
  };

  const handleAddService = () => {
    setFormData((prev) =>
      prev
        ? {
            ...prev,
            services: [
              ...(prev.services || []),
              {
                id: Date.now().toString(),
                name: '',
                description: '',
                startingPrice: '',
                status: 'active',
              },
            ],
          }
        : prev
    );
  };

  const handleServiceChange = (
    serviceId: string,
    field: keyof FotograferServiceItem,
    value: string | number
  ) => {
    setFormData((prev) =>
      prev
        ? {
            ...prev,
            services: (prev.services || []).map((s) =>
              s.id === serviceId ? { ...s, [field]: value } : s
            ),
          }
        : prev
    );
  };

  const handleRemoveService = (serviceId: string) => {
    setFormData((prev) =>
      prev
        ? {
            ...prev,
            services: (prev.services || []).filter((s) => s.id !== serviceId),
          }
        : prev
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;
    setIsSubmitting(true);
    try {
      await fotograferService.update(id, formData);
      router.push(`/admin/fotografer/${id}`);
    } catch (error) {
      console.error('Error updating fotografer:', error);
      alert('Gagal mengupdate fotografer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 flex flex-col items-center justify-center gap-3 text-[#4a5c50]">
        <Loader2 className="animate-spin text-[#85BB45]" size={32} />
        <p className="text-sm font-medium">Memuat data fotografer...</p>
      </div>
    );
  }

  if (!formData) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.push(`/admin/fotografer/${id}`)}
          className="p-2 text-[#4a5c50] hover:text-[#1C2B20] hover:bg-white rounded-xl transition border border-[#d4e0d7]"
          title="Kembali"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#1C2B20]">Ubah Data Fotografer</h2>
          <p className="text-sm text-[#4a5c50]">Perbarui profil mitra, paket layanan, dan galeri.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#d4e0d7] p-6 sm:p-8 shadow-xs">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-base font-bold text-[#1C2B20] pb-2 border-b border-[#d4e0d7]">
              Informasi Umum
            </h3>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#1C2B20]">Nama Brand / Fotografer *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-[#d4e0d7] text-sm text-[#1C2B20] focus:outline-none focus:border-[#85BB45]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#1C2B20]">Username Instagram *</label>
                <input
                  type="text"
                  name="instagramUsername"
                  value={formData.instagramUsername}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-[#d4e0d7] text-sm text-[#1C2B20] focus:outline-none focus:border-[#85BB45]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#1C2B20]">URL Instagram</label>
                <input
                  type="url"
                  name="instagramUrl"
                  value={formData.instagramUrl}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#d4e0d7] text-sm text-[#1C2B20] focus:outline-none focus:border-[#85BB45]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#1C2B20]">Nomor WhatsApp *</label>
                <input
                  type="tel"
                  name="whatsapp"
                  value={formData.whatsapp}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-[#d4e0d7] text-sm text-[#1C2B20] focus:outline-none focus:border-[#85BB45]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#1C2B20]">Cakupan Area *</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-[#d4e0d7] text-sm text-[#1C2B20] focus:outline-none focus:border-[#85BB45]"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#1C2B20]">Deskripsi *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={3}
                className="w-full px-4 py-2.5 rounded-xl border border-[#d4e0d7] text-sm text-[#1C2B20] focus:outline-none focus:border-[#85BB45] resize-y"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#1C2B20]">Status Mitra</label>
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

          {/* Foto Profil & Galeri */}
          <div className="space-y-4 pt-2">
            <h3 className="text-base font-bold text-[#1C2B20] pb-2 border-b border-[#d4e0d7]">
              Foto Profil & Portofolio
            </h3>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#1C2B20]">Foto Profil</label>
              <div className="flex items-center gap-4">
                <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-dashed border-[#85BB45] bg-[#EEF5EA]/40 text-[#3F6900] text-xs font-semibold hover:bg-[#EEF5EA] transition">
                  <Upload size={16} />
                  <span>Ganti Foto</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfileImageChange}
                    className="hidden"
                  />
                </label>
                {formData.profileImage && (
                  <img
                    src={formData.profileImage}
                    alt="Preview"
                    className="w-16 h-16 rounded-full object-cover border border-[#d4e0d7]"
                  />
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#1C2B20]">Portofolio / Galeri</label>
              <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-dashed border-[#85BB45] bg-[#EEF5EA]/40 text-[#3F6900] text-xs font-semibold hover:bg-[#EEF5EA] transition">
                <Upload size={16} />
                <span>Upload Foto Galeri</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleGalleryChange}
                  className="hidden"
                />
              </label>
              <div className="flex flex-wrap gap-2 pt-2">
                {formData.gallery?.map((img, i) => (
                  <div key={i} className="relative group">
                    <img
                      src={img}
                      alt="Gallery"
                      className="w-20 h-20 rounded-xl object-cover border border-[#d4e0d7]"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveGalleryImage(i)}
                      className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-80 hover:opacity-100"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Paket Layanan */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between pb-2 border-b border-[#d4e0d7]">
              <h3 className="text-base font-bold text-[#1C2B20]">Paket Layanan Foto</h3>
              <button
                type="button"
                onClick={handleAddService}
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-[#EEF5EA] text-[#3F6900] hover:bg-[#85BB45] hover:text-white transition"
              >
                <Plus size={14} /> Tambah Paket
              </button>
            </div>

            {(formData.services || []).length === 0 ? (
              <p className="text-xs text-[#8b9d91] italic py-2">Belum ada paket layanan foto.</p>
            ) : (
              <div className="space-y-3">
                {formData.services?.map((s) => (
                  <div
                    key={s.id}
                    className="p-3.5 bg-[#EEF5EA]/50 rounded-xl border border-[#d4e0d7]/80 grid grid-cols-1 sm:grid-cols-12 gap-3 items-end"
                  >
                    <div className="sm:col-span-4 space-y-1">
                      <label className="text-[11px] font-semibold text-[#8b9d91]">Nama Paket</label>
                      <input
                        type="text"
                        value={s.name}
                        onChange={(e) => handleServiceChange(s.id, 'name', e.target.value)}
                        required
                        className="w-full px-3 py-1.5 bg-white border border-[#d4e0d7] rounded-lg text-xs"
                      />
                    </div>
                    <div className="sm:col-span-4 space-y-1">
                      <label className="text-[11px] font-semibold text-[#8b9d91]">Deskripsi</label>
                      <input
                        type="text"
                        value={s.description}
                        onChange={(e) => handleServiceChange(s.id, 'description', e.target.value)}
                        className="w-full px-3 py-1.5 bg-white border border-[#d4e0d7] rounded-lg text-xs"
                      />
                    </div>
                    <div className="sm:col-span-3 space-y-1">
                      <label className="text-[11px] font-semibold text-[#8b9d91]">
                        Mulai Dari (Rp)
                      </label>
                      <input
                        type="number"
                        value={s.startingPrice}
                        onChange={(e) =>
                          handleServiceChange(s.id, 'startingPrice', e.target.value)
                        }
                        required
                        className="w-full px-3 py-1.5 bg-white border border-[#d4e0d7] rounded-lg text-xs"
                      />
                    </div>
                    <div className="sm:col-span-1 flex justify-end pb-0.5">
                      <button
                        type="button"
                        onClick={() => handleRemoveService(s.id)}
                        className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-[#d4e0d7] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => router.push(`/admin/fotografer/${id}`)}
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
