import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../api/axios';
import { 
  Plus, Edit2, Trash2, FileText, BarChart2, 
  ExternalLink, Copy, Search, TrendingUp, Users,
  Check, X,
  MousePointer2, Settings, Loader2
} from 'lucide-react';
import { 
  AreaChart, Area,
  Tooltip, ResponsiveContainer 
} from 'recharts';

const chartData = [
  { name: 'Mon', submissions: 2400 },
  { name: 'Tue', submissions: 1398 },
  { name: 'Wed', submissions: 9800 },
  { name: 'Thu', submissions: 3908 },
  { name: 'Fri', submissions: 4800 },
  { name: 'Sat', submissions: 3800 },
  { name: 'Sun', submissions: 4300 },
];

// ── Inline Title Editor ───────────────────────────────────────────────────────
const InlineTitleEditor = ({ form, onSaved }) => {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(form.title || 'Untitled Collection');
  const [saving, setSaving] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  const save = async () => {
    const trimmed = value.trim() || 'Untitled Collection';
    if (trimmed === form.title) { setEditing(false); return; }
    setSaving(true);
    try {
      await api.put(`/forms/${form._id}`, { title: trimmed });
      onSaved(form._id, trimmed);
      setValue(trimmed);
    } catch {
      setValue(form.title);
    } finally {
      setSaving(false);
      setEditing(false);
    }
  };

  const cancel = () => {
    setValue(form.title);
    setEditing(false);
  };

  if (editing) {
    return (
      <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
        <input
          ref={inputRef}
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') save(); if (e.key === 'Escape') cancel(); }}
          className="flex-1 bg-white/10 border border-brand-500/50 rounded-xl px-3 py-1.5 text-sm font-bold text-white outline-none focus:border-brand-500"
        />
        <button onClick={save} disabled={saving} className="w-7 h-7 rounded-lg bg-brand-500/20 text-brand-500 hover:bg-brand-500 hover:text-white flex items-center justify-center transition-all">
          {saving ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />}
        </button>
        <button onClick={cancel} className="w-7 h-7 rounded-lg bg-white/5 text-slate-400 hover:bg-red-500/20 hover:text-red-400 flex items-center justify-center transition-all">
          <X size={12} />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 group/title">
      <h4 className="text-xl font-bold text-white leading-tight truncate">
        {form.title || 'Untitled Collection'}
      </h4>
      <button
        onClick={e => { e.stopPropagation(); setEditing(true); }}
        className="opacity-0 group-hover/title:opacity-100 w-6 h-6 rounded-lg bg-white/5 text-slate-500 hover:text-brand-500 hover:bg-brand-500/10 flex items-center justify-center transition-all shrink-0"
      >
        <Edit2 size={10} />
      </button>
    </div>
  );
};

// ── Dashboard ─────────────────────────────────────────────────────────────────
const Dashboard = () => {
  const [forms, setForms]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState('');
  const navigate = useNavigate();

  useEffect(() => { fetchForms(); }, []);

  const fetchForms = async () => {
    try {
      const { data } = await api.get('/forms');
      setForms(data);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Called by InlineTitleEditor on successful save — updates local state instantly
  const handleTitleSaved = useCallback((formId, newTitle) => {
    setForms(prev => prev.map(f => f._id === formId ? { ...f, title: newTitle } : f));
  }, []);

  const deleteForm = async (e, id) => {
    e.preventDefault(); e.stopPropagation();
    if (!window.confirm('Permanently delete this collection?')) return;
    try {
      await api.delete(`/forms/${id}`);
      setForms(prev => prev.filter(f => f._id !== id));
    } catch { alert('Failed to delete form'); }
  };

  const duplicateForm = async (e, id) => {
    e.preventDefault(); e.stopPropagation();
    try {
      const { data } = await api.post(`/forms/${id}/duplicate`);
      setForms(prev => [data, ...prev]);
    } catch { alert('Failed to duplicate form'); }
  };

  const filteredForms = forms.filter(f =>
    (f.title || '').toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return (
    <div className="flex h-[80vh] items-center justify-center">
      <Loader2 className="w-10 h-10 text-brand-500 animate-spin" />
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-[1600px] mx-auto space-y-10 pb-20 pt-6 px-4 sm:px-8"
    >
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div className="space-y-1">
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">WORKSPACE</h1>
          <p className="text-slate-500 font-medium tracking-tight text-sm md:text-base">Central command for your dynamic form collections.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <div className="relative group flex-1 sm:flex-none">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-brand-500 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search by title..." 
              className="bg-white/5 border border-white/5 rounded-2xl pl-12 pr-4 h-12 w-full sm:w-64 focus:border-brand-500 focus:bg-white/[0.08] outline-none transition-all text-sm font-bold"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <button 
            onClick={() => navigate('/forms/new')}
            className="btn-premium btn-premium-primary h-12 px-8 shadow-2xl text-xs sm:text-sm whitespace-nowrap"
          >
            <Plus size={18} /> CREATE NEW FORM
          </button>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { label: 'Total Collections', value: forms.length, trend: 'Live Count', icon: TrendingUp },
          { label: 'Total Components',  value: forms.reduce((s, f) => s + (f.fields?.length || 0), 0), trend: 'Infrastructure', icon: MousePointer2 },
          { label: 'Total Responses',    value: forms.reduce((s, f) => s + (f.responseCount || 0), 0), trend: 'Global Reach', icon: Users },
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-8 rounded-[2.5rem] relative overflow-hidden border border-white/5"
          >
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">{stat.label}</p>
                <h4 className="text-4xl font-black text-white">{stat.value}</h4>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-brand-500/10 flex items-center justify-center text-brand-500 border border-brand-500/10">
                <stat.icon size={28} />
              </div>
            </div>
            <div className="mt-6 flex items-center gap-3">
              <span className="text-[10px] font-bold text-green-500 bg-green-500/10 px-3 py-1 rounded-full uppercase tracking-tighter">{stat.trend}</span>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Live Status</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-2xl font-black text-white uppercase tracking-tight">Active Collections</h3>
            <span className="text-xs font-bold text-brand-500 bg-brand-500/10 px-3 py-1 rounded-full">{filteredForms.length} Total</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AnimatePresence>
              {filteredForms.map((form, i) => (
                <motion.div 
                  key={form._id}
                  layout
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => navigate(`/forms/edit/${form._id}`)}
                  className="glass-card p-6 rounded-[2rem] border border-white/5 group cursor-pointer hover:border-brand-500/30 transition-all duration-500"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-slate-400 group-hover:bg-brand-500 group-hover:text-white transition-all duration-500">
                      <FileText size={28} />
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button 
                        onClick={e => duplicateForm(e, form._id)}
                        className="p-2.5 rounded-xl bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all"
                        title="Duplicate"
                      >
                        <Copy size={16} />
                      </button>
                      <button 
                        onClick={e => deleteForm(e, form._id)}
                        className="p-2.5 rounded-xl bg-red-500/5 text-slate-500 hover:text-red-500 hover:bg-red-500/10 transition-all"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  
                  {/* ── Inline editable title ── */}
                  <InlineTitleEditor form={form} onSaved={handleTitleSaved} />

                  <p className="text-sm text-slate-500 line-clamp-1 font-medium mt-1">
                    {form.description || 'No description provided.'}
                  </p>

                  <div className="mt-6 pt-5 border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-brand-500 shadow-[0_0_10px_rgba(14,165,233,0.5)]" />
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        {form.fields?.length || 0} COMPONENTS
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Link 
                        to={`/forms/edit/${form._id}`}
                        onClick={e => e.stopPropagation()}
                        className="p-2.5 bg-white/5 rounded-xl text-slate-400 hover:text-brand-500 hover:bg-brand-500/10 transition-all"
                        title="Edit"
                      >
                        <Edit2 size={16} />
                      </Link>
                      <Link 
                        to={`/forms/${form._id}`}
                        target="_blank"
                        onClick={e => e.stopPropagation()}
                        className="p-2.5 bg-white/5 rounded-xl text-slate-400 hover:text-brand-500 hover:bg-brand-500/10 transition-all"
                        title="Open Public Form"
                      >
                        <ExternalLink size={16} />
                      </Link>
                      <Link 
                        to={`/forms/edit/${form._id}`}
                        onClick={e => { e.stopPropagation(); }}
                        state={{ tab: 'responses' }}
                        className="p-2.5 bg-white/5 rounded-xl text-slate-400 hover:text-brand-500 hover:bg-brand-500/10 transition-all"
                        title="Responses"
                      >
                        <BarChart2 size={16} />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {filteredForms.length === 0 && (
              <div className="col-span-full py-32 flex flex-col items-center justify-center glass-card border-dashed border-white/10 rounded-[3rem] opacity-40">
                <Plus size={64} strokeWidth={1} className="mb-4" />
                <p className="text-xl font-bold text-white tracking-tight">Workspace is empty</p>
                <p className="text-sm text-slate-500 mt-1">Create your first form to start collecting data.</p>
              </div>
            )}
          </div>
        </div>

        {/* Aside — Performance Chart */}
        <aside className="space-y-8 h-full">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-xl font-black text-white uppercase tracking-tight">Performance</h3>
            <Settings size={18} className="text-slate-500" />
          </div>
          <div className="glass-card p-2 rounded-[2.5rem] h-[500px] border border-white/5 relative bg-white/[0.02]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart 
                data={forms.map(f => ({ name: f.title.substring(0, 10), count: f.responseCount || 0 })).reverse()} 
                margin={{ top: 40, right: 20, left: 20, bottom: 20 }}
              >
                <defs>
                  <linearGradient id="colorTrend" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#0ea5e9" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0F172A', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', fontSize: '10px', color: '#fff' }}
                  itemStyle={{ color: '#0ea5e9', fontWeight: 'bold' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#0ea5e9" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorTrend)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </aside>
      </div>
    </motion.div>
  );
};

export default Dashboard;
