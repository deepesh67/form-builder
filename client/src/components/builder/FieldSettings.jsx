import { useState } from 'react';
import { Trash2, Plus, X, Settings2, Palette, Type, ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const InputGroup = ({ label, children }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">{label}</label>
    {children}
  </div>
);

const FieldSettings = ({ field, onUpdate, onDelete }) => {
  const [activeTab, setActiveTab] = useState('content'); // content, style

  const handleUpdate = (path, value) => {
    onUpdate({ [path]: value });
  };

  const handleValidationUpdate = (key, value) => {
    onUpdate({
      validation: { ...field.validation, [key]: value },
    });
  };

  const addOption = () => {
    const newOptions = [...(field.options || []), { label: `Option ${(field.options?.length || 0) + 1}`, value: `opt${(field.options?.length || 0) + 1}` }];
    onUpdate({ options: newOptions });
  };

  const removeOption = (index) => {
    const newOptions = field.options.filter((_, i) => i !== index);
    onUpdate({ options: newOptions });
  };

  const updateOption = (index, key, value) => {
    const newOptions = field.options.map((opt, i) =>
      i === index ? { ...opt, [key]: value } : opt
    );
    onUpdate({ options: newOptions });
  };

  return (
    <div className="flex flex-col h-full bg-[#020617]">
      {/* Sub-header Tabs */}
      <div className="flex border-b border-white/5 shrink-0">
        {[
          { id: 'content', icon: Type, label: 'Content' },
          { id: 'style', icon: Palette, label: 'Styling' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-4 text-[10px] font-black uppercase tracking-widest transition-all relative ${
              activeTab === tab.id ? 'text-brand-500' : 'text-slate-500 hover:text-white'
            }`}
          >
            <tab.icon size={12} /> {tab.label}
            {activeTab === tab.id && (
              <motion.div layoutId="settingTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-500" />
            )}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-8 no-scrollbar scroll-smooth">
        <AnimatePresence mode="wait">
          {activeTab === 'content' && (
            <motion.div
              key="content"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="space-y-8"
            >
              <InputGroup label="Field Label">
                <input
                  type="text"
                  className="input-premium h-12"
                  value={field.label}
                  onChange={(e) => handleUpdate('label', e.target.value)}
                  placeholder="Enter label..."
                />
              </InputGroup>

              {!['section', 'paragraph', 'divider', 'spacer', 'submit'].includes(field.type) && (
                <InputGroup label="Placeholder Text">
                  <input
                    type="text"
                    className="input-premium h-12"
                    value={field.placeholder || ''}
                    onChange={(e) => handleUpdate('placeholder', e.target.value)}
                    placeholder="Enter placeholder..."
                  />
                </InputGroup>
              )}

              <InputGroup label="Help Text / Description">
                <textarea
                  className="input-premium h-20 py-3 resize-none text-xs"
                  value={field.helpText || ''}
                  onChange={(e) => handleUpdate('helpText', e.target.value)}
                  placeholder="Appears below the field..."
                />
              </InputGroup>

              {/* Action specific settings */}
              {['dropdown', 'multiselect', 'radio', 'checkbox'].includes(field.type) && (
                <div className="space-y-4 pt-4 border-t border-white/5">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Options List</label>
                    <button
                      onClick={addOption}
                      className="text-[10px] font-bold text-brand-500 flex items-center gap-1 hover:underline"
                    >
                      <Plus size={12} /> Add New
                    </button>
                  </div>
                  <div className="space-y-2">
                    {field.options?.map((opt, i) => (
                      <div key={i} className="flex gap-2 items-center group">
                        <input
                          type="text"
                          value={opt.label}
                          className="input-premium h-10 text-xs flex-1"
                          onChange={(e) => updateOption(i, 'label', e.target.value)}
                        />
                        <button
                          onClick={() => removeOption(i)}
                          className="p-2 text-slate-700 hover:text-red-500 transition-colors"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Validation */}
              {!['section', 'paragraph', 'divider', 'spacer', 'submit'].includes(field.type) && (
                <div className="pt-8 border-t border-white/5 space-y-6">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-500">Validation Rules</h4>
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                    <div className="space-y-0.5">
                      <p className="text-xs font-bold text-white uppercase tracking-tighter">Required Field</p>
                      <p className="text-[10px] text-slate-500">Must be filled before submission</p>
                    </div>
                    <button 
                      onClick={() => handleValidationUpdate('required', !field.validation?.required)}
                      className={`w-11 h-6 rounded-full relative transition-all duration-300 ${
                        field.validation?.required ? 'bg-brand-500' : 'bg-slate-800'
                      }`}
                    >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${
                        field.validation?.required ? 'right-1' : 'left-1'
                      }`} />
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'style' && (
            <motion.div
              key="style"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="space-y-8"
            >
              <InputGroup label="Component Width">
                <div className="grid grid-cols-2 gap-2">
                  {['25%', '50%', '75%', '100%'].map((w) => (
                    <button
                      key={w}
                      onClick={() => onUpdate({ styling: { ...field.styling, width: w } })}
                      className={`h-12 rounded-xl text-xs font-bold transition-all border ${
                        field.styling?.width === w 
                          ? 'bg-brand-500 border-brand-500 text-white shadow-lg shadow-brand-500/20' 
                          : 'bg-white/5 border-white/5 text-slate-500 hover:text-white'
                      }`}
                    >
                      {w}
                    </button>
                  ))}
                </div>
              </InputGroup>

              <InputGroup label="Custom Identifier (ID)">
                <div className="relative group">
                  <input
                    type="text"
                    className="input-premium h-12 font-mono text-xs text-slate-400 group-focus-within:text-white"
                    value={field.name}
                    onChange={(e) => handleUpdate('name', e.target.value)}
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-30">
                    <Check size={14} />
                  </div>
                </div>
                <p className="text-[10px] text-slate-600 font-medium px-1">This ID is used in API payloads and CSV headers.</p>
              </InputGroup>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Delete Component Button */}
      <div className="p-8 border-t border-white/5">
        <button 
          onClick={onDelete}
          className="w-full h-14 rounded-[1.5rem] bg-red-500/5 text-red-500 hover:bg-red-500 hover:text-white transition-all font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-2 group"
        >
          <Trash2 size={16} className="group-hover:scale-110 transition-transform" /> 
          Delete Field
        </button>
      </div>
    </div>
  );
};

export default FieldSettings;
