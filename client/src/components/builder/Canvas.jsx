import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { 
  Trash2, GripVertical, Type, AlignLeft, AtSign, Phone, 
  Lock, Hash, Globe, Calendar, Clock, ChevronDown, List, 
  CheckSquare, ToggleLeft, FileUp, Star, SlidersHorizontal, 
  Palette, Heading, Text as TextIcon, Minus, Space, Send, Image as ImageIcon
} from 'lucide-react';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';

const iconMap = {
  text: Type, textarea: AlignLeft, email: AtSign, phone: Phone,
  password: Lock, number: Hash, url: Globe, date: Calendar,
  time: Clock, datetime: Calendar, dropdown: ChevronDown, multiselect: List,
  radio: List, checkbox: CheckSquare, toggle: ToggleLeft, file: FileUp,
  image: ImageIcon, signature: ImageIcon, rating: Star, slider: SlidersHorizontal,
  color: Palette, section: Heading, paragraph: TextIcon, divider: Minus,
  spacer: Space, submit: Send
};

const SortableField = ({ field, onSelect, onRemove, isSelected }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ 
    id: field.id || field._id 
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 'auto',
  };

  const Icon = iconMap[field.type] || Type;

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={() => onSelect(field.id || field._id)}
      className={clsx(
        "group relative p-6 rounded-[2rem] border-2 transition-all duration-300",
        isSelected
          ? "border-brand-500 bg-brand-500/5 shadow-2xl shadow-brand-500/10"
          : "border-transparent bg-white/[0.03] hover:border-white/10 hover:bg-white/[0.05]",
        isDragging && "opacity-50"
      )}
    >
      <div className="flex items-start gap-5">
        <button
          {...attributes}
          {...listeners}
          className="mt-1 p-2 text-slate-600 hover:text-slate-200 cursor-grab active:cursor-grabbing transition-colors"
        >
          <GripVertical size={20} />
        </button>

        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-3">
            <div className={clsx(
              "w-8 h-8 rounded-lg flex items-center justify-center border",
              isSelected ? "bg-brand-500 text-white border-brand-500" : "bg-white/5 text-slate-500 border-white/5"
            )}>
              <Icon size={16} />
            </div>
            <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
              {field.label}
              {field.validation?.required && <span className="text-brand-500 ml-1">*</span>}
            </label>
          </div>

          <div className="h-12 bg-white/5 rounded-xl border border-dashed border-white/10 flex items-center px-4 opacity-50 relative overflow-hidden">
            <span className="text-xs text-slate-600 font-medium">{field.placeholder || `Visual placeholder for ${field.type}`}</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent animate-pulse" />
          </div>

          {field.helpText && (
            <p className="text-[10px] font-medium text-slate-600 ml-1">{field.helpText}</p>
          )}
        </div>

        <button
          onClick={(e) => { e.stopPropagation(); onRemove(field.id || field._id); }}
          className="p-3 text-slate-700 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all opacity-0 group-hover:opacity-100"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
};

const Canvas = ({ fields, onSelect, onRemove, selectedId }) => {
  return (
    <div className="space-y-4 min-h-[400px]">
      {fields.map((field) => (
        <SortableField
          key={field.id || field._id}
          field={field}
          onSelect={onSelect}
          onRemove={onRemove}
          isSelected={selectedId === (field.id || field._id)}
        />
      ))}
    </div>
  );
};

export default Canvas;
