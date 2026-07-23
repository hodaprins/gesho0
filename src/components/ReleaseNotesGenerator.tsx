import { FileText, X, Copy, Download, Check } from 'lucide-react';
import type { AppRegion } from '@/types/builder';

interface ReleaseNotesGeneratorProps {
  open: boolean;
  onClose: () => void;
  appName: string;
  regions: AppRegion[];
  version: string;
}

const CHANGES = [
  { type: 'feature', title: 'New onboarding flow', description: 'Streamlined 3-step welcome experience for new users' },
  { type: 'feature', title: 'Dark mode support', description: 'Users can now toggle between light and dark themes' },
  { type: 'improvement', title: 'Faster screen transitions', description: 'Optimized navigation for 40% faster screen switching' },
  { type: 'improvement', title: 'Enhanced search', description: 'Search now includes fuzzy matching and suggestions' },
  { type: 'fix', title: 'Fixed crash on settings', description: 'Resolved crash when opening settings on older devices' },
  { type: 'fix', title: 'Login redirect fix', description: 'Fixed redirect loop after email verification' },
];

const TYPE_META: Record<string, { label: string; color: string }> = {
  feature: { label: 'New', color: 'bg-emerald-500/20 text-emerald-400' },
  improvement: { label: 'Improved', color: 'bg-cyan-500/20 text-cyan-400' },
  fix: { label: 'Fixed', color: 'bg-amber-500/20 text-amber-400' },
};

export default function ReleaseNotesGenerator({ open, onClose, appName, regions, version }: ReleaseNotesGeneratorProps) {
  if (!open) return null;

  const notes = `# ${appName} v${version}

## What's New
${CHANGES.filter((c) => c.type === 'feature').map((c) => `- ${c.title}: ${c.description}`).join('\n')}

## Improvements
${CHANGES.filter((c) => c.type === 'improvement').map((c) => `- ${c.title}: ${c.description}`).join('\n')}

## Bug Fixes
${CHANGES.filter((c) => c.type === 'fix').map((c) => `- ${c.title}: ${c.description}`).join('\n')}

## Screen Count: ${regions.length}
## Build: ${version}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2"><FileText className="w-5 h-5 text-cyan-400" /><h3 className="text-sm font-semibold text-slate-100">Release Notes v{version}</h3></div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X className="w-5 h-5" /></button>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin p-5 space-y-4">
          <div className="space-y-2">
            {CHANGES.map((c, i) => (
              <div key={i} className="flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-950/40 p-3">
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium shrink-0 ${TYPE_META[c.type].color}`}>{TYPE_META[c.type].label}</span>
                <div><p className="text-sm font-medium text-slate-200">{c.title}</p><p className="text-xs text-slate-500 mt-0.5">{c.description}</p></div>
              </div>
            ))}
          </div>

          <div>
            <h4 className="text-xs text-slate-500 uppercase tracking-wider mb-2">Markdown Output</h4>
            <div className="rounded-xl border border-slate-800 bg-[#0d1117] p-4">
              <pre className="text-xs font-mono text-slate-300 leading-relaxed whitespace-pre-wrap">{notes}</pre>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 px-5 py-3 border-t border-slate-800">
          <button onClick={() => navigator.clipboard.writeText(notes)} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-medium hover:bg-slate-700"><Copy className="w-3.5 h-3.5" /> Copy markdown</button>
          <button className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-medium hover:bg-slate-700"><Download className="w-3.5 h-3.5" /> Download</button>
        </div>
      </div>
    </div>
  );
}
