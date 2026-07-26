import { Shapes, X, Search, Copy, Check } from 'lucide-react';
import { useState } from 'react';

const SYMBOLS = [
  { name: 'house.fill', cat: 'objects' }, { name: 'gear', cat: 'objects' }, { name: 'magnifyingglass', cat: 'objects' },
  { name: 'heart.fill', cat: 'nature' }, { name: 'leaf.fill', cat: 'nature' }, { name: 'flame.fill', cat: 'nature' },
  { name: 'cart.fill', cat: 'commerce' }, { name: 'creditcard.fill', cat: 'commerce' }, { name: 'tag.fill', cat: 'commerce' },
  { name: 'person.fill', cat: 'objects' }, { name: 'person.2.fill', cat: 'objects' }, { name: 'bell.fill', cat: 'objects' },
  { name: 'envelope.fill', cat: 'objects' }, { name: 'phone.fill', cat: 'objects' }, { name: 'message.fill', cat: 'objects' },
  { name: 'camera.fill', cat: 'objects' }, { name: 'photo.fill', cat: 'objects' }, { name: 'play.fill', cat: 'objects' },
];
const CATEGORIES = ['all', 'objects', 'nature', 'commerce'];

export default function SFSymbolsBrowser({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [cat, setCat] = useState('all');
  const [search, setSearch] = useState('');
  const [copied, setCopied] = useState<string | null>(null);
  if (!open) return null;

  const filtered = SYMBOLS.filter(s => (cat === 'all' || s.cat === cat) && s.name.includes(search.toLowerCase()));
  const copy = (name: string) => { navigator.clipboard?.writeText(name); setCopied(name); setTimeout(() => setCopied(null), 1500); };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2"><Shapes className="w-5 h-5 text-blue-400" /><h3 className="text-sm font-semibold text-slate-100">SF Symbols Browser</h3></div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X className="w-5 h-5" /></button>
        </div>
        <div className="px-5 py-2 border-b border-slate-800 space-y-2">
          <div className="relative"><Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search symbols..." className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs text-slate-200" /></div>
          <div className="flex items-center gap-1.5">{CATEGORIES.map(c => <button key={c} onClick={() => setCat(c)} className={`text-xs px-2 py-1 rounded-full capitalize ${cat === c ? 'bg-slate-800 text-slate-100' : 'text-slate-500'}`}>{c}</button>)}</div>
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-thin p-4">
          <div className="grid grid-cols-4 gap-2">
            {filtered.map(s => (
              <button key={s.name} onClick={() => copy(s.name)} className="group rounded-xl border border-slate-800 bg-slate-950/40 p-3 text-center hover:border-blue-500/30 transition-colors">
                <div className="w-8 h-8 mx-auto mb-1.5 flex items-center justify-center text-2xl">⬜</div>
                <p className="text-[9px] text-slate-500 truncate">{s.name}</p>
                {copied === s.name && <Check className="w-3 h-3 text-emerald-400 mx-auto mt-1" />}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
