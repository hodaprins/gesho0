import { Sparkles, Plus, Home } from 'lucide-react';

interface HeaderProps {
  projectName?: string;
  appType?: string;
  onNew: () => void;
  onHome: () => void;
}

export default function Header({ projectName, appType, onNew, onHome }: HeaderProps) {
  return (
    <header className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-950/80 backdrop-blur-sm z-10">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-slate-900" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-bold text-slate-100">AppForge</span>
          {projectName && (
            <>
              <span className="text-slate-700">/</span>
              <span className="text-sm text-slate-400">{projectName}</span>
              {appType && (
                <span className="text-xs px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 capitalize">
                  {appType}
                </span>
              )}
            </>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onHome}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
        >
          <Home className="w-3.5 h-3.5" />
          Home
        </button>
        <button
          onClick={onNew}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 text-slate-200 hover:bg-slate-700 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          New app
        </button>
      </div>
    </header>
  );
}
