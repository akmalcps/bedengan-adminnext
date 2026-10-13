'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, AtSign, Lock } from 'lucide-react';
import { login, isAuthenticated } from '@/src/utils/auth';
import '@/src/legacy-pages/auth/Login.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated()) {
      router.replace('/admin/dashboard');
    }
  }, [router]);

  const handleSubmit = (e) => {
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
    <div className="login-container">
      <div className="login-card">
        <div className="login-brand">
          <img src="/images/bedengan-logo2.png" alt="Bedengan Xplore" className="login-brand-logo" />
          <div className="login-brand-name">
            <span className="brand-bedengan">BEDENGAN</span>
            <span className="brand-xplore"> XPLORE</span>
          </div>
        </div>

        <div className="login-header">
          <h1>Selamat Datang, Admin</h1>
          <p>Sistem Informasi Manajemen Katalog Bedengan Xplore.</p>
        </div>

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
      </div>
    </div>
  );
}
