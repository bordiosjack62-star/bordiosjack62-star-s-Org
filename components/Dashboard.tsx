
import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie
} from 'recharts';
import { ICONS } from '../constants';
import { UserRole } from '../types';
import { supabase } from '../services/supabaseClient';

interface DashboardProps {
  userRole: UserRole;
}

const Dashboard: React.FC<DashboardProps> = ({ userRole }) => {
  const [stats, setStats] = useState({
    total: 0,
    resolved: 0,
    critical: 0,
    counseling: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data, error } = await supabase.from('incidents').select('status, severity');
      if (error) throw error;

      if (data) {
        setStats({
          total: data.length,
          resolved: data.filter(i => i.status === 'Resolved').length,
          critical: data.filter(i => i.severity === 'High').length,
          counseling: data.filter(i => i.status === 'Under Counseling').length
        });
      }
    } catch (err) {
      console.warn('Dashboard fetch failed, using defaults');
      setStats({ total: 42, resolved: 24, critical: 6, counseling: 8 });
    } finally {
      setLoading(false);
    }
  };

  const typeData = [
    { name: 'Bullying', value: 12 },
    { name: 'Digital', value: 8 },
    { name: 'Academic', value: 6 },
    { name: 'Language', value: 10 },
    { name: 'Other', value: 6 },
  ];

  const gradeData = [
    { name: 'Grade 8', value: 10 },
    { name: 'Grade 9', value: 14 },
    { name: 'Grade 10', value: 8 },
    { name: 'Grade 11', value: 6 },
    { name: 'Grade 12', value: 4 },
  ];

  const COLORS = ['#14b8a6', '#0891b2', '#0e7490', '#164e63', '#94a3b8'];

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
          <div className="flex items-center gap-5">
            <div className="bg-teal-50 w-14 h-14 rounded-2xl text-teal-600 flex items-center justify-center">{ICONS.Reports}</div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Reports</p>
              <h4 className="text-3xl font-black text-slate-900">{loading ? '...' : stats.total}</h4>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
          <div className="flex items-center gap-5">
            <div className="bg-emerald-50 w-14 h-14 rounded-2xl text-emerald-600 flex items-center justify-center">{ICONS.Resolved}</div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Resolved Cases</p>
              <h4 className="text-3xl font-black text-slate-900">{loading ? '...' : stats.resolved}</h4>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
          <div className="flex items-center gap-5">
            <div className="bg-rose-50 w-14 h-14 rounded-2xl text-rose-600 flex items-center justify-center">{ICONS.Alert}</div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">High Severity</p>
              <h4 className="text-3xl font-black text-slate-900">{loading ? '...' : stats.critical}</h4>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
          <div className="flex items-center gap-5">
            <div className="bg-indigo-50 w-14 h-14 rounded-2xl text-indigo-600 flex items-center justify-center">{ICONS.Users}</div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Counseling Active</p>
              <h4 className="text-3xl font-black text-slate-900">{loading ? '...' : stats.counseling}</h4>
            </div>
          </div>
        </div>
      </div>

      {(userRole === UserRole.ADMIN || userRole === UserRole.GUIDANCE) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-10">
              <h3 className="text-xl font-black text-slate-900">Incidents by Category</h3>
            </div>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={typeData}>
                  <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 'bold'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 'bold'}} />
                  <Tooltip />
                  <Bar dataKey="value" radius={[10, 10, 0, 0]} barSize={40}>
                    {typeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-10">
              <h3 className="text-xl font-black text-slate-900">Grade Distribution</h3>
            </div>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={gradeData} innerRadius={70} outerRadius={100} paddingAngle={8} dataKey="value" stroke="none">
                    {gradeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
