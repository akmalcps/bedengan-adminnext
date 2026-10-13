import Link from 'next/link';
import './not-found.css';

export default function NotFound() {
  return (
    <div className="not-found-container">
      <h1>404</h1>
      <h2>Halaman Tidak Ditemukan</h2>
      <p>Halaman yang Anda cari tidak ada atau telah dipindahkan.</p>
      <Link href="/admin/dashboard" className="back-home-btn">
        Kembali ke Dashboard
      </Link>
    </div>
  );
}
