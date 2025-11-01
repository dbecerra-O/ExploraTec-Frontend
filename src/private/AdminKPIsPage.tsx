import React from 'react';
import { KPIDashboard } from '../components/KPIDashboard/KPIDashboard';
import AdminNavbar from '../components/AdminNavbar/AdminNavbar';

const AdminKPIsPage: React.FC = () => {
  return (
    <div>
      <AdminNavbar />
      <KPIDashboard />
    </div>
  );
};

export default AdminKPIsPage;