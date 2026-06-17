import { 
  Type, AlignLeft, AtSign, Phone, Lock, Hash, Globe, 
  Calendar, Clock, CalendarClock, ChevronDown, List, 
  CheckSquare, ToggleLeft, FileUp, Image as ImageIcon, 
  PenTool, Star, SlidersHorizontal, Palette, Heading, Text as TextIcon, 
  Minus, Space, Send 
} from 'lucide-react';

export const FIELD_GROUPS = {
  TEXT: 'Text Inputs',
  SELECTION: 'Selection & Choice',
  ADVANCED: 'Advanced & Media',
  LAYOUT: 'Layout & Design',
};

export const FIELD_REGISTRY = [
  // Text Inputs
  { 
    type: 'text', 
    label: 'Single Line Text', 
    icon: Type, 
    group: FIELD_GROUPS.TEXT,
    defaultProps: { placeholder: 'Enter text...', validation: { required: true } } 
  },
  { 
    type: 'textarea', 
    label: 'Long Text', 
    icon: AlignLeft, 
    group: FIELD_GROUPS.TEXT,
    defaultProps: { placeholder: 'Enter long description...', validation: { required: true } } 
  },
  { 
    type: 'email', 
    label: 'Email', 
    icon: AtSign, 
    group: FIELD_GROUPS.TEXT,
    defaultProps: { placeholder: 'email@example.com', validation: { required: true } } 
  },
  { 
    type: 'phone', 
    label: 'Phone Number', 
    icon: Phone, 
    group: FIELD_GROUPS.TEXT,
    defaultProps: { placeholder: '+1 (555) 000-0000', validation: { required: true } } 
  },
  { 
    type: 'password', 
    label: 'Password', 
    icon: Lock, 
    group: FIELD_GROUPS.TEXT,
    defaultProps: { placeholder: '••••••••', validation: { required: true } } 
  },
  { 
    type: 'number', 
    label: 'Number', 
    icon: Hash, 
    group: FIELD_GROUPS.TEXT,
    defaultProps: { placeholder: '0', validation: { required: true } } 
  },
  { 
    type: 'url', 
    label: 'URL', 
    icon: Globe, 
    group: FIELD_GROUPS.TEXT,
    defaultProps: { placeholder: 'https://...', validation: { required: true } } 
  },

  // Pickers
  { 
    type: 'date', 
    label: 'Date Picker', 
    icon: Calendar, 
    group: FIELD_GROUPS.SELECTION,
    defaultProps: { validation: { required: true } } 
  },
  { 
    type: 'time', 
    label: 'Time Picker', 
    icon: Clock, 
    group: FIELD_GROUPS.SELECTION,
    defaultProps: { validation: { required: true } } 
  },
  { 
    type: 'datetime', 
    label: 'DateTime Picker', 
    icon: CalendarClock, 
    group: FIELD_GROUPS.SELECTION,
    defaultProps: { validation: { required: true } } 
  },

  // Choice
  { 
    type: 'dropdown', 
    label: 'Single Select', 
    icon: ChevronDown, 
    group: FIELD_GROUPS.SELECTION,
    defaultProps: { options: [{ label: 'Option 1', value: '1' }, { label: 'Option 2', value: '2' }], validation: { required: true } } 
  },
  { 
    type: 'multiselect', 
    label: 'Multi Select', 
    icon: List, 
    group: FIELD_GROUPS.SELECTION,
    defaultProps: { options: [{ label: 'Option 1', value: '1' }], validation: { required: true } } 
  },
  { 
    type: 'radio', 
    label: 'Radio Group', 
    icon: List, 
    group: FIELD_GROUPS.SELECTION,
    defaultProps: { options: [{ label: 'Option 1', value: '1' }], validation: { required: true } } 
  },
  { 
    type: 'checkbox', 
    label: 'Checkbox Group', 
    icon: CheckSquare, 
    group: FIELD_GROUPS.SELECTION,
    defaultProps: { options: [{ label: 'Option 1', value: '1' }], validation: { required: true } } 
  },
  { 
    type: 'toggle', 
    label: 'Toggle Switch', 
    icon: ToggleLeft, 
    group: FIELD_GROUPS.SELECTION,
    defaultProps: { label: 'Enable setting', validation: { required: true } } 
  },

  // Media & Specialized
  { 
    type: 'file', 
    label: 'File Upload', 
    icon: FileUp, 
    group: FIELD_GROUPS.ADVANCED,
    defaultProps: { helpText: 'Max size 5MB', validation: { required: true } } 
  },
  { 
    type: 'image', 
    label: 'Image Upload', 
    icon: ImageIcon, 
    group: FIELD_GROUPS.ADVANCED,
    defaultProps: { validation: { required: true } } 
  },
  { 
    type: 'signature', 
    label: 'Signature', 
    icon: PenTool, 
    group: FIELD_GROUPS.ADVANCED,
    defaultProps: { validation: { required: true } } 
  },
  { 
    type: 'rating', 
    label: 'Rating', 
    icon: Star, 
    group: FIELD_GROUPS.ADVANCED,
    defaultProps: { max: 5, validation: { required: true } } 
  },
  { 
    type: 'slider', 
    label: 'Slider', 
    icon: SlidersHorizontal, 
    group: FIELD_GROUPS.ADVANCED,
    defaultProps: { min: 0, max: 100, step: 1, validation: { required: true } } 
  },
  { 
    type: 'color', 
    label: 'Color Picker', 
    icon: Palette, 
    group: FIELD_GROUPS.ADVANCED,
    defaultProps: { defaultValue: '#0ea5e9' } 
  },

  // Layout
  { 
    type: 'section', 
    label: 'Section Header', 
    icon: Heading, 
    group: FIELD_GROUPS.LAYOUT,
    defaultProps: { label: 'Section Title', helpText: 'Description text...' } 
  },
  { 
    type: 'paragraph', 
    label: 'Paragraph Text', 
    icon: TextIcon, 
    group: FIELD_GROUPS.LAYOUT,
    defaultProps: { label: 'Enter your paragraph content here...' } 
  },
  { 
    type: 'divider', 
    label: 'Divider', 
    icon: Minus, 
    group: FIELD_GROUPS.LAYOUT,
    defaultProps: {} 
  },
  { 
    type: 'spacer', 
    label: 'Spacer', 
    icon: Space, 
    group: FIELD_GROUPS.LAYOUT,
    defaultProps: { height: '24px' } 
  },
  { 
    type: 'submit', 
    label: 'Submit Button', 
    icon: Send, 
    group: FIELD_GROUPS.LAYOUT,
    defaultProps: { label: 'Submit Form' } 
  },
];
