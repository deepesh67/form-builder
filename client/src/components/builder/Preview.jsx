import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, CheckCircle2, ChevronRight, Star, 
  Upload, Image as ImageIcon, X, Loader2
} from 'lucide-react';
import SignaturePad from '../fields/SignaturePad';
import api from '../../api/axios';

const Preview = ({ form }) => {
  const [data, setData] = useState({});
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (name, value) => {
    setData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simple validation check
    const newErrors = {};
    form.fields.forEach(f => {
      if (f.validation?.required && !data[f.name]) {
        newErrors[f.name] = `${f.label} is required`;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      // For Preview mode, we only submit if the form has been saved to DB
      if (form._id) {
        await api.post(`/responses/${form._id}`, { data });
        setSubmitted(true);
      } else {
        alert('⚠️ FORM NOT SAVED: Responses can only be recorded after you save the form for the first time.');
      }
    } catch (err) {
      alert('Submission failed. Check your network or form ID.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-full overflow-y-auto no-scrollbar bg-slate-950/20 py-20 px-8">
      <div className="max-w-xl mx-auto">
        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-card p-12 rounded-[3.5rem] shadow-2xl relative overflow-hidden ring-1 ring-white/5"
            >
              <div className="space-y-4 mb-12">
                <h1 className="text-4xl font-black tracking-tight text-white uppercase">{form.title}</h1>
                <p className="text-slate-500 font-medium">{form.description}</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-10">
                {form.fields.map((field) => (
                  <div 
                    key={field.id || field._id} 
                    className="space-y-3"
                    style={{ width: field.styling?.width || '100%' }}
                  >
                    <FieldRenderer 
                      field={field} 
                      value={data[field.name]} 
                      error={errors[field.name]}
                      onChange={(val) => handleInputChange(field.name, val)}
                    />
                  </div>
                ))}

                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-16 rounded-[2rem] bg-brand-600 text-white font-black uppercase tracking-[0.2em] shadow-2xl shadow-brand-600/40 hover:bg-brand-500 transition-all flex items-center justify-center gap-3 mt-12 disabled:opacity-50"
                >
                  {isSubmitting ? <Loader2 className="animate-spin" /> : (
                    <>
                      {form.settings?.submitButtonText || 'Submit Response'} <ChevronRight size={18} />
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card p-20 rounded-[4rem] text-center space-y-8"
            >
              <div className="w-24 h-24 bg-brand-500/10 rounded-full flex items-center justify-center mx-auto text-brand-500 border border-brand-500/20 shadow-2xl shadow-brand-500/10">
                <CheckCircle2 size={48} className="animate-bounce" />
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-black uppercase tracking-tight">Success!</h2>
                <p className="text-slate-500 font-medium leading-relaxed">
                  {form.settings?.successMessage || 'Thank you for your response!'}
                </p>
              </div>
              <button 
                onClick={() => setSubmitted(false)}
                className="text-xs font-bold text-slate-600 hover:text-white transition-colors"
              >
                Submit another response
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const FieldRenderer = ({ field, value, onChange, error }) => {
  const baseInput = "input-premium h-14 bg-white/5 border-white/5 focus:bg-white/[0.08] transition-all";
  
  const Label = () => field.type !== 'section' && field.type !== 'paragraph' && field.type !== 'divider' && (
    <div className="flex items-center justify-between mb-1">
      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">
        {field.label}
        {field.validation?.required && <span className="text-brand-500 ml-1">*</span>}
      </label>
      {error && <span className="text-[10px] font-bold text-red-500 uppercase">{error}</span>}
    </div>
  );

  const Help = () => field.helpText && (
    <p className="text-[10px] text-slate-600 font-medium ml-1 mt-1">{field.helpText}</p>
  );

  switch (field.type) {
    case 'section':
      return (
        <div className="pt-12 border-t border-white/5 mt-10 first:mt-0 first:pt-0 first:border-0 space-y-1">
          <h3 className="text-xl font-black text-white uppercase tracking-tight">{field.label}</h3>
          <p className="text-xs text-slate-600 font-medium">{field.helpText}</p>
        </div>
      );

    case 'paragraph':
      return <p className="text-sm text-slate-400 leading-relaxed font-medium">{field.label}</p>;
    
    case 'divider':
      return <div className="h-[1px] bg-white/5 w-full my-6 shadow-sm" />;

    case 'spacer':
      return <div style={{ height: field.height || '24px' }} />;

    case 'textarea':
      return (
        <>
          <Label />
          <textarea 
            className={`${baseInput} h-32 py-4 resize-none`} 
            placeholder={field.placeholder}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
          />
          <Help />
        </>
      );

    case 'dropdown':
    case 'multiselect':
      return (
        <>
          <Label />
          <select 
            className={baseInput} 
            value={value || ''} 
            onChange={(e) => onChange(e.target.value)}
          >
            <option value="">{field.placeholder || '-- Select Option --'}</option>
            {field.options?.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
          <Help />
        </>
      );

    case 'radio':
    case 'checkbox':
      return (
        <>
          <Label />
          <div className="grid grid-cols-1 gap-3">
            {field.options?.map((opt, i) => (
              <label 
                key={i} 
                className={`flex items-center gap-4 p-4 rounded-2xl border transition-all cursor-pointer ${
                  (Array.isArray(value) ? value.includes(opt.value) : value === opt.value)
                    ? 'bg-brand-500/10 border-brand-500/30 text-brand-500'
                    : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/[0.08]'
                }`}
              >
                <input 
                  type={field.type} 
                  name={field.name}
                  checked={Array.isArray(value) ? value.includes(opt.value) : value === opt.value}
                  onChange={(e) => {
                    if(field.type === 'checkbox') {
                      const currentVal = Array.isArray(value) ? [...value] : [];
                      if(e.target.checked) currentVal.push(opt.value);
                      else {
                        const idx = currentVal.indexOf(opt.value);
                        if(idx > -1) currentVal.splice(idx, 1);
                      }
                      onChange(currentVal);
                    } else {
                      onChange(opt.value);
                    }
                  }}
                  className="w-5 h-5 rounded-lg border-white/10 bg-transparent text-brand-500 focus:ring-brand-500" 
                />
                <span className="text-xs font-bold uppercase tracking-widest">{opt.label}</span>
              </label>
            ))}
          </div>
          <Help />
        </>
      );

    case 'toggle':
      const isTrue = value === true || value === 'true';
      return (
        <>
          <Label />
          <div 
            onClick={() => onChange(!isTrue)}
            className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 cursor-pointer hover:bg-white/[0.08] transition-all"
          >
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{field.label}</span>
            <div className={`w-12 h-7 rounded-full relative transition-all duration-300 ${isTrue ? 'bg-brand-500' : 'bg-slate-800'}`}>
              <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all duration-300 shadow-lg ${isTrue ? 'right-1' : 'left-1'}`} />
            </div>
          </div>
          <Help />
        </>
      );

    case 'rating':
      return (
        <>
          <Label />
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map(s => (
              <button
                key={s}
                type="button"
                onClick={() => onChange(s)}
                className={`p-4 rounded-2xl border transition-all ${
                  value >= s ? 'bg-brand-500/20 border-brand-500 text-brand-500' : 'bg-white/5 border-white/5 text-slate-700 hover:text-slate-400'
                }`}
              >
                <Star size={24} fill={value >= s ? "currentColor" : "none"} strokeWidth={1} />
              </button>
            ))}
          </div>
          <Help />
        </>
      );

    case 'slider':
      return (
        <>
          <Label />
          <div className="space-y-4 p-6 bg-white/5 rounded-2xl border border-white/5">
            <input 
              type="range"
              min={field.min || 0}
              max={field.max || 100}
              step={field.step || 1}
              value={value || 0}
              onChange={(e) => onChange(e.target.value)}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-brand-500"
            />
            <div className="flex justify-between text-[10px] font-black text-slate-600 uppercase tracking-widest">
              <span>{field.min || 0}</span>
              <span className="text-brand-500">Value: {value || 0}</span>
              <span>{field.max || 100}</span>
            </div>
          </div>
          <Help />
        </>
      );

    case 'signature':
      return (
        <>
          <Label />
          <SignaturePad value={value} onChange={onChange} />
          <Help />
        </>
      );

    case 'color':
      return (
        <>
          <Label />
          <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
            <input 
              type="color" 
              value={value || '#0ea5e9'} 
              onChange={(e) => onChange(e.target.value)}
              className="w-16 h-12 rounded-xl bg-transparent border-0 p-0 cursor-pointer"
            />
            <span className="text-xs font-mono font-bold text-slate-300 uppercase">{value || '#0ea5e9'}</span>
          </div>
          <Help />
        </>
      );

    case 'file':
    case 'image':
      const isFile = value && value.name;
      return (
        <>
          <Label />
          <div className="relative group">
            <input 
              type="file" 
              id={`file-${field.name}`}
              className="hidden" 
              accept={field.type === 'image' ? 'image/*' : '*/*'}
              onChange={(e) => {
                const file = e.target.files[0];
                if(file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    onChange({ 
                      name: file.name, 
                      size: file.size, 
                      type: file.type,
                      data: reader.result 
                    });
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />
            <label 
              htmlFor={`file-${field.name}`}
              className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-white/10 rounded-[2rem] bg-white/5 hover:bg-white/[0.08] hover:border-brand-500/40 transition-all cursor-pointer text-center space-y-4"
            >
              <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-slate-500 group-hover:text-brand-500 transition-colors">
                {field.type === 'image' ? <ImageIcon size={28} /> : <Upload size={28} />}
              </div>
              <div className="space-y-1">
                <p className="text-xs font-black uppercase tracking-widest text-slate-300">
                  {isFile ? value.name : `Click to upload ${field.type}`}
                </p>
                <p className="text-[10px] text-slate-600 font-bold">Max size: {field.maxSize || '5MB'}</p>
              </div>
            </label>
            {isFile && (
              <button 
                type="button"
                onClick={() => onChange(null)}
                className="absolute top-4 right-4 p-2 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-lg"
              >
                <X size={14} />
              </button>
            )}
          </div>
          <Help />
        </>
      );

    default:
      return (
        <>
          <Label />
          <div className="relative group">
            <input 
              type={field.type === 'datetime' ? 'datetime-local' : field.type} 
              className={baseInput} 
              placeholder={field.placeholder}
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
            />
            {field.type === 'password' && (
              <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-white transition-colors">
                {/* toggle icon logic would go here */}
              </button>
            )}
          </div>
          <Help />
        </>
      );
  }
};

export default Preview;
