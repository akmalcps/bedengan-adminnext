import type { Metadata } from 'next';
import LoginForm from './components/loginform';

export const metadata: Metadata = {
  title: 'Login - Bedengan Xplore Admin',
  description: 'Masuk ke Sistem Informasi Manajemen Katalog Bedengan Xplore',
};

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#EEF5EA] px-4 py-8">
      <div className="w-full max-w-[420px] bg-white rounded-2xl relative px-8 py-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col overflow-hidden">
        {/* Garis hijau di atas */}
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#2a4030] via-[#85BB45] to-[#96cc56]"></div>

        {/* Brand Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-6">
          <img
            src="/images/bedengan-logo2.png"
            alt="Bedengan Xplore"
            className="h-8 w-auto object-contain"
          />
          <div className="flex items-baseline gap-1.5 font-bold tracking-tight text-xl">
            <span className="text-gray-900">BEDENGAN</span>
            <span className="text-[#3F6900] text-lg font-bold">XPLORE</span>
          </div>
        </div>

        {/* Header */}
        <h1 className="text-[22px] font-bold text-gray-900 mb-1.5 text-center">
          Selamat Datang, Admin
        </h1>
        <p className="text-sm text-gray-500 mb-8 text-center">
          Sistem Informasi Manajemen Katalog Bedengan Xplore.
        </p>

        {/* Form */}
        <LoginForm />
      </div>
    </div>
  );
}
