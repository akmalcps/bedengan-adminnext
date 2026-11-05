'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Edit, ArrowLeft, Trash2, Loader2, Phone, Clock, MapPin } from 'lucide-react';
import { rentalService } from '@/src/services/rentalService';
import { Rental } from '@/src/types/rental';
import { formatRupiah } from '@/src/utils/format';

export default function RentalDetail() {
  const params = useParams();
  const id = typeof params?.id === 'string' ? params.id : '';
  const router = useRouter();
  const [rental, setRental] = useState<Rental | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRental = async () => {
      try {
        if (!id) return;
        const data = await rentalService.getById(id);
        if (data) {
          setRental(data);
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

  const handleDelete = async () => {
    if (!rental) return;
    if (window.confirm(`Apakah Anda yakin ingin menghapus Rental ${rental.name}?`)) {
      try {
        await rentalService.delete(id);
        router.push('/admin/rental');
      } catch (error) {
        console.error('Error deleting rental:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="p-12 flex flex-col items-center justify-center gap-3 text-[#4a5c50]">
        <Loader2 className="animate-spin text-[#85BB45]" size={32} />
        <p className="text-sm font-medium">Memuat detail rental...</p>
      </div>
    );
  }

  if (!rental) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button
            onClick={() => router.push('/admin/rental')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#4a5c50] hover:text-[#1C2B20] mb-2"
          >
            <ArrowLeft size={16} /> Kembali ke Daftar
          </button>
          <h2 className="text-xl sm:text-2xl font-bold text-[#1C2B20]">Detail Rental</h2>
          <p className="text-sm text-[#4a5c50]">Informasi profil penyedia dan daftar inventaris.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleDelete}
            className="inline-flex items-center gap-2 px-4 py-2 border border-red-200 bg-red-50 hover:bg-red-100 text-red-600 rounded-full text-xs font-semibold transition"
          >
            <Trash2 size={16} /> Hapus
          </button>
          <button
            onClick={() => router.push(`/admin/rental/${id}/edit`)}
            className="inline-flex items-center gap-2 px-5 py-2 bg-[#85BB45] hover:bg-[#74A934] text-white rounded-full text-xs font-semibold shadow-sm transition"
          >
            <Edit size={16} /> Edit Rental
          </button>
        </div>
      </div>

      {/* Main Detail Card */}
      <div className="bg-white rounded-2xl border border-[#d4e0d7] p-6 sm:p-8 shadow-sm space-y-6">
          {/* Brand header */}
          <div className="flex flex-col sm:flex-row gap-5 items-start">
            <img
              src={rental.image || 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=300'}
              alt={rental.name}
              className="w-28 h-28 rounded-2xl object-cover border border-[#d4e0d7] shrink-0"
            />
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2.5">
                <h3 className="text-xl font-bold text-[#1C2B20]">{rental.name}</h3>
                <span
                  className={`px-3 py-0.5 rounded-full text-xs font-semibold ${
                    rental.status === 'active'
                      ? 'bg-[#85BB45]/15 text-[#3F6900]'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {rental.status === 'active' ? 'Aktif' : 'Nonaktif'}
                </span>
              </div>
              <p className="text-sm text-[#4a5c50] leading-relaxed">{rental.description}</p>
            </div>
          </div>

          {/* Quick Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-[#EEF5EA]/50 border border-[#d4e0d7]">
            <div className="flex items-center gap-2.5">
              <Clock size={18} className="text-[#85BB45]" />
              <div>
                <p className="text-[11px] font-semibold text-[#8b9d91]">Jam Operasional</p>
                <p className="text-xs font-bold text-[#1C2B20]">
                  {rental.openingTime} - {rental.closingTime} WIB
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Phone size={18} className="text-[#85BB45]" />
              <div>
                <p className="text-[11px] font-semibold text-[#8b9d91]">WhatsApp</p>
                <p className="text-xs font-bold text-[#1C2B20]">{rental.whatsapp || '-'}</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <MapPin size={18} className="text-[#85BB45]" />
              <div>
                <p className="text-[11px] font-semibold text-[#8b9d91]">Lokasi / Alamat</p>
                <p className="text-xs font-bold text-[#1C2B20] truncate">{rental.address || '-'}</p>
              </div>
            </div>
          </div>

          {/* Items Section */}
          <div className="space-y-3">
            <h4 className="text-base font-bold text-[#1C2B20]">
              Peralatan Tersedia ({Array.isArray(rental.items) ? rental.items.length : 0})
            </h4>

            {Array.isArray(rental.items) && rental.items.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {rental.items.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-xl border border-[#d4e0d7] hover:border-[#85BB45] transition flex flex-col justify-between gap-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-semibold text-xs text-[#1C2B20]">{item.name}</span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          item.availability === 'tersedia'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-rose-100 text-rose-700'
                        }`}
                      >
                        {item.availability}
                      </span>
                    </div>
                    <div className="text-xs font-bold text-[#3F6900]">
                      {formatRupiah(item.price)}
                      <span className="text-[11px] font-normal text-[#8b9d91]"> / {item.unit}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#8b9d91] italic">Tidak ada item rental terdaftar.</p>
            )}
          </div>
        </div>
    </div>
  );
}
