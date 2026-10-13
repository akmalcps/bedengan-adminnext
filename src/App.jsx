import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './components/layout/AdminLayout';
import Login from './pages/auth/Login';
import Dashboard from './pages/dashboard/Dashboard';
import NotFound from './pages/NotFound';
import WarungList from './pages/warung/WarungList';
import WarungCreate from './pages/warung/WarungCreate';
import WarungDetail from './pages/warung/WarungDetail';
import WarungEdit from './pages/warung/WarungEdit';
import RentalList from './pages/rental/RentalList';
import RentalCreate from './pages/rental/RentalCreate';
import RentalDetail from './pages/rental/RentalDetail';
import RentalEdit from './pages/rental/RentalEdit';
import FotograferList from './pages/fotografer/FotograferList';
import FotograferCreate from './pages/fotografer/FotograferCreate';
import FotograferDetail from './pages/fotografer/FotograferDetail';
import FotograferEdit from './pages/fotografer/FotograferEdit';
import PendaftaranList from './pages/pendaftaran/PendaftaranList';
import PendaftaranDetail from './pages/pendaftaran/PendaftaranDetail';
import KawasanList from './pages/kawasan/KawasanList';
import KawasanDetail from './pages/kawasan/KawasanDetail';
import KawasanEdit from './pages/kawasan/KawasanEdit';
import Settings from './pages/settings/Settings';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="kawasan" element={<KawasanList />} />
          <Route path="kawasan/:id" element={<KawasanDetail />} />
          <Route path="kawasan/:id/edit" element={<KawasanEdit />} />

          <Route path="warung" element={<WarungList />} />
          <Route path="warung/create" element={<WarungCreate />} />
          <Route path="warung/:id" element={<WarungDetail />} />
          <Route path="warung/:id/edit" element={<WarungEdit />} />

          <Route path="rental" element={<RentalList />} />
          <Route path="rental/create" element={<RentalCreate />} />
          <Route path="rental/:id" element={<RentalDetail />} />
          <Route path="rental/:id/edit" element={<RentalEdit />} />

          <Route path="fotografer" element={<FotograferList />} />
          <Route path="fotografer/create" element={<FotograferCreate />} />
          <Route path="fotografer/:id" element={<FotograferDetail />} />
          <Route path="fotografer/:id/edit" element={<FotograferEdit />} />

          <Route path="pendaftaran" element={<PendaftaranList />} />
          <Route path="pendaftaran/:id" element={<PendaftaranDetail />} />

          <Route path="settings" element={<Settings />} />
          {/* <Route path="profile" element={<Profile />} /> */}
        </Route>
        
        <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
