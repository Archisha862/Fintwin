import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import {
  LayoutDashboard,
  Wallet,
  Activity,
  Shield,
  FlaskConical,
  Users,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Menu,
  Bell
} from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { name: "Dashboard", icon: LayoutDashboard, page: "Dashboard" },
  { name: "Assets", icon: Wallet, page: "Assets" },
  { name: "Agent Actions", icon: Activity, page: "AgentActions" },
  { name: "Circuit Breakers", icon: Shield, page: "CircuitBreakers" },
  { name: "Simulator", icon: FlaskConical, page: "Simulator" },
  { name: "Adviser Portal", icon: Users, page: "AdviserPortal" },
];

function FinTwinLogo({ size = 36, collapsed }) {
  return (
    <div className="flex items-center gap-3 min-w-0">
      <div
        className="rounded-xl flex items-center justify-center flex-shrink-0 relative overflow-hidden"
        style={{
          width: size, height: size,
          background: "linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%)"
        }}
      >
        <svg width={size * 0.58} height={size * 0.58} viewBox="0 0 24 24" fill="none">
          <path d="M4 6h7v2H4zM4 11h7v2H4zM4 16h7v2H4z" fill="white" fillOpacity="0.95" />
          <path d="M13 6h7v2h-7zM13 11h7v2h-7zM13 16h7v2h-7z" fill="white" fillOpacity="0.4" />
        </svg>
      </div>
      {!collapsed && (
        <div className="overflow-hidden">
          <h1 className="text-[15px] font-bold tracking-tight text-white leading-tight">FinTwin</h1>
          <p className="text-[9px] text-white/35 tracking-[0.15em] uppercase">Digital Wealth Co-Pilot</p>
        </div>
      )}
    </div>
  );
}

export default function Layout({ children, currentPageName }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  if (currentPageName === "Onboarding" || currentPageName === "Login" || currentPageName === "Welcome") {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen bg-[#F0F2F7] overflow-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        body { font-family: 'Inter', sans-serif; }
      `}</style>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:relative z-50 h-full flex flex-col
        transition-all duration-300 ease-in-out
        ${collapsed ? "w-[72px]" : "w-[248px]"}
        ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
        style={{ background: "linear-gradient(180deg, #0d1e3a 0%, #0a1628 100%)" }}
      >
        {/* Top gradient accent */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald-500/0 via-emerald-500/60 to-emerald-500/0" />

        {/* Logo */}
        <div className={`flex items-center h-[68px] border-b border-white/[0.06] flex-shrink-0 ${collapsed ? "px-4 justify-center" : "px-5"}`}>
          <FinTwinLogo size={34} collapsed={collapsed} />
        </div>

        {/* Nav */}
        <nav className="flex-1 py-5 px-3 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = currentPageName === item.page;
            return (
              <Link
                key={item.page}
                to={createPageUrl(item.page)}
                onClick={() => setMobileOpen(false)}
                title={collapsed ? item.name : undefined}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium
                  transition-all duration-150 group relative
                  ${isActive
                    ? "text-white"
                    : "text-white/40 hover:text-white/80 hover:bg-white/[0.04]"
                  }
                `}
              >
                {isActive && (
                  <div className="absolute inset-0 rounded-xl bg-white/[0.07]" />
                )}
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full bg-emerald-400" />
                )}
                <item.icon className={`w-[17px] h-[17px] flex-shrink-0 relative z-10 transition-colors ${isActive ? "text-emerald-400" : "group-hover:text-white/70"}`} />
                {!collapsed && <span className="relative z-10">{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* User section */}
        {user && (
          <div className={`border-t border-white/[0.06] ${collapsed ? "p-3" : "px-4 py-4"}`}>
            {collapsed ? (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-xs font-bold mx-auto cursor-pointer">
                {user.full_name?.[0] || "U"}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                  {user.full_name?.[0] || "U"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-white/80 truncate">{user.full_name || "User"}</p>
                  <p className="text-[10px] text-white/30 truncate">{user.email}</p>
                </div>
                <button onClick={() => base44.auth.logout()} className="text-white/20 hover:text-white/60 transition-colors flex-shrink-0">
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Collapse */}
        <div className="hidden lg:block px-3 pb-4">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-white/20 hover:text-white/50 hover:bg-white/[0.04] transition-all text-xs"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <><ChevronLeft className="w-4 h-4" /><span>Collapse</span></>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="h-[68px] bg-white/80 backdrop-blur-md border-b border-gray-100/80 flex items-center justify-between px-6 flex-shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setMobileOpen(true)} className="lg:hidden text-gray-400 hover:text-gray-700">
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-[15px] font-semibold text-[#0d1e3a]">
                {navItems.find(n => n.page === currentPageName)?.name || currentPageName}
              </h2>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="relative text-gray-400 hover:text-gray-600 h-9 w-9">
              <Bell className="w-4.5 h-4.5" />
              <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-emerald-500 rounded-full ring-2 ring-white" />
            </Button>
            {user && (
              <div className="ml-1 flex items-center gap-2.5 pl-3 border-l border-gray-100">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-[11px] font-bold text-white">
                  {user.full_name?.[0] || "U"}
                </div>
                <span className="text-xs font-medium text-gray-600 hidden md:block">{user.full_name || "User"}</span>
              </div>
            )}
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {children}
        </div>
      </main>
    </div>
  );
}