import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import Sidebar from '../../components/builder/Sidebar';
import Canvas from '../../components/builder/Canvas';
import FieldSettings from '../../components/builder/FieldSettings';
import Preview from '../../components/builder/Preview';
import ResponsesTable from '../../components/builder/ResponsesTable';

import api from '../../api/axios';
import { FIELD_REGISTRY, FIELD_GROUPS } from '../../constants/fieldTypes';
import { 
  Save, Eye, Settings as SettingsIcon, 
  ChevronLeft, Layout, MousePointer2, 
  Sparkles, Layers, Loader2, Plus, ArrowLeft,
  FileText, BarChart3, Settings2, X
} from 'lucide-react';

const Builder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // States
  const [activeTab, setActiveTab] = useState('builder'); // builder, preview, responses, settings
  const [form, setForm] = useState({
    title: 'Untitled Collection',
    description: 'Configure your fields to start collecting clean data.',
    fields: [],
    settings: {
      submitButtonText: 'Submit',
      successMessage: 'Thank you for your response!',
      active: true,
    }
  });
  const [selectedFieldId, setSelectedFieldId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const [showLibrary, setShowLibrary] = useState(false);
  const [showInspector, setShowInspector] = useState(false);

  useEffect(() => {
    if (id && id !== 'new' && id !== 'undefined') fetchForm();
  }, [id]);

  useEffect(() => {
    // Hide sidebars on route change or screen resize (simplified)
    const handleResize = () => {
      if (window.innerWidth < 1280) {
        setShowLibrary(false);
        setShowInspector(false);
      } else {
        setShowLibrary(true);
        setShowInspector(true);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchForm = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/forms/${id}`);
      setForm({
        _id: data._id,
        title: data.title || 'Untitled Collection',
        description: data.description || '',
        fields: data.fields || [],
        settings: {
          submitButtonText: data.settings?.submitButtonText || 'Submit',
          successMessage: data.settings?.successMessage || 'Thank you for your response!',
          active: data.settings?.active ?? true,
          redirectUrl: data.settings?.redirectUrl || '',
        }
      });
    } catch (err) {
      console.error(err);
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const addField = (typeData) => {
    const newId = `field_${Date.now()}`;
    const newField = {
      id: newId,
      _id: newId,
      type: typeData.type,
      label: typeData.label,
      name: `${typeData.type}_${Date.now()}`,
      ...typeData.defaultProps,
      styling: {
        width: '100%',
        color: '#ffffff',
      }
    };
    setForm((prev) => ({ ...prev, fields: [...prev.fields, newField] }));
    setSelectedFieldId(newId);
    if (window.innerWidth < 1280) {
      setShowLibrary(false);
    }
  };

  const updateField = (fieldId, updates) => {
    setForm((prev) => ({
      ...prev,
      fields: prev.fields.map((f) => (f.id === fieldId || f._id === fieldId ? { ...f, ...updates } : f)),
    }));
  };

  const saveForm = async () => {
    if (!form.title.trim()) return alert('Please enter a title');
    setIsSaving(true);
    try {
      if (id && id !== 'new') {
        await api.put(`/forms/${id}`, form);
        alert('Workspace Updated!');
      } else {
        const { data } = await api.post('/forms', form);
        alert('Collection Initialized!');
        navigate(`/forms/edit/${data._id}`, { replace: true });
      }
    } catch (err) {
      alert(`Save Rejected: ${err.response?.data?.error || 'Unknown error'}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      setForm((prev) => ({
        ...prev,
        fields: arrayMove(
          prev.fields,
          prev.fields.findIndex(f => (f.id || f._id) === active.id),
          prev.fields.findIndex(f => (f.id || f._id) === over.id)
        ),
      }));
    }
  };

  const selectedField = form.fields.find(f => f.id === selectedFieldId || f._id === selectedFieldId);

  if (loading) return (
    <div className="fixed inset-0 bg-[#020617] flex flex-col items-center justify-center">
      <Loader2 className="w-12 h-12 text-brand-500 animate-spin" />
    </div>
  );

  return (
    <div className="fixed inset-0 bg-[#020617] text-slate-200 flex flex-col overflow-hidden">
      {/* Primary Workspace Header */}
      <header className="h-16 border-b border-white/5 px-4 lg:px-8 flex items-center justify-between glass z-[60] bg-[#020617]/95 backdrop-blur-xl shrink-0">
        <div className="flex items-center gap-4 lg:gap-6 min-w-0">
          <Link to="/dashboard" className="w-9 h-9 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center hover:bg-brand-500/10 hover:text-brand-500 transition-all shrink-0">
            <ArrowLeft size={16} />
          </Link>
          <div className="hidden sm:flex flex-col gap-0.5 min-w-0">
            <input 
              value={form.title} 
              onChange={e => setForm({...form, title: e.target.value})}
              className="bg-transparent border-none outline-none font-black text-sm lg:text-base text-white focus:ring-0 w-32 lg:w-48 placeholder:text-slate-700 leading-tight truncate"
              placeholder="Title..."
            />
          </div>
        </div>

        {/* Tab Switcher - Compact & Professional */}
        <div className="flex items-center bg-white/5 rounded-2xl p-1 gap-1 border border-white/5 overflow-x-auto no-scrollbar max-w-full mx-2">
          {[
            { id: 'builder', label: 'Builder', icon: Layers, protected: false },
            { id: 'preview', label: 'Preview', icon: Eye, protected: false },
            { id: 'responses', label: 'Responses', icon: BarChart3, protected: true },
            { id: 'settings', label: 'Settings', icon: Settings2, protected: true },
          ].map((tab) => {
            const isDisabled = tab.protected && (!id || id === 'new');
            return (
              <button
                key={tab.id}
                disabled={isDisabled}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3 lg:px-4 py-1.5 rounded-xl text-[10px] lg:text-xs font-bold transition-all whitespace-nowrap ${
                  isDisabled ? 'opacity-20 cursor-not-allowed' :
                  activeTab === tab.id 
                    ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/20' 
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <tab.icon size={14} /> 
                <span className={activeTab === tab.id ? 'inline' : 'hidden md:inline'}>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={saveForm}
            disabled={isSaving}
            className="btn-premium btn-premium-primary py-2 px-4 lg:px-6 text-[10px] lg:text-xs font-bold uppercase tracking-widest whitespace-nowrap"
          >
            {isSaving ? <Loader2 className="animate-spin w-3.5 h-3.5" /> : <><Save size={14} className="hidden sm:inline" /> Save</>}
          </button>
        </div>
      </header>

      {/* Main Workspace Area based on Tabs */}
      <div className="flex-1 overflow-hidden relative">
        {activeTab === 'builder' && (
          <div className="h-full flex overflow-hidden">
            {/* Mobile Library Toggle */}
            <button 
              onClick={() => setShowLibrary(!showLibrary)}
              className="xl:hidden fixed bottom-6 left-6 z-[70] w-14 h-14 rounded-full bg-brand-500 text-white shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all"
            >
              <Plus size={24} className={showLibrary ? 'rotate-45' : ''} />
            </button>

            {/* Mobile Inspector Toggle */}
            {selectedField && (
              <button 
                onClick={() => setShowInspector(!showInspector)}
                className="xl:hidden fixed bottom-6 right-6 z-[70] w-14 h-14 rounded-full bg-slate-800 text-white shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all border border-white/10"
              >
                <SettingsIcon size={24} />
              </button>
            )}

            {/* Sidebar: Library */}
            <aside className={`
              fixed xl:relative inset-y-0 left-0 w-80 border-r border-white/5 bg-[#020617] h-full overflow-hidden flex flex-col pt-6 z-50 transition-transform duration-300
              ${showLibrary ? 'translate-x-0' : '-translate-x-full xl:translate-x-0'}
            `}>
              <div className="flex items-center justify-between px-6 mb-6 xl:hidden">
                <h3 className="font-black text-white uppercase tracking-tighter">Library</h3>
                <button onClick={() => setShowLibrary(false)} className="p-2 bg-white/5 rounded-lg"><X size={16}/></button>
              </div>
              <Sidebar onAdd={addField} />
            </aside>

            {/* Middle: Canvas */}
            <main className="flex-1 bg-slate-950/30 overflow-y-auto p-4 md:p-12 no-scrollbar scroll-smooth">
              <div className="max-w-3xl mx-auto min-h-full pb-40">
                <AnimatePresence mode="popLayout">
                  {form.fields.length === 0 ? (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      onClick={() => addField(FIELD_REGISTRY[0])}
                      className="h-[60vh] flex flex-col items-center justify-center text-center space-y-8 cursor-pointer group"
                    >
                      <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-[2rem] bg-brand-500/5 flex items-center justify-center text-brand-500 border border-brand-500/10 transition-all duration-500 shadow-2xl group-hover:bg-brand-500/10">
                        <Plus size={40} className="lg:size-48" strokeWidth={1} />
                      </div>
                      <div className="space-y-1">
                        <h2 className="text-lg lg:text-xl font-black text-white uppercase tracking-tight">Empty Workspace</h2>
                        <p className="text-xs lg:text-sm text-slate-500 font-medium">Click to add your first component.</p>
                      </div>
                    </motion.div>
                  ) : (
                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                      <SortableContext items={form.fields.map(f => f.id || f._id)} strategy={verticalListSortingStrategy}>
                        <Canvas
                          fields={form.fields}
                          onSelect={(fid) => {
                            setSelectedFieldId(fid);
                            if (window.innerWidth < 1280) setShowInspector(true);
                          }}
                          selectedId={selectedFieldId}
                          onRemove={(fid) => {
                            setForm(f => ({ ...f, fields: f.fields.filter(field => (field.id || field._id) !== fid) }));
                            if(selectedFieldId === fid) setSelectedFieldId(null);
                          }}
                        />
                      </SortableContext>
                    </DndContext>
                  )}
                </AnimatePresence>
              </div>
            </main>

            {/* Right: Inspector */}
            <aside className={`
              fixed xl:relative inset-y-0 right-0 w-full sm:w-[400px] border-l border-white/5 bg-[#020617] h-full overflow-y-auto no-scrollbar z-50 transition-transform duration-300
              ${showInspector ? 'translate-x-0' : 'translate-x-full xl:translate-x-0'}
            `}>
              <div className="flex items-center justify-between px-6 py-6 xl:hidden border-b border-white/5 mb-4">
                <h3 className="font-black text-white uppercase tracking-tighter">Properties</h3>
                <button onClick={() => setShowInspector(false)} className="p-2 bg-white/5 rounded-lg"><X size={16}/></button>
              </div>
              {selectedField ? (
                <FieldSettings
                  field={selectedField}
                  onUpdate={(updates) => updateField(selectedField.id || selectedField._id, updates)}
                />
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-20">
                  <MousePointer2 size={40} className="mb-4" />
                  <p className="text-xs font-black uppercase tracking-[0.2em]">Select a component</p>
                </div>
              )}
            </aside>

            {/* Mobile Save Button */}
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 lg:hidden z-[65]">
              <button 
                onClick={saveForm}
                disabled={isSaving}
                className="btn-premium btn-premium-primary py-3 px-10 text-xs font-bold uppercase tracking-[0.2em] shadow-2xl"
              >
                {isSaving ? <Loader2 size={16} className="animate-spin" /> : 'Save Workspace'}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'preview' && (
          <Preview form={form} />
        )}

        {activeTab === 'responses' && (
          <ResponsesTable formId={id} />
        )}

        {activeTab === 'settings' && (
          <div className="h-full overflow-y-auto no-scrollbar scroll-smooth">
            <div className="max-w-2xl mx-auto py-20 px-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-2">
              <h2 className="text-3xl font-black tracking-tight">Collection Settings</h2>
              <p className="text-slate-500 font-medium">Configure identity, behaviour and rules for this collection.</p>
            </div>

            {/* Identity */}
            <div className="glass-card p-8 rounded-[2rem] space-y-6">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-brand-500">Identity</h3>
              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-[0.15em] text-slate-500">Collection Title</label>
                <input
                  value={form.title}
                  onChange={e => setForm({...form, title: e.target.value})}
                  className="input-premium h-12"
                  placeholder="e.g. Employee Registration Form"
                />
              </div>
              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-[0.15em] text-slate-500">Description</label>
                <textarea
                  value={form.description}
                  onChange={e => setForm({...form, description: e.target.value})}
                  className="input-premium h-24 py-4 resize-none"
                  placeholder="Briefly describe the purpose of this form..."
                />
              </div>
            </div>

            {/* Submission */}
            <div className="glass-card p-8 rounded-[2rem] space-y-6">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-brand-500">Submission Behaviour</h3>
              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-[0.15em] text-slate-500">Submit Button Text</label>
                <input
                  value={form.settings?.submitButtonText || 'Submit'}
                  onChange={e => setForm({...form, settings: {...form.settings, submitButtonText: e.target.value}})}
                  className="input-premium h-12"
                  placeholder="Submit"
                />
              </div>
              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-[0.15em] text-slate-500">Success Message</label>
                <textarea 
                  value={form.settings?.successMessage || ''}
                  onChange={e => setForm({...form, settings: {...form.settings, successMessage: e.target.value}})}
                  className="input-premium h-28 py-4 resize-none"
                  placeholder="Thank you for your response!"
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="font-bold text-sm">Active Collection</p>
                  <p className="text-xs text-slate-500">Disable to stop receiving new responses.</p>
                </div>
                <div
                  onClick={() => setForm({...form, settings: {...form.settings, active: !form.settings?.active}})}
                  className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors duration-300 ${
                    form.settings?.active ? 'bg-brand-500' : 'bg-slate-700'
                  }`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${
                    form.settings?.active ? 'right-1' : 'left-1'
                  }`} />
                </div>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="p-8 border border-red-500/10 bg-red-500/5 rounded-[2rem] space-y-4">
              <h4 className="text-red-500 font-bold text-xs uppercase tracking-widest">Danger Zone</h4>
              <p className="text-sm text-slate-500">Permanently delete this collection and all associated responses. This cannot be undone.</p>
              <button 
                onClick={async () => {
                  if (!id || id === 'new') return alert('Save the form first before deleting.');
                  if (!window.confirm('Delete this collection permanently?')) return;
                  try {
                    await api.delete(`/forms/${id}`);
                    navigate('/dashboard');
                  } catch { alert('Failed to delete'); }
                }}
                className="px-6 py-3 bg-red-500/10 text-red-500 rounded-2xl font-bold text-xs hover:bg-red-500 hover:text-white transition-all"
              >
                Delete Collection
              </button>
            </div>
          </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Builder;
