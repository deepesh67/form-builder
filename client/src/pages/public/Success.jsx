import { CheckCircle, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

const Success = () => {
  return (
    <div className="max-w-md mx-auto py-20 text-center space-y-6 animate-in zoom-in duration-300">
      <div className="flex justify-center">
        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full flex items-center justify-center">
          <CheckCircle size={48} />
        </div>
      </div>
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Submission Received!</h1>
        <p className="text-slate-500 mt-2">Thank you for your time. Your response has been securely saved.</p>
      </div>
      <Link to="/" className="btn btn-secondary inline-flex items-center gap-2">
        <Home size={18} /> Back to Home
      </Link>
    </div>
  );
};

export default Success;
