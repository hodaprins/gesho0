import { useState } from 'react';
import { Loader, X, ToggleLeft, ToggleRight, FileText, User, ListOrdered, Square } from 'lucide-react';

interface SkeletonLoadingPreviewProps {
  open: boolean;
  onClose: () => void;
}

const SKELETON_PATTERNS = [
  { id: 'card', label: 'Card', icon: Square },
  { id: 'list', label: 'List', icon: ListOrdered },
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'article', label: 'Article', icon: FileText },
];

function SkeletonBlock({ className }: { className: string }) {
  return <div className={`rounded bg-slate-800 animate-pulse ${className}`} />;
}

function LoadedContent({ type }: { type: string }) {
  if (type === 'card') return (
    <div className="space-y-2">
      <div className="h-20 rounded-lg bg-gradient-to-br from-cyan-500/20 to-violet-500/20 flex items-center justify-center"><span className="text-xs text-cyan-400">Content</span></div>
      <p className="text-xs text-slate-300">Card Title</p>
      <p className="text-[11px] text-slate-500">Card description text</p>
    </div>
  );
  if (type === 'list') return (
    <div className="space-y-2">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center gap-2"><div className="w-7 h-7 rounded-full bg-slate-700" /><div className="flex-1"><p className="text-xs text-slate-300">Item {i}</p><p className="text-[10px] text-slate-500">Subtitle</p></div></div>
      ))}
    </div>
  );
  if (type === 'profile') return (
    <div className="flex flex-col items-center gap-2"><div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-400 to-rose-500" /><p className="text-sm text-slate-200 font-medium">Jane Doe</p><p className="text-[11px] text-slate-500">Product Designer</p></div>
  );
  return (
    <div className="space-y-2"><p className="text-sm text-slate-200 font-medium">Article Headline</p><p className="text-[11px] text-slate-400 leading-relaxed">This is the article body text that shows when content has fully loaded.</p><p className="text-[11px] text-slate-400 leading-relaxed">More paragraph text here.</p></div>
  );
}

export default function SkeletonLoadingPreview({ open, onClose }: SkeletonLoadingPreviewProps) {
  const [loaded, setLoaded] = useState(false);
  const [pattern, setPattern] = useState('card');

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Loader className="w-5 h-5 text-sky-400 animate-spin" style={{ animationDuration: '2s' }} />
            <h3 className="text-sm font-semibold text-slate-100">Skeleton Loading</h3>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X className="w-5 h-5" /></button>
        </div>

        <div className="flex-1 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex gap-1.5">
              {SKELETON_PATTERNS.map((p) => {
                const Icon = p.icon;
                return (
                  <button key={p.id} onClick={() => setPattern(p.id)} className={`flex items-center gap-1.5 text-[11px] px-2.5 py-1.5 rounded-lg transition-colors ${pattern === p.id ? 'bg-slate-800 text-sky-400' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/40'}`}>
                    <Icon className="w-3.5 h-3.5" /> {p.label}
                  </button>
                );
              })}
            </div>
            <button onClick={() => setLoaded(!loaded)} className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200">
              {loaded ? <ToggleRight className="w-5 h-5 text-emerald-400" /> : <ToggleLeft className="w-5 h-5" />}
              {loaded ? 'Loaded' : 'Loading'}
            </button>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-5 min-h-[200px]">
            {loaded ? (
              <div className="animate-fade-in-up"><LoadedContent type={pattern} /></div>
            ) : (
              <div className="space-y-3">
                {pattern === 'card' && (<><SkeletonBlock className="h-20 w-full" /><SkeletonBlock className="h-3 w-1/3" /><SkeletonBlock className="h-2.5 w-2/3" /></>)}
                {pattern === 'list' && ([1, 2, 3].map((i) => (<div key={i} className="flex items-center gap-2"><SkeletonBlock className="w-7 h-7 rounded-full" /><div className="flex-1 space-y-1.5"><SkeletonBlock className="h-2.5 w-3/4" /><SkeletonBlock className="h-2 w-1/2" /></div></div>)))}
                {pattern === 'profile' && (<div className="flex flex-col items-center gap-2"><SkeletonBlock className="w-14 h-14 rounded-full" /><SkeletonBlock className="h-3 w-24" /><SkeletonBlock className="h-2 w-32" /></div>)}
                {pattern === 'article' && (<><SkeletonBlock className="h-4 w-2/3" /><SkeletonBlock className="h-2.5 w-full" /><SkeletonBlock className="h-2.5 w-full" /><SkeletonBlock className="h-2.5 w-4/5" /></>)}
              </div>
            )}
          </div>

          <p className="text-[11px] text-slate-500 text-center">Toggle the switch to compare skeleton vs. loaded states</p>
        </div>
      </div>
    </div>
  );
}
