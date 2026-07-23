import { Package, X, Check, AlertTriangle, ArrowUp, Search } from 'lucide-react';
import { useState } from 'react';

interface Dependency {
  id: string;
  name: string;
  current: string;
  latest: string;
  type: 'core' | 'dev' | 'peer';
  status: 'up-to-date' | 'outdated' | 'vulnerable';
  vulnerabilities: number;
}

const DEPS: Dependency[] = [
  { id: '1', name: 'react', current: '18.3.1', latest: '18.3.1', type: 'core', status: 'up-to-date', vulnerabilities: 0 },
  { id: '2', name: 'react-dom', current: '18.3.1', latest: '18.3.1', type: 'core', status: 'up-to-date', vulnerabilities: 0 },
  { id: '3', name: '@supabase/supabase-js', current: '2.57.4', latest: '2.58.0', type: 'core', status: 'outdated', vulnerabilities: 0 },
  { id: '4', name: 'lucide-react', current: '0.344.0', latest: '0.400.1', type: 'core', status: 'outdated', vulnerabilities: 0 },
  { id: '5', name: 'axios', current: '1.6.0', latest: '1.7.2', type: 'core', status: 'vulnerable', vulnerabilities: 1 },
  { id: '6', name: 'typescript', current: '5.5.3', latest: '5.6.2', type: 'dev', status: 'outdated', vulnerabilities: 0 },
  { id: '7', name: 'vite', current: '5.4.2', latest: '5.4.2', type: 'dev', status: 'up-to-date', vulnerabilities: 0 },
  { id: '8', name: 'eslint', current: '9.9.1', latest: '9.9.1', type: 'dev', status: 'up-to-date', vulnerabilities: 0 },
  { id: '9', name: 'tailwindcss', current: '3.4.1', latest: '3.4.7', type: 'dev', status: 'outdated', vulnerabilities: 0 },
  { id: '10', name: 'lodash', current: '4.17.20', latest: '4.17.21', type: 'core', status: 'vulnerable', vulnerabilities: 2 },
];

const STATUS_META: Record<string, { color: string; icon: React.ReactNode }> = {
  'up-to-date': { color: 'text-emerald-400', icon: <Check className="w-3 h-3" /> },
  'outdated': { color: 'text-amber-400', icon: <ArrowUp className="w-3 h-3" /> },
  'vulnerable': { color: 'text-red-400', icon: <AlertTriangle className="w-3 h-3" /> },
};

interface DependencyManagerProps {
  open: boolean;
  onClose: () => void;
}

export default function DependencyManager({ open, onClose }: DependencyManagerProps) {
  const [search, setSearch] = useState('');
  if (!open) return null;
  const filtered = DEPS.filter((d) => d.name.includes(search.toLowerCase()));
  const outdated = DEPS.filter((d) => d.status === 'outdated').length;
  const vulnerable = DEPS.filter((d) => d.status === 'vulnerable').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2"><Package className="w-5 h-5 text-cyan-400" /><h3 className="text-sm font-semibold text-slate-100">Dependencies</h3></div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X className="w-5 h-5" /></button>
        </div>

        <div className="grid grid-cols-3 gap-2 px-5 py-3 border-b border-slate-800">
          <div className="rounded-lg bg-slate-800/50 p-2 text-center"><p className="text-lg font-bold text-slate-100">{DEPS.length}</p><p className="text-[10px] text-slate-500">Total</p></div>
          <div className="rounded-lg bg-slate-800/50 p-2 text-center"><p className="text-lg font-bold text-amber-400">{outdated}</p><p className="text-[10px] text-slate-500">Outdated</p></div>
          <div className="rounded-lg bg-slate-800/50 p-2 text-center"><p className="text-lg font-bold text-red-400">{vulnerable}</p><p className="text-[10px] text-slate-500">Vulnerable</p></div>
        </div>

        <div className="px-5 py-2 border-b border-slate-800">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search packages..." className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs text-slate-200 focus:outline-none" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-1.5">
          {filtered.map((d) => (
            <div key={d.id} className="flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-950/40 px-3 py-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <code className="text-xs font-mono text-slate-200">{d.name}</code>
                  <span className={`text-[9px] px-1 rounded ${d.type === 'core' ? 'bg-cyan-500/20 text-cyan-400' : d.type === 'dev' ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-700 text-slate-400'}`}>{d.type}</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-slate-600 mt-0.5">
                  <span className="font-mono">{d.current}</span>
                  {d.status !== 'up-to-date' && <><ArrowRight /> <span className="font-mono text-amber-400">{d.latest}</span></>}
                  {d.vulnerabilities > 0 && <span className="text-red-400">{d.vulnerabilities} vuln{d.vulnerabilities > 1 ? 's' : ''}</span>}
                </div>
              </div>
              <span className={`flex items-center gap-1 text-[10px] ${STATUS_META[d.status].color}`}>{STATUS_META[d.status].icon}</span>
              {d.status !== 'up-to-date' && <button className="text-[10px] px-2 py-1 rounded bg-slate-800 text-cyan-400 hover:bg-slate-700">Update</button>}
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 px-5 py-3 border-t border-slate-800">
          <button className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-900 text-xs font-semibold"><ArrowUp className="w-3.5 h-3.5" /> Update all</button>
          <span className="text-xs text-slate-500">{outdated + vulnerable} packages need attention</span>
        </div>
      </div>
    </div>
  );
}

function ArrowRight() { return <span className="text-slate-600">→</span>; }
