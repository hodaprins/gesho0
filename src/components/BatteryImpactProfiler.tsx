import { BatteryMedium, X, Cpu, MapPin, Globe, Sun } from 'lucide-react';
import type { AppRegion } from '@/types/builder';

interface BatteryImpactProfilerProps {
  open: boolean;
  onClose: () => void;
  regions: AppRegion[];
}

interface ScreenImpact {
  name: string;
  cpu: number;
  gps: number;
  network: number;
  brightness: number;
  mwh: number;
}

function deriveImpact(region: AppRegion): ScreenImpact {
  const els = region.spec.elements;
  const cpu = 15 + els.length * 4 + (els.some((e) => e.kind === 'image') ? 20 : 0);
  const gps = els.some((e) => e.label?.toLowerCase().includes('location')) ? 35 : 4;
  const network = els.filter((e) => e.kind === 'list' || e.kind === 'card').length * 12 + 8;
  const brightness = els.some((e) => e.kind === 'image') ? 55 : 30;
  const mwh = Math.round((cpu * 0.4 + gps * 0.5 + network * 0.3 + brightness * 0.2) * 10) / 10;
  return { name: region.region_name, cpu, gps, network, brightness, mwh };
}

const FACTORS = [
  { key: 'cpu', label: 'CPU', icon: Cpu, color: 'bg-cyan-500' },
  { key: 'gps', label: 'GPS', icon: MapPin, color: 'bg-emerald-500' },
  { key: 'network', label: 'Network', icon: Globe, color: 'bg-violet-500' },
  { key: 'brightness', label: 'Brightness', icon: Sun, color: 'bg-amber-500' },
] as const;

export default function BatteryImpactProfiler({ open, onClose, regions }: BatteryImpactProfilerProps) {
  if (!open) return null;
  const impacts = regions.map(deriveImpact);
  const maxMwh = Math.max(...impacts.map((i) => i.mwh), 1);
  const totalMwh = impacts.reduce((s, i) => s + i.mwh, 0);
  const worst = [...impacts].sort((a, b) => b.mwh - a.mwh)[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <BatteryMedium className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-semibold text-slate-100">Battery Impact Profiler</h3>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X className="w-5 h-5" /></button>
        </div>

        <div className="grid grid-cols-3 gap-2 px-5 py-3 border-b border-slate-800">
          <div className="rounded-lg bg-slate-800/50 p-2 text-center"><p className="text-lg font-bold text-slate-100">{totalMwh.toFixed(1)}</p><p className="text-[10px] text-slate-500">Total mWh</p></div>
          <div className="rounded-lg bg-slate-800/50 p-2 text-center"><p className="text-lg font-bold text-slate-100">{impacts.length}</p><p className="text-[10px] text-slate-500">Screens</p></div>
          <div className="rounded-lg bg-slate-800/50 p-2 text-center"><p className="text-lg font-bold text-amber-400 truncate" title={worst?.name}>{worst?.name ?? '—'}</p><p className="text-[10px] text-slate-500">Worst screen</p></div>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-3">
          {impacts.map((imp, i) => (
            <div key={i} className="rounded-xl border border-slate-800 bg-slate-800/30 p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-200 truncate">{imp.name}</span>
                <span className="text-xs font-mono text-emerald-400">{imp.mwh} mWh</span>
              </div>
              <div className="flex items-end gap-1.5 h-16 mb-2">
                {FACTORS.map((f) => {
                  const val = imp[f.key];
                  return (
                    <div key={f.key} className="flex-1 flex flex-col items-center gap-1">
                      <div className="w-full bg-slate-800 rounded-t flex items-end h-full">
                        <div className={`w-full ${f.color} rounded-t transition-all duration-500`} style={{ height: `${Math.min(val, 100)}%` }} />
                      </div>
                      <f.icon className="w-3 h-3 text-slate-600" />
                    </div>
                  );
                })}
              </div>
              <div className="flex items-center gap-3 text-[10px] text-slate-500">
                <span>CPU {imp.cpu}%</span><span>GPS {imp.gps}%</span><span>Net {imp.network}%</span><span>Bright {imp.brightness}%</span>
              </div>
              <div className="mt-2 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-amber-500" style={{ width: `${(imp.mwh / maxMwh) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
