import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, CheckCircle2, ChevronRight, Star, 
  Upload, Image as ImageIcon, X, Loader2,
  Database, ShieldCheck, Globe, RefreshCw
} from 'lucide-react';
import SignaturePad from '../../components/fields/SignaturePad';
import api from '../../api/axios';

const PublicForm = () => {
  const { id } = useParams();
  const [form, setForm] = useState(null);
  const [data, setData] = useState({});
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchForm();
  }, [id]);

  const fetchForm = async () => {
    try {
      const { data } = await api.get(`/forms/${id}`);
      setForm(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (name, value) => {
    setData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Validation
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    form.fields.forEach(f => {
      const value = data[f.name];
      const isRequired = f.validation?.required;

      // Skip non-input fields
      if (['section', 'paragraph', 'divider', 'spacer', 'submit'].includes(f.type)) return;

      if (isRequired) {
        if (!value || (Array.isArray(value) && value.length === 0) || (typeof value === 'object' && !value.fileName && !value.data)) {
          // Specific messages based on type
          if (['dropdown', 'radio', 'checkbox', 'multiselect'].includes(f.type)) {
            newErrors[f.name] = "Please select an option.";
          } else if (['file', 'image'].includes(f.type)) {
            newErrors[f.name] = "Please upload a file.";
          } else {
            newErrors[f.name] = "This field is required.";
          }
        } else if (f.type === 'email' && !emailRegex.test(value)) {
          newErrors[f.name] = "Please enter a valid email address.";
        }
      } else if (value && f.type === 'email' && !emailRegex.test(value)) {
        newErrors[f.name] = "Please enter a valid email address.";
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSubmitting(false);
      
      // Auto-scroll to first invalid
      const firstErrorField = form.fields.find(f => newErrors[f.name]);
      if (firstErrorField) {
        const element = document.getElementById(`field-${firstErrorField._id || firstErrorField.id}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }
      return;
    }

    try {
      await api.post(`/responses/${id}`, { data });
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      if (err.response?.status === 409) {
        alert(err.response.data.message || "Your response has already been submitted.");
      } else {
        alert('Failed to submit form. Please check your connection.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center">
      <Loader2 className="w-12 h-12 text-brand-500 animate-spin" />
    </div>
  );

  if (!form) return (
    <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center text-center p-8">
      <div className="w-20 h-20 bg-red-500/10 rounded-3xl flex items-center justify-center text-red-500 mb-6 font-bold border border-red-500/20 shadow-2xl">404</div>
      <h2 className="text-3xl font-black uppercase tracking-tight text-white mb-2">Collection Not Found</h2>
      <p className="text-slate-500 font-medium max-w-sm">This form has been retired or the link is incorrect. Please contact the administrator.</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 py-10 md:py-20 px-4 md:px-8 relative overflow-hidden">
      {/* Background Decor */}
      <div className="neo-blur bg-brand-500 w-[300px] h-[300px] md:w-[500px] md:h-[500px] -top-20 -right-20 opacity-10" />
      <div className="neo-blur bg-indigo-500 w-[200px] h-[200px] md:w-[400px] md:h-[400px] -bottom-20 -left-20 opacity-10" />

      <div className="max-w-xl mx-auto relative z-10">
        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: -20 }}
              className="glass-card p-6 md:p-12 rounded-[2rem] md:rounded-[3.5rem] shadow-2xl relative overflow-hidden border border-white/5 backdrop-blur-3xl"
            >
              <div className="space-y-4 mb-10 md:mb-12">
                <div className="flex items-center gap-2.5 mb-4 md:mb-6 opacity-40">
                  <Globe size={14} className="text-brand-500" />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em]">SECURE PUBLIC COLLECTION</span>
                </div>
                <h1 className="text-2xl md:text-4xl font-black tracking-tight text-white underline decoration-brand-500 decoration-4 underline-offset-8 uppercase leading-tight">{form.title}</h1>
                <p className="text-slate-500 font-medium text-base md:text-lg leading-relaxed pt-2">{form.description}</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-12">
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

                <div className="pt-8">
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-16 rounded-[2rem] bg-brand-600 text-white font-black uppercase tracking-[0.2em] shadow-2xl shadow-brand-600/40 hover:bg-brand-500 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    {isSubmitting ? <Loader2 className="animate-spin" /> : (
                      <>
                        {form.settings?.submitButtonText || 'Submit Form'} <ChevronRight size={18} />
                      </>
                    )}
                  </button>
                </div>
              </form>
              
              <div className="mt-12 flex items-center justify-center gap-2 opacity-20 hover:opacity-40 transition-opacity">
                <ShieldCheck size={14} />
                <span className="text-[10px] font-bold uppercase tracking-widest">Powered by FormFlow Secure</span>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card p-20 rounded-[4rem] text-center space-y-10 border border-brand-500/20 shadow-2xl shadow-brand-500/10"
            >
              <div className="w-24 h-24 bg-brand-500/10 rounded-[2rem] flex items-center justify-center mx-auto text-brand-500 border border-brand-500/10 shadow-2xl shadow-brand-500/20">
                <CheckCircle2 size={48} className="animate-pulse" />
              </div>
              <div className="space-y-4">
                <h2 className="text-4xl font-black uppercase tracking-tight text-white underline decoration-brand-500 decoration-4 underline-offset-[12px]">Success!</h2>
                <p className="text-slate-400 font-medium text-lg pt-4 leading-relaxed">
                  {form.settings?.successMessage || 'Thank you for your response! Your data has been securely processed.'}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Reusable Field Renderer (Same as Preview for parity)
const FieldRenderer = ({ field, value, onChange, error }) => {
  const baseInput = "input-premium h-14 bg-white/5 border-white/5 focus:bg-white/[0.08] transition-all selection:bg-brand-500/30";
  
  const Label = () => field.type !== 'section' && field.type !== 'paragraph' && field.type !== 'divider' && (
    <div className="flex items-center justify-between mb-2">
      <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">
        {field.label}
        {field.validation?.required && <span className="text-brand-500 ml-1 font-black">*</span>}
      </label>
      <AnimatePresence>
        {error && (
          <motion.span 
            initial={{ x: 10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="text-[10px] font-black text-red-500 uppercase tracking-tighter bg-red-500/10 px-2 py-0.5 rounded-lg border border-red-500/20"
          >
            {error}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );

  const Help = () => field.helpText && (
    <p className="text-[10px] text-slate-600 font-bold ml-1 mt-1.5 uppercase tracking-wide">{field.helpText}</p>
  );

  switch (field.type) {
    case 'section':
      return (
        <div className="pt-16 border-t border-white/5 mt-14 first:mt-0 first:pt-0 first:border-0 space-y-2">
          <h3 className="text-2xl font-black text-white uppercase tracking-tight decoration-brand-500/20 decoration-2 underline underline-offset-8">{field.label}</h3>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">{field.helpText}</p>
        </div>
      );

    case 'paragraph':
      return <p className="text-sm text-slate-400 leading-relaxed font-bold border-l-2 border-brand-500/30 pl-4 py-1">{field.label}</p>;
    
    case 'divider':
      return <div className="h-[1px] bg-white/5 w-full my-8 block shadow-2xl relative">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-brand-500/20 to-transparent blur-sm" />
      </div>;

    case 'spacer':
      return <div style={{ height: field.height || '32px' }} />;

    case 'textarea':
      return (
        <>
          <Label />
          <textarea 
            className={`${baseInput} h-40 py-6 placeholder:text-slate-800`} 
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
          <div className="relative">
            <select 
              className={baseInput} 
              value={value || ''} 
              onChange={(e) => onChange(e.target.value)}
            >
              <option value="" className="bg-[#020617]">{field.placeholder || '-- Select Option --'}</option>
              {field.options?.map(opt => <option key={opt.value} value={opt.value} className="bg-[#020617]">{opt.label}</option>)}
            </select>
          </div>
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
                className={`flex items-center gap-4 p-5 rounded-[1.5rem] border transition-all cursor-pointer group ${
                  (Array.isArray(value) ? value.includes(opt.value) : value === opt.value)
                    ? 'bg-brand-500/10 border-brand-500 text-brand-500 shadow-xl shadow-brand-500/5'
                    : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/[0.08] hover:border-white/10'
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
                  className="w-5 h-5 rounded-lg border-white/10 bg-transparent text-brand-500 focus:ring-brand-500 cursor-pointer" 
                />
                <span className="text-xs font-black uppercase tracking-widest">{opt.label}</span>
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
            className={`flex items-center justify-between p-5 rounded-[1.5rem] border transition-all cursor-pointer ${
              isTrue ? 'bg-brand-500/10 border-brand-500/30' : 'bg-white/5 border-white/5 hover:bg-white/[0.08]'
            }`}
          >
            <span className={`text-[11px] font-black uppercase tracking-[0.1em] ${isTrue ? 'text-brand-500' : 'text-slate-400'}`}>{field.label}</span>
            <div className={`w-12 h-7 rounded-full relative transition-all duration-500 ${isTrue ? 'bg-brand-500' : 'bg-slate-800'}`}>
              <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all duration-500 shadow-2xl ${isTrue ? 'right-1' : 'left-1'}`} />
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
                className={`flex-1 h-16 rounded-[1.2rem] border transition-all flex items-center justify-center ${
                  value >= s ? 'bg-brand-500 text-white border-brand-500 shadow-lg shadow-brand-500/20 scale-[1.05]' : 'bg-white/5 border-white/5 text-slate-800 hover:text-slate-500'
                }`}
              >
                <Star size={24} fill={value >= s ? "currentColor" : "none"} strokeWidth={1.5} />
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
          <div className="space-y-4 p-8 bg-white/5 rounded-[2rem] border border-white/5">
            <input 
              type="range"
              min={field.min || 0}
              max={field.max || 100}
              step={field.step || 1}
              value={value || 0}
              onChange={(e) => onChange(e.target.value)}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-brand-500"
            />
            <div className="flex justify-between text-[11px] font-black text-slate-600 uppercase tracking-[0.2em] pt-2">
              <span>{field.min || 0}</span>
              <span className="text-brand-500 bg-brand-500/10 px-3 py-1 rounded-lg border border-brand-500/20">CURRENT: {value || 0}</span>
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
          <div className="flex items-center gap-6 p-5 bg-white/5 rounded-[1.5rem] border border-white/5">
            <input 
              type="color" 
              value={value || '#0ea5e9'} 
              onChange={(e) => onChange(e.target.value)}
              className="w-20 h-14 rounded-2xl bg-transparent border-0 p-0 cursor-pointer shadow-2xl"
            />
            <div className="flex flex-col">
              <span className="text-xs font-black font-mono text-white/40 uppercase tracking-widest">SELECTED HEX</span>
              <span className="text-lg font-black font-mono text-white tracking-widest">{value || '#0EA5E9'}</span>
            </div>
          </div>
          <Help />
        </>
      );

    case 'file':
    case 'image':
      const isFile = value && value.fileName;
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
                      fileName: file.name, 
                      fileSize: file.size, 
                      fileType: file.type,
                      fileUrl: reader.result 
                    });
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />
            
            <label 
              htmlFor={`file-${field.name}`}
              className={`flex items-center gap-6 border-2 border-dashed transition-all cursor-pointer ${
                isFile 
                  ? 'p-4 rounded-xl bg-brand-500/5 border-brand-500/30' 
                  : 'p-6 rounded-2xl bg-white/5 border-white/10 hover:bg-brand-500/5 hover:border-brand-500/40'
              }`}
              style={{ minHeight: isFile ? '80px' : '130px' }}
            >
              <div className={`rounded-xl flex items-center justify-center shrink-0 transition-all ${
                isFile ? 'w-10 h-10 bg-brand-500 text-white' : 'w-12 h-12 bg-white/5 text-slate-500 group-hover:text-brand-500'
              }`}>
                {isFile ? (
                  <CheckCircle2 size={20} />
                ) : (
                  field.type === 'image' ? <ImageIcon size={22} /> : <Upload size={22} />
                )}
              </div>
              
              <div className="flex-1 min-w-0 text-left">
                {isFile ? (
                  <div className="flex flex-col">
                    <p className="text-[10px] font-black uppercase tracking-[0.1em] text-brand-500 mb-0.5">✓ File Uploaded</p>
                    <p className="text-sm font-bold text-white truncate max-w-[200px] leading-tight">{value.fileName}</p>
                    <p className="text-[10px] text-slate-500 font-medium uppercase mt-0.5">{(value.fileSize / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                ) : (
                  <div className="space-y-0.5">
                    <p className="text-sm font-black text-slate-200">Upload {field.label || field.type}</p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                      Max size: {field.maxSize || '5MB'}
                    </p>
                  </div>
                )}
              </div>

              {isFile ? (
                <div 
                  onClick={(e) => {
                    e.preventDefault();
                    onChange(null);
                  }}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 text-[10px] font-black uppercase tracking-wider text-slate-400 hover:text-white transition-all whitespace-nowrap"
                >
                  <RefreshCw size={12} /> Change
                </div>
              ) : (
                <div className="px-4 py-2 bg-brand-500/10 text-brand-500 text-[10px] font-black uppercase tracking-widest rounded-lg border border-brand-500/20 group-hover:bg-brand-500 group-hover:text-white transition-all">
                  Browse
                </div>
              )}
            </label>
          </div>
          <Help />
        </>
      );

    case 'email':
    case 'url':
    case 'phone':
    case 'password':
    case 'number':
    case 'text':
    default:
      return (
        <>
          <Label />
          <div className="relative">
            <input 
              id={`field-${field._id || field.id}`}
              type={field.type === 'datetime' ? 'datetime-local' : (field.type === 'phone' ? 'tel' : field.type)} 
              className={baseInput} 
              placeholder={field.placeholder}
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              aria-label={field.label}
            />
          </div>
          <Help />
        </>
      );
  }
};

export default PublicForm;
