import React from 'react';
import AdminNavbar from '../components/AdminNavbar/AdminNavbar';
import UserList from '../components/UserList/UserList';

export const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      
      {/* Contenido principal */}
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-200">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">
              👥 Usuarios Registrados
            </h2>
            <p className="text-gray-600 mt-2">
              Gestiona y visualiza todos los usuarios del sistema
            </p>
          </div>
        </div>

        {/* Contenedor principal */}
        <div className="bg-white shadow-xl rounded-2xl p-6 border border-gray-100">
          <UserList />
        </div>
      </div>
    </div>
  );
};