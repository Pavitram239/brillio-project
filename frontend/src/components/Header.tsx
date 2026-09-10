import React, { useEffect, useState } from 'react';
import { Building2, Command, Activity } from 'lucide-react';
import { checkHealth } from '../services/api';

interface HeaderProps {
  onSearchFocusClick?: () => void;
}

export const Header: React.FC<HeaderProps> = () => {
  const [isHealthy, setIsHealthy] = useState<boolean | null>(null);

  useEffect(() => {
    let mounted = true;
    const verifyHealth = async () => {
      try {
        await checkHealth();
        if (mounted) setIsHealthy(true);
      } catch {
        if (mounted) setIsHealthy(false);
      }
    };
    verifyHealth();
    const interval = setInterval(verifyHealth, 30000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-20 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand logo & title */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-100 tracking-tight">Company Research Tool</h1>
              <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-semibold px-2 py-0.5 rounded-full">
                Sales Intelligence
              </span>
            </div>
            <p className="text-xs text-slate-400">Automated pre-meeting briefings for SDRs & Account Executives</p>
          </div>
        </div>

        {/* Shortcut hint & System Status */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-1.5 bg-slate-800/80 border border-slate-700/60 rounded-lg px-2.5 py-1 text-xs text-slate-400">
            <Command className="w-3.5 h-3.5 text-slate-400" />
            <span>K</span>
            <span className="text-slate-500 ml-1">Focus Search</span>
          </div>

          <div className="flex items-center gap-2 text-xs bg-slate-800/50 border border-slate-700/40 rounded-full px-3 py-1">
            <Activity className={`w-3.5 h-3.5 ${isHealthy ? 'text-emerald-400 animate-pulse' : isHealthy === false ? 'text-rose-400' : 'text-slate-500'}`} />
            <span className="text-slate-300">
              {isHealthy ? 'API Active' : isHealthy === false ? 'API Offline' : 'Connecting...'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
