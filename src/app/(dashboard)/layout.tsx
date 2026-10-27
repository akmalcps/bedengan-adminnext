'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/src/components/layout/Sidebar';
import Topbar from '@/src/components/layout/Topbar';
import { isAuthenticated } from '@/src/utils/auth';
import { getApplications } from '@/src/services/applicationService';
import { Application } from '@/src/types/application';
import { Loader2 } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pendingApplications, setPendingApplications] = useState<Application[]>([]);
  const [checkedAuth, setCheckedAuth] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace('/login');
      return;
    }
    setCheckedAuth(true);

    const fetchPendingCount = async () => {
      try {
        const data = await getApplications();
        const pending = data.filter((item: Application) => item.status === 'Pending');
        setPendingApplications(pending);
      } catch (error) {
        console.error('Error fetching pending count:', error);
      }
    };

    fetchPendingCount();

    window.addEventListener('applications_updated', fetchPendingCount);
    return () => window.removeEventListener('applications_updated', fetchPendingCount);
  }, [router]);

  if (!checkedAuth) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#EEF5EA] gap-3">
        <Loader2 className="animate-spin text-[#85BB45]" size={36} />
        <p className="text-[#1C2B20] font-medium text-sm">Memuat Panel Admin...</p>
      </div>
    );
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen flex bg-[#EEF5EA]">
      {/* Mobile Backdrop Overlay */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-xs z-40 lg:hidden transition-opacity duration-300 ${
          sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar Component */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        pendingCount={pendingApplications.length}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-x-hidden">
        <Topbar onMenuClick={toggleSidebar} pendingApplications={pendingApplications} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
