'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Search, Filter, Edit, Eye, Trash2, Power, PowerOff, Loader2 } from 'lucide-react';
import { warungService } from '@/src/services/warungService';
import { Warung } from '@/src/types/warung';

export default function WarungList() {
  const [warungs, setWarungs] = useState<Warung[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const router = useRouter();

  const fetchWarungs = async () => {
    try {
      setLoading(true);
      const data = await warungService.getAll();
      setWarungs(data);
    } catch (error) {
      console.error('Error fetching warungs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWarungs();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus Warung ${name}?`)) {
      try {
        await warungService.delete(id);
        await fetchWarungs();
      } catch (error) {
        console.error('Error deleting warung:', error);
      }
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      await warungService.toggleStatus(id);
      await fetchWarungs();
    } catch (error) {
      console.error('Error toggling status:', error);
    }
  };

  const filteredWarungs = warungs.filter((w) => {
    const matchSearch =
      w.name.toLowerCase().includes(search.toLowerCase()) ||
      w.tags?.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    const matchStatus = statusFilter === 'all' || w.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#1C2B20]">Warung & Kuliner</h2>
          <p className="text-sm text-[#4a5c50] mt-0.5">
            Kelola data warung makan, kedai kopi, dan jajanan di kawasan Bedengan.
          </p>
        </div>
        <button
          onClick={() => router.push('/admin/warung/create')}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#85BB45] hover:bg-[#74A934] active:scale-[0.98] text-white font-semibold rounded-full text-sm shadow-xs transition"
        >
          <Plus size={18} />
          <span>Tambah Warung</span>
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8b9d91]" />
          <input
            type="text"
            placeholder="Cari nama warung atau menu..."
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
            <p className="text-sm font-medium">Memuat data warung...</p>
          </div>
        ) : filteredWarungs.length === 0 ? (
          <div className="p-12 text-center text-[#8b9d91] text-sm">
            Belum ada data warung yang sesuai.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#EEF5EA]/50 border-b border-[#d4e0d7] text-xs font-semibold text-[#4a5c50] uppercase tracking-wider">
                  <th className="py-3.5 px-4 sm:px-6">Foto</th>
                  <th className="py-3.5 px-4 sm:px-6">Nama Warung</th>
                  <th className="py-3.5 px-4 sm:px-6">Menu Unggulan</th>
                  <th className="py-3.5 px-4 sm:px-6">Jam Buka</th>
                  <th className="py-3.5 px-4 sm:px-6">Status</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#d4e0d7]/60 text-sm">
                {filteredWarungs.map((warung) => (
                  <tr key={warung.id} className="hover:bg-[#EEF5EA]/30 transition">
                    <td className="py-3.5 px-4 sm:px-6">
                      <img
                        src={warung.image}
                        alt={warung.name}
                        className="w-12 h-12 rounded-xl object-cover border border-[#d4e0d7]"
                      />
                    </td>
                    <td className="py-3.5 px-4 sm:px-6">
                      <div className="font-semibold text-[#1C2B20]">{warung.name}</div>
                      <div className="text-xs text-[#8b9d91]">{warung.whatsapp}</div>
                    </td>
                    <td className="py-3.5 px-4 sm:px-6">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {warung.tags?.map((tag, i) => (
                          <span
                            key={i}
                            className="text-[10px] bg-[#85BB45]/15 text-[#3F6900] font-semibold px-2 py-0.5 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 sm:px-6 text-[#4a5c50]">
                      {warung.openingTime} - {warung.closingTime}
                    </td>
                    <td className="py-3.5 px-4 sm:px-6">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          warung.status === 'active'
                            ? 'bg-[#85BB45]/15 text-[#3F6900]'
                            : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {warung.status === 'active' ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 sm:px-6 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => router.push(`/admin/warung/${warung.id}`)}
                          className="p-1.5 text-[#4a5c50] hover:text-[#85BB45] hover:bg-[#EEF5EA] rounded-lg transition"
                          title="Lihat Detail"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => router.push(`/admin/warung/${warung.id}/edit`)}
                          className="p-1.5 text-[#4a5c50] hover:text-[#85BB45] hover:bg-[#EEF5EA] rounded-lg transition"
                          title="Ubah Data"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(warung.id)}
                          className={`p-1.5 rounded-lg transition ${
                            warung.status === 'active'
                              ? 'text-amber-500 hover:bg-amber-50'
                              : 'text-[#85BB45] hover:bg-[#EEF5EA]'
                          }`}
                          title={warung.status === 'active' ? 'Nonaktifkan' : 'Aktifkan'}
                        >
                          {warung.status === 'active' ? <PowerOff size={18} /> : <Power size={18} />}
                        </button>
                        <button
                          onClick={() => handleDelete(warung.id, warung.name)}
                          className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition"
                          title="Hapus"
                        >
                          <Trash2 size={18} />
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
