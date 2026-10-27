'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Tent,
  Utensils,
  Camera,
  ClipboardList,
  Settings,
  LogOut,
  X
} from 'lucide-react';
import { logout, getUser } from '@/src/utils/auth';
import { AdminUser } from '@/src/types/auth';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  pendingCount?: number;
}

export default function Sidebar({ isOpen, onClose, pendingCount = 0 }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<AdminUser | null>(null);

  useEffect(() => {
    setUser(getUser());
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Rental Camping', path: '/admin/rental', icon: Tent },
    { label: 'Warung & Kuliner', path: '/admin/warung', icon: Utensils },
    { label: 'Fotografer', path: '/admin/fotografer', icon: Camera },
    {
      label: 'Pengajuan Usaha',
      path: '/admin/pendaftaran',
      icon: ClipboardList,
      badge: pendingCount > 0 ? pendingCount : null,
    },
  ];

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 lg:static lg:translate-x-0 w-64 bg-[#1C2B20] text-white flex flex-col transition-transform duration-300 ease-in-out shrink-0 ${
        isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
      }`}
    >
      {/* Header */}
      <div className="p-5 flex flex-col gap-3 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/images/bedengan-logo.png"
              alt="Bedengan Xplore"
              className="w-8 h-8 object-contain"
            />
            <div className="flex flex-col leading-tight">
              <span className="text-white font-bold text-base tracking-wide uppercase">
                BEDENGAN
              </span>
              <span className="text-[#85BB45] font-semibold text-xs tracking-wider uppercase">
                XPLORE
              </span>
            </div>
          </div>
          {/* Close button on mobile */}
          <button
            onClick={onClose}
            className="lg:hidden p-1 text-[#AAB8AE] hover:text-white rounded-lg transition"
            aria-label="Tutup Menu"
          >
            <X size={20} />
          </button>
        </div>

        <div className="inline-flex items-center gap-1.5 bg-white/10 px-2.5 py-1 rounded-full text-[11px] text-[#AAB8AE] w-fit">
          <span className="w-1.5 h-1.5 rounded-full bg-[#85BB45]" />
          Admin Panel
        </div>
      </div>

      {/* Nav list */}
      <nav className="flex-1 overflow-y-auto px-3.5 py-4 flex flex-col gap-1.5">
        {navItems.map((item, index) => {
          const isActive =
            pathname === item.path ||
            (item.path !== '/admin/dashboard' && pathname?.startsWith(item.path));
          const Icon = item.icon;

          return (
            <Link
              key={index}
              href={item.path}
              onClick={onClose}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${
                isActive
                  ? 'bg-[#85BB45] text-[#1C2B20] font-semibold shadow-sm'
                  : 'text-[#AAB8AE] hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon
                size={18}
                strokeWidth={isActive ? 2.5 : 2}
                className={isActive ? 'text-[#1C2B20]' : 'text-[#AAB8AE]'}
              />
              <span className="flex-1 truncate">{item.label}</span>
              {item.badge && (
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                    isActive ? 'bg-[#1C2B20] text-white' : 'bg-[#85BB45] text-[#1C2B20]'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}

        <div className="h-px bg-white/10 my-2" />

        <Link
          href="/admin/settings"
          onClick={onClose}
          className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${
            pathname === '/admin/settings'
              ? 'bg-[#85BB45] text-[#1C2B20] font-semibold shadow-sm'
              : 'text-[#AAB8AE] hover:text-white hover:bg-white/5'
          }`}
        >
          <Settings size={18} strokeWidth={2} className="text-[#AAB8AE]" />
          <span className="flex-1">Pengaturan</span>
        </Link>
      </nav>

      {/* Footer Profile */}
      <div className="p-3.5 border-t border-white/10">
        <div className="flex items-center gap-3 bg-white/5 p-2.5 rounded-xl">
          <div className="w-9 h-9 rounded-full bg-[#85BB45] text-[#1C2B20] font-bold flex items-center justify-center text-xs shrink-0 uppercase">
            {user?.initials || user?.name?.slice(0, 2) || 'AD'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-xs font-semibold truncate leading-tight">
              {user?.name || 'Admin Bedengan'}
            </p>
            <p className="text-[#AAB8AE] text-[11px] truncate mt-0.5">
              {user?.role || 'Administrator'}
            </p>
          </div>
          <button
            onClick={handleLogout}
            title="Keluar"
            className="p-1.5 text-[#AAB8AE] hover:text-red-400 hover:bg-white/10 rounded-lg transition"
          >
            <LogOut size={16} strokeWidth={2} />
          </button>
        </div>
      </div>
    </aside>
  );
}
