// src/components/dashboard/Sidebar.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  MdDashboard,
  MdPeople,
  MdSchedule,
  MdCalendarToday,
  MdInventory,
  MdAnalytics,
  MdNotifications,
  MdSettings,
  MdClose,
  MdArrowForward
} from 'react-icons/md';
import { FiTarget } from "react-icons/fi";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  {
    icon: MdDashboard,
    label: 'Dashboard',
    href: '/dashboard'
  },
  {
    icon: MdPeople,
    label: 'Employee Directory',
    href: '/dashboard/employee-directory'
  },
  {
    icon: MdSchedule,
    label: 'Attendance & Time Tracking',
    href: '/dashboard/attendance-time-tracking'
  },
  {
    icon: MdCalendarToday,
    label: 'Leave Management',
    href: '/dashboard/leave-management'
  },
  {
    icon: MdInventory,
    label: 'Asset Management',
    href: '/dashboard/asset-management'
  },
  {
    icon: MdAnalytics,
    label: 'Reports & Analytics',
    href: '/dashboard/reports-analytics'
  },
  {
    icon: MdNotifications,
    label: 'Notifications & Alerts',
    href: '/dashboard/notifications-alerts'
  },
  {
    icon: MdSettings,
    label: 'Settings',
    href: '/dashboard/settings'
  }
];

export default function SideBar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed left-0 top-0 h-full bg-[#004b92] text-white transition-transform duration-300 z-50
        w-[308px] sm:w-[280px] md:w-[300px] lg:w-[308px] lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <FiTarget className="w-5 h-5 text-blue-900" />
            </div>
            <span className="text-xl font-bold">HRMS</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-blue-800 transition-colors lg:hidden"
          >
            <MdClose className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-4 px-2">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <div key={index} className="relative">
                {/* White left border indicator for active item */}
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r-sm"></div>
                )}
                <Link
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center px-3 py-3 mx-1 rounded-lg transition-colors mb-1 ${
                    isActive
                      ? 'bg-white text-gray-800 ml-2 shadow-sm'
                      : 'text-blue-100 hover:bg-blue-800 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="ml-3 text-sm font-medium">{item.label}</span>
                </Link>
              </div>
            );
          })}
        </nav>

        {/* Bottom section - Log Out */}
        <div className="absolute bottom-4 left-0 right-0 px-2">
          <button className="flex items-center justify-between px-4 py-3 mx-1 rounded-lg transition-colors w-full bg-white text-gray-800 shadow-sm hover:bg-gray-50">
            <span className="text-sm font-medium">Log Out</span>
            <MdArrowForward className="w-5 h-5" />
          </button>
        </div>
      </div>
    </>
  );
}