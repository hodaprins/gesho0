import { useState } from 'react';
import { Wifi, X, WifiOff, Activity, Zap } from 'lucide-react';

interface NetworkConditionSimulatorProps {
  open: boolean;
  onClose: () => void;
}

interface NetworkProfile {
  id: string;
  label: string;
  latency: string;
  bandwidth: string;
  packetLoss: string;
  color: string;
  bar: number;
}

const PROFILES: NetworkProfile[] = [
  { id: '2g', label: '2G', latency: '800 ms', bandwidth: '35 Kbps', packetLoss: '2.0%', color: 'from-rose-500 to-red-500', bar: 15 },
  { id: '3g', label: '3G', latency: '400 ms', bandwidth: '400 Kbps', packetLoss: '1.0%', color: 'from-amber-500 to-orange-500', bar: 40 },
  { id: '4g', label: '4G LTE', latency: '100 ms', bandwidth: '10 Mbps', packetLoss: '0.3%', color: 'from-cyan-500 to-blue-500', bar: 70 },
  { id: '5g', label: '5G', latency: '20 ms', bandwidth: '200 Mbps', packetLoss: '0.1%', color: 'from-emerald-500 to-teal-500', bar: 95 },
  { id: 'offline', label: 'Offline', latency: '—', bandwidth: '0 Kbps', packetLoss: '100%', color: 'from-slate-600 to-slate-700', bar: 0 },
];

export default function NetworkConditionSimulator({ open, onClose }: NetworkConditionSimulatorProps) {
  const [active, setActive] = useState('4g');
  if (!open) return null;
  const current = PROFILES.find((p) => p.id === active)!;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Wifi className="w-5 h-5 text-cyan-400" />
            <h3 className="text-sm font-semibold text-slate-100">Network Condition Simulator</h3>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X className="w-5 h-5" /></button>
        </div>

        <div className="px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider">Active profile</span>
          </div>
          <div className="flex items-center justify-between rounded-xl bg-slate-800/50 p-3">
            <div className="flex items-center gap-3">
              {active === 'offline' ? <WifiOff className="w-6 h-6 text-slate-400" /> : <Zap className="w-6 h-6 text-emerald-400" />}
              <div>
                <p className="text-sm font-bold text-slate-100">{current.label}</p>
                <p className="text-[10px] text-slate-500">{current.latency} · {current.bandwidth}</p>
              </div>
            </div>
            <div className="h-2 w-28 rounded-full bg-slate-700 overflow-hidden">
              <div className={`h-full rounded-full bg-gradient-to-r ${current.color} transition-all duration-500`} style={{ width: `${current.bar}%` }} />
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-2">
          {PROFILES.map((p) => {
            const selected = p.id === active;
            return (
              <button
                key={p.id}
                onClick={() => setActive(p.id)}
                className={`w-full text-left rounded-xl border p-3 transition-all ${selected ? 'border-cyan-500/50 bg-cyan-500/5' : 'border-slate-800 bg-slate-800/30 hover:border-slate-700'}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {p.id === 'offline' ? <WifiOff className="w-4 h-4 text-slate-500" /> : <Activity className="w-4 h-4 text-cyan-400" />}
                    <span className="text-xs font-semibold text-slate-200">{p.label}</span>
                    {selected && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400">active</span>}
                  </div>
                  <div className={`h-1.5 w-16 rounded-full overflow-hidden`}>
                    <div className={`h-full rounded-full bg-gradient-to-r ${p.color}`} style={{ width: `${p.bar}%` }} />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-[10px]">
                  <div><p className="text-slate-600">Latency</p><p className="text-slate-300 font-mono">{p.latency}</p></div>
                  <div><p className="text-slate-600">Bandwidth</p><p className="text-slate-300 font-mono">{p.bandwidth}</p></div>
                  <div><p className="text-slate-600">Packet loss</p><p className={`font-mono ${parseFloat(p.packetLoss) > 1 ? 'text-rose-400' : 'text-slate-300'}`}>{p.packetLoss}</p></div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
