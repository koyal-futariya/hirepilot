"use client";

import { LogOut, Home, Briefcase, MessageSquare, Bell, User, Settings } from "lucide-react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { useSession, signOut } from "@/lib/auth-client";

type MenuItem = {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
};

const menuItems: MenuItem[] = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Jobs", href: "/dashboard/jobs", icon: Briefcase },
  { name: "Applications", href: "/dashboard/applications", icon: MessageSquare },
  { name: "Notifications", href: "/dashboard/notifications", icon: Bell },
  { name: "Profile", href: "/dashboard/profile", icon: User },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  // Using session data
  const { data: session, isPending } = useSession();

  const userDetails = {
    name: session?.user?.name || session?.user?.email?.split("@")[0] || "User",
    email: session?.user?.email || "",
    avatar: session?.user?.image || "/avatar.jpg", // fallback image
  };

  function handleLogout() {
    signOut().then(() => {
      router.push("/login");
    });
  }

  // Close profile dropdown when clicking outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    }
    if (profileOpen) {
      document.addEventListener("mousedown", handleClick);
    } else {
      document.removeEventListener("mousedown", handleClick);
    }
    return () => document.removeEventListener("mousedown", handleClick);
  }, [profileOpen]);

  if (isPending) {
    // Optionally show a loading state here
    return null;
  }

  return (
    <div className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64 h-screen border-r border-gray-200 bg-white">
        {/* Header */}
        <div className="flex items-center h-16 px-4 border-b border-gray-200">
          <h1 className="text-xl font-semibold text-gray-900">HirePilot</h1>
        </div>
        {/* Navigation */}
        <div className="flex flex-col flex-grow px-4 py-4 overflow-y-auto">
          <nav className="flex-1 space-y-1">
            {menuItems.map((item: MenuItem) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-lg ${
                    isActive ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
        {/* Footer Profile Card with Dropdown */}
        <div className="mt-auto px-4 py-4 relative" ref={profileRef}>
          <button
            onClick={() => setProfileOpen((open) => !open)}
            className="flex items-center w-full gap-3 bg-gray-100 rounded-lg p-3 hover:bg-gray-200 transition"
          >
            <img
              src={userDetails.avatar}
              alt={`${userDetails.name} avatar`}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="flex flex-col text-left">
              <span className="text-sm font-semibold text-gray-900">{userDetails.name}</span>
              <span className="text-xs text-gray-600">{userDetails.email}</span>
            </div>
            <svg
              className={`ml-auto h-4 w-4 text-gray-500 transition-transform ${profileOpen ? "rotate-180" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
            >
              <path stroke="currentColor" strokeWidth="2" d="M6 9l6 6 6-6" />
            </svg>
          </button>
          {profileOpen && (
            <div className="absolute left-0 bottom-16 w-64 bg-white border border-gray-200 rounded-xl shadow-lg z-20">
              <div className="p-4 flex items-center gap-3 border-b border-gray-100">
                <img
                  src={userDetails.avatar}
                  alt={`${userDetails.name} avatar`}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <span className="block text-sm font-semibold text-gray-900">{userDetails.name}</span>
                  <span className="block text-xs text-gray-600">{userDetails.email}</span>
                </div>
              </div>
              <div className="divide-y divide-gray-100">
                <button className="w-full flex items-center px-4 py-3 text-sm hover:bg-gray-50 gap-3">
                  {/* Place holder icon */}
                  <svg width={18} height={18} className="text-gray-500"><path d="M6 10.5V9a6 6 0 0112 0v1.5"/></svg>
                  Upgrade to Pro
                </button>
                <button className="w-full flex items-center px-4 py-3 text-sm hover:bg-gray-50 gap-3">
                  <Settings className="w-4 h-4 text-gray-500" />
                  Account
                </button>
                <button className="w-full flex items-center px-4 py-3 text-sm hover:bg-gray-50 gap-3">
                  <Bell className="w-4 h-4 text-gray-500" />
                  Notifications
                </button>
                <button
                  className="w-full flex items-center px-4 py-3 text-sm text-red-600 hover:bg-red-50 gap-3"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4" />
                  Log out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
