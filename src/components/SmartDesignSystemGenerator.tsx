import { Wand2, X, Upload, Loader2, Check, Palette } from 'lucide-react';
import { useState } from 'react';
import type { ColorScheme } from '@/types/builder';

interface GeneratedToken {
  category: string;
  tokens: { name: string; value: string }[];
}

interface SmartDesignSystemGeneratorProps {
  open: boolean;
  onClose: () => void;
  colorScheme: ColorScheme;
}

export default function SmartDesignSystemGenerator({ open, onClose, colorScheme }: SmartDesignSystemGeneratorProps) {
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  if (!open) return null;

  const generate = () => { setGenerating(true); setTimeout(() => { setGenerating(false); setGenerated(true); }, 1800); };

  const tokens: GeneratedToken[] = [
    { category: 'Colors', tokens: [{ name: 'primary', value: colorScheme.primary }, { name: 'secondary', value: colorScheme.secondary }, { name: 'accent', value: colorScheme.accent }, { name: 'background', value: colorScheme.background }, { name: 'surface', value: colorScheme.surface }, { name: 'text', value: colorScheme.text }] },
    { category: 'Typography', tokens: [{ name: 'fontFamily', value: 'Inter, sans-serif' }, { name: 'headingSize', value: '24px' }, { name: 'bodySize', value: '14px' }, { name: 'captionSize', value: '12px' }] },
    { category: 'Spacing', tokens: [{ name: 'xs', value: '4px' }, { name: 'sm', value: '8px' }, { name: 'md', value: '16px' }, { name: 'lg', value: '24px' }, { name: 'xl', value: '32px' }] },
    { category: 'Radius', tokens: [{ name: 'sm', value: '6px' }, { name: 'md', value: '12px' }, { name: 'lg', value: '20px' }, { name: 'full', value: '9999px' }] },
    { category: 'Shadows', tokens: [{ name: 'sm', value: '0 1px 3px rgba(0,0,0,0.1)' }, { name: 'md', value: '0 4px 12px rgba(0,0,0,0.15)' }, { name: 'lg', value: '0 8px 24px rgba(0,0,0,0.2)' }] },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2"><Wand2 className="w-5 h-5 text-purple-400" /><h3 className="text-sm font-semibold text-slate-100">Design System Generator</h3></div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X className="w-5 h-5" /></button>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-4">
          {!generated && !generating && (
            <div className="text-center py-8">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 flex items-center justify-center mx-auto mb-4"><Palette className="w-10 h-10 text-purple-400" /></div>
              <p className="text-sm text-slate-300 mb-1">Generate a complete design system</p>
              <p className="text-xs text-slate-500 mb-4">From your current color scheme, we'll create colors, typography, spacing, radius, and shadows</p>
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg" style={{ backgroundColor: colorScheme.primary }} />
                <div className="w-8 h-8 rounded-lg" style={{ backgroundColor: colorScheme.secondary }} />
                <div className="w-8 h-8 rounded-lg" style={{ backgroundColor: colorScheme.accent }} />
              </div>
              <button onClick={generate} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-cyan-500 text-slate-900 text-sm font-semibold"><Wand2 className="w-4 h-4" /> Generate System</button>
              <div className="mt-4 flex items-center justify-center gap-2"><Upload className="w-4 h-4 text-slate-500" /><span className="text-xs text-slate-500">Or upload a logo to derive from</span></div>
            </div>
          )}

          {generating && (
            <div className="flex flex-col items-center justify-center py-12 gap-2"><Loader2 className="w-10 h-10 text-purple-400 animate-spin" /><p className="text-xs text-slate-500">Analyzing colors and generating tokens...</p></div>
          )}

          {generated && tokens.map((cat) => (
            <div key={cat.category}>
              <h4 className="text-xs text-slate-500 uppercase tracking-wider mb-2">{cat.category}</h4>
              <div className="space-y-1">
                {cat.tokens.map((t) => (
                  <div key={t.name} className="flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-950/40 px-3 py-1.5">
                    {t.value.startsWith('#') && <div className="w-4 h-4 rounded border border-slate-700" style={{ backgroundColor: t.value }} />}
                    <code className="text-xs font-mono text-slate-300 flex-1">{t.name}</code>
                    <code className="text-xs font-mono text-cyan-400">{t.value}</code>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {generated && <div className="flex items-center gap-2 px-5 py-3 border-t border-slate-800"><button className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-900 text-xs font-semibold"><Check className="w-3.5 h-3.5" /> Apply to project</button></div>}
      </div>
    </div>
  );
}
