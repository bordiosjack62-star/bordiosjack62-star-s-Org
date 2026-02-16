
import React, { useEffect, useState } from 'react';
import { UserRole } from '../types';
import { ICONS, APP_NAME } from '../constants';
import { checkConnection } from '../services/supabaseClient';

interface LayoutProps {
  children: React.ReactNode;
  userRole: UserRole;
  onLogout: () => void;
  currentView: string;
  setCurrentView: (view: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, userRole, onLogout, currentView, setCurrentView }) => {
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    const ping = async () => {
      const connected = await checkConnection();
      setIsLive(connected);
    };
    ping();
    const interval = setInterval(ping, 30000); // Check every 30s
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: ICONS.Dashboard, roles: [UserRole.ADMIN, UserRole.TEACHER, UserRole.GUIDANCE] },
    { id: 'reports', label: 'Safety Log', icon: ICONS.Reports, roles: [UserRole.ADMIN, UserRole.TEACHER, UserRole.GUIDANCE] },
    { id: 'new-report', label: 'New Report', icon: ICONS.Add, roles: [UserRole.ADMIN, UserRole.TEACHER, UserRole.ANONYMOUS, UserRole.GUIDANCE] },
    { id: 'users', label: 'Users', icon: ICONS.Users, roles: [UserRole.ADMIN] },
  ];

  return (
    <div className="flex h-screen bg-[#f1f5f9] overflow-hidden font-inter">
      {/* Sidebar - Midnight Slate */}
      <aside className="w-80 bg-slate-900 text-white flex flex-col shadow-[10px_0_30px_rgba(0,0,0,0.05)] z-20">
        <div className="p-10 flex items-center gap-5 border-b border-white/5">
          <div className="bg-teal-600 w-12 h-12 rounded-[1.25rem] flex items-center justify-center shadow-2xl shadow-teal-900/40">
            <span className="text-white font-black text-2xl italic">B</span>
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tighter leading-none">{APP_NAME}</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className={`w-1.5 h-1.5 rounded-full ${isLive ? 'bg-teal-500 animate-pulse' : 'bg-slate-600'}`}></span>
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">{isLive ? 'Live Sync Active' : 'Offline Mode'}</span>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-8 space-y-4 mt-6">
          {navItems
            .filter(item => item.roles.includes(userRole))
            .map(item => (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`w-full flex items-center gap-5 px-6 py-5 rounded-2xl transition-all duration-300 group ${
                  currentView === item.id 
                    ? 'bg-teal-600 text-white shadow-2xl shadow-teal-600/30 translate-x-1' 
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className={`${currentView === item.id ? 'scale-110' : 'group-hover:scale-110'} transition-transform duration-300`}>
                  {item.icon}
                </div>
                <span className="font-black text-sm uppercase tracking-widest">{item.label}</span>
                {currentView === item.id && <div className="ml-auto w-2 h-2 rounded-full bg-white shadow-[0_0_8px_white] animate-pulse"></div>}
              </button>
            ))}
        </nav>

        <div className="p-8">
          <div className="bg-white/5 p-8 rounded-[2rem] mb-8 backdrop-blur-xl border border-white/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-20 h-20 bg-teal-500/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-teal-500/20 transition-all"></div>
            <p className="text-[10px] text-teal-500 uppercase font-black tracking-[0.2em] mb-2">Portal Access</p>
            <p className="text-sm font-black truncate text-white">{userRole}</p>
          </div>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-5 px-6 py-5 rounded-2xl text-slate-500 hover:bg-red-500/10 hover:text-red-400 transition-all font-black text-xs uppercase tracking-[0.2em]"
          >
            {ICONS.Logout}
            <span>Exit Portal</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-slate-50/30">
        <header className="bg-white/70 backdrop-blur-3xl border-b border-slate-200 sticky top-0 z-10 px-12 py-8 flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight capitalize">{currentView.replace('-', ' ')}</h2>
            <div className="flex items-center gap-3 mt-2">
              <span className={`flex h-2 w-2 rounded-full ${isLive ? 'bg-emerald-500' : 'bg-slate-300'} shadow-[0_0_8px_rgba(16,185,129,0.5)]`}></span>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                {isLive ? 'Cloud Protection Secured' : 'Local Storage Only'}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-8">
            <div className="text-right hidden sm:block">
              <div className="text-sm font-black text-slate-900 tracking-tighter">
                {new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
              </div>
              <div className="text-[10px] text-teal-600 font-black uppercase tracking-widest mt-0.5">
                School Instance #82
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-white border-2 border-slate-100 flex items-center justify-center text-slate-400 shadow-sm hover:border-teal-400 hover:text-teal-600 transition-all cursor-pointer">
              {ICONS.Users}
            </div>
          </div>
        </header>
        <div className="p-12 max-w-7xl mx-auto">
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Layout;
