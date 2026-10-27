'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Edit, ArrowLeft, Trash2, Loader2, Phone, Clock, MapPin } from 'lucide-react';
import { warungService } from '@/src/services/warungService';
import { Warung } from '@/src/types/warung';
import MobilePreviewFrame from '@/src/components/preview/MobilePreviewFrame';
import MobileWarungPreview from '@/src/components/preview/MobileWarungPreview';

export default function WarungDetail() {
  const params = useParams();
  const id = typeof params?.id === 'string' ? params.id : '';
  const router = useRouter();
  const [warung, setWarung] = useState<Warung | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchWarung = useCallback(async () => {
    try {
      if (!id) return;
      const data = await warungService.getById(id);
      if (data) {
        setWarung(data);
      } else {
        router.push('/admin/warung');
      }
    } catch (error) {
      console.error('Error fetching warung:', error);
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  useEffect(() => {
    fetchWarung();
  }, [fetchWarung]);

  const handleDelete = async () => {
    if (!warung) return;
    if (window.confirm(`Apakah Anda yakin ingin menghapus Warung ${warung.name}?`)) {
      try {
        await warungService.delete(id);
        router.push('/admin/warung');
      } catch (error) {
        console.error('Error deleting warung:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="p-12 flex flex-col items-center justify-center gap-3 text-[#4a5c50]">
        <Loader2 className="animate-spin text-[#85BB45]" size={32} />
        <p className="text-sm font-medium">Memuat detail warung...</p>
      </div>
    );
  }

  if (!warung) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button
            onClick={() => router.push('/admin/warung')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#4a5c50] hover:text-[#1C2B20] mb-2"
          >
            <ArrowLeft size={16} /> Kembali ke Daftar
          </button>
          <h2 className="text-xl sm:text-2xl font-bold text-[#1C2B20]">Detail Warung</h2>
          <p className="text-sm text-[#4a5c50]">Informasi profil warung kuliner Bedengan.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleDelete}
            className="inline-flex items-center gap-2 px-4 py-2 border border-red-200 bg-red-50 hover:bg-red-100 text-red-600 rounded-full text-xs font-semibold transition"
          >
            <Trash2 size={16} /> Hapus
          </button>
          <button
            onClick={() => router.push(`/admin/warung/${id}/edit`)}
            className="inline-flex items-center gap-2 px-5 py-2 bg-[#85BB45] hover:bg-[#74A934] text-white rounded-full text-xs font-semibold shadow-xs transition"
          >
            <Edit size={16} /> Edit Warung
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Detail Info */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#d4e0d7] p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row gap-5 items-start">
            <img
              src={warung.image}
              alt={warung.name}
              className="w-28 h-28 rounded-2xl object-cover border border-[#d4e0d7] shrink-0"
            />
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2.5">
                <h3 className="text-xl font-bold text-[#1C2B20]">{warung.name}</h3>
                <span
                  className={`px-3 py-0.5 rounded-full text-xs font-semibold ${
                    warung.status === 'active'
                      ? 'bg-[#85BB45]/15 text-[#3F6900]'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {warung.status === 'active' ? 'Aktif' : 'Nonaktif'}
                </span>
              </div>
              <p className="text-sm text-[#4a5c50] leading-relaxed">{warung.description}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-[#EEF5EA]/50 border border-[#d4e0d7]">
            <div className="flex items-center gap-2.5">
              <Clock size={18} className="text-[#85BB45]" />
              <div>
                <p className="text-[11px] font-semibold text-[#8b9d91]">Jam Buka</p>
                <p className="text-xs font-bold text-[#1C2B20]">
                  {warung.openingTime} - {warung.closingTime}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Phone size={18} className="text-[#85BB45]" />
              <div>
                <p className="text-[11px] font-semibold text-[#8b9d91]">WhatsApp</p>
                <p className="text-xs font-bold text-[#1C2B20]">{warung.whatsapp || '-'}</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <MapPin size={18} className="text-[#85BB45]" />
              <div>
                <p className="text-[11px] font-semibold text-[#8b9d91]">Alamat</p>
                <p className="text-xs font-bold text-[#1C2B20] truncate">{warung.address || '-'}</p>
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <h4 className="text-sm font-bold text-[#1C2B20]">Menu Andalan & Rekomendasi</h4>
            <div className="flex flex-wrap gap-2">
              {warung.tags?.map((tag) => (
                <span
                  key={tag}
                  className="px-3.5 py-1.5 rounded-full bg-[#85BB45]/15 text-[#3F6900] text-xs font-semibold"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Mobile Preview */}
        <div className="flex flex-col items-center">
          <div className="mb-3 text-center">
            <h3 className="text-sm font-bold text-[#1C2B20]">Preview Mobile</h3>
            <p className="text-xs text-[#8b9d91]">Tampilan warung di aplikasi publik</p>
          </div>
          <MobilePreviewFrame title={warung.name}>
            <MobileWarungPreview data={warung} />
          </MobilePreviewFrame>
        </div>
      </div>
    </div>
  );
}
