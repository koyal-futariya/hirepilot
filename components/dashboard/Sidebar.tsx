"use client";

import { 
  LogOut, 
  Home, 
  Briefcase, 
  MessageSquare, 
  Bell, 
  User, 
  Settings, 
  ChevronUp, 
  Command,
  Sparkles
} from "lucide-react";
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

  const { data: session, isPending } = useSession();

  const userDetails = {
    name: session?.user?.name || session?.user?.email?.split("@")[0] || "User",
    email: session?.user?.email || "",
  };

  // Extract the first letter for the avatar
  const userInitial = userDetails.name.charAt(0).toUpperCase();

  function handleLogout() {
    signOut().then(() => {
      router.push("/login");
    });
  }

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

  if (isPending) return null;

  return (
    <div className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64 h-screen bg-white border-r border-slate-200 shadow-[1px_0_0_0_rgba(0,0,0,0.02)]">
        
        {/* Header */}
        <div className="flex items-center h-16 px-6 border-b border-slate-100">
          <div className="flex items-center gap-2 text-blue-600">
            <div className="p-1.5 bg-blue-600 rounded-lg">
              <Command className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">HirePilot</h1>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex flex-col flex-grow px-3 py-6 overflow-y-auto custom-scrollbar">
          <nav className="flex-1 space-y-1">
            {menuItems.map((item: MenuItem) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ease-in-out ${
                    isActive
                      ? "bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-100"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <item.icon
                    className={`w-5 h-5 mr-3 transition-colors ${
                      isActive ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600"
                    }`}
                  />
                  {item.name}
                  {item.name === "Notifications" && (
                     <span className="ml-auto bg-red-100 text-red-600 py-0.5 px-2 rounded-full text-xs font-semibold">
                       3
                     </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Profile Card with Dropdown */}
        <div className="mt-auto px-3 py-4 relative" ref={profileRef}>
          <div className="relative">
            {profileOpen && (
              <div className="absolute bottom-full left-0 right-0 mb-3 w-full bg-white border border-slate-100 rounded-xl shadow-xl ring-1 ring-black/5 transform transition-all duration-200 origin-bottom z-50">
                <div className="p-4 border-b border-slate-50 bg-slate-50/50 rounded-t-xl">
                  <div className="flex items-center gap-3">
                    {/* Dropdown Avatar: Initial */}
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-700 border border-blue-200 shadow-sm">
                      <span className="text-sm font-bold">{userInitial}</span>
                    </div>
                    
                    <div className="overflow-hidden">
                      <span className="block text-sm font-semibold text-slate-900 truncate">
                        {userDetails.name}
                      </span>
                      <span className="block text-xs text-slate-500 truncate">
                        {userDetails.email}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-1.5 space-y-0.5">
                  
                  
                  <div className="h-px bg-slate-100 my-1 mx-2" />
                  <button
                    className="w-full flex items-center px-3 py-2 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-4 h-4 mr-3" />
                    Log out
                  </button>
                </div>
              </div>
            )}

            <button
              onClick={() => setProfileOpen((open) => !open)}
              className={`flex items-center w-full gap-3 p-2 rounded-xl border transition-all duration-200 ${
                profileOpen 
                  ? "bg-white border-blue-200 ring-2 ring-blue-100 shadow-sm" 
                  : "bg-white border-transparent hover:bg-slate-50 hover:border-slate-200"
              }`}
            >
              {/* Footer Avatar: Initial */}
              <div className="flex items-center justify-center w-9 h-9 rounded-full bg-blue-100 text-blue-700 border border-blue-200 shrink-0">
                 <span className="text-sm font-bold">{userInitial}</span>
              </div>
              
              <div className="flex flex-col text-left flex-1 overflow-hidden">
                <span className="text-sm font-medium text-slate-700 truncate">{userDetails.name}</span>
                <span className="text-xs text-slate-500 truncate">View Profile</span>
              </div>
              <ChevronUp 
                className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                  profileOpen ? "" : "rotate-180"
                }`} 
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
