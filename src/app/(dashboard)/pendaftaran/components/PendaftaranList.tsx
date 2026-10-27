'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Filter, Eye, Loader2 } from 'lucide-react';
import { applicationService } from '@/src/services/applicationService';
import { Application } from '@/src/types/application';

export default function PendaftaranList() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const router = useRouter();

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const data = await applicationService.getApplications();
      setApplications(data);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const filteredApplications = applications.filter((a) => {
    const matchSearch =
      a.businessName.toLowerCase().includes(search.toLowerCase()) ||
      a.applicantName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || a.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-[#1C2B20]">Pendaftaran Usaha/Jasa</h2>
        <p className="text-sm text-[#4a5c50] mt-0.5">
          Review dan verifikasi pendaftaran usaha baru dari warga kawasan Bedengan.
        </p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8b9d91]" />
          <input
            type="text"
            placeholder="Cari nama usaha atau nama pemohon..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-[#d4e0d7] rounded-full text-sm text-[#1C2B20] placeholder-[#8b9d91] focus:outline-none focus:border-[#85BB45] focus:ring-2 focus:ring-[#85BB45]/15 transition"
          />
        </div>

        <div className="relative flex items-center">
          <Filter size={18} className="absolute left-3.5 text-[#8b9d91] pointer-events-none" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto pl-10 pr-8 py-2 bg-white border border-[#d4e0d7] rounded-full text-sm text-[#1C2B20] focus:outline-none focus:border-[#85BB45] transition cursor-pointer appearance-none"
          >
            <option value="all">Semua Status</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl border border-[#d4e0d7] shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center gap-3 text-[#4a5c50]">
            <Loader2 className="animate-spin text-[#85BB45]" size={32} />
            <p className="text-sm font-medium">Memuat data pendaftaran...</p>
          </div>
        ) : filteredApplications.length === 0 ? (
          <div className="p-12 text-center text-[#8b9d91] text-sm">
            Belum ada data pendaftaran yang sesuai.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#EEF5EA]/50 border-b border-[#d4e0d7] text-xs font-semibold text-[#4a5c50] uppercase tracking-wider">
                  <th className="py-3.5 px-4 sm:px-6">Usaha / Jasa</th>
                  <th className="py-3.5 px-4 sm:px-6">Pemohon</th>
                  <th className="py-3.5 px-4 sm:px-6">Kategori</th>
                  <th className="py-3.5 px-4 sm:px-6">Tanggal Masuk</th>
                  <th className="py-3.5 px-4 sm:px-6">Status</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#d4e0d7]/60 text-sm">
                {filteredApplications.map((app) => (
                  <tr key={app.id} className="hover:bg-[#EEF5EA]/30 transition">
                    <td className="py-3.5 px-4 sm:px-6 font-semibold text-[#1C2B20]">
                      {app.businessName}
                    </td>
                    <td className="py-3.5 px-4 sm:px-6 text-[#4a5c50]">{app.applicantName}</td>
                    <td className="py-3.5 px-4 sm:px-6 text-[#4a5c50]">{app.category}</td>
                    <td className="py-3.5 px-4 sm:px-6 text-[#8b9d91]">
                      {new Date(app.submittedAt).toLocaleDateString('id-ID')}
                    </td>
                    <td className="py-3.5 px-4 sm:px-6">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          app.status === 'Approved'
                            ? 'bg-[#85BB45]/15 text-[#3F6900]'
                            : app.status === 'Rejected'
                            ? 'bg-rose-100 text-rose-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        {app.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 sm:px-6 text-right">
                      <button
                        onClick={() => router.push(`/admin/pendaftaran/${app.id}`)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-[#d4e0d7] hover:bg-[#EEF5EA] text-xs font-semibold text-[#1C2B20] transition"
                      >
                        <Eye size={14} /> Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
