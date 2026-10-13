import type { Metadata } from 'next';
import LoginForm from './components/loginform';
import './Login.css';

export const metadata: Metadata = {
  title: 'Login - Bedengan Xplore Admin',
  description: 'Masuk ke Sistem Informasi Manajemen Katalog Bedengan Xplore',
};

export default function LoginPage() {
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

        <LoginForm />
      </div>
    </div>
  );
}
