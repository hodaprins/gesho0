import { BatteryCharging, X, Cpu, Wifi, MapPin, Monitor } from 'lucide-react';

const METRICS = [
  { component: 'CPU Usage', icon: Cpu, value: 23, max: 100, unit: '%', color: 'text-blue-400', barColor: 'bg-blue-500' },
  { component: 'GPU Rendering', icon: Monitor, value: 15, max: 100, unit: '%', color: 'text-purple-400', barColor: 'bg-purple-500' },
  { component: 'Network Activity', icon: Wifi, value: 8, max: 100, unit: '%', color: 'text-cyan-400', barColor: 'bg-cyan-500' },
  { component: 'Location Services', icon: MapPin, value: 45, max: 100, unit: '%', color: 'text-amber-400', barColor: 'bg-amber-500' },
];

const SCREENS = [
  { name: 'Home Screen', energy: 12 }, { name: 'Feed', energy: 28 }, { name: 'Profile', energy: 8 },
  { name: 'Camera', energy: 67 }, { name: 'Settings', energy: 5 }, { name: 'Map View', energy: 52 },
];

export default function EnergyMetricsPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  const totalScore = Math.round(100 - (METRICS.reduce((s, m) => s + m.value, 0) / 4));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2"><BatteryCharging className="w-5 h-5 text-emerald-400" /><h3 className="text-sm font-semibold text-slate-100">Energy Metrics</h3></div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X className="w-5 h-5" /></button>
        </div>
        <div className="grid grid-cols-2 gap-2 px-5 py-3 border-b border-slate-800">
          <div className="rounded-lg bg-emerald-500/10 p-3 text-center"><p className="text-2xl font-bold text-emerald-400">{totalScore}</p><p className="text-[10px] text-slate-500">Energy Score</p></div>
          <div className="rounded-lg bg-slate-800/50 p-3 text-center"><p className="text-2xl font-bold text-slate-200">3.2h</p><p className="text-[10px] text-slate-500">Est. Impact/hr</p></div>
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-4">
          <div>
            <h4 className="text-xs text-slate-500 uppercase tracking-wider mb-2">Component Breakdown</h4>
            <div className="space-y-2">
              {METRICS.map(m => (
                <div key={m.component} className="rounded-lg border border-slate-800 bg-slate-950/40 p-3">
                  <div className="flex items-center justify-between mb-1.5"><div className="flex items-center gap-2"><m.icon className={`w-3.5 h-3.5 ${m.color}`} /><span className="text-xs text-slate-300">{m.component}</span></div><span className="text-xs font-mono text-slate-200">{m.value}{m.unit}</span></div>
                  <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden"><div className={`h-full rounded-full ${m.barColor}`} style={{ width: `${m.value}%` }} /></div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-xs text-slate-500 uppercase tracking-wider mb-2">Per-Screen Energy Impact</h4>
            <div className="space-y-1.5">
              {SCREENS.map(s => (
                <div key={s.name} className="flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-950/40 p-2.5">
                  <span className="text-xs text-slate-300 flex-1">{s.name}</span>
                  <div className="w-20 h-1.5 rounded-full bg-slate-800 overflow-hidden"><div className={`h-full rounded-full ${s.energy > 40 ? 'bg-red-500' : s.energy > 20 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${s.energy}%` }} /></div>
                  <span className={`text-xs font-mono w-8 text-right ${s.energy > 40 ? 'text-red-400' : s.energy > 20 ? 'text-amber-400' : 'text-emerald-400'}`}>{s.energy}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
