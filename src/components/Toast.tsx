import React from 'react';
import { useNotificationStore } from '../store/useNotificationStore';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useNotificationStore();

  return (
    <div className="fixed top-24 left-1/2 -translate-x-1/2 sm:translate-x-0 sm:left-auto sm:right-4 sm:top-24 z-[9999] flex flex-col gap-2 w-[90%] sm:w-auto max-w-sm pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl text-white w-full transition-all transform translate-y-0 opacity-100 animate-fade-in pointer-events-auto ${
            toast.type === 'success' ? 'bg-success' :
            toast.type === 'error' ? 'bg-danger' : 'bg-primary'
          }`}
        >
          {toast.type === 'success' && <CheckCircle className="w-5 h-5" />}
          {toast.type === 'error' && <AlertCircle className="w-5 h-5" />}
          {toast.type === 'info' && <Info className="w-5 h-5" />}
          
          <span className="flex-1 font-medium text-sm">{toast.message}</span>
          
          <button onClick={() => removeToast(toast.id)} className="text-white/80 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
