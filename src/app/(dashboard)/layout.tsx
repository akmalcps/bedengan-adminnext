'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/src/components/layout/Sidebar';
import Topbar from '@/src/components/layout/Topbar';
import { isAuthenticated } from '@/src/utils/auth';
import { getApplications } from '@/src/services/mock/applicationService';
import '@/src/components/layout/AdminLayout.css';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pendingApplications, setPendingApplications] = useState<any[]>([]);
  const [checkedAuth, setCheckedAuth] = useState(false);

  useEffect(() => {
    // If user is not authenticated, set default demo auth if none, or redirect to login
    if (!isAuthenticated()) {
      router.replace('/login');
      return;
    }
    setCheckedAuth(true);

    const fetchPendingCount = async () => {
      try {
        const data = await getApplications();
        const pending = data.filter((item: any) => item.status === 'Pending');
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
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--color-background)' }}>
        <p style={{ color: 'var(--color-forest)', fontWeight: 500 }}>Memuat Panel Admin...</p>
      </div>
    );
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="admin-layout">
      <div className={`sidebar-overlay ${sidebarOpen ? 'active' : ''}`} onClick={() => setSidebarOpen(false)}></div>
      
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} pendingCount={pendingApplications.length} />
      
      <div className="admin-main">
        <Topbar onMenuClick={toggleSidebar} pendingApplications={pendingApplications} />
        
        <div className="admin-content">
          {children}
        </div>
      </div>
    </div>
  );
}
