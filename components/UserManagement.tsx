
import React, { useState, useEffect } from 'react';
import { ICONS, MOCK_USERS } from '../constants';
import { UserRole, User } from '../types';
import { supabase } from '../services/supabaseClient';

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUserData, setNewUserData] = useState({ name: '', role: UserRole.TEACHER });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      
      if (data && data.length > 0) {
        setUsers(data as any);
      } else {
        setUsers(MOCK_USERS as any);
      }
    } catch (err) {
      console.warn('Could not fetch profiles, using mocks', err);
      setUsers(MOCK_USERS as any);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserData.name) return;
    setIsSubmitting(true);

    try {
      const { data, error } = await supabase
        .from('profiles')
        .insert([{
          name: newUserData.name,
          role: newUserData.role,
          active: true
        }])
        .select();

      if (error) throw error;
      
      if (data) {
        setUsers(prev => [...prev, data[0] as any].sort((a, b) => a.name.localeCompare(b.name)));
      }
      setShowAddModal(false);
      setNewUserData({ name: '', role: UserRole.TEACHER });
    } catch (err) {
      console.error('Error adding user:', err);
      alert('Failed to add staff member.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ active: !currentStatus })
        .eq('id', id);

      if (error) throw error;
      setUsers(prev => prev.map(u => u.id === id ? { ...u, active: !currentStatus } : u));
    } catch (err) {
      console.error('Error updating user status:', err);
    }
  };

  const deleteUser = async (id: string) => {
    if (!confirm('Are you sure you want to remove this staff member?')) return;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setUsers(prev => prev.filter(u => u.id !== id));
    } catch (err) {
      console.error('Error deleting user:', err);
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-center">
        <h3 className="text-3xl font-black text-slate-900 tracking-tighter">User Directory</h3>
        <div className="flex gap-4">
          <button onClick={fetchUsers} className="p-4 bg-white border-2 border-slate-100 rounded-[1.5rem] text-slate-400 hover:text-teal-600 transition-all">
            <svg className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
          <button 
            onClick={() => setShowAddModal(true)}
            className="px-8 py-4 bg-teal-600 text-white rounded-[1.5rem] font-black text-[11px] uppercase tracking-widest shadow-xl shadow-teal-100 flex items-center gap-3 hover:bg-teal-700 transition-all"
          >
            {ICONS.Add} New Staff Member
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden min-h-[300px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-20 space-y-4">
            <div className="w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-400 font-black uppercase tracking-widest text-xs">Loading Personnel...</p>
          </div>
        ) : (
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
                      user.role === UserRole.ADMIN ? 'bg-slate-900 text-white' : 
                      user.role === UserRole.GUIDANCE ? 'bg-indigo-50 text-indigo-600' : 
                      'bg-teal-50 text-teal-600'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <button onClick={() => toggleStatus(user.id, user.active)} className={`flex items-center gap-2 px-3 py-1 rounded-full transition-all ${user.active ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${user.active ? 'bg-emerald-600' : 'bg-rose-600'}`}></div>
                      <span className="text-[10px] font-black uppercase tracking-widest">{user.active ? 'Active' : 'Deactivated'}</span>
                    </button>
                  </td>
                  <td className="px-8 py-6 text-right space-x-2">
                    <button className="p-2 text-slate-400 hover:text-teal-600 transition-all">{ICONS.Notes}</button>
                    <button onClick={() => deleteUser(user.id)} className="p-2 text-slate-400 hover:text-rose-500 transition-all">{ICONS.Delete}</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-10">
              <div className="flex justify-between items-center mb-10">
                <h4 className="text-2xl font-black text-slate-900 tracking-tight">Register Staff</h4>
                <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-900 transition-all">✕</button>
              </div>
              <form onSubmit={handleAddUser} className="space-y-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                  <input
                    type="text"
                    required
                    className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 outline-none transition-all font-bold text-slate-900"
                    placeholder="Enter full name"
                    value={newUserData.name}
                    onChange={e => setNewUserData({...newUserData, name: e.target.value})}
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Assigned Role</label>
                  <select
                    className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 bg-slate-50/50 focus:bg-white outline-none transition-all font-bold text-slate-900 appearance-none"
                    value={newUserData.role}
                    onChange={e => setNewUserData({...newUserData, role: e.target.value as UserRole})}
                  >
                    <option value={UserRole.TEACHER}>Teacher / Faculty</option>
                    <option value={UserRole.GUIDANCE}>Guidance Counselor</option>
                    <option value={UserRole.ADMIN}>Administrator</option>
                  </select>
                </div>
                <div className="pt-4">
                  <button
                    disabled={isSubmitting}
                    className="w-full py-5 bg-teal-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-teal-700 disabled:bg-slate-200 transition-all"
                  >
                    {isSubmitting ? 'Processing...' : 'Confirm Registration'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
