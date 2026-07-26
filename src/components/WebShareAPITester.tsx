import { Share2, X, FileText, Link, Image } from 'lucide-react';
import { useState } from 'react';

export default function WebShareAPITester({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [title, setTitle] = useState('Check out this app!');
  const [text, setText] = useState('Built with Bolt.new');
  const [url, setUrl] = useState('https://example.com');
  const [result, setResult] = useState<string | null>(null);
  if (!open) return null;

  const share = async () => { try { if (navigator.share) { await navigator.share({ title, text, url }); setResult('Shared successfully!'); } else setResult('Web Share API not supported on this device.'); } catch { setResult('Share cancelled.'); } setTimeout(() => setResult(null), 3000); };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2"><Share2 className="w-5 h-5 text-blue-400" /><h3 className="text-sm font-semibold text-slate-100">Web Share API Tester</h3></div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X className="w-5 h-5" /></button>
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-3">
          <div><label className="text-xs text-slate-500 mb-1 block flex items-center gap-1.5"><FileText className="w-3 h-3" /> Title</label><input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-xs text-slate-200" /></div>
          <div><label className="text-xs text-slate-500 mb-1 block flex items-center gap-1.5"><FileText className="w-3 h-3" /> Text</label><textarea value={text} onChange={(e) => setText(e.target.value)} className="w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-xs text-slate-200 h-16 resize-none" /></div>
          <div><label className="text-xs text-slate-500 mb-1 block flex items-center gap-1.5"><Link className="w-3 h-3" /> URL</label><input value={url} onChange={(e) => setUrl(e.target.value)} className="w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-xs text-slate-200" /></div>
          <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3">
            <h4 className="text-xs text-slate-500 mb-2">Share Level</h4>
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-lg bg-slate-800/50 p-2 text-center"><p className="text-xs text-slate-200">Basic</p><p className="text-[10px] text-slate-500">title, text, url</p></div>
              <div className="rounded-lg bg-blue-500/10 p-2 text-center border border-blue-500/20"><p className="text-xs text-blue-400">Advanced</p><p className="text-[10px] text-slate-500">+ files (Level 2)</p></div>
            </div>
          </div>
          {result && <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-2.5 text-xs text-emerald-400">{result}</div>}
        </div>
        <div className="flex items-center gap-2 px-5 py-3 border-t border-slate-800"><button onClick={share} className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-blue-500/20 text-blue-400 text-sm font-semibold"><Share2 className="w-4 h-4" /> Share</button></div>
      </div>
    </div>
  );
}
