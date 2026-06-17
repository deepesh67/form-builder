import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api/axios';
import { Download, Search, Filter, Calendar, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const Responses = () => {
  const { id } = useParams();
  const [form, setForm] = useState(null);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [formRes, respRes] = await Promise.all([
          api.get(`/forms/${id}`),
          api.get(`/responses/${id}`)
        ]);
        setForm(formRes.data);
        setResponses(respRes.data);
      } catch (error) {
        console.error('Error fetching responses:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const exportCSV = () => {
    window.open(`http://localhost:5000/api/responses/${id}/export`, '_blank');
  };

  const filteredResponses = responses.filter(r =>
    JSON.stringify(r.data).toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div></div>;
  if (!form) return <div className="text-center py-20">Form not found</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/" className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold">{form.title} - Submissions</h1>
          <p className="text-slate-500 text-sm">Review activity and export data</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between glass p-4 rounded-2xl">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search submissions..."
            className="input-field pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button className="btn btn-secondary flex items-center justify-center gap-2 flex-1 sm:flex-none">
            <Filter size={18} /> Filter
          </button>
          <button
            onClick={exportCSV}
            className="btn btn-primary flex items-center justify-center gap-2 flex-1 sm:flex-none"
          >
            <Download size={18} /> Export CSV
          </button>
        </div>
      </div>

      <div className="overflow-x-auto card p-0">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/50">
              <th className="p-4 font-semibold text-sm border-b border-slate-100 dark:border-slate-800">Submitted At</th>
              {form.fields.slice(0, 3).map(f => (
                <th key={f.name} className="p-4 font-semibold text-sm border-b border-slate-100 dark:border-slate-800">{f.label}</th>
              ))}
              <th className="p-4 font-semibold text-sm border-b border-slate-100 dark:border-slate-800">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredResponses.map((res) => (
              <tr key={res._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                <td className="p-4 text-sm whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-slate-400" />
                    {new Date(res.createdAt).toLocaleString()}
                  </div>
                </td>
                {form.fields.slice(0, 3).map(f => (
                  <td key={f.name} className="p-4 text-sm truncate max-w-[200px]">
                    {res.data[f.name] || '-'}
                  </td>
                ))}
                <td className="p-4 text-sm">
                  <button className="text-primary-600 font-medium hover:underline">View Details</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredResponses.length === 0 && (
          <div className="p-20 text-center text-slate-400">
            <p>No submissions found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Responses;
