// src/app/dashboard/layout.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
// import Header from '@/components/dashboard/Header';
import SideBar from '@/components/dashboard/SideBar';
import Header from '../../components/dashboard/Header';


interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check authentication status
    const token = localStorage.getItem('authToken');
    if (!token) {
      router.push('/signin');
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  const handleMenuToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Inside your authenticated layout render block
return (
  <div className="flex h-screen bg-gray-100 relative">
    {/* Sidebar - Fixed */}
    <SideBar 
      isOpen={sidebarOpen} 
      onClose={handleSidebarClose}
    />

    {/* Main Content - Pushed on large screens to make room for sidebar */}
    <div
      className={`
        flex-1 flex flex-col min-w-0 transition-all duration-300
        pt-[90px] 
        lg:pl-[308px] 
      `}
    >
      {/* Header - stick to top */}
      <div className="fixed top-0 left-0 right-0 z-30 lg:ml-[308px] h-[90px] bg-white">
        <Header 
          onMenuToggle={handleMenuToggle}
          sidebarOpen={sidebarOpen}
          onSearch={(query) => console.log('Search:', query)}
        />
      </div>

      {/* Content Area */}
      <main className="flex-1 overflow-y-auto bg-gray-50">
        <div className="p-4 sm:p-6 lg:p-8 h-full">
          {children}
        </div>
      </main>
    </div>

    {/* Mobile sidebar overlay */}
    {sidebarOpen && (
      <div 
        className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={handleSidebarClose}
      />
    )}
  </div>
);
}