
import React, { useState } from 'react';
import { ICONS, MOCK_USERS } from '../constants';
import { UserRole } from '../types';

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState(MOCK_USERS);

  const toggleStatus = (id: string) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, active: !u.active } : u));
  };

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-center">
        <h3 className="text-3xl font-black text-slate-900 tracking-tighter">User Directory</h3>
        <button className="px-8 py-4 bg-teal-600 text-white rounded-[1.5rem] font-black text-[11px] uppercase tracking-widest shadow-xl shadow-teal-100 flex items-center gap-3">
          {ICONS.Add} New Staff Member
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-slate-50">
          <thead className="bg-slate-50/50">
            <tr>
              <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Name</th>
              <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Role</th>
              <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
              <th className="px-8 py-6 text-right text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {users.map(user => (
              <tr key={user.id} className="hover:bg-slate-50/30 transition-all">
                <td className="px-8 py-6 font-black text-slate-900">{user.name}</td>
                <td className="px-8 py-6">
                  <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full ${
                    user.role === 'Admin' ? 'bg-slate-900 text-white' : 
                    user.role === 'Guidance' ? 'bg-indigo-50 text-indigo-600' : 
                    'bg-teal-50 text-teal-600'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-8 py-6">
                  <button onClick={() => toggleStatus(user.id)} className={`flex items-center gap-2 px-3 py-1 rounded-full transition-all ${user.active ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${user.active ? 'bg-emerald-600' : 'bg-rose-600'}`}></div>
                    <span className="text-[10px] font-black uppercase tracking-widest">{user.active ? 'Active' : 'Deactivated'}</span>
                  </button>
                </td>
                <td className="px-8 py-6 text-right space-x-2">
                  <button className="p-2 text-slate-400 hover:text-teal-600 transition-all">{ICONS.Notes}</button>
                  <button className="p-2 text-slate-400 hover:text-rose-500 transition-all">{ICONS.Delete}</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;
