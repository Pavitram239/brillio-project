import React from 'react';
import { AlertOctagon, RotateCcw } from 'lucide-react';

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ message, onRetry }) => {
  return (
    <div className="max-w-xl mx-auto my-8 p-6 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-center shadow-lg">
      <div className="inline-flex p-3 rounded-full bg-rose-500/20 text-rose-400 mb-3">
        <AlertOctagon className="w-6 h-6" />
      </div>

      <h3 className="text-base font-bold text-rose-200 mb-1">Research Request Failed</h3>

      <p className="text-xs text-rose-300/80 mb-4 leading-relaxed max-w-md mx-auto">
        {message}
      </p>

      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-medium text-xs rounded-xl transition-all shadow-md shadow-rose-600/20"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Try Again</span>
        </button>
      )}
    </div>
  );
};
