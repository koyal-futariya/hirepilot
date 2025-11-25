'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, User, Rocket, BookOpen, BarChart2, Bell, Settings, Menu, X } from 'lucide-react';

const menuItems = [
  { name: 'Home', icon: Home, href: '/dashboard' },
  { name: 'Profile', icon: User, href: '/dashboard/profile' },
  { name: 'Launchpad', icon: Rocket, href: '/dashboard/launchpad' },
  { name: 'Interview Prep', icon: BookOpen, href: '/dashboard/interview-prep' },
  { name: 'Statistics', icon: BarChart2, href: '/dashboard/statistics' },
  { name: 'Notifications', icon: Bell, href: '/dashboard/notifications' },
  { name: 'Settings', icon: Settings, href: '/dashboard/settings' },
];

export function MobileSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="md:hidden">
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 p-3 rounded-full bg-blue-600 text-white shadow-lg"
      >
        <Menu className="w-6 h-6" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setIsOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-64 bg-white shadow-xl">
            <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
              <h1 className="text-xl font-semibold text-gray-900">AutoJob</h1>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-md text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <nav className="px-4 py-4 space-y-1">
              {menuItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg ${
                      isActive
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}
