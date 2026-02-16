
import React, { useState } from 'react';
import { UserRole } from '../types';
import { APP_NAME } from '../constants';

interface LoginProps {
  onLogin: (role: UserRole) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [loading, setLoading] = useState<UserRole | null>(null);

  const handleRoleSelect = (role: UserRole) => {
    setLoading(role);
    setTimeout(() => {
      onLogin(role);
    }, 400);
  };

  const roles = [
    {
      id: UserRole.ANONYMOUS,
      title: 'Student / Parent',
      desc: 'Quickly & safely report an incident without an account.',
      color: 'bg-teal-600',
      icon: '👋',
      label: 'Get Started'
    },
    {
      id: UserRole.TEACHER,
      title: 'Faculty Portal',
      desc: 'Access classroom safety tools and staff logs.',
      color: 'bg-slate-800',
      icon: '🍎',
      label: 'Staff Sign In'
    },
    {
      id: UserRole.GUIDANCE,
      title: 'Guidance & Support',
      desc: 'Manage student interventions and counseling.',
      color: 'bg-indigo-600',
      icon: '🧠',
      label: 'Counselor Login'
    },
    {
      id: UserRole.ADMIN,
      title: 'Administration',
      desc: 'Manage school safety metrics and analytics.',
      color: 'bg-cyan-900',
      icon: '🛡️',
      label: 'Admin Login'
    }
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-6 relative overflow-hidden font-inter">
      <div className="absolute top-[-15%] right-[-5%] w-[50%] h-[50%] bg-teal-100/40 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-15%] left-[-5%] w-[50%] h-[50%] bg-cyan-100/40 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-6xl">
        <header className="text-center mb-16 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="inline-flex items-center gap-2 bg-teal-50 px-4 py-2 rounded-full text-teal-700 text-xs font-black uppercase tracking-widest mb-8 border border-teal-100">
            <span className="flex h-2 w-2 rounded-full bg-teal-500 shadow-[0_0_8px_rgba(20,184,166,0.6)]"></span>
            School Safety Network
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tighter mb-8 leading-[0.9]">
            Buddy<span className="text-teal-600">Guard</span>
          </h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed">
            The intelligent safety reporting platform designed to keep your school environment secure and responsive.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
          {roles.map((role) => (
            <button
              key={role.id}
              onClick={() => handleRoleSelect(role.id)}
              disabled={!!loading}
              className={`group relative bg-white border border-slate-200 p-8 rounded-[2rem] text-left transition-all duration-500 hover:border-teal-400 hover:shadow-[0_30px_60px_-15px_rgba(20,184,166,0.15)] hover:-translate-y-3 ${
                loading === role.id ? 'opacity-70 scale-[0.98]' : ''
              }`}
            >
              <div className={`w-14 h-14 rounded-2xl ${role.color} flex items-center justify-center text-2xl mb-8 shadow-xl shadow-teal-900/10 group-hover:scale-110 transition-transform duration-500`}>
                {role.icon}
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-2 tracking-tight">{role.title}</h3>
              <p className="text-slate-500 font-medium mb-10 leading-relaxed text-xs h-12">{role.desc}</p>
              
              <div className="flex items-center justify-between">
                <span className="font-black text-teal-600 text-[10px] uppercase tracking-widest">{role.label}</span>
                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-teal-600 group-hover:text-white transition-all duration-300">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </div>

              {loading === role.id && (
                <div className="absolute inset-0 bg-white/90 flex items-center justify-center rounded-[2rem] backdrop-blur-sm">
                  <div className="w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      <footer className="mt-20 text-center opacity-40">
        <p className="text-slate-900 font-black text-[10px] uppercase tracking-[0.4em] mb-4">Enterprise Grade Security • 256-bit Encryption</p>
        <p className="text-slate-500 text-xs font-medium">© 2025 BuddyGuard Safety Systems</p>
      </footer>
    </div>
  );
};

export default Login;
