import { Accessibility, X, Check, AlertTriangle, XCircle } from 'lucide-react';
import type { AppRegion, ColorScheme } from '@/types/builder';

interface AccessibilityCheckerProps {
  open: boolean;
  onClose: () => void;
  regions: AppRegion[];
  colorScheme: ColorScheme;
}

interface A11yIssue {
  severity: 'high' | 'medium' | 'low';
  rule: string;
  message: string;
  screen: string;
  fix: string;
}

function contrastRatio(hex1: string, hex2: string): number {
  const lum = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const l1 = lum(hex1);
  const l2 = lum(hex2);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

function checkA11y(regions: AppRegion[], cs: ColorScheme): A11yIssue[] {
  const issues: A11yIssue[] = [];
  const ratio = contrastRatio(cs.text, cs.background);
  if (ratio < 4.5) issues.push({ severity: 'high', rule: 'WCAG 1.4.3', message: `Text contrast ratio ${ratio.toFixed(1)}:1 is below 4.5:1 minimum`, screen: 'Global', fix: 'Darken text color or lighten background' });
  const primaryRatio = contrastRatio('#ffffff', cs.primary);
  if (primaryRatio < 3) issues.push({ severity: 'medium', rule: 'WCAG 1.4.3', message: 'Primary button text contrast is low', screen: 'Global', fix: 'Use darker primary color for button text' });
  regions.forEach((r) => {
    const hasHeader = r.spec.elements.some((e) => e.kind === 'header');
    const hasInput = r.spec.elements.some((e) => e.kind === 'input');
    if (hasInput) r.spec.elements.filter((e) => e.kind === 'input').forEach((inp) => {
      if (!inp.placeholder && !inp.label) issues.push({ severity: 'medium', rule: 'WCAG 3.3.2', message: 'Input field missing label or placeholder', screen: r.region_name, fix: 'Add aria-label or visible label' });
    });
    if (hasHeader && r.spec.elements.filter((e) => e.kind === 'header').length > 1) issues.push({ severity: 'low', rule: 'WCAG 1.3.1', message: 'Multiple H1 headers on same screen', screen: r.region_name, fix: 'Use only one H1 per screen' });
  });
  if (issues.length === 0) issues.push({ severity: 'low', rule: 'PASS', message: 'No accessibility issues detected', screen: 'Global', fix: '' });
  return issues;
}

const ICONS = { high: <XCircle className="w-4 h-4 text-red-400" />, medium: <AlertTriangle className="w-4 h-4 text-amber-400" />, low: <Check className="w-4 h-4 text-emerald-400" /> };
const COLORS = { high: 'border-red-500/30 bg-red-500/5', medium: 'border-amber-500/30 bg-amber-500/5', low: 'border-emerald-500/30 bg-emerald-500/5' };

export default function AccessibilityChecker({ open, onClose, regions, colorScheme }: AccessibilityCheckerProps) {
  if (!open) return null;
  const issues = checkA11y(regions, colorScheme);
  const score = Math.max(0, 100 - issues.filter((i) => i.severity === 'high').length * 20 - issues.filter((i) => i.severity === 'medium').length * 10 - issues.filter((i) => i.severity === 'low' && i.rule !== 'PASS').length * 5);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Accessibility className="w-5 h-5 text-cyan-400" />
            <h3 className="text-sm font-semibold text-slate-100">Accessibility Checker</h3>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X className="w-5 h-5" /></button>
        </div>

        <div className="grid grid-cols-4 gap-2 px-5 py-3 border-b border-slate-800">
          <div className="rounded-lg bg-slate-800/50 p-2 text-center"><p className="text-lg font-bold text-slate-100">{score}</p><p className="text-[10px] text-slate-500">Score</p></div>
          <div className="rounded-lg bg-slate-800/50 p-2 text-center"><p className="text-lg font-bold text-red-400">{issues.filter(i => i.severity === 'high').length}</p><p className="text-[10px] text-slate-500">High</p></div>
          <div className="rounded-lg bg-slate-800/50 p-2 text-center"><p className="text-lg font-bold text-amber-400">{issues.filter(i => i.severity === 'medium').length}</p><p className="text-[10px] text-slate-500">Medium</p></div>
          <div className="rounded-lg bg-slate-800/50 p-2 text-center"><p className="text-lg font-bold text-emerald-400">{issues.filter(i => i.severity === 'low').length}</p><p className="text-[10px] text-slate-500">Low</p></div>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-2">
          {issues.map((issue, i) => (
            <div key={i} className={`rounded-xl border p-3 ${COLORS[issue.severity]}`}>
              <div className="flex items-start gap-3">
                {ICONS[issue.severity]}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-slate-200">{issue.rule}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">{issue.screen}</span>
                  </div>
                  <p className="text-xs text-slate-400">{issue.message}</p>
                  {issue.fix && <p className="text-[10px] text-slate-500 mt-1">Fix: {issue.fix}</p>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
