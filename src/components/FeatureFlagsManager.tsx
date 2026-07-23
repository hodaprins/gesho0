import { useState } from 'react';
import { Flag, X, Plus, Trash2 } from 'lucide-react';

interface FeatureFlag {
  id: string;
  name: string;
  key: string;
  enabled: boolean;
  environments: { dev: boolean; staging: boolean; prod: boolean };
  description: string;
}

const INITIAL_FLAGS: FeatureFlag[] = [
  { id: '1', name: 'Dark Mode', key: 'dark_mode', enabled: true, environments: { dev: true, staging: true, prod: false }, description: 'Enable dark theme' },
  { id: '2', name: 'New Checkout', key: 'new_checkout', enabled: true, environments: { dev: true, staging: true, prod: true }, description: 'Revamped payment flow' },
  { id: '3', name: 'AI Recommendations', key: 'ai_recs', enabled: false, environments: { dev: true, staging: false, prod: false }, description: 'ML-powered suggestions' },
  { id: '4', name: 'Social Login', key: 'social_login', enabled: true, environments: { dev: true, staging: true, prod: true }, description: 'OAuth providers' },
  { id: '5', name: 'Push Notifications', key: 'push_notifs', enabled: false, environments: { dev: true, staging: false, prod: false }, description: 'Push to mobile devices' },
];

interface FeatureFlagsManagerProps {
  open: boolean;
  onClose: () => void;
}

export default function FeatureFlagsManager({ open, onClose }: FeatureFlagsManagerProps) {
  const [flags, setFlags] = useState<FeatureFlag[]>(INITIAL_FLAGS);

  if (!open) return null;

  const toggle = (id: string, env: keyof FeatureFlag['environments']) => {
    setFlags((prev) => prev.map((f) => f.id === id ? { ...f, environments: { ...f.environments, [env]: !f.environments[env] } } : f));
  };

  const toggleGlobal = (id: string) => {
    setFlags((prev) => prev.map((f) => f.id === id ? { ...f, enabled: !f.enabled } : f));
  };

  const remove = (id: string) => setFlags((prev) => prev.filter((f) => f.id !== id));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Flag className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-semibold text-slate-100">Feature Flags</h3>
            <span className="text-xs text-slate-500">{flags.filter(f => f.enabled).length}/{flags.length} active</span>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X className="w-5 h-5" /></button>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-2">
          {flags.map((flag) => (
            <div key={flag.id} className="group rounded-xl border border-slate-800 bg-slate-950/40 p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <button onClick={() => toggleGlobal(flag.id)} className={`relative w-9 h-5 rounded-full transition-colors shrink-0 ${flag.enabled ? 'bg-emerald-500' : 'bg-slate-700'}`}>
                    <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${flag.enabled ? 'translate-x-4' : 'translate-x-0.5'}`} />
                  </button>
                  <div>
                    <p className="text-sm font-medium text-slate-200">{flag.name}</p>
                    <p className="text-[10px] text-slate-500 font-mono">{flag.key}</p>
                  </div>
                </div>
                <button onClick={() => remove(flag.id)} className="opacity-0 group-hover:opacity-100 text-slate-600 hover:text-red-400 transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
              <p className="text-xs text-slate-500 mb-2">{flag.description}</p>
              <div className="flex items-center gap-2">
                {(['dev', 'staging', 'prod'] as const).map((env) => (
                  <button key={env} onClick={() => toggle(flag.id, env)}
                    className={`text-[10px] px-2 py-1 rounded-lg font-medium capitalize transition-colors ${flag.environments[env] ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-600'}`}>
                    {env}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 px-5 py-3 border-t border-slate-800">
          <button onClick={() => setFlags((p) => [...p, { id: crypto.randomUUID(), name: 'New Flag', key: 'new_flag', enabled: false, environments: { dev: false, staging: false, prod: false }, description: 'Description' }])}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-medium hover:bg-slate-700 transition-colors">
            <Plus className="w-3.5 h-3.5" /> Add flag
          </button>
        </div>
      </div>
    </div>
  );
}
