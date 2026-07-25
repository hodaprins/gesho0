import { Palette, X, Heart, Zap, Shield, Sparkles, TrendingUp, Moon } from 'lucide-react';
import { useState } from 'react';

interface ColorPsychology {
  id: string;
  emotion: string;
  colors: { name: string; hex: string }[];
  description: string;
  icon: React.ReactNode;
}

const PSYCHOLOGY: ColorPsychology[] = [
  { id: 'trust', emotion: 'Trust & Security', colors: [{ name: 'Ocean Blue', hex: '#0284c7' }, { name: 'Deep Navy', hex: '#1e3a8a' }], description: 'Blue tones reduce anxiety and convey reliability. Ideal for finance, healthcare, and enterprise apps.', icon: <Shield className="w-4 h-4" /> },
  { id: 'energy', emotion: 'Energy & Urgency', colors: [{ name: 'Vibrant Orange', hex: '#f97316' }, { name: 'Hot Red', hex: '#dc2626' }], description: 'Warm colors increase heart rate and create urgency. Perfect for CTAs, sales, and food apps.', icon: <Zap className="w-4 h-4" /> },
  { id: 'calm', emotion: 'Calm & Wellness', colors: [{ name: 'Sage Green', hex: '#84cc16' }, { name: 'Soft Teal', hex: '#14b8a6' }], description: 'Greens and teals lower stress. Great for meditation, health, and productivity apps.', icon: <Heart className="w-4 h-4" /> },
  { id: 'luxury', emotion: 'Luxury & Premium', colors: [{ name: 'Royal Gold', hex: '#d97706' }, { name: 'Charcoal', hex: '#27272a' }], description: 'Dark with gold accents signals exclusivity. Use for high-end products and subscriptions.', icon: <Sparkles className="w-4 h-4" /> },
  { id: 'growth', emotion: 'Growth & Success', colors: [{ name: 'Forest Green', hex: '#16a34a' }, { name: 'Spring Lime', hex: '#65a30d' }], description: 'Greens signal growth and positivity. Ideal for fitness, finance growth, and eco apps.', icon: <TrendingUp className="w-4 h-4" /> },
  { id: 'focus', emotion: 'Focus & Night', colors: [{ name: 'Midnight', hex: '#0f172a' }, { name: 'Electric Blue', hex: '#3b82f6' }], description: 'Dark backgrounds with blue accents reduce eye strain and improve focus. Best for reading and coding apps.', icon: <Moon className="w-4 h-4" /> },
];

const APP_TYPES = ['Finance', 'Health', 'Social', 'E-commerce', 'Education', 'Productivity', 'Entertainment'];

interface ColorPsychologyEngineProps {
  open: boolean;
  onClose: () => void;
}

export default function ColorPsychologyEngine({ open, onClose }: ColorPsychologyEngineProps) {
  const [appType, setAppType] = useState('Finance');
  const [selected, setSelected] = useState('trust');
  if (!open) return null;

  const current = PSYCHOLOGY.find((p) => p.id === selected)!;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2"><Palette className="w-5 h-5 text-purple-400" /><h3 className="text-sm font-semibold text-slate-100">Color Psychology Engine</h3></div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X className="w-5 h-5" /></button>
        </div>

        <div className="px-5 py-2 border-b border-slate-800">
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-500">App type:</span>
            {APP_TYPES.map((t) => <button key={t} onClick={() => { setAppType(t); setSelected(t === 'Finance' ? 'trust' : t === 'Health' ? 'calm' : t === 'E-commerce' ? 'energy' : t === 'Productivity' ? 'focus' : 'growth'); }} className={`text-xs px-2 py-1 rounded-full ${appType === t ? 'bg-slate-800 text-slate-100' : 'text-slate-500'}`}>{t}</button>)}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-3">
          <div className="rounded-xl border-2 border-purple-500/30 bg-purple-500/5 p-4">
            <div className="flex items-center gap-2 mb-2">{current.icon}<span className="text-sm font-medium text-slate-200">{current.emotion}</span></div>
            <p className="text-xs text-slate-400 mb-3">{current.description}</p>
            <div className="flex items-center gap-2">
              {current.colors.map((c) => (
                <div key={c.hex} className="flex-1 rounded-lg overflow-hidden">
                  <div className="h-16" style={{ backgroundColor: c.hex }} />
                  <div className="bg-slate-800 p-2"><p className="text-xs text-slate-200">{c.name}</p><p className="text-[10px] text-slate-500 font-mono">{c.hex}</p></div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs text-slate-500 uppercase tracking-wider mb-2">All Emotional Palettes</h4>
            <div className="grid grid-cols-2 gap-2">
              {PSYCHOLOGY.map((p) => (
                <button key={p.id} onClick={() => setSelected(p.id)} className={`rounded-xl border p-2 text-left transition-colors ${selected === p.id ? 'border-purple-500/30 bg-purple-500/5' : 'border-slate-800 bg-slate-950/40 hover:bg-slate-800/20'}`}>
                  <div className="flex items-center gap-1.5 mb-1.5">{p.icon}<span className="text-xs text-slate-200">{p.emotion}</span></div>
                  <div className="flex gap-1">{p.colors.map((c) => <div key={c.hex} className="flex-1 h-6 rounded" style={{ backgroundColor: c.hex }} />)}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 px-5 py-3 border-t border-slate-800">
          <button className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-cyan-500 text-slate-900 text-xs font-semibold"><Palette className="w-3.5 h-3.5" /> Apply to project</button>
          <span className="text-xs text-slate-500">Best for {appType} apps</span>
        </div>
      </div>
    </div>
  );
}
