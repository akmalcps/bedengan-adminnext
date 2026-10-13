'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, AtSign, Lock } from 'lucide-react';
import { login } from '@/src/utils/auth';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      if (login(email, password)) {
        router.push('/admin/dashboard');
      } else {
        setError('Email atau kata sandi tidak valid. (Gunakan email default & password: admin123)');
        setIsLoading(false);
      }
    }, 400);
  };

  return (
    <form onSubmit={handleSubmit} className="login-form">
      {error && <div className="login-error">{error}</div>}

      <div className="form-group">
        <label htmlFor="email">Email Petugas</label>
        <div className="input-with-icon">
          <AtSign className="input-icon left-icon" size={18} />
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@bedenganxplore.id"
            required
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="password">Kata Sandi</label>
        <div className="input-with-icon">
          <Lock className="input-icon left-icon" size={18} />
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••••••"
            required
          />
          <button
            type="button"
            className="toggle-password"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      <div className="login-options">
        <label className="remember-me">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
          <span>Ingat saya</span>
        </label>
        <a href="#" className="forgot-password" onClick={(e) => e.preventDefault()}>
          Lupa password?
        </a>
      </div>

      <button type="submit" className="login-submit-btn" disabled={isLoading}>
        {isLoading ? 'Memproses...' : 'Masuk ke Dashboard →'}
      </button>
    </form>
  );
}
