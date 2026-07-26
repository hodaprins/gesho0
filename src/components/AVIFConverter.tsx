import { Image, X, FileImage, ArrowRight } from 'lucide-react';
import { useState } from 'react';

export default function AVIFConverter({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [format, setFormat] = useState<'AVIF' | 'WebP'>('AVIF');
  const [quality, setQuality] = useState(80);
  if (!open) return null;

  const originalSize = 2400;
  const compressedSize = Math.round(originalSize * (1 - quality / 100 * 0.85));
  const savings = Math.round((1 - compressedSize / originalSize) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2"><Image className="w-5 h-5 text-blue-400" /><h3 className="text-sm font-semibold text-slate-100">Image Converter</h3></div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X className="w-5 h-5" /></button>
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-4">
          <div><h4 className="text-xs text-slate-500 uppercase tracking-wider mb-2">Output Format</h4><div className="grid grid-cols-2 gap-2">{(['AVIF', 'WebP'] as const).map(f => <button key={f} onClick={() => setFormat(f)} className={`rounded-xl border p-3 text-center transition-colors ${format === f ? 'border-blue-500/30 bg-blue-500/5' : 'border-slate-800 bg-slate-950/40'}`}><FileImage className={`w-5 h-5 mx-auto mb-1 ${format === f ? 'text-blue-400' : 'text-slate-500'}`} /><p className="text-xs text-slate-200">{f}</p><p className="text-[10px] text-slate-500">{f === 'AVIF' ? '50% smaller than WebP' : 'Universal support'}</p></button>)}</div></div>
          <div><div className="flex items-center justify-between mb-1"><label className="text-xs text-slate-400">Quality</label><span className="text-xs font-mono text-slate-200">{quality}%</span></div><input type="range" min="10" max="100" value={quality} onChange={(e) => setQuality(Number(e.target.value))} className="w-full accent-blue-500" /></div>
          <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="text-center flex-1"><p className="text-[10px] text-slate-500">Original (JPEG)</p><p className="text-lg font-bold text-slate-200">{(originalSize / 1024).toFixed(1)} KB</p></div>
              <ArrowRight className="w-5 h-5 text-slate-500" />
              <div className="text-center flex-1"><p className="text-[10px] text-slate-500">Compressed ({format})</p><p className="text-lg font-bold text-emerald-400">{(compressedSize / 1024).toFixed(1)} KB</p></div>
            </div>
            <div className="h-2 rounded-full bg-slate-800 overflow-hidden"><div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-emerald-500" style={{ width: `${savings}%` }} /></div>
            <p className="text-center text-xs text-emerald-400 mt-2">{savings}% smaller · Saves {(originalSize - compressedSize) / 1024 > 1 ? `${((originalSize - compressedSize) / 1024).toFixed(1)} KB` : `${originalSize - compressedSize} B`} per image</p>
          </div>
          <div className="grid grid-cols-2 gap-2"><div className="rounded-lg bg-slate-800/50 p-2"><p className="text-[10px] text-slate-500">Batch Processing</p><p className="text-xs text-slate-200">Up to 500 images</p></div><div className="rounded-lg bg-slate-800/50 p-2"><p className="text-[10px] text-slate-500">Max Dimensions</p><input defaultValue="2048px" className="bg-transparent text-xs text-slate-200 w-full" /></div></div>
        </div>
        <div className="flex items-center gap-2 px-5 py-3 border-t border-slate-800"><button className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-blue-500/20 text-blue-400 text-sm font-semibold"><Image className="w-4 h-4" /> Convert & Optimize</button></div>
      </div>
    </div>
  );
}
