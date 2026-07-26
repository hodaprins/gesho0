import { GitBranch, X, Play, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

const TRIGGERS = ['push (main)', 'pull_request', 'schedule (daily)', 'workflow_dispatch'];
const JOBS = [
  { id: '1', name: 'test', runsOn: 'ubuntu-latest', steps: 4 },
  { id: '2', name: 'lint', runsOn: 'ubuntu-latest', steps: 2 },
  { id: '3', name: 'build', runsOn: 'ubuntu-latest', steps: 5 },
  { id: '4', name: 'deploy', runsOn: 'ubuntu-latest', steps: 3 },
];

export default function GitHubActionsBuilder({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [trigger, setTrigger] = useState('push (main)');
  const [jobs, setJobs] = useState(JOBS);
  if (!open) return null;

  const yaml = `name: CI/CD Pipeline\non:\n  ${trigger.includes('push') ? 'push' : trigger.includes('pull') ? 'pull_request' : 'schedule'}:\n    branches: [main]\n\njobs:\n${jobs.map(j => `  ${j.name}:\n    runs-on: ${j.runsOn}\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-node@v4\n      - run: npm ci\n      - run: npm test`).join('\n\n')}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2"><GitBranch className="w-5 h-5 text-slate-300" /><h3 className="text-sm font-semibold text-slate-100">GitHub Actions Builder</h3></div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X className="w-5 h-5" /></button>
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-3">
          <div><h4 className="text-xs text-slate-500 uppercase tracking-wider mb-2">Trigger</h4><div className="flex flex-wrap gap-1.5">{TRIGGERS.map(t => <button key={t} onClick={() => setTrigger(t)} className={`text-xs px-2.5 py-1 rounded-full ${trigger === t ? 'bg-slate-800 text-slate-100' : 'bg-slate-800/50 text-slate-400'}`}>{t}</button>)}</div></div>
          <div><div className="flex items-center justify-between mb-2"><h4 className="text-xs text-slate-500 uppercase tracking-wider">Jobs ({jobs.length})</h4><button onClick={() => setJobs(j => [...j, { id: crypto.randomUUID(), name: 'new-job', runsOn: 'ubuntu-latest', steps: 1 }])} className="text-slate-400 hover:text-slate-200"><Plus className="w-3.5 h-3.5" /></button></div><div className="space-y-1.5">{jobs.map(j => <div key={j.id} className="group flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-950/40 p-2.5"><Play className="w-3 h-3 text-emerald-400" /><div className="flex-1"><p className="text-xs text-slate-200 font-mono">{j.name}</p><p className="text-[10px] text-slate-500">{j.runsOn} · {j.steps} steps</p></div><button onClick={() => setJobs(p => p.filter(x => x.id !== j.id))} className="opacity-0 group-hover:opacity-100 text-slate-600 hover:text-red-400"><Trash2 className="w-3 h-3" /></button></div>)}</div></div>
          <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3"><h4 className="text-xs text-slate-300 font-medium mb-1">YAML Preview</h4><pre className="text-[10px] font-mono text-slate-300 whitespace-pre-wrap max-h-40 overflow-auto">{yaml}</pre></div>
        </div>
      </div>
    </div>
  );
}
