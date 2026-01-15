import { Route, Routes } from 'react-router-dom';
import { Account } from './pages/account';
import { Auth } from './pages/auth';
import Index from './pages/Index';
import { DashboardLayout } from './pages/dashboard/DashboardLayout';
import { DashboardHome } from './pages/dashboard/DashboardHome';
import { SettingsPage } from './pages/dashboard/SettingsPage';
import { SocraticPage } from './pages/dashboard/SocraticPage';

// Main application component with routing configuration

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/auth/:pathname" element={<Auth />} />
      <Route path="/account/:pathname" element={<Account />} />
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<DashboardHome />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="socratic" element={<SocraticPage />} />
      </Route>
    </Routes>
  );
}
