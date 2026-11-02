'use client';

import React, { useState, useEffect } from 'react';
import { LogOut, Save, User, ShieldCheck, Loader2, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { logout, getUser, setAuthSession, getToken } from '@/src/utils/auth';
import { authService } from '@/src/services/authService';
import { AdminUser } from '@/src/types/auth';

export default function SettingsView() {
  const router = useRouter();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [name, setName] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const localUser = getUser();
    if (localUser) {
      setUser(localUser);
      setName(localUser.name || '');
    }

    // Ambil profil terbaru dari backend
    authService
      .getProfile()
      .then((profile) => {
        setUser(profile);
        setName(profile.name || '');
      })
      .catch((err) => {
        console.warn('Gagal memuat profil admin:', err);
      });
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (!name.trim()) {
      errs.name = 'Nama lengkap wajib diisi!';
    }

    if (newPassword) {
      if (!currentPassword) {
        errs.currentPassword = 'Password saat ini wajib diisi jika ingin mengganti password!';
      }
      if (newPassword.length < 6) {
        errs.newPassword = 'Password baru minimal 6 karakter!';
      }
      if (newPassword !== confirmPassword) {
        errs.confirmPassword = 'Konfirmasi password baru tidak cocok!';
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage('');

    if (!validate()) {
      return;
    }

    setIsSaving(true);
    try {
      const payload: { name: string; current_password?: string; new_password?: string } = {
        name: name.trim(),
      };

      if (newPassword) {
        payload.current_password = currentPassword;
        payload.new_password = newPassword;
      }

      const updatedUser = await authService.updateProfile(payload);
      const token = getToken();
      if (token) {
        setAuthSession(token, updatedUser);
      }
      setUser(updatedUser);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setSuccessMessage('Profil dan pengaturan keamanan berhasil diperbarui di database!');
    } catch (err: any) {
      setErrors({ api: err?.message || 'Gagal memperbarui profil admin.' });
    } finally {
      setIsSaving(false);
    }
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

          {successMessage && (
            <div className="flex items-center gap-2 bg-[#EEF5EA] border border-[#85BB45]/30 text-[#3F6900] px-4 py-3 rounded-xl text-xs sm:text-sm font-medium">
              <CheckCircle2 size={16} />
              <span>{successMessage}</span>
            </div>
          )}

          {errors.api && (
            <div className="bg-[#FDEEEA] border border-[#E74C3C]/30 text-[#E74C3C] px-4 py-3 rounded-xl text-xs sm:text-sm font-medium">
              {errors.api}
            </div>
          )}

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#1C2B20]">Email / Username</label>
              <input
                type="text"
                value={user?.email || 'admin@bedengan.com'}
                disabled
                className="w-full px-4 py-2.5 rounded-xl border border-[#d4e0d7] bg-[#EEF5EA]/60 text-sm text-[#4a5c50] cursor-not-allowed"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#1C2B20]">Nama Lengkap *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
                }}
                className={`w-full px-4 py-2.5 rounded-xl border text-sm text-[#1C2B20] focus:outline-none ${
                  errors.name ? 'border-red-500 focus:border-red-500' : 'border-[#d4e0d7] focus:border-[#85BB45]'
                }`}
              />
              {errors.name && <p className="text-red-500 text-xs font-medium">{errors.name}</p>}
            </div>

            <div className="pt-2 border-t border-[#d4e0d7]/60 space-y-3">
              <p className="text-xs font-bold text-[#1C2B20]">Ganti Kata Sandi (Opsional)</p>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[#4a5c50]">Password Saat Ini</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => {
                    setCurrentPassword(e.target.value);
                    if (errors.currentPassword) setErrors((prev) => ({ ...prev, currentPassword: '' }));
                  }}
                  placeholder="Masukkan password saat ini"
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm text-[#1C2B20] focus:outline-none ${
                    errors.currentPassword ? 'border-red-500 focus:border-red-500' : 'border-[#d4e0d7] focus:border-[#85BB45]'
                  }`}
                />
                {errors.currentPassword && (
                  <p className="text-red-500 text-xs font-medium">{errors.currentPassword}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[#4a5c50]">Password Baru</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    if (errors.newPassword) setErrors((prev) => ({ ...prev, newPassword: '' }));
                  }}
                  placeholder="Minimal 6 karakter"
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm text-[#1C2B20] focus:outline-none ${
                    errors.newPassword ? 'border-red-500 focus:border-red-500' : 'border-[#d4e0d7] focus:border-[#85BB45]'
                  }`}
                />
                {errors.newPassword && (
                  <p className="text-red-500 text-xs font-medium">{errors.newPassword}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[#4a5c50]">Konfirmasi Password Baru</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: '' }));
                  }}
                  placeholder="Ulangi password baru"
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm text-[#1C2B20] focus:outline-none ${
                    errors.confirmPassword ? 'border-red-500 focus:border-red-500' : 'border-[#d4e0d7] focus:border-[#85BB45]'
                  }`}
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-xs font-medium">{errors.confirmPassword}</p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#85BB45] hover:bg-[#74A934] text-white text-sm font-semibold rounded-xl shadow-xs transition disabled:opacity-70"
            >
              {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              <span>{isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
            </button>
          </form>
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
