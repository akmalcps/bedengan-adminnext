'use client';

import React from 'react';
import { LogOut, Save, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { logout } from '@/src/utils/auth';

export default function Settings() {
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h2>Pengaturan</h2>
          <p>Konfigurasi admin dan preferensi aplikasi.</p>
        </div>
      </div>

      <div className="dashboard-grid-2">
        <div className="card">
          <h3 style={{ fontSize: '1.25rem', color: 'var(--color-forest)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <User size={20} /> Profil Admin
          </h3>
          
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label>Email / Username</label>
            <input type="text" value="admin@bedenganxplore.test" disabled style={{ backgroundColor: 'var(--color-background)' }} />
          </div>

          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label>Password Baru</label>
            <input type="password" placeholder="Kosongkan jika tidak ingin mengubah" />
          </div>

          <button className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
            <Save size={18} /> Simpan Profil
          </button>
        </div>

        <div className="card">
          <h3 style={{ fontSize: '1.25rem', color: 'var(--color-forest)', marginBottom: '1.5rem' }}>Sesi & Keamanan</h3>
          
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: '2rem', lineHeight: 1.5 }}>
            Anda masuk sebagai admin utama. Pastikan untuk selalu keluar (logout) jika menggunakan perangkat publik atau perangkat yang digunakan bersama.
          </p>

          <button className="btn-danger" onClick={handleLogout} style={{ width: '100%', justifyContent: 'center' }}>
            <LogOut size={18} /> Keluar / Logout
          </button>
        </div>
      </div>
    </div>
  );
}
