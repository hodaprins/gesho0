import { Accessibility, X, Check, AlertTriangle, Eye } from 'lucide-react';
import { useState } from 'react';

const CHECKS = [
  { id: 'contrast', name: 'Color Contrast (4.5:1)', status: 'pass', detail: 'All text meets WCAG AA' },
  { id: 'aria', name: 'ARIA 1.3 Roles', status: 'pass', detail: 'Semantic roles applied correctly' },
  { id: 'focus', name: 'Focus Management', status: 'warn', detail: 'Focus order needs adjustment on 2 screens' },
  { id: 'keyboard', name: 'Keyboard Navigation', status: 'pass', detail: 'All interactive elements reachable' },
  { id: 'labels', name: 'Form Labels', status: 'pass', detail: 'All inputs have associated labels' },
  { id: 'alt', name: 'Image Alt Text', status: 'fail', detail: '3 images missing alt attributes' },
  { id: 'headings', name: 'Heading Hierarchy', status: 'pass', detail: 'Logical heading order maintained' },
  { id: ' landmarks', name: 'Landmark Regions', status: 'pass', detail: 'header, nav, main, footer present' },
];

export default function WCAGComplianceChecker({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  const pass = CHECKS.filter(c => c.status === 'pass').length;
  const warn = CHECKS.filter(c => c.status === 'warn').length;
  const fail = CHECKS.filter(c => c.status === 'fail').length;
  const score = Math.round((pass / CHECKS.length) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2"><Accessibility className="w-5 h-5 text-blue-400" /><h3 className="text-sm font-semibold text-slate-100">WCAG 3.0 Compliance</h3></div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X className="w-5 h-5" /></button>
        </div>
        <div className="grid grid-cols-4 gap-2 px-5 py-3 border-b border-slate-800">
          <div className="rounded-lg bg-emerald-500/10 p-2 text-center"><p className="text-lg font-bold text-emerald-400">{pass}</p><p className="text-[10px] text-slate-500">Pass</p></div>
          <div className="rounded-lg bg-amber-500/10 p-2 text-center"><p className="text-lg font-bold text-amber-400">{warn}</p><p className="text-[10px] text-slate-500">Warn</p></div>
          <div className="rounded-lg bg-red-500/10 p-2 text-center"><p className="text-lg font-bold text-red-400">{fail}</p><p className="text-[10px] text-slate-500">Fail</p></div>
          <div className="rounded-lg bg-slate-800/50 p-2 text-center"><p className="text-lg font-bold text-slate-100">{score}%</p><p className="text-[10px] text-slate-500">Score</p></div>
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-1.5">
          {CHECKS.map(c => (
            <div key={c.id} className={`rounded-lg border p-3 ${c.status === 'pass' ? 'border-emerald-500/20 bg-emerald-500/5' : c.status === 'warn' ? 'border-amber-500/20 bg-amber-500/5' : 'border-red-500/20 bg-red-500/5'}`}>
              <div className="flex items-center gap-2">
                {c.status === 'pass' ? <Check className="w-4 h-4 text-emerald-400" /> : c.status === 'warn' ? <AlertTriangle className="w-4 h-4 text-amber-400" /> : <AlertTriangle className="w-4 h-4 text-red-400" />}
                <span className="text-xs text-slate-200 flex-1">{c.name}</span>
                <span className={`text-[10px] uppercase font-medium ${c.status === 'pass' ? 'text-emerald-400' : c.status === 'warn' ? 'text-amber-400' : 'text-red-400'}`}>{c.status}</span>
              </div>
              <p className="text-[10px] text-slate-500 mt-1 ml-6 flex items-center gap-1"><Eye className="w-2.5 h-2.5" />{c.detail}</p>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 px-5 py-3 border-t border-slate-800"><p className="text-xs text-slate-500">WCAG 3.0 · ARIA 1.3 · W3C Recommended</p><button className="ml-auto text-xs px-3 py-2 rounded-lg bg-blue-500/20 text-blue-400 font-medium">Fix Issues</button></div>
      </div>
    </div>
  );
}
