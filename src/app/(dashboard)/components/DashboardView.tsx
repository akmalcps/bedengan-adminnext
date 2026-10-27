'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  UtensilsCrossed,
  Tent,
  Camera,
  ClipboardList,
  Plus,
  ChevronRight,
  Loader2,
} from 'lucide-react';
import {
  dashboardService,
  DashboardStats,
  ActivityItem,
} from '@/src/services/dashboardService';
import { Application } from '@/src/types/application';

export default function DashboardView() {
  const [stats, setStats] = useState<DashboardStats>({
    totalWarung: 0,
    totalRental: 0,
    totalFotografer: 0,
    pendingPendaftaran: 0,
  });
  const [pendingApps, setPendingApps] = useState<Application[]>([]);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsData, appsData, activitiesData] = await Promise.all([
          dashboardService.getStats(),
          dashboardService.getPendingApplications(),
          dashboardService.getRecentActivities(),
        ]);

        setStats(statsData);
        setPendingApps(appsData);
        setActivities(activitiesData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="p-12 flex flex-col items-center justify-center gap-3 text-[#4a5c50]">
        <Loader2 className="animate-spin text-[#85BB45]" size={32} />
        <p className="text-sm font-medium">Memuat data Dashboard...</p>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Warung & Kuliner',
      count: stats.totalWarung,
      icon: UtensilsCrossed,
      bgColor: 'bg-[#85BB45]/15',
      iconColor: 'text-[#3F6900]',
    },
    {
      title: 'Total Rental Camping',
      count: stats.totalRental,
      icon: Tent,
      bgColor: 'bg-[#1C2B20]/10',
      iconColor: 'text-[#1C2B20]',
    },
    {
      title: 'Total Fotografer',
      count: stats.totalFotografer,
      icon: Camera,
      bgColor: 'bg-[#4a5c50]/10',
      iconColor: 'text-[#4a5c50]',
    },
    {
      title: 'Pendaftaran Menunggu',
      count: stats.pendingPendaftaran,
      icon: ClipboardList,
      bgColor: 'bg-amber-500/15',
      iconColor: 'text-amber-600',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-[#1C2B20]">Dashboard Admin</h2>
        <p className="text-sm text-[#4a5c50] mt-0.5">
          Pantau ringkasan statistik dan aktivitas ekosistem Bedengan Xplore.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {statCards.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-2xl p-5 border border-[#d4e0d7] shadow-xs hover:shadow-md transition flex items-center gap-4"
            >
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${item.bgColor} ${item.iconColor}`}
              >
                <Icon size={26} />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-[#8b9d91] truncate">{item.title}</p>
                <p className="text-2xl font-extrabold text-[#1C2B20] mt-0.5">{item.count}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="space-y-3">
        <h3 className="text-base font-bold text-[#1C2B20]">Aksi Cepat</h3>
        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={() => router.push('/admin/warung/create')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#85BB45] hover:bg-[#74A934] text-white text-xs font-semibold shadow-xs transition"
          >
            <Plus size={16} /> Tambah Warung
          </button>
          <button
            onClick={() => router.push('/admin/rental/create')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#85BB45] hover:bg-[#74A934] text-white text-xs font-semibold shadow-xs transition"
          >
            <Plus size={16} /> Tambah Rental
          </button>
          <button
            onClick={() => router.push('/admin/fotografer/create')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#85BB45] hover:bg-[#74A934] text-white text-xs font-semibold shadow-xs transition"
          >
            <Plus size={16} /> Tambah Fotografer
          </button>
          <button
            onClick={() => router.push('/admin/pendaftaran')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#d4e0d7] bg-white hover:bg-[#EEF5EA] text-[#1C2B20] text-xs font-semibold shadow-xs transition"
          >
            <ClipboardList size={16} /> Review Pengajuan
          </button>
        </div>
      </div>

      {/* 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Pending Reviews */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-[#1C2B20]">Pengajuan Menunggu Review</h3>
            <Link
              href="/admin/pendaftaran"
              className="text-xs font-semibold text-[#85BB45] hover:underline"
            >
              Lihat Semua &rarr;
            </Link>
          </div>

          <div className="bg-white rounded-2xl border border-[#d4e0d7] p-4 sm:p-5 shadow-xs">
            {pendingApps.length > 0 ? (
              <div className="divide-y divide-[#d4e0d7]/70">
                {pendingApps.map((app) => (
                  <div
                    key={app.id}
                    className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-[#1C2B20] truncate">
                        {app.businessName}
                      </p>
                      <p className="text-xs text-[#8b9d91] truncate mt-0.5">
                        {app.category} • {app.applicantName}
                      </p>
                    </div>
                    <button
                      onClick={() => router.push(`/admin/pendaftaran/${app.id}`)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#85BB45]/15 text-[#3F6900] hover:bg-[#85BB45] hover:text-white text-xs font-semibold transition shrink-0"
                    >
                      <span>Review</span>
                      <ChevronRight size={14} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#8b9d91] text-center py-6">
                Tidak ada pengajuan baru saat ini.
              </p>
            )}
          </div>
        </div>

        {/* Right Column: Recent Activities */}
        <div className="space-y-3">
          <h3 className="text-base font-bold text-[#1C2B20]">Aktivitas Terbaru</h3>
          <div className="bg-white rounded-2xl border border-[#d4e0d7] p-5 shadow-xs">
            <div className="space-y-4">
              {activities.map((act) => (
                <div key={act.id} className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-[#85BB45] mt-1.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-[#1C2B20] leading-snug">
                      {act.message}
                    </p>
                    <span className="text-[10px] text-[#8b9d91] block mt-0.5">{act.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
