import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { 
  Search, Filter, Download, ArrowUpRight, 
  ChevronLeft, ChevronRight, Loader2, Database,
  Table as TableIcon, Eye, X, FileText
} from 'lucide-react';
import { motion } from 'framer-motion';

const ResponsesTable = ({ formId }) => {
  const [previewFile, setPreviewFile] = useState(null);
  const [responses, setResponses] = useState([]);
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchData();
  }, [formId]);

  const fetchData = async () => {
    if (!formId || formId === 'new' || formId === 'undefined') {
      setLoading(false);
      return;
    }
    try {
      const [resData, formData] = await Promise.all([
        api.get(`/forms/${formId}/responses`),
        api.get(`/forms/${formId}`)
      ]);
      const raw = resData.data;
      setResponses(Array.isArray(raw) ? raw : (raw?.data || []));
      setFields((formData.data.fields || []).filter(f => 
        !['section','paragraph','divider','spacer','submit'].includes(f.type)
      ));
    } catch (err) {
      console.error('ResponsesTable fetch error:', err);
      setResponses([]);
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    const headers = ['Submitted At', ...fields.map(f => f.label)].join(',');
    const rows = responses.map(r => {
      const date = new Date(r.createdAt).toLocaleString();
      const vals = fields.map(f => {
        const val = r.data[f.name] || '';
        if (typeof val === 'object' && val !== null && (val.fileName || val.name)) {
          const name = val.fileName || val.name;
          const url = val.fileUrl || val.data;
          return `"${name} (${url})"`;
        }
        return `"${val.toString().replace(/"/g, '""')}"`;
      });
      return `${date},${vals.join(',')}`;
    });
    
    const csvContent = "data:text/csv;charset=utf-8," + headers + "\n" + rows.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `responses_${formId}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePreview = (file) => {
    const dataUrl = file.fileUrl || file.data;

    // Convert Base64/DataURL to Blob for better browser support and same-page viewing
    if (dataUrl && dataUrl.startsWith('data:')) {
      try {
        const parts = dataUrl.split(',');
        const mime = parts[0].match(/:(.*?);/)[1];
        const b64 = parts[1];
        
        const byteCharacters = atob(b64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: mime });
        const blobUrl = URL.createObjectURL(blob);
        
        // Update file object with temporary blob URL for same-page modal preview
        const fileWithBlob = { ...file, blobUrl };
        setPreviewFile(fileWithBlob);
      } catch (e) {
        console.error('Blob conversion failed:', e);
        setPreviewFile(file); // Fallback to raw dataURL if blob failed
      }
    } else {
      setPreviewFile(file);
    }
  };

  const FileCell = ({ value, type }) => {
    if (!value || typeof value !== 'object') return <span>{value?.toString() || '—'}</span>;
    
    const fileName = value.fileName || value.name || 'document';
    const fileUrl = value.fileUrl || value.data;
    const isImage = type === 'image' || (value.fileType && value.fileType.startsWith('image/'));

    return (
      <div className="flex items-center gap-4 group/cell">
        <div 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handlePreview(value);
          }}
          className="flex items-center gap-3 cursor-pointer group/preview"
        >
          {isImage ? (
            <div className="w-10 h-10 rounded-lg overflow-hidden border border-white/10 group-hover/preview:border-brand-500 transition-colors shrink-0 shadow-lg">
              <img src={fileUrl} alt={fileName} className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center shrink-0 group-hover/preview:bg-brand-500/10 transition-colors">
              <FileText size={18} className="text-slate-500 group-hover/preview:text-brand-500" />
            </div>
          )}
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-bold text-white group-hover/preview:text-brand-500 transition-colors truncate max-w-[120px]">
              {fileName}
            </span>
            <span className="text-[10px] text-slate-500 flex items-center gap-1 font-black uppercase tracking-tighter">
              <Eye size={10} /> View Inline
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover/cell:opacity-100 transition-opacity">
          <button 
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handlePreview(value);
            }}
            className="p-2 hover:bg-white/5 rounded-lg text-slate-500 hover:text-white transition-colors"
            title="Preview"
          >
            <Eye size={14} />
          </button>
          <a 
            href={fileUrl} 
            download={fileName}
            onClick={(e) => e.stopPropagation()}
            className="p-2 hover:bg-white/5 rounded-lg text-slate-500 hover:text-white transition-colors"
            title="Download"
          >
            <Download size={14} />
          </a>
        </div>
      </div>
    );
  };

  const PreviewModal = () => {
    useEffect(() => {
      return () => {
        if (previewFile?.blobUrl) {
          URL.revokeObjectURL(previewFile.blobUrl);
        }
      };
    }, [previewFile]);

    if (!previewFile) return null;
    const fileUrl = previewFile.blobUrl || previewFile.fileUrl || previewFile.data;
    const fileName = previewFile.fileName || previewFile.name;
    const fileType = previewFile.fileType || previewFile.type || '';
    const isPdf = fileType === 'application/pdf';

    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-8 bg-slate-950/90 backdrop-blur-md">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative max-w-5xl w-full h-full flex flex-col items-center justify-center"
        >
          <button 
            onClick={() => {
              if (previewFile.blobUrl) URL.revokeObjectURL(previewFile.blobUrl);
              setPreviewFile(null);
            }}
            className="absolute -top-12 right-0 p-3 bg-white/5 hover:bg-red-500/10 hover:text-red-500 rounded-full transition-all text-white border border-white/10"
          >
            <X size={24} />
          </button>
          
          <div className="w-full h-full rounded-[2.5rem] overflow-hidden border border-white/5 shadow-2xl relative group bg-black/40">
            {isPdf ? (
              <iframe src={fileUrl} className="w-full h-full border-0" title={fileName} />
            ) : (
              <img src={fileUrl} alt={fileName} className="w-full h-full object-contain" />
            )}
            
            <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-black/80 to-transparent flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="space-y-1">
                <p className="text-white font-bold text-lg">{fileName}</p>
                <p className="text-slate-400 text-xs font-medium">{fileType}</p>
              </div>
              <a 
                href={fileUrl} 
                download={fileName}
                className="btn-premium btn-premium-primary py-3 px-8 text-xs font-bold uppercase tracking-widest"
              >
                Download Original
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    );
  };

  if (loading) return (
    <div className="h-full flex items-center justify-center">
      <Loader2 className="w-10 h-10 text-brand-500 animate-spin" />
    </div>
  );

  return (
    <div className="h-full flex flex-col pt-6 md:pt-10 px-4 md:px-12 bg-slate-950/20">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8 md:mb-10">
        <div className="space-y-1">
          <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight">Data Intelligence</h2>
          <p className="text-slate-500 font-medium text-xs md:text-sm">Analyzing {responses.length} total submissions for this collection.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative group flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-brand-500 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search data..." 
              className="bg-white/5 border border-white/5 rounded-2xl h-12 w-full sm:w-64 pl-12 pr-4 text-xs font-bold uppercase tracking-widest outline-none focus:border-brand-500 transition-all placeholder:text-slate-700"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button 
            onClick={exportToCSV}
            className="btn-premium btn-premium-secondary h-12 px-6 text-[10px] sm:text-xs font-black uppercase tracking-widest whitespace-nowrap"
          >
            <Download size={16} /> Export CSV
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto rounded-[2.5rem] border border-white/5 bg-[#020617]/40 shadow-2xl no-scrollbar">
        <table className="w-full text-left border-collapse min-w-[1000px]">
          <thead className="sticky top-0 bg-[#0F172A] z-20">
            <tr>
              <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 border-b border-white/5">Submitted At</th>
              {fields.map(field => (
                <th key={field.id} className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 border-b border-white/5">{field.label}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {responses
              .filter(res => {
                if (!search) return true;
                const searchLower = search.toLowerCase();
                return Object.values(res.data).some(val => {
                  if (typeof val === 'object' && val !== null) {
                    return (val.fileName || val.name || '').toLowerCase().includes(searchLower);
                  }
                  return val?.toString().toLowerCase().includes(searchLower);
                });
              })
              .map((res, i) => (
              <motion.tr 
                key={res._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="hover:bg-white/[0.02] transition-colors group"
              >
                <td className="p-6 text-xs font-bold text-slate-400">
                  {new Date(res.createdAt).toLocaleString()}
                </td>
                {fields.map(field => (
                  <td key={field.id} className="p-6 text-sm font-medium text-white max-w-xs">
                    <FileCell value={res.data[field.name]} type={field.type} />
                  </td>
                ))}
              </motion.tr>
            ))}

            {responses.length === 0 && (
              <tr>
                <td colSpan={fields.length + 1} className="p-32 text-center">
                  <div className="flex flex-col items-center justify-center opacity-20">
                    <Database size={64} strokeWidth={1} className="mb-4" />
                    <p className="text-xl font-bold uppercase tracking-widest">No Submissions Recorded</p>
                    <p className="text-sm font-medium">Wait for users to start interacting with your form.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {responses.length > 0 && (
        <div className="h-24 flex items-center justify-between opacity-50 px-4">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Showing {responses.length} entries</p>
          <div className="flex items-center gap-4">
            <button className="h-10 w-10 bg-white/5 rounded-xl flex items-center justify-center hover:bg-white/10"><ChevronLeft size={18}/></button>
            <button className="h-10 w-10 bg-white/5 rounded-xl flex items-center justify-center hover:bg-white/10"><ChevronRight size={18}/></button>
          </div>
        </div>
      )}
      <PreviewModal />
    </div>
  );
};

export default ResponsesTable;
