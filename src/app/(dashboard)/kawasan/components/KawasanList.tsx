'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Filter, Eye, Edit, Power, PowerOff, Loader2 } from 'lucide-react';
import { kawasanService } from '@/src/services/kawasanService';
import { Kawasan } from '@/src/types/kawasan';

export default function KawasanList() {
  const [kawasans, setKawasans] = useState<Kawasan[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const router = useRouter();

  const fetchKawasans = async () => {
    try {
      setLoading(true);
      const data = await kawasanService.getAll();
      setKawasans(data);
    } catch (error) {
      console.error('Error fetching kawasans:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKawasans();
  }, []);

  const handleToggleStatus = async (id: string) => {
    try {
      await kawasanService.toggleStatus(id);
      await fetchKawasans();
    } catch (error) {
      console.error('Error toggling status:', error);
    }
  };

  const filteredKawasans = kawasans.filter((k) => {
    const matchSearch = k.name.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || k.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-[#1C2B20]">Kawasan Bedengan</h2>
        <p className="text-sm text-[#4a5c50] mt-0.5">
          Kelola master data 13 area camping, kapasitas tenda, dan fasilitas terdekat.
        </p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8b9d91]" />
          <input
            type="text"
            placeholder="Cari area camping..."
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
            <option value="active">Aktif</option>
            <option value="inactive">Nonaktif</option>
          </select>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl border border-[#d4e0d7] shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center gap-3 text-[#4a5c50]">
            <Loader2 className="animate-spin text-[#85BB45]" size={32} />
            <p className="text-sm font-medium">Memuat data kawasan...</p>
          </div>
        ) : filteredKawasans.length === 0 ? (
          <div className="p-12 text-center text-[#8b9d91] text-sm">
            Belum ada area kawasan yang sesuai.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#EEF5EA]/50 border-b border-[#d4e0d7] text-xs font-semibold text-[#4a5c50] uppercase tracking-wider">
                  <th className="py-3.5 px-4 sm:px-6">Foto</th>
                  <th className="py-3.5 px-4 sm:px-6">Nama Area</th>
                  <th className="py-3.5 px-4 sm:px-6">Kapasitas</th>
                  <th className="py-3.5 px-4 sm:px-6">Fasilitas</th>
                  <th className="py-3.5 px-4 sm:px-6">Status</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#d4e0d7]/60 text-sm">
                {filteredKawasans.map((kawasan) => (
                  <tr key={kawasan.id} className="hover:bg-[#EEF5EA]/30 transition">
                    <td className="py-3.5 px-4 sm:px-6">
                      <img
                        src={kawasan.image}
                        alt={kawasan.name}
                        className="w-12 h-12 rounded-xl object-cover border border-[#d4e0d7]"
                      />
                    </td>
                    <td className="py-3.5 px-4 sm:px-6">
                      <div className="font-semibold text-[#1C2B20]">{kawasan.name}</div>
                      <div className="text-xs text-[#8b9d91]">Area #{kawasan.number}</div>
                    </td>
                    <td className="py-3.5 px-4 sm:px-6 text-[#4a5c50] font-medium">
                      {kawasan.capacity}
                    </td>
                    <td className="py-3.5 px-4 sm:px-6">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {kawasan.facilities?.slice(0, 2).map((f, i) => (
                          <span
                            key={i}
                            className="text-[10px] bg-[#85BB45]/15 text-[#3F6900] font-semibold px-2 py-0.5 rounded-full"
                          >
                            {f}
                          </span>
                        ))}
                        {(kawasan.facilities?.length || 0) > 2 && (
                          <span className="text-[10px] text-[#8b9d91] font-semibold px-1 py-0.5">
                            +{kawasan.facilities.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 sm:px-6">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          kawasan.status === 'active'
                            ? 'bg-[#85BB45]/15 text-[#3F6900]'
                            : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {kawasan.status === 'active' ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 sm:px-6 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => router.push(`/admin/kawasan/${kawasan.id}`)}
                          className="p-1.5 text-[#4a5c50] hover:text-[#85BB45] hover:bg-[#EEF5EA] rounded-lg transition"
                          title="Lihat Detail"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => router.push(`/admin/kawasan/${kawasan.id}/edit`)}
                          className="p-1.5 text-[#4a5c50] hover:text-[#85BB45] hover:bg-[#EEF5EA] rounded-lg transition"
                          title="Ubah Data"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(kawasan.id)}
                          className={`p-1.5 rounded-lg transition ${
                            kawasan.status === 'active'
                              ? 'text-amber-500 hover:bg-amber-50'
                              : 'text-[#85BB45] hover:bg-[#EEF5EA]'
                          }`}
                          title={kawasan.status === 'active' ? 'Nonaktifkan' : 'Aktifkan'}
                        >
                          {kawasan.status === 'active' ? <PowerOff size={18} /> : <Power size={18} />}
                        </button>
                      </div>
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
