'use client';

import React, { useState, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, Bell, CheckCircle2 } from 'lucide-react';
import { getUser } from '@/src/utils/auth';
import { AdminUser } from '@/src/types/auth';
import { Application } from '@/src/types/application';

interface TopbarProps {
  onMenuClick: () => void;
  pendingApplications?: Application[];
}

export default function Topbar({ onMenuClick, pendingApplications = [] }: TopbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<AdminUser | null>(null);

  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  const pendingCount = pendingApplications.length;

  useEffect(() => {
    setUser(getUser());
  }, []);

  const pathParts = (pathname || '').split('/').filter((p) => p && p !== 'admin');
  const pageTitles: Record<string, string> = {
    dashboard: 'Dashboard',
    warung: 'Warung & Kuliner',
    rental: 'Rental Camping',
    fotografer: 'Fotografer',
    pendaftaran: 'Pengajuan Usaha/Jasa',
    kawasan: 'Kawasan Bedengan',
    settings: 'Pengaturan',
    create: 'Tambah Data',
    edit: 'Ubah Data',
  };

  const lastPart = pathParts.length > 0 ? pathParts[pathParts.length - 1] : 'dashboard';
  const currentTitle =
    pageTitles[lastPart] || (lastPart.charAt(0).toUpperCase() + lastPart.slice(1));

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsNotificationOpen(false);
      }
    };

    if (isNotificationOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isNotificationOpen]);

  useEffect(() => {
    setIsNotificationOpen(false);
  }, [pathname]);

  const formatTimeAgo = (dateString?: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return 'Baru saja';
    if (diffHours < 24) return `${diffHours} jam lalu`;
    return `${diffDays} hari lalu`;
  };

  const handleNotificationClick = (appId: string) => {
    setIsNotificationOpen(false);
    router.push(`/admin/pendaftaran/${appId}`);
  };

  const handleViewAll = () => {
    setIsNotificationOpen(false);
    router.push('/admin/pendaftaran');
  };

  return (
    <header className="h-16 bg-white border-b border-[#d4e0d7] flex items-center justify-between px-4 sm:px-6 sticky top-0 z-30">
      {/* Left side */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 text-[#1C2B20] hover:bg-[#EEF5EA] rounded-xl transition"
          aria-label="Toggle Menu"
        >
          <Menu size={22} />
        </button>
        <h1 className="text-base sm:text-lg font-bold text-[#1C2B20] tracking-tight">
          {currentTitle}
        </h1>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3 sm:gap-5">
        {/* Notification dropdown */}
        <div className="relative" ref={notificationRef}>
          <button
            onClick={() => setIsNotificationOpen(!isNotificationOpen)}
            className="relative p-2 text-[#4a5c50] hover:text-[#85BB45] hover:bg-[#EEF5EA] rounded-xl transition"
            aria-label="Notifikasi"
            aria-expanded={isNotificationOpen}
          >
            <Bell size={20} />
            {pendingCount > 0 && (
              <span className="absolute top-1 right-1 bg-[#e74c3c] text-white text-[10px] font-bold px-1.5 h-4 min-w-4 rounded-full flex items-center justify-center">
                {pendingCount}
              </span>
            )}
          </button>

          {isNotificationOpen && (
            <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-[#d4e0d7] z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="p-4 border-b border-[#d4e0d7]">
                <h3 className="font-bold text-sm text-[#1C2B20]">Notifikasi</h3>
                {pendingCount > 0 && (
                  <span className="text-xs text-[#8b9d91]">
                    {pendingCount} pengajuan menunggu review
                  </span>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-[#d4e0d7]/60">
                {pendingCount > 0 ? (
                  pendingApplications.map((app) => (
                    <button
                      key={app.id}
                      onClick={() => handleNotificationClick(app.id)}
                      className="w-full text-left p-3.5 flex items-start gap-3 hover:bg-[#EEF5EA]/60 transition"
                    >
                      <span className="w-2 h-2 rounded-full bg-[#85BB45] mt-1.5 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-[#1C2B20] truncate">
                          {app.businessName}
                        </p>
                        <p className="text-[11px] text-[#4a5c50] truncate">
                          {app.applicantName} • {app.category}
                        </p>
                        <span className="text-[10px] text-[#8b9d91] block mt-1">
                          {formatTimeAgo(app.submittedAt)}
                        </span>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="p-6 text-center flex flex-col items-center justify-center gap-2">
                    <CheckCircle2 size={28} className="text-[#85BB45]" />
                    <p className="text-xs font-semibold text-[#1C2B20]">Tidak ada pengajuan baru</p>
                    <p className="text-[11px] text-[#8b9d91]">Semua pengajuan sudah diproses.</p>
                  </div>
                )}
              </div>

              <div className="p-3 bg-[#EEF5EA]/40 border-t border-[#d4e0d7]">
                <button
                  onClick={handleViewAll}
                  className="w-full text-center text-xs font-semibold text-[#1C2B20] hover:text-[#85BB45] transition py-1"
                >
                  Lihat semua pengajuan &rarr;
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Profile info */}
        <div className="flex items-center gap-3 pl-3 border-l border-[#d4e0d7]">
          <div className="hidden md:flex flex-col text-right">
            <span className="text-xs font-bold text-[#1C2B20] leading-tight">
              {user?.name || 'Admin'}
            </span>
            <span className="text-[10px] text-[#8b9d91]">
              {user?.role || 'Administrator'}
            </span>
          </div>
          <img
            src={
              user?.avatar ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                user?.name || 'Admin'
              )}&background=85BB45&color=fff`
            }
            alt="Profile"
            className="w-9 h-9 rounded-full object-cover ring-2 ring-[#85BB45]/30 shrink-0"
          />
        </div>
      </div>
    </header>
  );
}
