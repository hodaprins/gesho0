import { useState } from 'react';
import { GitBranch, X, Clock, Check, ArrowUp, ArrowDown } from 'lucide-react';
import type { VersionEntry } from '@/types/builder';

interface VersionHistoryProps {
  open: boolean;
  onClose: () => void;
  appName: string;
  screenCount: number;
}

export default function VersionHistory({ open, onClose, appName, screenCount }: VersionHistoryProps) {
  if (!open) return null;

  const versions = generateVersions(appName, screenCount);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up max-h-[80vh] overflow-y-auto scrollbar-thin">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 sticky top-0 bg-slate-900 z-10">
          <div className="flex items-center gap-2">
            <GitBranch className="w-5 h-5 text-cyan-400" />
            <h3 className="text-sm font-semibold text-slate-100">Version History</h3>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5">
          <div className="relative space-y-4">
            <div className="absolute left-3.5 top-2 bottom-2 w-px bg-slate-800" />
            {versions.map((v, i) => (
              <div key={v.id} className="relative flex gap-4 animate-fade-in-up" style={{ animationDelay: `${i * 60}ms` }}>
                <div className="relative z-10 w-7 h-7 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center shrink-0">
                  <span className="text-[10px] font-bold text-slate-400">{v.version.split('.')[0]}</span>
                </div>
                <div className="flex-1 pb-2">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-slate-200">v{v.version}</span>
                    {i === 0 && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-medium">
                        Latest
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mb-1">{v.changes}</p>
                  <div className="flex items-center gap-2 text-[10px] text-slate-600">
                    <Clock className="w-3 h-3" />
                    {v.timestamp}
                    <span>·</span>
                    <span>{v.author}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function generateVersions(appName: string, screenCount: number): VersionEntry[] {
  const now = Date.now();
  return [
    {
      id: 'v1',
      version: '1.0.0',
      timestamp: 'Just now',
      changes: `Initial release with ${screenCount} screens, design system, and navigation flow.`,
      author: 'AI Builder',
    },
    {
      id: 'v2',
      version: '0.9.0',
      timestamp: '5 min ago',
      changes: 'Added build pipeline, test suite, and audit checks.',
      author: 'AI Builder',
    },
    {
      id: 'v3',
      version: '0.8.0',
      timestamp: '10 min ago',
      changes: 'Generated code for React Native, Flutter, Swift, and Kotlin targets.',
      author: 'Code Generator',
    },
    {
      id: 'v4',
      version: '0.7.0',
      timestamp: '12 min ago',
      changes: 'Applied design system colors and typography.',
      author: 'Design Engine',
    },
    {
      id: 'v5',
      version: '0.6.0',
      timestamp: '15 min ago',
      changes: 'Created database schema and API endpoints.',
      author: 'Database Builder',
    },
    {
      id: 'v6',
      version: '0.5.0',
      timestamp: '18 min ago',
      changes: 'Scaffolded project structure and installed dependencies.',
      author: 'Build System',
    },
    {
      id: 'v7',
      version: '0.1.0',
      timestamp: '20 min ago',
      changes: `Parsed prompt and planned ${appName} architecture.`,
      author: 'Prompt Analyzer',
    },
  ];
}
