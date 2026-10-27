'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Search, Filter, Edit, Eye, Trash2, Power, PowerOff, Loader2 } from 'lucide-react';
import { rentalService } from '@/src/services/rentalService';
import { Rental } from '@/src/types/rental';

export default function RentalList() {
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const router = useRouter();

  const fetchRentals = async () => {
    try {
      setLoading(true);
      const data = await rentalService.getAll();
      setRentals(data);
    } catch (error) {
      console.error('Error fetching rentals:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRentals();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus Rental "${name}"?`)) {
      try {
        await rentalService.delete(id);
        await fetchRentals();
      } catch (error) {
        console.error('Error deleting rental:', error);
      }
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      await rentalService.toggleStatus(id);
      await fetchRentals();
    } catch (error) {
      console.error('Error toggling status:', error);
    }
  };

  const filteredRentals = rentals.filter((r) => {
    const matchSearch = r.name?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || r.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#1C2B20]">Rental Camping</h2>
          <p className="text-sm text-[#4a5c50] mt-0.5">
            Kelola data penyedia dan inventaris peralatan camping.
          </p>
        </div>
        <button
          onClick={() => router.push('/admin/rental/create')}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#85BB45] hover:bg-[#74A934] active:scale-[0.98] text-white font-semibold rounded-full text-sm shadow-sm transition"
        >
          <Plus size={18} />
          <span>Tambah Rental</span>
        </button>
      </div>

      {/* Toolbar Search & Filter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8b9d91]" />
          <input
            type="text"
            placeholder="Cari nama rental..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-[#d4e0d7] rounded-full text-sm text-[#1C2B20] placeholder-[#8b9d91] focus:outline-none focus:border-[#85BB45] focus:ring-2 focus:ring-[#85BB45]/15 transition"
          />
        </div>

        {/* Filter */}
        <div className="relative flex items-center">
          <Filter size={18} className="absolute left-3.5 text-[#8b9d91] pointer-events-none" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto pl-10 pr-8 py-2 bg-white border border-[#d4e0d7] rounded-full text-sm text-[#1C2B20] focus:outline-none focus:border-[#85BB45] focus:ring-2 focus:ring-[#85BB45]/15 transition cursor-pointer appearance-none"
          >
            <option value="all">Semua Status</option>
            <option value="active">Aktif</option>
            <option value="inactive">Nonaktif</option>
          </select>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl border border-[#d4e0d7] shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center gap-3 text-[#4a5c50]">
            <Loader2 className="animate-spin text-[#85BB45]" size={32} />
            <p className="text-sm font-medium">Memuat data rental...</p>
          </div>
        ) : filteredRentals.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center justify-center gap-3">
            <p className="text-sm text-[#8b9d91]">Belum ada data rental yang sesuai.</p>
            <button
              onClick={() => router.push('/admin/rental/create')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#85BB45] text-white font-medium rounded-full text-xs shadow-sm hover:bg-[#74A934] transition"
            >
              <Plus size={16} /> Tambah Rental Sekarang
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#EEF5EA]/50 border-b border-[#d4e0d7] text-xs font-semibold text-[#4a5c50] uppercase tracking-wider">
                  <th className="py-3.5 px-4 sm:px-6">Foto</th>
                  <th className="py-3.5 px-4 sm:px-6">Nama Rental</th>
                  <th className="py-3.5 px-4 sm:px-6">Jumlah Item</th>
                  <th className="py-3.5 px-4 sm:px-6">Jam Operasional</th>
                  <th className="py-3.5 px-4 sm:px-6">Status</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#d4e0d7]/60 text-sm">
                {filteredRentals.map((rental) => (
                  <tr key={rental.id} className="hover:bg-[#EEF5EA]/30 transition">
                    <td className="py-3.5 px-4 sm:px-6">
                      <img
                        src={rental.image || 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=100'}
                        alt={rental.name}
                        className="w-12 h-12 rounded-xl object-cover border border-[#d4e0d7]"
                      />
                    </td>
                    <td className="py-3.5 px-4 sm:px-6">
                      <div className="font-semibold text-[#1C2B20]">{rental.name}</div>
                      <div className="text-xs text-[#8b9d91]">{rental.whatsapp || '-'}</div>
                    </td>
                    <td className="py-3.5 px-4 sm:px-6 text-[#4a5c50]">
                      {rental.items?.length || 0} item
                    </td>
                    <td className="py-3.5 px-4 sm:px-6 text-[#4a5c50]">
                      {rental.openingTime} - {rental.closingTime}
                    </td>
                    <td className="py-3.5 px-4 sm:px-6">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          rental.status === 'active'
                            ? 'bg-[#85BB45]/15 text-[#3F6900]'
                            : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {rental.status === 'active' ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 sm:px-6 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => router.push(`/admin/rental/${rental.id}`)}
                          className="p-1.5 text-[#4a5c50] hover:text-[#85BB45] hover:bg-[#EEF5EA] rounded-lg transition"
                          title="Lihat Detail"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => router.push(`/admin/rental/${rental.id}/edit`)}
                          className="p-1.5 text-[#4a5c50] hover:text-[#85BB45] hover:bg-[#EEF5EA] rounded-lg transition"
                          title="Ubah Data"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(rental.id)}
                          className={`p-1.5 rounded-lg transition ${
                            rental.status === 'active'
                              ? 'text-amber-500 hover:bg-amber-50'
                              : 'text-[#85BB45] hover:bg-[#EEF5EA]'
                          }`}
                          title={rental.status === 'active' ? 'Nonaktifkan' : 'Aktifkan'}
                        >
                          {rental.status === 'active' ? <PowerOff size={18} /> : <Power size={18} />}
                        </button>
                        <button
                          onClick={() => handleDelete(rental.id, rental.name)}
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
