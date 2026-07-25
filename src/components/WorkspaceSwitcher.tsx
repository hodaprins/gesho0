import { Building2, X } from 'lucide-react';
import { useState } from 'react';

interface Workspace {
  id: string;
  name: string;
  projects: number;
  color: string;
}

const WORKSPACES: Workspace[] = [
  { id: '1', name: 'Acme Design Studio', projects: 12, color: '#f472b6' },
  { id: '2', name: 'Northwind Labs', projects: 8, color: '#60a5fa' },
  { id: '3', name: 'Globex Product Team', projects: 5, color: '#34d399' },
  { id: '4', name: 'Initech Internal', projects: 3, color: '#fbbf24' },
  { id: '5', name: 'Umbrella Mobile', projects: 7, color: '#a78bfa' },
];

interface WorkspaceSwitcherProps {
  open: boolean;
  onClose: () => void;
}

export function WorkspaceSwitcher({ open, onClose }: WorkspaceSwitcherProps) {
  const [query, setQuery] = useState('');

  if (!open) return null;

  const filtered = WORKSPACES.filter((w) =>
    w.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg max-h-[85vh] flex flex-col rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-500/15 text-sky-400">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-100">Switch Workspace</h2>
              <p className="text-xs text-slate-400">{WORKSPACES.length} workspaces · {WORKSPACES.reduce((s, w) => s + w.projects, 0)} projects</p>
            </div>
          </div>
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors" aria-label="Close">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="border-b border-slate-800 px-5 py-3">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search workspaces..."
            className="w-full rounded-lg border border-slate-700 bg-slate-800/50 px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:border-sky-500/50 focus:outline-none"
          />
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-2">
          {filtered.length === 0 && (
            <p className="py-8 text-center text-xs text-slate-500">No workspaces match "{query}"</p>
          )}
          {filtered.map((ws) => (
            <button
              key={ws.id}
              onClick={onClose}
              className="flex w-full items-center gap-3 rounded-xl border border-slate-800 bg-slate-800/40 p-3 text-left hover:border-slate-700 hover:bg-slate-800/70 transition-colors"
            >
              <div
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xs font-bold text-white"
                style={{ backgroundColor: ws.color }}
              >
                {ws.name.charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium text-slate-100">{ws.name}</p>
                <p className="text-[10px] text-slate-500">{ws.projects} projects</p>
              </div>
              <svg className="h-4 w-4 text-slate-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          ))}
        </div>

        <div className="border-t border-slate-800 px-5 py-3">
          <button className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-slate-700 py-2 text-xs font-medium text-slate-300 hover:border-sky-500/50 hover:text-sky-400 transition-colors">
            <span className="text-base leading-none">+</span> Create New Workspace
          </button>
        </div>
      </div>
    </div>
  );
}
