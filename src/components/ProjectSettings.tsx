import { Settings, X, Save, Trash2, AlertTriangle } from 'lucide-react';
import { useState } from 'react';
import type { Project } from '@/types/builder';

interface ProjectSettingsProps {
  open: boolean;
  onClose: () => void;
  project: Project | null;
}

export default function ProjectSettings({ open, onClose, project }: ProjectSettingsProps) {
  const [name, setName] = useState(project?.name ?? '');
  const [platform, setPlatform] = useState(project?.platform ?? 'both');
  const [dangerOpen, setDangerOpen] = useState(false);
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2"><Settings className="w-5 h-5 text-cyan-400" /><h3 className="text-sm font-semibold text-slate-100">Project Settings</h3></div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X className="w-5 h-5" /></button>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin p-5 space-y-4">
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Project Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-500" />
          </div>

          <div>
            <label className="text-xs text-slate-500 mb-1 block">Platform</label>
            <div className="flex items-center gap-2">
              {(['ios', 'android', 'both'] as const).map((p) => <button key={p} onClick={() => setPlatform(p)} className={`text-xs px-3 py-2 rounded-lg capitalize transition-colors ${platform === p ? 'bg-slate-800 text-slate-100' : 'bg-slate-950 text-slate-500 hover:text-slate-300'}`}>{p}</button>)}
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3 space-y-2">
            <h4 className="text-xs text-slate-500 uppercase tracking-wider">Project Info</h4>
            <div className="flex justify-between text-xs"><span className="text-slate-500">ID</span><code className="text-slate-300 font-mono">{project?.id ?? '—'}</code></div>
            <div className="flex justify-between text-xs"><span className="text-slate-500">Type</span><span className="text-slate-300 capitalize">{project?.app_type ?? '—'}</span></div>
            <div className="flex justify-between text-xs"><span className="text-slate-500">Status</span><span className="text-slate-300 capitalize">{project?.status ?? '—'}</span></div>
            <div className="flex justify-between text-xs"><span className="text-slate-500">Created</span><span className="text-slate-300">{project?.created_at?.slice(0, 10) ?? '—'}</span></div>
          </div>

          <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-3">
            <button onClick={() => setDangerOpen(!dangerOpen)} className="w-full flex items-center gap-2 text-sm font-medium text-red-400"><AlertTriangle className="w-4 h-4" /> Danger Zone</button>
            {dangerOpen && (
              <div className="mt-3 space-y-2">
                <p className="text-xs text-slate-400">Delete this project and all associated data. This action cannot be undone.</p>
                <button className="w-full rounded-lg py-2 bg-red-500/20 text-red-400 text-xs font-medium hover:bg-red-500/30 flex items-center justify-center gap-1.5"><Trash2 className="w-3.5 h-3.5" /> Delete project</button>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 px-5 py-3 border-t border-slate-800">
          <button className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-900 text-xs font-semibold"><Save className="w-3.5 h-3.5" /> Save changes</button>
          <button onClick={onClose} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-medium hover:bg-slate-700">Cancel</button>
        </div>
      </div>
    </div>
  );
}
