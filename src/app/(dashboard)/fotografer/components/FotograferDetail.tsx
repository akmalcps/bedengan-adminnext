'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Edit, ArrowLeft, Trash2, Loader2, Phone, Camera, MapPin } from 'lucide-react';
import { fotograferService } from '@/src/services/fotograferService';
import { Fotografer } from '@/src/types/fotografer';
import { formatRupiah } from '@/src/utils/format';

export default function FotograferDetail() {
  const params = useParams();
  const id = typeof params?.id === 'string' ? params.id : '';
  const router = useRouter();
  const [fotografer, setFotografer] = useState<Fotografer | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchFotografer = useCallback(async () => {
    try {
      if (!id) return;
      const data = await fotograferService.getById(id);
      if (data) {
        setFotografer(data);
      } else {
        router.push('/admin/fotografer');
      }
    } catch (error) {
      console.error('Error fetching fotografer:', error);
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  useEffect(() => {
    fetchFotografer();
  }, [fetchFotografer]);

  const handleDelete = async () => {
    if (!fotografer) return;
    if (window.confirm(`Apakah Anda yakin ingin menghapus Fotografer ${fotografer.name}?`)) {
      try {
        await fotograferService.delete(id);
        router.push('/admin/fotografer');
      } catch (error) {
        console.error('Error deleting fotografer:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="p-12 flex flex-col items-center justify-center gap-3 text-[#4a5c50]">
        <Loader2 className="animate-spin text-[#85BB45]" size={32} />
        <p className="text-sm font-medium">Memuat detail fotografer...</p>
      </div>
    );
  }

  if (!fotografer) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button
            onClick={() => router.push('/admin/fotografer')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#4a5c50] hover:text-[#1C2B20] mb-2"
          >
            <ArrowLeft size={16} /> Kembali ke Daftar
          </button>
          <h2 className="text-xl sm:text-2xl font-bold text-[#1C2B20]">Detail Fotografer</h2>
          <p className="text-sm text-[#4a5c50]">Informasi profil mitra dan paket layanan foto.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleDelete}
            className="inline-flex items-center gap-2 px-4 py-2 border border-red-200 bg-red-50 hover:bg-red-100 text-red-600 rounded-full text-xs font-semibold transition"
          >
            <Trash2 size={16} /> Hapus
          </button>
          <button
            onClick={() => router.push(`/admin/fotografer/${id}/edit`)}
            className="inline-flex items-center gap-2 px-5 py-2 bg-[#85BB45] hover:bg-[#74A934] text-white rounded-full text-xs font-semibold shadow-xs transition"
          >
            <Edit size={16} /> Edit Fotografer
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#d4e0d7] p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row gap-5 items-start">
          <img
            src={fotografer.profileImage}
            alt={fotografer.name}
            className="w-24 h-24 rounded-2xl object-cover border border-[#d4e0d7] shrink-0"
          />
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <h3 className="text-xl font-bold text-[#1C2B20]">{fotografer.name}</h3>
              <span
                className={`px-3 py-0.5 rounded-full text-xs font-semibold ${
                  fotografer.status === 'active'
                    ? 'bg-[#85BB45]/15 text-[#3F6900]'
                    : 'bg-slate-200 text-slate-600'
                }`}
              >
                {fotografer.status === 'active' ? 'Aktif' : 'Nonaktif'}
              </span>
            </div>
            <p className="text-sm text-[#4a5c50] leading-relaxed">{fotografer.description}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-[#EEF5EA]/50 border border-[#d4e0d7]">
          <div className="flex items-center gap-2.5">
            <Camera size={18} className="text-[#85BB45]" />
            <div>
              <p className="text-[11px] font-semibold text-[#8b9d91]">Instagram</p>
              <a
                href={fotografer.instagramUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-bold text-[#3F6900] hover:underline"
              >
                {fotografer.instagramUsername}
              </a>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Phone size={18} className="text-[#85BB45]" />
            <div>
              <p className="text-[11px] font-semibold text-[#8b9d91]">WhatsApp</p>
              <p className="text-xs font-bold text-[#1C2B20]">{fotografer.whatsapp || '-'}</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <MapPin size={18} className="text-[#85BB45]" />
            <div>
              <p className="text-[11px] font-semibold text-[#8b9d91]">Lokasi Area</p>
              <p className="text-xs font-bold text-[#1C2B20] truncate">
                {fotografer.location || 'Malang Raya'}
              </p>
            </div>
          </div>
        </div>

        {/* Galeri Portofolio */}
        {fotografer.gallery?.length > 0 && (
          <div className="space-y-3 pt-2">
            <h4 className="text-sm font-bold text-[#1C2B20]">Portofolio Foto</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {fotografer.gallery.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`Portofolio ${i + 1}`}
                  className="w-full h-28 object-cover rounded-xl border border-[#d4e0d7]"
                />
              ))}
            </div>
          </div>
        )}

        {/* Paket Layanan */}
        <div className="space-y-3 pt-2">
          <h4 className="text-sm font-bold text-[#1C2B20]">
            Paket Layanan Tersedia ({fotografer.services?.length || 0})
          </h4>

          {(fotografer.services || []).length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {fotografer.services.map((s) => (
                <div
                  key={s.id}
                  className="p-3.5 rounded-xl border border-[#d4e0d7] hover:border-[#85BB45] transition flex flex-col justify-between gap-2"
                >
                  <div>
                    <h5 className="font-semibold text-xs text-[#1C2B20]">{s.name}</h5>
                    <p className="text-[11px] text-[#4a5c50] mt-0.5">{s.description}</p>
                  </div>
                  <div className="text-xs font-bold text-[#3F6900]">
                    Mulai dari {formatRupiah(s.startingPrice)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-[#8b9d91] italic">Belum ada paket layanan terdaftar.</p>
          )}
        </div>
      </div>
    </div>
  );
}
