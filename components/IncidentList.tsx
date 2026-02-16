
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
  const [noteValue, setNoteValue] = useState('');
  const [isSavingNote, setIsSavingNote] = useState(false);

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
      
      const formatted = (data || []).map((item: any) => ({
        id: item.id,
        studentName: item.student_name,
        gradeSection: item.grade_section,
        incidentType: item.incident_type as IncidentType,
        description: item.description,
        date: item.date,
        status: item.status as IncidentStatus,
        reportedBy: item.reported_by as UserRole,
        severity: item.severity as 'Low' | 'Medium' | 'High',
        adminNotes: item.admin_notes,
        teacherRemarks: item.teacher_remarks,
        guidanceNotes: item.guidance_notes
      }));

      // Only use mock data if DB is completely empty (no table or no rows)
      setIncidents(formatted.length > 0 ? formatted : []);
    } catch (err) {
      console.error('Supabase fetch failed:', err);
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

  const saveNote = async () => {
    if (!selectedIncident) return;
    setIsSavingNote(true);
    
    const fieldMap: Record<string, string> = {
      [UserRole.ADMIN]: 'admin_notes',
      [UserRole.TEACHER]: 'teacher_remarks',
      [UserRole.GUIDANCE]: 'guidance_notes'
    };

    const dbField = fieldMap[userRole];
    if (!dbField) return;

    try {
      const { error } = await supabase
        .from('incidents')
        .update({ [dbField]: noteValue })
        .eq('id', selectedIncident.id);

      if (error) throw error;

      // Update local state by mapping field names correctly
      const camelField = dbField.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
      setIncidents(prev => prev.map(inc => 
        inc.id === selectedIncident.id ? { ...inc, [camelField]: noteValue } : inc
      ));
      
      alert('Notes updated successfully.');
    } catch (err) {
      console.error('Error saving note:', err);
    } finally {
      setIsSavingNote(false);
    }
  };

  const filteredIncidents = incidents.filter(i => {
    const matchesSearch = i.studentName.toLowerCase().includes(search.toLowerCase()) ||
                        i.description.toLowerCase().includes(search.toLowerCase());
    const matchesType = filterType === 'All' || i.incidentType === filterType;
    return matchesSearch && matchesType;
  });

  const getStatusColor = (status: IncidentStatus) => {
    switch (status) {
      case 'Resolved': return 'bg-emerald-500';
      case 'Under Counseling': return 'bg-indigo-500';
      case 'Action Taken': return 'bg-cyan-500';
      case 'Under Review': return 'bg-amber-500';
      case 'New': return 'bg-rose-500';
      case 'Seen': return 'bg-slate-400';
      case 'Forwarded': return 'bg-violet-500';
      default: return 'bg-slate-500';
    }
  };

  const openIncidentDetail = (incident: Incident) => {
    setSelectedIncident(incident);
    const notes = userRole === UserRole.ADMIN ? incident.adminNotes :
                  userRole === UserRole.TEACHER ? incident.teacherRemarks :
                  incident.guidanceNotes;
    setNoteValue(notes || '');
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
            className="block w-full pl-14 pr-6 py-4 border-2 border-slate-100 rounded-[1.5rem] bg-white font-bold outline-none focus:border-teal-400 transition-all"
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
        ) : filteredIncidents.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-20 text-center">
            <div className="bg-slate-50 p-6 rounded-full mb-6">{ICONS.Security}</div>
            <h4 className="text-xl font-black text-slate-900 mb-2">No Incidents Found</h4>
            <p className="text-slate-400 font-medium">Clear search filters to see all reports.</p>
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
                  <tr key={incident.id} className="hover:bg-slate-50/30 transition-all cursor-pointer group" onClick={() => openIncidentDetail(incident)}>
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
          <div className="bg-white w-full max-w-4xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-10 lg:p-14 overflow-y-auto max-h-[90vh]">
              <div className="flex justify-between items-start mb-10">
                <div>
                  <div className="flex items-center gap-4 mb-3">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase text-white ${getStatusColor(selectedIncident.status)}`}>
                      {selectedIncident.status}
                    </span>
                    <span className="text-xs font-bold text-slate-400">{selectedIncident.date}</span>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                      selectedIncident.severity === 'High' ? 'bg-rose-100 text-rose-600' : 
                      selectedIncident.severity === 'Medium' ? 'bg-amber-100 text-amber-600' : 
                      'bg-emerald-100 text-emerald-600'
                    }`}>
                      {selectedIncident.severity} Risk
                    </span>
                  </div>
                  <h3 className="text-4xl font-black text-slate-900 tracking-tight">{selectedIncident.studentName} <span className="text-slate-300 font-medium text-2xl ml-2">({selectedIncident.gradeSection})</span></h3>
                </div>
                <button onClick={() => setSelectedIncident(null)} className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all">✕</button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                <div className="md:col-span-2 space-y-10">
                  <div className="bg-slate-50 p-8 rounded-[2rem]">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Original Report</h4>
                    <p className="text-slate-700 text-lg leading-relaxed italic">"{selectedIncident.description}"</p>
                  </div>

                  <div className="space-y-6">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Case Management Notes</h4>
                    <div className="relative">
                      <textarea
                        rows={4}
                        className="w-full px-6 py-5 rounded-2xl border-2 border-slate-100 bg-white focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 outline-none transition-all font-bold text-slate-900 placeholder-slate-300"
                        placeholder={`Enter your ${userRole.toLowerCase()} notes here...`}
                        value={noteValue}
                        onChange={(e) => setNoteValue(e.target.value)}
                      />
                      <button 
                        onClick={saveNote}
                        disabled={isSavingNote}
                        className="mt-4 px-8 py-4 bg-teal-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-teal-100 hover:bg-teal-700 disabled:bg-slate-200 transition-all"
                      >
                        {isSavingNote ? 'Syncing...' : 'Save & Update Records'}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Incident Control</h4>
                    <div className="flex flex-col gap-3">
                      {userRole === UserRole.ADMIN && (
                        <button onClick={() => updateStatus(selectedIncident.id, 'Resolved')} className="w-full px-6 py-4 bg-emerald-500 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-lg shadow-emerald-100 hover:bg-emerald-600 transition-all">Mark as Resolved</button>
                      )}
                      {(userRole === UserRole.GUIDANCE || userRole === UserRole.ADMIN) && (
                        <button onClick={() => updateStatus(selectedIncident.id, 'Under Counseling')} className="w-full px-6 py-4 bg-indigo-500 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-lg shadow-indigo-100 hover:bg-indigo-600 transition-all">Schedule Counseling</button>
                      )}
                      <button onClick={() => updateStatus(selectedIncident.id, 'Action Taken')} className="w-full px-6 py-4 border-2 border-slate-100 text-slate-600 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-slate-50 transition-all">Record Action Taken</button>
                    </div>
                  </div>

                  <div className="p-6 bg-slate-900 rounded-[2rem] text-white">
                    <h4 className="text-[9px] font-black text-teal-400 uppercase tracking-widest mb-4">Metadata</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-[10px] text-slate-400">Reporter:</span>
                        <span className="text-[10px] font-bold">{selectedIncident.reportedBy}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[10px] text-slate-400">Category:</span>
                        <span className="text-[10px] font-bold">{selectedIncident.incidentType}</span>
                      </div>
                    </div>
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
