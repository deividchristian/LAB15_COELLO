'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const handleStorage = () => {
      setRole(localStorage.getItem('user-role') || 'CUSTOMER');
    };
    handleStorage();
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const toggleRole = () => {
    const newRole = role === 'ADMIN' ? 'CUSTOMER' : 'ADMIN';
    localStorage.setItem('user-role', newRole);
    setRole(newRole);
    window.dispatchEvent(new Event('storage'));
    window.location.reload(); // Recarga para aplicar cambios en las vistas
  };

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-xl font-bold text-gray-900">
              MiniMarket
            </Link>
            <div className="flex gap-6">
              <Link href="/" className="text-gray-600 hover:text-gray-900 font-medium">
                Catálogo
              </Link>
              {role === 'ADMIN' && (
                <Link href="/admin" className="text-red-600 hover:text-red-700 font-bold">
                  Panel Admin
                </Link>
              )}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs bg-gray-100 text-gray-800 font-semibold px-2.5 py-0.5 rounded border border-gray-300">
              Rol: {role}
            </span>
            <button
              onClick={toggleRole}
              className="text-xs bg-gray-900 text-white px-3 py-1.5 rounded hover:bg-gray-800 transition-colors font-medium"
            >
              Cambiar a {role === 'ADMIN' ? 'CUSTOMER' : 'ADMIN'}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}