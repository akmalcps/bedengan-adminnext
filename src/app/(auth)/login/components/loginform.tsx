'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, AtSign, Lock, Loader2, ArrowRight } from 'lucide-react';
import { authService } from '@/src/services/authService';
import { setAuthSession } from '@/src/utils/auth';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const { token, user } = await authService.login({ email, password });
      setAuthSession(token, user);
      router.push('/admin/dashboard');
    } catch (err: any) {
      setError(err?.message || 'Email atau kata sandi tidak valid.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col w-full">
      {error && (
        <div className="bg-[#FDEEEA] border border-[#E74C3C]/30 text-[#E74C3C] px-4 py-3 rounded-xl text-xs sm:text-sm text-center font-medium mb-4">
          {error}
        </div>
      )}

      {/* Email */}
      <div className="mb-4">
        <label htmlFor="email" className="block text-xs font-bold text-gray-800 mb-1.5">
          Email Petugas
        </label>
        <div className="relative flex items-center w-full">
          <AtSign className="absolute left-3.5 text-gray-400 pointer-events-none" size={18} />
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@bedenganxplore.id"
            required
            className="w-full h-[46px] pl-[38px] pr-10 border border-gray-200 rounded-xl text-sm bg-white placeholder-gray-400 focus:border-[#85BB45] focus:ring-1 focus:ring-[#85BB45] outline-none transition-all"
          />
        </div>
      </div>

      {/* Password */}
      <div className="mb-4">
        <label htmlFor="password" className="block text-xs font-bold text-gray-800 mb-1.5">
          Kata Sandi
        </label>
        <div className="relative flex items-center w-full">
          <Lock className="absolute left-3.5 text-gray-400 pointer-events-none" size={18} />
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••••••"
            required
            className="w-full h-[46px] pl-[38px] pr-10 border border-gray-200 rounded-xl text-sm bg-white placeholder-gray-400 focus:border-[#85BB45] focus:ring-1 focus:ring-[#85BB45] outline-none transition-all"
          />
          <button
            type="button"
            className="absolute right-3.5 text-gray-400 cursor-pointer p-0.5 hover:text-gray-600 transition-colors"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      {/* Checkbox & Lupa Password */}
      <div className="flex items-center justify-between mt-1 mb-5">
        <label className="flex items-center cursor-pointer select-none">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="w-4 h-4 rounded border-gray-300 text-[#85BB45] focus:ring-[#85BB45] accent-[#85BB45] cursor-pointer"
          />
          <span className="text-xs text-gray-600 ml-2">Ingat saya</span>
        </label>
        <a
          href="#"
          className="text-xs font-bold text-[#629227] hover:underline"
          onClick={(e) => e.preventDefault()}
        >
          Lupa password?
        </a>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full h-[46px] flex items-center justify-center gap-2 bg-[#85BB45] hover:bg-[#74A934] text-white font-semibold text-sm rounded-xl transition-all shadow-sm cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <>
            <Loader2 size={18} className="animate-spin text-white" />
            <span>Memproses...</span>
          </>
        ) : (
          <>
            <span>Masuk ke Dashboard</span>
            <ArrowRight size={18} />
          </>
        )}
      </button>
    </form>
  );
}
