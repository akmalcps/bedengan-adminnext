'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Edit, ArrowLeft, Power, PowerOff, Loader2, Tent } from 'lucide-react';
import { kawasanService } from '@/src/services/kawasanService';
import { Kawasan } from '@/src/types/kawasan';
import MobilePreviewFrame from '@/src/components/preview/MobilePreviewFrame';
import MobileAreaPreview from '@/src/components/preview/MobileAreaPreview';

export default function KawasanDetail() {
  const params = useParams();
  const id = typeof params?.id === 'string' ? params.id : '';
  const router = useRouter();
  const [kawasan, setKawasan] = useState<Kawasan | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchKawasan = useCallback(async () => {
    try {
      if (!id) return;
      const data = await kawasanService.getById(id);
      if (data) {
        setKawasan(data);
      } else {
        router.push('/admin/kawasan');
      }
    } catch (error) {
      console.error('Error fetching kawasan:', error);
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  useEffect(() => {
    fetchKawasan();
  }, [fetchKawasan]);

  const handleToggleStatus = async () => {
    try {
      await kawasanService.toggleStatus(id);
      await fetchKawasan();
    } catch (error) {
      console.error('Error toggling status:', error);
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

  if (!kawasan) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button
            onClick={() => router.push('/admin/kawasan')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#4a5c50] hover:text-[#1C2B20] mb-2"
          >
            <ArrowLeft size={16} /> Kembali ke Daftar
          </button>
          <h2 className="text-xl sm:text-2xl font-bold text-[#1C2B20]">Detail Kawasan</h2>
          <p className="text-sm text-[#4a5c50]">Informasi profil area camping Bedengan.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleToggleStatus}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold border transition ${
              kawasan.status === 'active'
                ? 'border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100'
                : 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
            }`}
          >
            {kawasan.status === 'active' ? <PowerOff size={16} /> : <Power size={16} />}
            <span>{kawasan.status === 'active' ? 'Nonaktifkan' : 'Aktifkan'}</span>
          </button>
          <button
            onClick={() => router.push(`/admin/kawasan/${id}/edit`)}
            className="inline-flex items-center gap-1.5 px-5 py-2 bg-[#85BB45] hover:bg-[#74A934] text-white rounded-full text-xs font-semibold shadow-xs transition"
          >
            <Edit size={16} /> Edit Kawasan
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Detail Information */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#d4e0d7] p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row gap-5 items-start">
            <img
              src={kawasan.image}
              alt={kawasan.name}
              className="w-32 h-28 rounded-2xl object-cover border border-[#d4e0d7] shrink-0"
            />
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2.5">
                <h3 className="text-xl font-bold text-[#1C2B20]">{kawasan.name}</h3>
                <span
                  className={`px-3 py-0.5 rounded-full text-xs font-semibold ${
                    kawasan.status === 'active'
                      ? 'bg-[#85BB45]/15 text-[#3F6900]'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {kawasan.status === 'active' ? 'Aktif' : 'Nonaktif'}
                </span>
              </div>
              <p className="text-sm text-[#4a5c50] leading-relaxed">{kawasan.description}</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#EEF5EA]/50 border border-[#d4e0d7] flex items-center gap-3">
            <Tent size={20} className="text-[#85BB45]" />
            <div>
              <p className="text-[11px] font-semibold text-[#8b9d91]">Kapasitas Area</p>
              <p className="text-sm font-bold text-[#1C2B20]">{kawasan.capacity}</p>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <h4 className="text-sm font-bold text-[#1C2B20]">Fasilitas Terdekat</h4>
            <div className="flex flex-wrap gap-2">
              {kawasan.facilities?.map((f) => (
                <span
                  key={f}
                  className="px-3.5 py-1.5 rounded-full bg-[#85BB45]/15 text-[#3F6900] text-xs font-semibold"
                >
                  {f}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Mobile Preview */}
        <div className="flex flex-col items-center">
          <div className="mb-3 text-center">
            <h3 className="text-sm font-bold text-[#1C2B20]">Preview Mobile</h3>
            <p className="text-xs text-[#8b9d91]">Tampilan area di aplikasi publik</p>
          </div>
          <MobilePreviewFrame title={kawasan.name}>
            <MobileAreaPreview data={kawasan} />
          </MobilePreviewFrame>
        </div>
      </div>
    </div>
  );
}
