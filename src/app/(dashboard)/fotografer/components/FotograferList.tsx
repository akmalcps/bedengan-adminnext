'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Search, Filter, Edit, Eye, Trash2, Power, PowerOff, Loader2 } from 'lucide-react';
import { fotograferService } from '@/src/services/fotograferService';
import { Fotografer } from '@/src/types/fotografer';

export default function FotograferList() {
  const [fotografers, setFotografers] = useState<Fotografer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const router = useRouter();

  const fetchFotografers = async () => {
    try {
      setLoading(true);
      const data = await fotograferService.getAll();
      setFotografers(data);
    } catch (error) {
      console.error('Error fetching fotografers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFotografers();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus Fotografer ${name}?`)) {
      try {
        await fotograferService.delete(id);
        await fetchFotografers();
      } catch (error) {
        console.error('Error deleting fotografer:', error);
      }
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      await fotograferService.toggleStatus(id);
      await fetchFotografers();
    } catch (error) {
      console.error('Error toggling status:', error);
    }
  };

  const filteredFotografers = fotografers.filter((f) => {
    const matchSearch =
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.instagramUsername.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || f.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#1C2B20]">Jasa Fotografer</h2>
          <p className="text-sm text-[#4a5c50] mt-0.5">
            Kelola data mitra fotografer dan videografer profesional di Bedengan.
          </p>
        </div>
        <button
          onClick={() => router.push('/admin/fotografer/create')}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#85BB45] hover:bg-[#74A934] active:scale-[0.98] text-white font-semibold rounded-full text-sm shadow-xs transition"
        >
          <Plus size={18} />
          <span>Tambah Fotografer</span>
        </button>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8b9d91]" />
          <input
            type="text"
            placeholder="Cari nama fotografer atau Instagram..."
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

      <div className="bg-white rounded-2xl border border-[#d4e0d7] shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center gap-3 text-[#4a5c50]">
            <Loader2 className="animate-spin text-[#85BB45]" size={32} />
            <p className="text-sm font-medium">Memuat data fotografer...</p>
          </div>
        ) : filteredFotografers.length === 0 ? (
          <div className="p-12 text-center text-[#8b9d91] text-sm">
            Belum ada data fotografer yang sesuai.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#EEF5EA]/50 border-b border-[#d4e0d7] text-xs font-semibold text-[#4a5c50] uppercase tracking-wider">
                  <th className="py-3.5 px-4 sm:px-6">Profil</th>
                  <th className="py-3.5 px-4 sm:px-6">Nama Fotografer</th>
                  <th className="py-3.5 px-4 sm:px-6">Instagram</th>
                  <th className="py-3.5 px-4 sm:px-6">Layanan</th>
                  <th className="py-3.5 px-4 sm:px-6">Status</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#d4e0d7]/60 text-sm">
                {filteredFotografers.map((f) => (
                  <tr key={f.id} className="hover:bg-[#EEF5EA]/30 transition">
                    <td className="py-3.5 px-4 sm:px-6">
                      <img
                        src={f.profileImage}
                        alt={f.name}
                        className="w-12 h-12 rounded-xl object-cover border border-[#d4e0d7]"
                      />
                    </td>
                    <td className="py-3.5 px-4 sm:px-6">
                      <div className="font-semibold text-[#1C2B20]">{f.name}</div>
                      <div className="text-xs text-[#8b9d91]">{f.whatsapp}</div>
                    </td>
                    <td className="py-3.5 px-4 sm:px-6">
                      <a
                        href={f.instagramUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-semibold text-[#3F6900] hover:underline"
                      >
                        {f.instagramUsername}
                      </a>
                    </td>
                    <td className="py-3.5 px-4 sm:px-6 text-[#4a5c50]">
                      {f.services?.length || 0} paket layanan
                    </td>
                    <td className="py-3.5 px-4 sm:px-6">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          f.status === 'active'
                            ? 'bg-[#85BB45]/15 text-[#3F6900]'
                            : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {f.status === 'active' ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 sm:px-6 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => router.push(`/admin/fotografer/${f.id}`)}
                          className="p-1.5 text-[#4a5c50] hover:text-[#85BB45] hover:bg-[#EEF5EA] rounded-lg transition"
                          title="Lihat Detail"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => router.push(`/admin/fotografer/${f.id}/edit`)}
                          className="p-1.5 text-[#4a5c50] hover:text-[#85BB45] hover:bg-[#EEF5EA] rounded-lg transition"
                          title="Ubah Data"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(f.id)}
                          className={`p-1.5 rounded-lg transition ${
                            f.status === 'active'
                              ? 'text-amber-500 hover:bg-amber-50'
                              : 'text-[#85BB45] hover:bg-[#EEF5EA]'
                          }`}
                          title={f.status === 'active' ? 'Nonaktifkan' : 'Aktifkan'}
                        >
                          {f.status === 'active' ? <PowerOff size={18} /> : <Power size={18} />}
                        </button>
                        <button
                          onClick={() => handleDelete(f.id, f.name)}
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
