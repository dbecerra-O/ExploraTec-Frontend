import { Link, useLocation } from 'react-router-dom';
import LogoutButton from '../LogoutButton/LogoutButton';

const AdminNavbar = () => {
  const location = useLocation();

  const menuItems = [
    { path: '/dashboard', label: 'Usuarios' },
    { path: '/kpis', label: 'KPIs' },
    { path: '/events', label: 'Eventos' }
  ];

  return (
    <nav className="bg-gray-800 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <h2 className="text-xl font-bold text-white">Admin Panel</h2>
            </div>
          </div>

          {/* Menu Items y User Actions*/}
          <div className="flex items-center space-x-6">
            {/* Navegación */}
            <ul className="flex items-center space-x-1">
              {menuItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`
                      px-4 py-4 font-medium transition-all duration-200 relative
                      ${location.pathname === item.path
                        ? 'text-white bg-blue-400 shadow-lg transform scale-105'
                        : 'text-gray-300 hover:text-white hover:bg-gray-700'
                      }
                    `}
                  >
                    {item.label}
                    </Link>
                </li>
              ))}
            </ul>
            <div className="h-6 w-px bg-gray-600"></div>
            <div className="flex items-center space-x-4">
              <LogoutButton />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;