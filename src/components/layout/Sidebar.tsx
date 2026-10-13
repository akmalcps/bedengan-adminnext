'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Tent,
  Utensils,
  Camera,
  ClipboardList,
  Settings,
  LogOut
} from 'lucide-react';
import { logout } from '@/src/utils/auth';
import { currentAdmin } from '@/src/data/mock/adminMock';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  pendingCount?: number;
}

export default function Sidebar({ isOpen, onClose, pendingCount = 0 }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const navItems = [
    { label: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Rental Camping", path: "/admin/rental", icon: Tent },
    { label: "Warung & Kuliner", path: "/admin/warung", icon: Utensils },
    { label: "Fotografer", path: "/admin/fotografer", icon: Camera },
    { label: "Pengajuan\nUsaha/Jasa", path: "/admin/pendaftaran", icon: ClipboardList, badge: pendingCount > 0 ? pendingCount : null }
  ];

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <div className="sidebar-brand">
          <img src="/images/bedengan-logo.png" alt="Bedengan Xplore" className="brand-logo" />
          <div className="brand-text">
            <span className="brand-bedengan">BEDENGAN</span>
            <span className="brand-xplore">XPLORE</span>
          </div>
        </div>
        <div className="admin-panel-badge">
          <span className="status-dot"></span> Admin Panel
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item, index) => {
          const isActive = pathname === item.path || (item.path !== '/admin/dashboard' && pathname?.startsWith(item.path));
          const Icon = item.icon;
          return (
            <Link
              key={index}
              href={item.path}
              className={`nav-item ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              <span className="icon-wrapper"><Icon size={18} strokeWidth={2.5} /></span>
              <span className="nav-label" style={{ whiteSpace: 'pre-line' }}>{item.label}</span>
              {item.badge && <span className="nav-badge">{item.badge}</span>}
            </Link>
          );
        })}

        <div className="nav-divider"></div>

        <Link
          href="/admin/settings"
          className={`nav-item ${pathname === '/admin/settings' ? 'active' : ''}`}
          onClick={onClose}
        >
          <span className="icon-wrapper"><Settings size={18} strokeWidth={2.5} /></span>
          <span className="nav-label">Pengaturan</span>
        </Link>
      </nav>

      <div className="sidebar-footer">
        <div className="profile-card">
          <div className="profile-avatar">{currentAdmin.initials}</div>
          <div className="profile-info">
            <span className="profile-name">{currentAdmin.name}</span>
            <span className="profile-role">{currentAdmin.role}</span>
          </div>
          <button className="logout-btn" onClick={handleLogout} title="Logout">
            <LogOut size={18} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </aside>
  );
}
