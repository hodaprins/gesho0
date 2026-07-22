import {
  Sparkles,
  Plus,
  Home,
  LayoutGrid,
  Rocket,
  Download,
  Store,
  GitBranch,
} from 'lucide-react';

interface HeaderProps {
  projectName?: string;
  appType?: string;
  onNew: () => void;
  onHome: () => void;
  onDashboard?: () => void;
  onDeploy?: () => void;
  onExport?: () => void;
  onStore?: () => void;
  onVersions?: () => void;
  buildComplete?: boolean;
  showActions?: boolean;
}

export default function Header({
  projectName,
  appType,
  onNew,
  onHome,
  onDashboard,
  onDeploy,
  onExport,
  onStore,
  onVersions,
  buildComplete,
  showActions,
}: HeaderProps) {
  return (
    <header className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-950/80 backdrop-blur-sm z-10">
      <div className="flex items-center gap-3">
        <button onClick={onHome} className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center transition-transform group-hover:scale-110">
            <Sparkles className="w-4 h-4 text-slate-900" />
          </div>
          <span className="text-sm font-bold text-slate-100">AppForge</span>
        </button>
        {projectName && (
          <div className="flex items-baseline gap-2">
            <span className="text-slate-700">/</span>
            <span className="text-sm text-slate-400">{projectName}</span>
            {appType && (
              <span className="text-xs px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 capitalize">
                {appType}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-1.5">
        {showActions && (
          <>
            {onVersions && (
              <ActionButton icon={<GitBranch className="w-3.5 h-3.5" />} label="Versions" onClick={onVersions} />
            )}
            {onStore && (
              <ActionButton icon={<Store className="w-3.5 h-3.5" />} label="Store" onClick={onStore} />
            )}
            {onExport && (
              <ActionButton icon={<Download className="w-3.5 h-3.5" />} label="Export" onClick={onExport} />
            )}
            {onDeploy && (
              <button
                onClick={onDeploy}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-900 hover:shadow-lg hover:shadow-emerald-500/25 transition-all hover:scale-[1.02] active:scale-95"
              >
                <Rocket className="w-3.5 h-3.5" />
                Deploy
              </button>
            )}
            <div className="w-px h-5 bg-slate-800 mx-1" />
          </>
        )}
        {onDashboard && (
          <button
            onClick={onDashboard}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            Projects
          </button>
        )}
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
          New
        </button>
      </div>
    </header>
  );
}

function ActionButton({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
    >
      {icon}
      {label}
    </button>
  );
}
