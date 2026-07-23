import { useState } from 'react';
import { Palette, X, Plus, Trash2, Copy } from 'lucide-react';
import type { ColorScheme } from '@/types/builder';

interface DesignToken {
  id: string;
  name: string;
  value: string;
  category: 'color' | 'spacing' | 'radius' | 'font' | 'shadow';
}

interface DesignTokensManagerProps {
  open: boolean;
  onClose: () => void;
  colorScheme: ColorScheme;
}

const INITIAL_TOKENS: DesignToken[] = [
  { id: '1', name: 'color.primary', value: '#0f766e', category: 'color' },
  { id: '2', name: 'color.secondary', value: '#14b8a6', category: 'color' },
  { id: '3', name: 'color.accent', value: '#f59e0b', category: 'color' },
  { id: '4', name: 'color.background', value: '#f0fdfa', category: 'color' },
  { id: '5', name: 'color.surface', value: '#ffffff', category: 'color' },
  { id: '6', name: 'spacing.xs', value: '4px', category: 'spacing' },
  { id: '7', name: 'spacing.sm', value: '8px', category: 'spacing' },
  { id: '8', name: 'spacing.md', value: '16px', category: 'spacing' },
  { id: '9', name: 'spacing.lg', value: '24px', category: 'spacing' },
  { id: '10', name: 'radius.sm', value: '6px', category: 'radius' },
  { id: '11', name: 'radius.md', value: '12px', category: 'radius' },
  { id: '12', name: 'radius.lg', value: '20px', category: 'radius' },
  { id: '13', name: 'font.size.body', value: '14px', category: 'font' },
  { id: '14', name: 'font.size.heading', value: '24px', category: 'font' },
  { id: '15', name: 'shadow.card', value: '0 2px 8px rgba(0,0,0,0.1)', category: 'shadow' },
];

const CATEGORIES = ['color', 'spacing', 'radius', 'font', 'shadow'] as const;
const CAT_ICONS: Record<string, React.ReactNode> = { color: <Palette className="w-3 h-3" />, spacing: <div className="w-3 h-3" />, radius: <div className="w-3 h-3 rounded-full border" />, font: <div className="w-3 h-3" />, shadow: <div className="w-3 h-3 rounded bg-slate-600" /> };

export default function DesignTokensManager({ open, onClose }: DesignTokensManagerProps) {
  const [tokens, setTokens] = useState<DesignToken[]>(INITIAL_TOKENS);
  const [activeCat, setActiveCat] = useState<string>('all');
  if (!open) return null;

  const filtered = activeCat === 'all' ? tokens : tokens.filter((t) => t.category === activeCat);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-cyan-400" />
            <h3 className="text-sm font-semibold text-slate-100">Design Tokens</h3>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X className="w-5 h-5" /></button>
        </div>

        <div className="flex items-center gap-1.5 px-5 py-2 border-b border-slate-800">
          <button onClick={() => setActiveCat('all')} className={`text-xs px-2 py-1 rounded-full ${activeCat === 'all' ? 'bg-slate-800 text-slate-100' : 'text-slate-500'}`}>All</button>
          {CATEGORIES.map((c) => <button key={c} onClick={() => setActiveCat(c)} className={`text-xs px-2 py-1 rounded-full capitalize ${activeCat === c ? 'bg-slate-800 text-slate-100' : 'text-slate-500'}`}>{c}</button>)}
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-1">
          {filtered.map((token) => (
            <div key={token.id} className="group flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-950/40 px-3 py-2">
              {token.category === 'color' && <div className="w-4 h-4 rounded border border-slate-700 shrink-0" style={{ backgroundColor: token.value }} />}
              <div className="flex-1">
                <p className="text-xs font-mono text-slate-300">{token.name}</p>
              </div>
              <code className="text-xs font-mono text-cyan-400">{token.value}</code>
              <button onClick={() => navigator.clipboard.writeText(token.value)} className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-slate-300 transition-all"><Copy className="w-3 h-3" /></button>
              <button onClick={() => setTokens((p) => p.filter((t) => t.id !== token.id))} className="opacity-0 group-hover:opacity-100 text-slate-600 hover:text-red-400 transition-all"><Trash2 className="w-3 h-3" /></button>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 px-5 py-3 border-t border-slate-800">
          <button onClick={() => setTokens((p) => [...p, { id: crypto.randomUUID(), name: 'new.token', value: '', category: 'color' }])} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-medium hover:bg-slate-700"><Plus className="w-3.5 h-3.5" /> Add token</button>
          <span className="text-xs text-slate-500">{tokens.length} tokens</span>
        </div>
      </div>
    </div>
  );
}
