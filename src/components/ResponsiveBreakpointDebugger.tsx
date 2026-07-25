import { Monitor, X, Smartphone, Tablet, AlertTriangle, Check } from 'lucide-react';
import { useState } from 'react';
import type { ColorScheme } from '@/types/builder';

const BREAKPOINTS = [
  { name: 'XS', width: 320, label: 'Small Phone', icon: '📱' },
  { name: 'SM', width: 375, label: 'iPhone SE', icon: '📱' },
  { name: 'MD', width: 768, label: 'Tablet', icon: '📟' },
  { name: 'LG', width: 1024, label: 'Laptop', icon: '💻' },
  { name: 'XL', width: 1440, label: 'Desktop', icon: '🖥️' },
];

interface BreakpointIssue {
  breakpoint: string;
  issue: string;
  severity: 'warning' | 'error';
}

const ISSUES: BreakpointIssue[] = [
  { breakpoint: 'XS', issue: 'Button text overflows container', severity: 'error' },
  { breakpoint: 'XS', issue: 'Header title truncated', severity: 'warning' },
  { breakpoint: 'SM', issue: 'Image aspect ratio distorts', severity: 'warning' },
  { breakpoint: 'MD', issue: 'Two-column layout collapses too early', severity: 'warning' },
  { breakpoint: 'LG', issue: 'Excessive whitespace on right side', severity: 'warning' },
];

interface ResponsiveBreakpointDebuggerProps {
  open: boolean;
  onClose: () => void;
  colorScheme: ColorScheme;
  appName: string;
}

export default function ResponsiveBreakpointDebugger({ open, onClose, colorScheme, appName }: ResponsiveBreakpointDebuggerProps) {
  const [active, setActive] = useState(1);
  if (!open) return null;
  const current = BREAKPOINTS[active];
  const bpIssues = ISSUES.filter((i) => i.breakpoint === current.name);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2"><Monitor className="w-5 h-5 text-cyan-400" /><h3 className="text-sm font-semibold text-slate-100">Breakpoint Debugger</h3></div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X className="w-5 h-5" /></button>
        </div>

        <div className="flex items-center gap-1.5 px-5 py-2 border-b border-slate-800 overflow-x-auto scrollbar-thin">
          {BREAKPOINTS.map((bp, i) => <button key={bp.name} onClick={() => setActive(i)} className={`text-xs px-2.5 py-1 rounded-full whitespace-nowrap ${i === active ? 'bg-slate-800 text-slate-100' : 'text-slate-500'}`}>{bp.icon} {bp.name} ({bp.width}px)</button>)}
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin p-4">
          <div className="flex justify-center mb-4">
            <div className="rounded-lg border-2 border-slate-700 overflow-hidden transition-all duration-300" style={{ width: `${Math.min(current.width * 0.35, 280)}px`, backgroundColor: colorScheme.background }}>
              <div className="p-3 space-y-2" style={{ color: colorScheme.text }}>
                <div className="text-center py-2 text-xs font-bold" style={{ color: colorScheme.primary }}>{appName}</div>
                <div className="rounded-lg p-2 text-[10px] text-center" style={{ backgroundColor: colorScheme.surface }}>Header</div>
                <div className="grid grid-cols-2 gap-1"><div className="rounded p-2 text-[8px] text-center" style={{ backgroundColor: colorScheme.surface }}>Card 1</div><div className="rounded p-2 text-[8px] text-center" style={{ backgroundColor: colorScheme.surface }}>Card 2</div></div>
                <div className="rounded-lg p-2 text-[10px] text-center" style={{ backgroundColor: colorScheme.primary, color: '#fff' }}>Button</div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs"><span className="text-slate-400">{current.label}</span><span className="text-slate-500 font-mono">{current.width}px</span></div>
            {bpIssues.length === 0 ? <div className="flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-3"><Check className="w-4 h-4 text-emerald-400" /><span className="text-xs text-emerald-400">No issues at this breakpoint!</span></div> : bpIssues.map((issue, i) => (
              <div key={i} className={`flex items-center gap-2 rounded-lg border p-3 ${issue.severity === 'error' ? 'border-red-500/30 bg-red-500/5' : 'border-amber-500/30 bg-amber-500/5'}`}>
                <AlertTriangle className={`w-3.5 h-3.5 ${issue.severity === 'error' ? 'text-red-400' : 'text-amber-400'}`} />
                <span className="text-xs text-slate-300">{issue.issue}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
