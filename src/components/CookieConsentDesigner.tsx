import { useState } from 'react';
import { Cookie, X, Check } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  description: string;
  required: boolean;
  enabled: boolean;
}

interface CookieConsentDesignerProps {
  open: boolean;
  onClose: () => void;
}

const POSITIONS = ['bottom', 'top', 'center'] as const;
type Position = typeof POSITIONS[number];

export default function CookieConsentDesigner({ open, onClose }: CookieConsentDesignerProps) {
  const [position, setPosition] = useState<Position>('bottom');
  const [style, setStyle] = useState<'bar' | 'modal' | 'floating'>('bar');
  const [cats, setCats] = useState<Category[]>([
    { id: 'nec', name: 'Necessary', description: 'Auth, security, session — always on', required: true, enabled: true },
    { id: 'ana', name: 'Analytics', description: 'Anonymized usage metrics', required: false, enabled: true },
    { id: 'mkt', name: 'Marketing', description: 'Personalized ads & tracking', required: false, enabled: false },
  ]);
  if (!open) return null;

  const toggle = (id: string) => setCats((p) => p.map((c) => c.id === id && !c.required ? { ...c, enabled: !c.enabled } : c));
  const enabledCount = cats.filter((c) => c.enabled).length;

  const previewPos: Record<Position, string> = { bottom: 'absolute bottom-2 left-2 right-2', top: 'absolute top-2 left-2 right-2', center: 'absolute inset-0 flex items-center justify-center' };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2"><Cookie className="w-5 h-5 text-amber-400" /><h3 className="text-sm font-semibold text-slate-100">Cookie Consent Designer</h3></div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X className="w-5 h-5" /></button>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-4">
          <div>
            <p className="text-[10px] uppercase text-slate-500 mb-1.5">Position</p>
            <div className="flex gap-1.5">
              {POSITIONS.map((p) => <button key={p} onClick={() => setPosition(p)} className={`px-3 py-1.5 rounded-lg text-xs capitalize transition-all ${position === p ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-800 text-slate-400 hover:text-slate-200'}`}>{p}</button>)}
            </div>
          </div>
          <div>
            <p className="text-[10px] uppercase text-slate-500 mb-1.5">Style</p>
            <div className="flex gap-1.5">
              {(['bar', 'modal', 'floating'] as const).map((s) => <button key={s} onClick={() => setStyle(s)} className={`px-3 py-1.5 rounded-lg text-xs capitalize transition-all ${style === s ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-800 text-slate-400 hover:text-slate-200'}`}>{s}</button>)}
            </div>
          </div>

          <div>
            <p className="text-[10px] uppercase text-slate-500 mb-1.5">Categories</p>
            <div className="space-y-2">
              {cats.map((c) => (
                <div key={c.id} className="rounded-xl border border-slate-800 bg-slate-950/40 p-3 flex items-center gap-3">
                  <button onClick={() => toggle(c.id)} disabled={c.required} className={`w-9 h-5 rounded-full flex items-center transition-all ${c.enabled ? 'bg-emerald-500/30' : 'bg-slate-700'} ${c.required ? 'opacity-60 cursor-not-allowed' : ''}`}>
                    <span className={`w-3.5 h-3.5 rounded-full bg-white transition-all ${c.enabled ? 'translate-x-4' : 'translate-x-1'}`} />
                  </button>
                  <div className="flex-1">
                    <div className="flex items-center gap-1.5"><p className="text-sm font-medium text-slate-200">{c.name}</p>{c.required && <span className="text-[9px] px-1 rounded bg-slate-700 text-slate-400">Required</span>}</div>
                    <p className="text-[11px] text-slate-500">{c.description}</p>
                  </div>
                  {c.enabled && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[10px] uppercase text-slate-500 mb-1.5">Preview</p>
            <div className="relative h-36 rounded-xl border border-slate-800 bg-slate-950 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-slate-800/40 to-slate-950" />
              <div className={previewPos[position]}>
                <div className={`${style === 'floating' ? 'mx-auto w-56' : ''} rounded-lg bg-slate-800 border border-slate-700 p-2.5 shadow-xl`}>
                  <p className="text-[11px] text-slate-300">We use cookies to improve your experience.</p>
                  <div className="flex items-center gap-1.5 mt-2">
                    <button className="text-[10px] px-2 py-1 rounded bg-emerald-500 text-slate-900 font-medium">Accept all</button>
                    <button className="text-[10px] px-2 py-1 rounded bg-slate-700 text-slate-300">Manage</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center px-5 py-3 border-t border-slate-800">
          <span className="text-xs text-slate-500">{enabledCount} of {cats.length} categories enabled</span>
          <button className="ml-auto inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-slate-900 text-xs font-semibold">Deploy banner</button>
        </div>
      </div>
    </div>
  );
}
