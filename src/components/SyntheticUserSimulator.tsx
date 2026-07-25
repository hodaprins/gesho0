import { Bot, X, Play, Square, AlertTriangle, Check, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import type { AppRegion, ColorScheme } from '@/types/builder';

interface BotSession {
  id: string;
  persona: string;
  steps: { screen: string; action: string; result: 'success' | 'confused' | 'stuck'; note: string }[];
  status: 'running' | 'completed';
  confusionPoints: number;
}

const BOTS = [
  { id: 'firsttime', name: 'First-time user', color: 'text-cyan-400' },
  { id: 'returning', name: 'Returning user', color: 'text-emerald-400' },
  { id: 'elderly', name: 'Elderly user', color: 'text-amber-400' },
];

interface SyntheticUserSimulatorProps {
  open: boolean;
  onClose: () => void;
  regions: AppRegion[];
  colorScheme: ColorScheme;
  appName: string;
}

export default function SyntheticUserSimulator({ open, onClose, regions, colorScheme, appName }: SyntheticUserSimulatorProps) {
  const [sessions, setSessions] = useState<BotSession[]>([]);
  const [running, setRunning] = useState(false);
  const [activeBot, setActiveBot] = useState(0);

  useEffect(() => { if (open && sessions.length === 0) runAll(); }, [open]);

  if (!open) return null;

  const runAll = () => {
    setRunning(true);
    setSessions([]);
    BOTS.forEach((bot, bi) => {
      setTimeout(() => {
        const steps = regions.slice(0, 5).map((r, si) => {
          const isConfused = si === 2 && bi === 2;
          const isStuck = si === 3 && bi === 0 && !r.spec.elements.some((e) => e.kind === 'button');
          return { screen: r.region_name, action: ['Tapped button', 'Entered text', 'Scrolled down', 'Tapped link', 'Viewed content'][si] ?? 'Interacted', result: (isConfused ? 'confused' : isStuck ? 'stuck' : 'success') as 'success' | 'confused' | 'stuck', note: isConfused ? 'Unclear what to do next' : isStuck ? 'No button to proceed' : 'Completed smoothly' };
        });
        setSessions((prev) => [...prev, { id: bot.id, persona: bot.name, steps, status: 'completed', confusionPoints: steps.filter((s) => s.result !== 'success').length }]);
        if (bi === BOTS.length - 1) setRunning(false);
      }, (bi + 1) * 800);
    });
  };

  const totalConfusion = sessions.reduce((s, sess) => s + sess.confusionPoints, 0);
  const current = sessions[activeBot];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2"><Bot className="w-5 h-5 text-purple-400" /><h3 className="text-sm font-semibold text-slate-100">Synthetic User Simulator</h3></div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X className="w-5 h-5" /></button>
        </div>

        <div className="grid grid-cols-3 gap-2 px-5 py-3 border-b border-slate-800">
          <div className="rounded-lg bg-slate-800/50 p-2 text-center"><p className="text-lg font-bold text-slate-100">{sessions.length}</p><p className="text-[10px] text-slate-500">Bots Run</p></div>
          <div className="rounded-lg bg-slate-800/50 p-2 text-center"><p className="text-lg font-bold text-red-400">{totalConfusion}</p><p className="text-[10px] text-slate-500">Confusion Points</p></div>
          <div className="rounded-lg bg-slate-800/50 p-2 text-center"><p className="text-lg font-bold text-emerald-400">{sessions.length > 0 ? Math.round(((sessions.length * 5 - totalConfusion) / (sessions.length * 5)) * 100) : 0}%</p><p className="text-[10px] text-slate-500">Success Rate</p></div>
        </div>

        <div className="flex items-center gap-1.5 px-5 py-2 border-b border-slate-800">
          {sessions.map((s, i) => <button key={s.id} onClick={() => setActiveBot(i)} className={`text-xs px-2.5 py-1 rounded-full ${i === activeBot ? 'bg-slate-800 text-slate-100' : 'text-slate-500'}`}>{s.persona}</button>)}
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin p-4">
          {running && sessions.length < BOTS.length && (
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-3"><Loader2 className="w-3.5 h-3.5 text-purple-400 animate-spin" /> Running bot {sessions.length + 1} of {BOTS.length}...</div>
          )}
          {current && (
            <div className="space-y-2">
              {current.steps.map((step, i) => (
                <div key={i} className={`rounded-xl border p-3 animate-fade-in-up ${step.result === 'success' ? 'border-slate-800 bg-slate-950/40' : step.result === 'confused' ? 'border-amber-500/30 bg-amber-500/5' : 'border-red-500/30 bg-red-500/5'}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-400">{i + 1}</span>
                    <span className="text-xs text-slate-300 flex-1">{step.action} on {step.screen}</span>
                    {step.result === 'success' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <AlertTriangle className={`w-3.5 h-3.5 ${step.result === 'confused' ? 'text-amber-400' : 'text-red-400'}`} />}
                  </div>
                  {step.result !== 'success' && <p className="text-[10px] text-slate-500 ml-7">{step.note}</p>}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 px-5 py-3 border-t border-slate-800">
          <button onClick={runAll} disabled={running} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-cyan-500 text-slate-900 text-xs font-semibold disabled:opacity-40">{running ? <Square className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}{running ? 'Running...' : 'Run all bots'}</button>
        </div>
      </div>
    </div>
  );
}
