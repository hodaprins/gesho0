import { Gauge, X, AlertTriangle, Check, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import type { AppRegion } from '@/types/builder';

interface FrictionPoint {
  screen: string;
  issue: string;
  severity: 'high' | 'medium' | 'low';
  fix: string;
  frictionScore: number;
}

function detectFriction(regions: AppRegion[]): FrictionPoint[] {
  const points: FrictionPoint[] = [];
  regions.forEach((r) => {
    const els = r.spec.elements;
    const inputs = els.filter((e) => e.kind === 'input').length;
    if (inputs > 3) points.push({ screen: r.region_name, issue: `${inputs} input fields may overwhelm users`, severity: 'high', fix: 'Split into multi-step form', frictionScore: 25 });
    const buttons = els.filter((e) => e.kind === 'button').length;
    if (buttons > 4) points.push({ screen: r.region_name, issue: `${buttons} buttons create decision paralysis`, severity: 'medium', fix: 'Prioritize one primary CTA', frictionScore: 15 });
    if (els.length > 8) points.push({ screen: r.region_name, issue: 'Too many elements on screen', severity: 'medium', fix: 'Use progressive disclosure', frictionScore: 18 });
    if (!els.some((e) => e.kind === 'button')) points.push({ screen: r.region_name, issue: 'No clear call-to-action', severity: 'high', fix: 'Add a primary action button', frictionScore: 22 });
  });
  return points;
}

interface AIFrictionScoreProps {
  open: boolean;
  onClose: () => void;
  regions: AppRegion[];
}

const SEV_COLOR: Record<string, string> = { high: 'text-red-400', medium: 'text-amber-400', low: 'text-slate-400' };

export default function AIFrictionScore({ open, onClose, regions }: AIFrictionScoreProps) {
  const [expanded, setExpanded] = useState<number | null>(null);
  if (!open) return null;

  const points = detectFriction(regions);
  const totalFriction = points.reduce((s, p) => s + p.frictionScore, 0);
  const score = Math.max(0, 100 - totalFriction);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2"><Gauge className="w-5 h-5 text-purple-400" /><h3 className="text-sm font-semibold text-slate-100">UX Friction Score</h3></div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X className="w-5 h-5" /></button>
        </div>

        <div className="px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-4">
            <div className="relative w-20 h-20 shrink-0">
              <svg className="w-full h-full -rotate-90">
                <circle cx="40" cy="40" r="34" fill="none" stroke="#1e293b" strokeWidth="6" />
                <circle cx="40" cy="40" r="34" fill="none" stroke={score > 70 ? '#10b981' : score > 40 ? '#f59e0b' : '#ef4444'} strokeWidth="6" strokeDasharray={`${(score / 100) * 213.6} 213.6`} strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center"><span className={`text-xl font-bold ${score > 70 ? 'text-emerald-400' : score > 40 ? 'text-amber-400' : 'text-red-400'}`}>{score}</span></div>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-200">Overall Friction Score</p>
              <p className="text-xs text-slate-500">{score > 70 ? 'Smooth experience — minimal friction detected' : score > 40 ? 'Moderate friction — some improvements needed' : 'High friction — users will struggle'}</p>
              <p className="text-xs text-slate-500 mt-1">{points.length} friction points found across {new Set(points.map((p) => p.screen)).size} screens</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-2">
          {points.length === 0 ? (
            <div className="text-center py-12"><Check className="w-12 h-12 text-emerald-400 mx-auto mb-2" /><p className="text-sm text-slate-300">No friction detected! Your app flows smoothly.</p></div>
          ) : points.map((p, i) => (
            <div key={i} className="rounded-xl border border-slate-800 bg-slate-950/40 overflow-hidden">
              <button onClick={() => setExpanded(expanded === i ? null : i)} className="w-full flex items-center gap-3 p-3 text-left">
                <AlertTriangle className={`w-4 h-4 ${SEV_COLOR[p.severity]} shrink-0`} />
                <div className="flex-1"><p className="text-sm text-slate-200">{p.issue}</p><p className="text-[10px] text-slate-500">{p.screen}</p></div>
                <span className={`text-xs font-mono ${SEV_COLOR[p.severity]}`}>-{p.frictionScore}</span>
              </button>
              {expanded === i && (
                <div className="border-t border-slate-800 p-3 flex items-center gap-2"><ArrowRight className="w-3.5 h-3.5 text-emerald-400" /><p className="text-xs text-slate-400">Fix: {p.fix}</p></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
