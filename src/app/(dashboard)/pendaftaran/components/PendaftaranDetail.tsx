'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, CheckCircle, XCircle, Loader2, Phone, User, Store } from 'lucide-react';
import { applicationService } from '@/src/services/applicationService';
import { Application } from '@/src/types/application';

export default function PendaftaranDetail() {
  const params = useParams();
  const id = typeof params?.id === 'string' ? params.id : '';
  const router = useRouter();
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const fetchApplication = useCallback(async () => {
    try {
      if (!id) return;
      const data = await applicationService.getApplicationById(id);
      if (data) {
        setApplication(data);
      } else {
        router.push('/admin/pendaftaran');
      }
    } catch (error) {
      console.error('Error fetching application:', error);
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  useEffect(() => {
    fetchApplication();
  }, [fetchApplication]);

  const handleApprove = async () => {
    if (
      window.confirm(
        'Terima Pendaftaran?\n\nUsaha ini akan disetujui dan siap masuk ke katalog Bedengan Xplore.'
      )
    ) {
      try {
        await applicationService.approveApplication(id);
        await fetchApplication();
      } catch (error) {
        console.error('Error approving application:', error);
      }
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      alert('Mohon isi alasan penolakan.');
      return;
    }

    try {
      await applicationService.rejectApplication(id, rejectReason);
      setShowRejectModal(false);
      await fetchApplication();
    } catch (error) {
      console.error('Error rejecting application:', error);
    }
  };

  if (loading) {
    return (
      <div className="p-12 flex flex-col items-center justify-center gap-3 text-[#4a5c50]">
        <Loader2 className="animate-spin text-[#85BB45]" size={32} />
        <p className="text-sm font-medium">Memuat detail pendaftaran...</p>
      </div>
    );
  }

  if (!application) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button
            onClick={() => router.push('/admin/pendaftaran')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#4a5c50] hover:text-[#1C2B20] mb-2"
          >
            <ArrowLeft size={16} /> Kembali ke Daftar
          </button>
          <h2 className="text-xl sm:text-2xl font-bold text-[#1C2B20]">Detail Pendaftaran</h2>
          <p className="text-sm text-[#4a5c50]">Review informasi usaha atau jasa yang diajukan.</p>
        </div>

        {application.status === 'Pending' && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowRejectModal(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 border border-red-200 bg-red-50 hover:bg-red-100 text-red-600 rounded-full text-xs font-semibold transition"
            >
              <XCircle size={16} /> Tolak
            </button>
            <button
              onClick={handleApprove}
              className="inline-flex items-center gap-1.5 px-5 py-2 bg-[#85BB45] hover:bg-[#74A934] text-white rounded-full text-xs font-semibold shadow-xs transition"
            >
              <CheckCircle size={16} /> Terima Pendaftaran
            </button>
          </div>
        )}
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-2xl border border-[#d4e0d7] p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#d4e0d7]">
          <div>
            <h3 className="text-xl font-bold text-[#1C2B20]">{application.businessName}</h3>
            <p className="text-xs text-[#8b9d91] mt-0.5">Kategori: {application.category}</p>
          </div>
          <span
            className={`px-3.5 py-1 rounded-full text-xs font-bold ${
              application.status === 'Approved'
                ? 'bg-[#85BB45]/15 text-[#3F6900]'
                : application.status === 'Rejected'
                ? 'bg-rose-100 text-rose-700'
                : 'bg-amber-100 text-amber-700'
            }`}
          >
            {application.status}
          </span>
        </div>

        {application.status === 'Rejected' && application.rejectionReason && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
            <h4 className="font-bold mb-1 text-xs uppercase tracking-wide">Alasan Penolakan:</h4>
            <p>{application.rejectionReason}</p>
          </div>
        )}

        {/* Info Pemohon */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-[#1C2B20] flex items-center gap-2">
            <User size={16} className="text-[#85BB45]" />
            <span>Informasi Pemohon</span>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-[#EEF5EA]/50 border border-[#d4e0d7]">
            <div>
              <p className="text-[11px] font-semibold text-[#8b9d91]">Nama Lengkap</p>
              <p className="text-sm font-bold text-[#1C2B20] mt-0.5">
                {application.applicantName}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Phone size={16} className="text-[#85BB45]" />
              <div>
                <p className="text-[11px] font-semibold text-[#8b9d91]">Nomor WhatsApp</p>
                <p className="text-sm font-bold text-[#1C2B20] mt-0.5">{application.whatsapp}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Info Usaha */}
        <div className="space-y-3 pt-2">
          <h4 className="text-sm font-bold text-[#1C2B20] flex items-center gap-2">
            <Store size={16} className="text-[#85BB45]" />
            <span>Informasi Usaha</span>
          </h4>
          <div className="space-y-3 text-sm">
            <div>
              <p className="text-xs font-semibold text-[#8b9d91]">Deskripsi Layanan</p>
              <p className="text-[#1C2B20] mt-1 leading-relaxed">{application.description}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-[#8b9d91]">Alamat Lokasi</p>
              <p className="text-[#1C2B20] mt-1">{application.address}</p>
            </div>
          </div>

          {application.images?.length > 0 && (
            <div className="pt-2">
              <p className="text-xs font-semibold text-[#8b9d91] mb-2">Foto Pendukung</p>
              <div className="flex flex-wrap gap-3">
                {application.images.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt="Pendukung"
                    className="w-28 h-28 object-cover rounded-xl border border-[#d4e0d7]"
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-[#1C2B20]">Tolak Pendaftaran?</h3>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#1C2B20]">Alasan Penolakan *</label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={3}
                placeholder="Berikan alasan spesifik penolakan..."
                className="w-full p-3 border border-[#d4e0d7] rounded-xl text-sm focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowRejectModal(false)}
                className="px-4 py-2 rounded-full border border-[#d4e0d7] text-xs font-semibold text-[#1C2B20] hover:bg-[#EEF5EA] transition"
              >
                Batal
              </button>
              <button
                onClick={handleReject}
                className="px-4 py-2 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-xs transition"
              >
                Tolak Pendaftaran
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
