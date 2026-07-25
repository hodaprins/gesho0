import { useState } from 'react';
import { MonitorSmartphone, X, AlertTriangle, Check } from 'lucide-react';

interface CrossDeviceScreenshotDiffProps {
  open: boolean;
  onClose: () => void;
}

interface DeviceShot {
  name: string;
  resolution: string;
  diffs: number;
  status: 'pass' | 'warn' | 'fail';
}

const DEVICES: DeviceShot[] = [
  { name: 'iPhone 15', resolution: '393×852', diffs: 0, status: 'pass' },
  { name: 'Pixel 8', resolution: '412×915', diffs: 2, status: 'warn' },
  { name: 'iPad', resolution: '820×1180', diffs: 5, status: 'fail' },
  { name: 'Galaxy S24', resolution: '360×780', diffs: 1, status: 'warn' },
];

const STATUS_STYLE = {
  pass: { ring: 'ring-emerald-500/40', badge: 'bg-emerald-500/15 text-emerald-400', icon: Check },
  warn: { ring: 'ring-amber-500/40', badge: 'bg-amber-500/15 text-amber-400', icon: AlertTriangle },
  fail: { ring: 'ring-rose-500/40', badge: 'bg-rose-500/15 text-rose-400', icon: AlertTriangle },
} as const;

const DIFF_SPOTS: Record<string, { top: string; left: string }[]> = {
  'Pixel 8': [{ top: '32%', left: '20%' }, { top: '68%', left: '55%' }],
  iPad: [{ top: '20%', left: '15%' }, { top: '40%', left: '70%' }, { top: '55%', left: '30%' }, { top: '75%', left: '60%' }, { top: '85%', left: '45%' }],
  'Galaxy S24': [{ top: '50%', left: '40%' }],
};

export default function CrossDeviceScreenshotDiff({ open, onClose }: CrossDeviceScreenshotDiffProps) {
  const [selected, setSelected] = useState<string | null>(null);
  if (!open) return null;
  const totalDiffs = DEVICES.reduce((s, d) => s + d.diffs, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <MonitorSmartphone className="w-5 h-5 text-cyan-400" />
            <h3 className="text-sm font-semibold text-slate-100">Cross-Device Screenshot Diff</h3>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X className="w-5 h-5" /></button>
        </div>

        <div className="grid grid-cols-3 gap-2 px-5 py-3 border-b border-slate-800">
          <div className="rounded-lg bg-slate-800/50 p-2 text-center"><p className="text-lg font-bold text-slate-100">{DEVICES.length}</p><p className="text-[10px] text-slate-500">Devices</p></div>
          <div className="rounded-lg bg-slate-800/50 p-2 text-center"><p className="text-lg font-bold text-amber-400">{totalDiffs}</p><p className="text-[10px] text-slate-500">Total diffs</p></div>
          <div className="rounded-lg bg-slate-800/50 p-2 text-center"><p className="text-lg font-bold text-emerald-400">{DEVICES.filter((d) => d.status === 'pass').length}</p><p className="text-[10px] text-slate-500">Passing</p></div>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin p-4">
          <div className="grid grid-cols-2 gap-3">
            {DEVICES.map((d) => {
              const st = STATUS_STYLE[d.status];
              const spots = DIFF_SPOTS[d.name] ?? [];
              return (
                <button key={d.name} onClick={() => setSelected(selected === d.name ? null : d.name)}
                  className={`rounded-xl border border-slate-800 bg-slate-800/30 p-3 text-left transition-all ring-1 ${st.ring} ${selected === d.name ? 'ring-2' : ''}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="text-xs font-semibold text-slate-200">{d.name}</p>
                      <p className="text-[10px] text-slate-500 font-mono">{d.resolution}</p>
                    </div>
                    <span className={`flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full ${st.badge}`}>
                      <st.icon className="w-3 h-3" />{d.diffs} diff{d.diffs !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="relative w-full rounded-lg bg-slate-950 border border-slate-800 overflow-hidden" style={{ height: 120 }}>
                    <div className="absolute inset-0 p-2 space-y-1.5">
                      <div className="h-2.5 rounded bg-slate-800 w-2/3" />
                      <div className="h-2 rounded bg-slate-800/70 w-full" />
                      <div className="h-2 rounded bg-slate-800/70 w-5/6" />
                      <div className="h-8 rounded bg-slate-800/50 w-full mt-1" />
                      <div className="h-2 rounded bg-slate-800/60 w-1/2" />
                      <div className="h-6 rounded bg-cyan-500/20 w-1/3 mt-1" />
                    </div>
                    {spots.map((spot, i) => (
                      <div key={i} className="absolute w-5 h-5 rounded-full border-2 border-rose-500 bg-rose-500/20 animate-pulse"
                        style={{ top: spot.top, left: spot.left }} />
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
          {selected && (
            <div className="mt-3 rounded-xl border border-rose-500/30 bg-rose-500/5 p-3">
              <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">{selected} — diff details</p>
              <p className="text-xs text-slate-300">{DIFF_SPOTS[selected]?.length ?? 0} layout mismatches detected. Safe-area insets or font scaling likely cause overflow on {selected}.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
