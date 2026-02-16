
import React, { useState } from 'react';
import { IncidentType, UserRole } from '../types';
import { analyzeIncident } from '../services/geminiService';
import { ICONS, INCIDENT_TYPE_ICONS } from '../constants';
import { supabase } from '../services/supabaseClient';

interface IncidentFormProps {
  onSuccess: () => void;
  userRole: UserRole;
}

const IncidentForm: React.FC<IncidentFormProps> = ({ onSuccess, userRole }) => {
  const [loading, setLoading] = useState(false);
  const [aiAnalyzing, setAiAnalyzing] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    studentName: '',
    gradeSection: '',
    incidentType: IncidentType.OTHER,
    description: '',
    date: new Date().toISOString().split('T')[0],
  });

  const handleAiAnalyze = async () => {
    if (formData.description.length < 10) return;
    setAiAnalyzing(true);
    try {
      const result = await analyzeIncident(formData.description);
      if (result) {
        setAiSuggestion(result);
      }
    } catch (err) {
      console.error("AI Analysis error:", err);
    } finally {
      setAiAnalyzing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('incidents')
        .insert([{
          student_name: formData.studentName,
          grade_section: formData.gradeSection,
          incident_type: formData.incidentType,
          description: formData.description,
          date: formData.date,
          status: 'New',
          reported_by: userRole,
          severity: aiSuggestion?.severity || 'Medium'
        }]);

      if (error) throw error;
      onSuccess();
    } catch (err: any) {
      console.error('Error saving incident:', err);
      alert(`Error: ${err.message || 'Failed to submit report. Please check your connection.'}`);
    } finally {
      setLoading(false);
    }
  };

  const applyAiSuggestion = () => {
    if (aiSuggestion) {
      const type = Object.values(IncidentType).find(t => 
        aiSuggestion.suggestedType.toLowerCase().includes(t.toLowerCase())
      ) || IncidentType.OTHER;
      setFormData(prev => ({ ...prev, incidentType: type }));
      setAiSuggestion(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-[2.5rem] shadow-[0_25px_70px_-15px_rgba(0,0,0,0.06)] border border-slate-200 overflow-hidden">
        <div className="p-8 md:p-14">
          <header className="mb-14">
            <h3 className="text-4xl font-black text-slate-900 mb-4 tracking-tighter">Submit Report</h3>
            <p className="text-slate-500 font-medium text-lg max-w-xl">
              Provide the details of the incident. Your safety and privacy are our highest priority.
            </p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-12">
            <section className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl bg-teal-600 text-white flex items-center justify-center font-black shadow-lg shadow-teal-200">1</div>
                <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Identify Parties</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Student Involved</label>
                  <input
                    type="text"
                    required
                    className="w-full px-6 py-5 rounded-2xl border-2 border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 outline-none transition-all font-bold text-slate-900 placeholder-slate-300"
                    placeholder="e.g. Juan dela Cruz"
                    value={formData.studentName}
                    onChange={e => setFormData({ ...formData, studentName: e.target.value })}
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Grade / Section</label>
                  <input
                    type="text"
                    required
                    className="w-full px-6 py-5 rounded-2xl border-2 border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 outline-none transition-all font-bold text-slate-900 placeholder-slate-300"
                    placeholder="e.g. 11-B"
                    value={formData.gradeSection}
                    onChange={e => setFormData({ ...formData, gradeSection: e.target.value })}
                  />
                </div>
              </div>
            </section>

            <section className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl bg-teal-600 text-white flex items-center justify-center font-black shadow-lg shadow-teal-200">2</div>
                <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Select Category</h4>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                {Object.values(IncidentType).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setFormData({ ...formData, incidentType: type })}
                    className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all duration-300 gap-4 group h-32 ${
                      formData.incidentType === type 
                        ? 'border-teal-600 bg-teal-50/80 text-teal-700 ring-4 ring-teal-500/10' 
                        : 'border-slate-100 bg-white hover:border-slate-300 text-slate-400 hover:text-slate-900 shadow-sm'
                    }`}
                  >
                    <div className={`${formData.incidentType === type ? 'text-teal-600 scale-110' : 'text-slate-300 group-hover:text-slate-600'} transition-all duration-300`}>
                      {INCIDENT_TYPE_ICONS[type] || ICONS.Alert}
                    </div>
                    <span className="text-[11px] font-black text-center leading-tight uppercase tracking-widest">{type}</span>
                  </button>
                ))}
              </div>
            </section>

            <section className="space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-teal-600 text-white flex items-center justify-center font-black shadow-lg shadow-teal-200">3</div>
                  <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Incident Details</h4>
                </div>
                <button
                  type="button"
                  onClick={handleAiAnalyze}
                  disabled={aiAnalyzing || formData.description.length < 10}
                  className="px-6 py-3 rounded-2xl text-[11px] font-black bg-slate-900 text-white hover:bg-teal-600 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed transition-all flex items-center gap-3 uppercase tracking-widest shadow-xl"
                >
                  {aiAnalyzing ? (
                    <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : '🪄'}
                  {aiAnalyzing ? 'Analyzing...' : 'AI Risk Analysis'}
                </button>
              </div>

              <div className="relative">
                <textarea
                  required
                  rows={6}
                  className="w-full px-8 py-7 rounded-3xl border-2 border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 outline-none transition-all font-bold text-slate-900 placeholder-slate-300 text-lg leading-relaxed resize-none"
                  placeholder="Tell us what happened..."
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              {aiSuggestion && (
                <div className="bg-teal-600 text-white rounded-[2.5rem] p-8 shadow-2xl shadow-teal-900/20 animate-in zoom-in-95 duration-500">
                  <div className="flex items-start gap-6">
                    <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-2xl shrink-0 border border-white/20">✨</div>
                    <div className="flex-1">
                      <p className="text-xl font-bold mb-4">AI Assessment: {aiSuggestion.suggestedType}</p>
                      <p className="text-base font-medium text-teal-50/80 mb-8 italic">{aiSuggestion.reasoning}</p>
                      <button
                        type="button"
                        onClick={applyAiSuggestion}
                        className="px-8 py-4 bg-white text-teal-700 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-teal-50"
                      >
                        Accept Recommendation
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </section>

            <div className="pt-14 border-t border-slate-100 flex justify-end gap-6">
              <button
                type="submit"
                disabled={loading}
                className="px-14 py-5 bg-teal-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl hover:bg-teal-700 transition-all flex items-center gap-4"
              >
                {loading ? 'Sending to Database...' : 'Submit Official Report'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default IncidentForm;
