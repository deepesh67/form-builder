import { motion } from 'framer-motion';
import { FIELD_REGISTRY, FIELD_GROUPS } from '../../constants/fieldTypes';
import { Plus, Search, ChevronRight } from 'lucide-react';
import { useState } from 'react';

const Sidebar = ({ onAdd }) => {
  const [search, setSearch] = useState('');
  
  const filteredRegistry = FIELD_REGISTRY.filter(f => 
    f.label.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full">
      <div className="px-6 mb-8 space-y-4">
        <div className="flex items-center gap-2 text-brand-500">
          <Search size={16} />
          <input 
            type="text" 
            placeholder="Search components..." 
            className="bg-transparent border-none outline-none text-xs font-bold w-full uppercase tracking-widest placeholder:text-slate-600"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-20 no-scrollbar space-y-8">
        {Object.values(FIELD_GROUPS).map((groupName) => {
          const groupFields = filteredRegistry.filter(f => f.group === groupName);
          if (groupFields.length === 0) return null;

          return (
            <div key={groupName} className="space-y-3">
              <h4 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] ml-2">
                {groupName}
              </h4>
              <div className="grid grid-cols-1 gap-2">
                {groupFields.map((field) => (
                  <motion.button
                    key={field.type}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onAdd(field)}
                    className="w-full flex items-center gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-brand-500/50 hover:bg-white/[0.08] transition-all group text-left"
                  >
                    <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center text-slate-500 group-hover:text-brand-500 transition-colors">
                      <field.icon size={18} />
                    </div>
                    <div className="flex-1">
                      <p className="text-[13px] font-bold text-slate-300 group-hover:text-white transition-colors">
                        {field.label}
                      </p>
                    </div>
                    <Plus size={14} className="text-slate-700 group-hover:text-brand-500 transition-colors" />
                  </motion.button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;
