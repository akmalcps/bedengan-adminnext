# Bedengan Xplore - Web Admin Dashboard

<div align="center">

![Bedengan Xplore Banner](https://img.shields.io/badge/Bedengan_Xplore-Admin_Dashboard-85BB45?style=for-the-badge&logo=forest&logoColor=white)

[![Next.js](https://img.shields.io/badge/Next.js_15-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript_5_(Strict)-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![React](https://img.shields.io/badge/React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![REST API](https://img.shields.io/badge/REST_API-Integrated-FF6C37?style=for-the-badge&logo=postman&logoColor=white)](#-integrasi-rest-api)
[![Status](https://img.shields.io/badge/Status-Production_Ready-success?style=for-the-badge)](#)

<p align="center">
  <strong>Sistem Informasi Manajemen Katalog & Layanan Operasional Terpadu Wisata Alam Bedengan</strong>
</p>

<p align="center">
  Platform administrasi berbasis web modern berstandar enterprise yang dirancang untuk mengelola seluruh ekosistem katalog kawasan, reservasi rental perlengkapan, layanan fotografer profesional, hingga digitalisasi tenant warung UMKM secara terpusat, aman, dan efisien.
</p>

</div>

---

## 📑 Daftar Isi

- [Gambaran Umum](#-gambaran-umum)
- [Teknologi & Tech Stack](#-teknologi--tech-stack)
- [Arsitektur Proyek (Project-Based Learning)](#-arsitektur-proyek-project-based-learning)
  - [Prinsip Desain & Layering](#prinsip-desain--layering)
  - [Struktur Direktori](#struktur-direktori)
- [Fitur Utama Sistem](#-fitur-utama-sistem)
- [Kredensial Default (Akses Pengujian)](#-kredensial-default-akses-pengujian)
- [Panduan Instalasi & Memulai](#-panduan-instalasi--memulai)
  - [Prasyarat Sistem](#prasyarat-sistem)
  - [Langkah Instalasi](#langkah-instalasi)
  - [Konfigurasi Environment](#konfigurasi-environment)
- [Integrasi REST API](#-integrasi-rest-api)
- [Standar Kualitas & Konvensi Kode](#-standar-kualitas--konvensi-kode)
- [Lisensi & Kepemilikan](#-lisensi--kepemilikan)

---

## 🌿 Gambaran Umum

**Bedengan Xplore Web Admin Dashboard** merupakan solusi digital kelas korporasi yang dibangun khusus untuk mendukung pengelolaan operasional destinasi wisata alam Bedengan. Sistem ini mengonsolidasikan data multidimensi ke dalam satu antarmuka terintegrasi dengan performa tinggi, responsif, dan ramah pengguna (*user-friendly*).

Sistem memungkinkan pengelola wisata untuk:
- Memantau metrik operasional dan pertumbuhan ekosistem wisata secara *real-time*.
- Mengelola data inventaris kawasan wisata, spot berkemah (*camping ground*), dan fasilitas pendukung.
- Mengatur katalog penyewaan perlengkapan wisata (*outdoor equipment*) serta kontrol ketersediaan unit.
- Mengkoordinasikan mitra fotografer dan verifikasi portofolio layanan dokumentasi.
- Mengintegrasikan pelaku usaha mikro (warung makan/minuman) demi pemberdayaan ekonomi lokal.

---

## 🛠️ Teknologi & Tech Stack

Proyek ini dibangun di atas fondasi teknologi web modern dengan fokus pada skalabilitas, performa optimal, dan integritas tipe data tingkat tinggi:

| Komponen | Teknologi | Deskripsi |
| :--- | :--- | :--- |
| **Framework Utama** | **Next.js 15 (App Router)** | Framework full-stack React generasi terbaru dengan optimasi rendering, route grouping `(auth)` & `(dashboard)`, server-driven routing, dan arsitektur modular. |
| **Bahasa Pemrograman** | **TypeScript (Strict Mode)** | Penulisan kode 100% *Type-Safe* dengan validasi statis ketat guna mengeliminasi *runtime bug* dan menjamin kepatuhan kontrak data. |
| **Styling & UI Engine** | **Tailwind CSS v4** | Mesin CSS performa tinggi berbasis *CSS variables* dan `@theme` tokens, mendukung responsivitas adaptif dan estetika modern (*glassmorphism*, mikro-animasi). |
| **Iconography** | **Lucide React** | Pustaka ikon vektor modern yang konsisten, bersih, dan berbobot visual presisi. |
| **Komunikasi Data** | **REST API Integration** | Klien HTTP terpusat (`apiClient`) dengan injeksi *Bearer Authorization*, manajemen status HTTP, dan *error handling* standar korporasi. |
| **Manajemen State & Sesi** | **Client-Side Token Auth** | Mekanisme persistensi sesi berbasis token pada *Secure Local Storage* dilengkapi *route guard* dan penanganan kedaluwarsa token. |

---

## 🏗️ Arsitektur Proyek (Project-Based Learning)

Proyek ini dikembangkan menggunakan paradigma **Project-Based Learning (PBL)** dengan menerapkan standar rekayasa perangkat lunak industri. Sistem dirancang dengan **pemisahan layer yang bersih (*Separation of Concerns*)** dan menggaransi **100% Type-Safe Architecture**.

```
┌─────────────────────────────────────────────────────────────┐
│                   PRESENTATION / UI LAYER                   │
│        Next.js 15 App Router (`(auth)`, `(dashboard)`)       │
│               Tailwind CSS v4 + Lucide React                │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                        SERVICES LAYER                       │
│    `apiClient.ts`, `authService.ts`, `kawasanService.ts`,   │
│     `rentalService.ts`, `fotograferService.ts`, dll.        │
│          (Abstraksi REST API & Centralized Error)           │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                         TYPES LAYER                         │
│           100% Strict Type Definitions & Contracts          │
│       `api.ts`, `auth.ts`, `kawasan.ts`, `rental.ts`        │
└─────────────────────────────────────────────────────────────┘
```

### Prinsip Desain & Layering

1. **Types Layer (`src/types/`)**
   - Mendefinisikan seluruh kontrak data (*Data Transfer Objects* / DTO), struktur entitas model, dan format respons API (`ApiResponse<T>`, `PaginationMeta`).
   - Tidak ada ketergantungan runtime; menjadi sumber kebenaran tunggal (*Single Source of Truth*) bagi tipe data di seluruh modul aplikasi.

2. **Services Layer (`src/services/`)**
   - Mengisolasi seluruh interaksi protokol HTTP dan integrasi REST API dari komponen presentasi.
   - Mengimplementasikan `apiClient` terpusat yang secara otomatis menyisipkan *token header*, mengurai payload, serta menangani galat terstruktur melalui kelas `ApiError`.

3. **Presentation & Components Layer (`src/app/`, `src/components/`)**
   - Komponen UI murni (*stateless/stateful*) yang hanya bertugas menyajikan antarmuka dan merespons interaksi pengguna.
   - Pemisahan rute menggunakan Route Groups Next.js:
     - `src/app/(auth)/` untuk alur otentikasi (login, pemulihan sandi).
     - `src/app/(dashboard)/` untuk alur kerja operasional administrasi.

4. **Utilities & Guards Layer (`src/utils/`)**
   - Menyediakan utilitas manajemen sesi (`setAuthSession`, `isAuthenticated`, `logout`), format mata uang Rupiah, dan manipulasi data umum.

---

### Struktur Direktori

```plaintext
bedengan-adminnext/
├── public/                     # Aset statis publik (logo, ikon, gambar)
├── src/
│   ├── app/                    # Next.js 15 App Router
│   │   ├── (auth)/             # Route group autentikasi
│   │   │   └── login/          # Halaman & form login petugas
│   │   ├── (dashboard)/        # Route group panel dashboard
│   │   │   ├── admin/          # Sub-rute administrasi
│   │   │   │   ├── dashboard/  # Tampilan analitik & ringkasan statistik
│   │   │   │   ├── kawasan/    # Manajemen spot kawasan wisata
│   │   │   │   ├── rental/     # Manajemen inventaris rental alat
│   │   │   │   ├── fotografer/ # Manajemen direktori fotografer
│   │   │   │   ├── warung/     # Manajemen mitra warung & kuliner
│   │   │   │   ├── pendaftaran/# Verifikasi registrasi mitra masuk
│   │   │   │   └── settings/   # Konfigurasi sistem & profil akun
│   │   │   ├── layout.tsx      # Sidebar & Navigation Shell Master
│   │   │   └── not-found.tsx   # Custom fallback halaman 404
│   │   ├── globals.css         # Import Tailwind CSS v4 & custom @theme
│   │   └── layout.tsx          # Root HTML layout & font metadata
│   ├── components/             # Reusable enterprise UI components
│   ├── data/                   # Data mock, fallback, & referensi statis
│   ├── services/               # Services Layer (REST API Client & Service handlers)
│   │   ├── apiClient.ts        # Base fetch client dengan interceptor token
│   │   ├── authService.ts      # Endpoint otentikasi & user profile
│   │   ├── dashboardService.ts # Endpoint metrik & analitik ringkas
│   │   ├── kawasanService.ts   # CRUD kawasan wisata
│   │   ├── rentalService.ts    # CRUD inventaris perlengkapan rental
│   │   ├── fotograferService.ts# CRUD mitra fotografer
│   │   └── warungService.ts    # CRUD warung & kuliner lokal
│   ├── styles/                 # Helper stylesheet tambahan
│   ├── types/                  # Types Layer (100% Strict Type Definitions)
│   │   ├── api.ts              # Generic API response contracts
│   │   ├── auth.ts             # User, Credential, & Session types
│   │   ├── kawasan.ts          # Kawasan & Camping spot schema
│   │   ├── rental.ts           # Rental equipment & item schema
│   │   ├── fotografer.ts       # Photographer portfolio schema
│   │   └── warung.ts           # Merchant/Warung schema
│   └── utils/                  # Token persistence, helper formatters, guards
├── package.json                # Dependensi proyek & script runner
├── tsconfig.json               # Konfigurasi TypeScript (Strict Mode diaktifkan)
└── next.config.ts              # Konfigurasi Next.js Compiler & Headers
```

---

## ✨ Fitur Utama Sistem

Sistem dirancang secara komprehensif untuk mendukung tata kelola ekosistem wisata:

```
                  ┌─────────────────────────────────────────┐
                  │   Bedengan Xplore - Fitur Utama         │
                  └────────────────────┬────────────────────┘
          ┌────────────────────────────┼────────────────────────────┐
          ▼                            ▼                            ▼
┌──────────────────┐         ┌──────────────────┐         ┌──────────────────┐
│   Autentikasi    │         │  Statistik Real- │         │  Katalog & Mitra │
│  Berbasis Token  │         │  time Dashboard  │         │    Operasional   │
│ • Secure storage │         │ • Total merchant │         │ • Kawasan Wisata │
│ • Session guard  │         │ • Volume rental  │         │ • Rental Alat    │
│ • Interceptor    │         │ • Status booking │         │ • Fotografer     │
│                  │         │ • Tren analitik  │         │ • Warung UMKM    │
└──────────────────┘         └──────────────────┘         └──────────────────┘
```

1. 🔐 **Autentikasi Berbasis Token (Secure Session Management)**
   - Login petugas berbasis kredensial email dan password.
   - Penyimpanan sesi aman pada *client storage* dengan validasi status aktif (*Bearer Authorization*).
   - Pengamanan rute terproteksi (*Route Guards*) mencegah akses ilegal ke area dashboard tanpa autentikasi valid.

2. 📊 **Visualisasi Statistik & Metrik Dashboard**
   - Ringkasan kartu analitik (*Metric Cards*) yang menampilkan jumlah aktif kawasan, unit rental, fotografer, serta mitra warung.
   - Pemantauan status operasional dan aktivitas pendaftaran mitra secara *real-time*.

3. 🌲 **Manajemen Kawasan (Katalog & Spot Area Wisata)**
   - Pengelolaan direktori titik lokasi wisata, camping ground, dan zona rekreasi Bedengan.
   - Pengaturan informasi detail: nama spot, deskripsi, kapasitas tenda, fasilitas, koordinat, dan status operasional.

4. ⛺ **Manajemen Rental & Inventaris Peralatan**
   - Katalogisasi unit sewa perlengkapan outdoor (tenda, matras, nesting, sleeping bag, kompor portabel).
   - Kontrol ketersediaan stok, harga per hari, kondisi peralatan, dan verifikasi permohonan peminjaman.

5. 📸 **Manajemen Fotografer Profesional**
   - Kurasi dan verifikasi data fotografer mitra lokal Bedengan.
   - Manajemen portofolio hasil karya, paket sesi pemotretan, tarif, serta kontak pemesanan.

6. 🍲 **Manajemen Warung & Pemberdayaan UMKM**
   - Pendaftaran dan verifikasi pelaku usaha kuliner di kawasan wisata.
   - Manajemen menu unggulan, rentang harga, jam operasional, dan lokasi blok warung.

7. 📋 **Manajemen Verifikasi Pendaftaran Mitra**
   - Alur persetujuan (*approval workflow*) untuk calon mitra baru (penyedia rental, fotografer, dan warung).

---

## 🔑 Kredensial Default (Akses Pengujian)

Untuk keperluan evaluasi, peninjauan fungsionalitas (*QA Testing*), maupun demonstrasi lokal, gunakan akun kredensial bawaan berikut:

> [!IMPORTANT]
> **Kredensial Testing Sistem:**
> - **URL Login**: `http://localhost:3000/login`
> - **Email Petugas**: `admin@bedengan.com`
> - **Kata Sandi**: `password123`
> - **Role Otoritas**: `Super Administrator / Petugas Wisata`

*(Pastikan backend server aktif atau konfigurasi API diarahkan dengan tepat saat melakukan autentikasi).*

---

## ⚙️ Panduan Instalasi & Memulai

Ikuti langkah-langkah di bawah ini untuk mengkloning repositori, memasang dependensi, dan menjalankan server pengembang lokal.

### Prasyarat Sistem

Pastikan lingkungan komputer Anda telah memenuhi kriteria berikut:
- **Node.js**: Versi `18.18.0` atau yang lebih baru (disarankan LTS `v20.x`)
- **Package Manager**: `npm` (v9+), `yarn`, `pnpm`, atau `bun`
- **Git**: Terpasang pada sistem operasi

### Langkah Instalasi

1. **Clone Repositori**
   ```bash
   git clone https://github.com/akmalcps/bedengan-adminnext.git
   cd bedengan-adminnext
   ```

2. **Instalasi Dependensi**
   Jalankan perintah berikut untuk menginstal seluruh dependensi eksternal:
   ```bash
   npm install
   ```

3. **Konfigurasi Environment Variable**
   Salin berkas konfigurasi lingkungan atau buat berkas `.env.local` pada direktori root proyek:
   ```bash
   cp .env.example .env.local
   ```
   *Jika `.env.example` belum tersedia, isi `.env.local` dengan konfigurasi dasar berikut:*
   ```env
   # URL Endpoint Backend REST API
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```

4. **Jalankan Server Development**
   Nyalakan server lokal Next.js dengan perintah:
   ```bash
   npm run dev
   ```

5. **Akses Dashboard**
   Buka peramban (*browser*) dan arahkan ke alamat:
   ```text
   http://localhost:3000
   ```
   Sistem akan secara otomatis mengarahkan Anda ke portal login di `http://localhost:3000/login`.

---

### Skrip Perintah Tersedia

| Perintah | Deskripsi |
| :--- | :--- |
| `npm run dev` | Menjalankan server pengembangan lokal dengan Hot Module Replacement (HMR). |
| `npm run build` | Melakukan kompilasi aset dan membangun paket optimasi produksi (*production bundle*). |
| `npm run start` | Menjalankan server aplikasi Next.js dalam mode produksi setelah proses `build`. |
| `npm run lint` | Melakukan audit statis kode menggunakan ESLint untuk memastikan kerapian kode. |

---

## 📡 Integrasi REST API

Sistem berkomunikasi secara asinkron dengan REST API backend. Abstraksi komunikasi ditangani secara terpusat melalui `src/services/apiClient.ts` dengan penanganan galat `ApiError`:

```typescript
// Contoh integrasi pada Services Layer
import { apiClient } from '@/src/services/apiClient';
import { KawasanItem } from '@/src/types/kawasan';

export const kawasanService = {
  getAll: () => apiClient<KawasanItem[]>('/kawasan'),
  getById: (id: string) => apiClient<KawasanItem>(`/kawasan/${id}`),
  create: (data: Partial<KawasanItem>) => apiClient<KawasanItem>('/kawasan', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
};
```

Setiap permintaan yang membutuhkan proteksi secara transparan menyertakan header otentikasi:
```http
Authorization: Bearer <token_admin>
Content-Type: application/json
```

---

## 🛡️ Standar Kualitas & Konvensi Kode

Demi menjaga konsistensi dan standar enterprise pada basis kode proyek:

- **Type Safety**: Dilarang menggunakan tipe `any` tanpa justifikasi ketat; selalu definisikan DTO pada `src/types/`.
- **Component Modularity**: Pecah komponen UI kompleks menjadi sub-komponen kecil (*single responsibility*).
- **Clean Git Workflow**: Gunakan konvensi penamaan commit standar (*Conventional Commits*) seperti `feat:`, `fix:`, `refactor:`, `docs:`, atau `chore:`.

---

## 📄 Lisensi & Kepemilikan

Hak Cipta © 2026 **Bedengan Xplore Project Team**. Seluruh hak cipta dilindungi undang-undang.  
Dikembangkan untuk mendukung digitalisasi ekosistem pariwisata Bedengan.
