
import React, { useState, useEffect } from 'react';
import { Incident, IncidentType, IncidentStatus, UserRole } from '../types';
import { ICONS, MOCK_INCIDENTS } from '../constants';
import { supabase } from '../services/supabaseClient';

interface IncidentListProps {
  userRole: UserRole;
}

const IncidentList: React.FC<IncidentListProps> = ({ userRole }) => {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<string>('All');
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);

  useEffect(() => {
    fetchIncidents();
  }, []);

  const fetchIncidents = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('incidents')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;
      
      // Transform snake_case from DB to camelCase for the UI
      const formatted = (data || []).map((item: any) => ({
        id: item.id,
        studentName: item.student_name,
        gradeSection: item.grade_section,
        incidentType: item.incident_type,
        description: item.description,
        date: item.date,
        status: item.status,
        reportedBy: item.reported_by,
        severity: item.severity,
      }));

      setIncidents(formatted.length > 0 ? formatted : MOCK_INCIDENTS as any);
    } catch (err) {
      console.warn('Supabase fetch failed, using mock data.', err);
      setIncidents(MOCK_INCIDENTS as any);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: IncidentStatus) => {
    try {
      const { error } = await supabase
        .from('incidents')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;

      setIncidents(prev => prev.map(inc => inc.id === id ? { ...inc, status: newStatus } : inc));
      if (selectedIncident?.id === id) {
        setSelectedIncident(prev => prev ? { ...prev, status: newStatus } : null);
      }
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const filteredIncidents = incidents.filter(i => {
    const matchesSearch = i.studentName.toLowerCase().includes(search.toLowerCase()) ||
                        i.description.toLowerCase().includes(search.toLowerCase());
    const matchesType = filterType === 'All' || i.incidentType === filterType;
    
    if (userRole === UserRole.TEACHER) {
      return matchesSearch && matchesType && i.gradeSection.includes('10 - A');
    }
    return matchesSearch && matchesType;
  });

  const getStatusColor = (status: IncidentStatus) => {
    switch (status) {
      case 'Resolved': return 'bg-emerald-500';
      case 'Under Counseling': return 'bg-indigo-500';
      case 'Action Taken': return 'bg-cyan-500';
      case 'Under Review': return 'bg-amber-500';
      case 'New': return 'bg-rose-500';
      default: return 'bg-slate-500';
    }
  };

  return (
    <div className="space-y-8 relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="relative flex-1 max-w-xl">
          <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-400">
            {ICONS.Search}
          </div>
          <input
            type="text"
            className="block w-full pl-14 pr-6 py-4 border-2 border-slate-100 rounded-[1.5rem] bg-white font-bold"
            placeholder="Search student or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-4">
          <button onClick={fetchIncidents} className="p-4 bg-white border-2 border-slate-100 rounded-[1.5rem] text-slate-400 hover:text-teal-600 transition-all">
            <svg className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
          <select 
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-6 py-4 bg-white border-2 border-slate-100 rounded-[1.5rem] font-black text-[11px] uppercase tracking-widest text-slate-600 outline-none"
          >
            <option value="All">All Types</option>
            {Object.values(IncidentType).map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_-15px_rgba(0,0,0,0.05)] border border-slate-100 overflow-hidden min-h-[400px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-20 space-y-4">
            <div className="w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-400 font-black uppercase tracking-widest text-xs">Accessing Cloud Shield...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-50">
              <thead className="bg-slate-50/50">
                <tr>
                  <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Date</th>
                  <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Student</th>
                  <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Category</th>
                  <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                  <th className="px-8 py-6 text-right text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-50">
                {filteredIncidents.map((incident) => (
                  <tr key={incident.id} className="hover:bg-slate-50/30 transition-all cursor-pointer group" onClick={() => setSelectedIncident(incident)}>
                    <td className="px-8 py-6 whitespace-nowrap text-xs font-bold text-slate-500">{incident.date}</td>
                    <td className="px-8 py-6 whitespace-nowrap"><div className="text-sm font-black text-slate-900">{incident.studentName}</div></td>
                    <td className="px-8 py-6 whitespace-nowrap">
                      <span className="text-[10px] font-black uppercase tracking-widest text-teal-600 bg-teal-50 px-3 py-1.5 rounded-full">{incident.incidentType}</span>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${getStatusColor(incident.status)}`}></div>
                        <span className="text-[11px] font-bold text-slate-700">{incident.status}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button className="bg-slate-50 p-2 rounded-xl text-slate-400 group-hover:bg-teal-600 group-hover:text-white transition-all">
                        {ICONS.ChevronRight}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedIncident && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white w-full max-w-4xl rounded-[3rem] shadow-2xl overflow-hidden">
            <div className="p-10 lg:p-14 overflow-y-auto max-h-[90vh]">
              <div className="flex justify-between items-start mb-10">
                <div>
                  <div className="flex items-center gap-4 mb-3">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase text-white ${getStatusColor(selectedIncident.status)}`}>
                      {selectedIncident.status}
                    </span>
                    <span className="text-xs font-bold text-slate-400">{selectedIncident.date}</span>
                  </div>
                  <h3 className="text-4xl font-black text-slate-900">{selectedIncident.studentName}</h3>
                </div>
                <button onClick={() => setSelectedIncident(null)} className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400">✕</button>
              </div>

              <div className="space-y-8">
                <div className="bg-slate-50 p-8 rounded-[2rem]">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase mb-4">Description</h4>
                  <p className="text-slate-700 text-lg italic">"{selectedIncident.description}"</p>
                </div>

                <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase">Update Status</h4>
                  <div className="flex flex-wrap gap-3">
                    {userRole === UserRole.ADMIN && (
                      <button onClick={() => updateStatus(selectedIncident.id, 'Resolved')} className="px-6 py-3 border-2 border-emerald-200 text-emerald-600 rounded-2xl font-black text-[10px] uppercase">Mark Resolved</button>
                    )}
                    {userRole === UserRole.GUIDANCE && (
                      <button onClick={() => updateStatus(selectedIncident.id, 'Under Counseling')} className="px-6 py-3 border-2 border-indigo-200 text-indigo-600 rounded-2xl font-black text-[10px] uppercase">Intervene</button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IncidentList;
