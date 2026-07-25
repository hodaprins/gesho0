import { Sparkles, X, Zap, Waves, Eye } from 'lucide-react';
import { useState } from 'react';

type Setting = 'animations' | 'transitions' | 'parallax' | 'autoplays';

export function ReducedMotionSettings({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [enabled, setEnabled] = useState(false);
  const [toggles, setToggles] = useState<Record<Setting, boolean>>({
    animations: true,
    transitions: true,
    parallax: true,
    autoplays: true,
  });

  if (!open) return null;

  const toggle = (k: Setting) => setToggles((t) => ({ ...t, [k]: !t[k] }));

  const items: { key: Setting; label: string; desc: string; icon: typeof Zap }[] = [
    { key: 'animations', label: 'Disable Animations', desc: 'Turn off decorative motion effects', icon: Sparkles },
    { key: 'transitions', label: 'Reduce Transitions', desc: 'Shorten or remove fade/slide durations', icon: Waves },
    { key: 'parallax', label: 'Disable Parallax', desc: 'Stop scroll-based movement of layers', icon: Zap },
    { key: 'autoplays', label: 'Pause Auto-playing Media', desc: 'Prevent autoplay of video & loops', icon: Eye },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
          <div className="flex items-center gap-3">
            <Sparkles className="h-5 w-5 text-indigo-400" />
            <h2 className="text-lg font-semibold text-white">Reduced Motion</h2>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-6 py-4">
          <button
            onClick={() => {
              setEnabled((v) => !v);
              setToggles((t) =>
                Object.fromEntries(Object.keys(t).map((k) => [k, !enabled])) as Record<Setting, boolean>
              );
            }}
            className={`flex w-full items-center justify-between rounded-xl border p-4 transition ${
              enabled ? 'border-indigo-500 bg-indigo-500/10' : 'border-slate-800 bg-slate-800/40'
            }`}
          >
            <div className="text-left">
              <p className="text-sm font-semibold text-white">Enable Reduced Motion</p>
              <p className="text-xs text-slate-400">Applies all simplifications at once</p>
            </div>
            <span className={`relative h-6 w-11 rounded-full transition ${enabled ? 'bg-indigo-500' : 'bg-slate-700'}`}>
              <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${enabled ? 'left-5' : 'left-0.5'}`} />
            </span>
          </button>

          <div className="mt-4 space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Individual Controls</p>
            {items.map(({ key, label, desc, icon: Icon }) => (
              <div key={key} className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-800/30 px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800">
                    <Icon className="h-4 w-4 text-slate-300" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{label}</p>
                    <p className="text-xs text-slate-500">{desc}</p>
                  </div>
                </div>
                <button
                  onClick={() => toggle(key)}
                  className={`relative h-5 w-9 rounded-full transition ${toggles[key] ? 'bg-indigo-500' : 'bg-slate-700'}`}
                >
                  <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all ${toggles[key] ? 'left-4' : 'left-0.5'}`} />
                </button>
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-lg bg-slate-800/50 p-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Preview</p>
            <div className="flex items-center gap-3">
              <div className={`h-3 w-3 rounded-full ${toggles.animations ? 'animate-pulse bg-indigo-400' : 'bg-slate-600'}`} />
              <span className="text-sm text-slate-300">
                {toggles.animations ? 'Animation active' : 'Motion disabled'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t border-slate-800 px-6 py-3">
          <button onClick={onClose} className="rounded-lg px-4 py-1.5 text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white">
            Cancel
          </button>
          <button onClick={onClose} className="rounded-lg bg-indigo-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-indigo-500">
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default ReducedMotionSettings;
