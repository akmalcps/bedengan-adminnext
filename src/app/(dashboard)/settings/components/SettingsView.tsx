'use client';

import React, { useState, useEffect } from 'react';
import { LogOut, Save, User, ShieldCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { logout, getUser } from '@/src/utils/auth';
import { AdminUser } from '@/src/types/auth';

export default function SettingsView() {
  const router = useRouter();
  const [user, setUser] = useState<AdminUser | null>(null);

  useEffect(() => {
    setUser(getUser());
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-[#1C2B20]">Pengaturan</h2>
        <p className="text-sm text-[#4a5c50] mt-0.5">Konfigurasi admin dan preferensi sesi.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl border border-[#d4e0d7] p-6 shadow-sm space-y-5">
          <h3 className="text-base font-bold text-[#1C2B20] flex items-center gap-2 pb-2 border-b border-[#d4e0d7]">
            <User size={18} className="text-[#85BB45]" />
            <span>Profil Admin</span>
          </h3>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#1C2B20]">Email / Username</label>
            <input
              type="text"
              value={user?.email || 'admin@bedenganxplore.test'}
              disabled
              className="w-full px-4 py-2.5 rounded-xl border border-[#d4e0d7] bg-[#EEF5EA]/60 text-sm text-[#4a5c50] cursor-not-allowed"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#1C2B20]">Nama Lengkap</label>
            <input
              type="text"
              defaultValue={user?.name || 'Admin Bedengan'}
              className="w-full px-4 py-2.5 rounded-xl border border-[#d4e0d7] text-sm text-[#1C2B20] focus:outline-none focus:border-[#85BB45]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#1C2B20]">Password Baru</label>
            <input
              type="password"
              placeholder="Kosongkan jika tidak ingin mengubah"
              className="w-full px-4 py-2.5 rounded-xl border border-[#d4e0d7] text-sm text-[#1C2B20] focus:outline-none focus:border-[#85BB45]"
            />
          </div>

          <button
            onClick={() => alert('Profil berhasil diperbarui!')}
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#85BB45] hover:bg-[#74A934] text-white text-sm font-semibold rounded-xl shadow-xs transition"
          >
            <Save size={16} /> Simpan Perubahan
          </button>
        </div>

        {/* Security / Session Card */}
        <div className="bg-white rounded-2xl border border-[#d4e0d7] p-6 shadow-sm space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-base font-bold text-[#1C2B20] flex items-center gap-2 pb-2 border-b border-[#d4e0d7]">
              <ShieldCheck size={18} className="text-[#85BB45]" />
              <span>Sesi & Keamanan</span>
            </h3>

            <p className="text-sm text-[#4a5c50] leading-relaxed">
              Anda saat ini aktif sebagai Administrator Bedengan Xplore. Selalu pastikan untuk
              keluar (logout) jika sedang menggunakan perangkat bersama atau komputer umum demi
              menjaga keamanan data.
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 text-sm font-semibold rounded-xl transition"
          >
            <LogOut size={16} /> Keluar / Logout
          </button>
        </div>
      </div>
    </div>
  );
}
