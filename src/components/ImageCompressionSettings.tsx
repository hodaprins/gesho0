import { useState } from 'react';
import { ImageDown, X, ImageIcon, Gauge, Maximize2, ArrowRight, Check } from 'lucide-react';

interface ImageCompressionSettingsProps {
  open: boolean;
  onClose: () => void;
}

const FORMATS = [
  { id: 'webp', label: 'WebP', desc: 'Best compression' },
  { id: 'jpeg', label: 'JPEG', desc: 'Wide support' },
  { id: 'png', label: 'PNG', desc: 'Lossless' },
];

export default function ImageCompressionSettings({ open, onClose }: ImageCompressionSettingsProps) {
  const [quality, setQuality] = useState(75);
  const [format, setFormat] = useState('webp');
  const [maxWidth, setMaxWidth] = useState(1920);

  if (!open) return null;

  const originalSize = 4.8;
  const compressionRatio = format === 'png' ? 1 : format === 'jpeg' ? 0.4 + (quality / 100) * 0.4 : 0.25 + (quality / 100) * 0.4;
  const compressedSize = (originalSize * compressionRatio).toFixed(1);
  const savings = Math.round((1 - compressionRatio) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <ImageDown className="w-5 h-5 text-fuchsia-400" />
            <h3 className="text-sm font-semibold text-slate-100">Image Compression</h3>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X className="w-5 h-5" /></button>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin p-5 space-y-5">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5"><Gauge className="w-3.5 h-3.5" /> Quality</label>
              <span className="text-xs text-fuchsia-400 font-mono">{quality}</span>
            </div>
            <input type="range" min={1} max={100} value={quality} onChange={(e) => setQuality(Number(e.target.value))} className="w-full accent-fuchsia-500" />
            <div className="flex justify-between text-[10px] text-slate-600 mt-1"><span>Smallest</span><span>Best</span></div>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-300 mb-2 block">Format</label>
            <div className="grid grid-cols-3 gap-2">
              {FORMATS.map((f) => (
                <button key={f.id} onClick={() => setFormat(f.id)} className={`rounded-lg border p-2.5 text-left transition-colors ${format === f.id ? 'border-fuchsia-500/50 bg-fuchsia-500/10' : 'border-slate-800 hover:border-slate-700'}`}>
                  <p className={`text-xs font-medium ${format === f.id ? 'text-fuchsia-400' : 'text-slate-300'}`}>{f.label}</p>
                  <p className="text-[10px] text-slate-500">{f.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5"><Maximize2 className="w-3.5 h-3.5" /> Max Dimensions</label>
              <span className="text-xs text-fuchsia-400 font-mono">{maxWidth}px</span>
            </div>
            <div className="flex gap-2">
              {[1280, 1920, 2560].map((w) => (
                <button key={w} onClick={() => setMaxWidth(w)} className={`flex-1 text-xs py-2 rounded-lg border transition-colors ${maxWidth === w ? 'border-fuchsia-500/50 bg-fuchsia-500/10 text-fuchsia-400' : 'border-slate-800 text-slate-400 hover:border-slate-700'}`}>{w}px</button>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
            <div className="flex items-center gap-2 mb-3">
              <ImageIcon className="w-4 h-4 text-slate-500" />
              <span className="text-xs font-medium text-slate-300">Size Comparison</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1 text-center">
                <p className="text-[10px] text-slate-500 mb-1">Before</p>
                <p className="text-lg font-semibold text-slate-300 font-mono">{originalSize} MB</p>
                <div className="mt-1.5 h-2 rounded-full bg-slate-800 overflow-hidden"><div className="h-full bg-slate-600 rounded-full" style={{ width: '100%' }} /></div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-600" />
              <div className="flex-1 text-center">
                <p className="text-[10px] text-slate-500 mb-1">After</p>
                <p className="text-lg font-semibold text-fuchsia-400 font-mono">{compressedSize} MB</p>
                <div className="mt-1.5 h-2 rounded-full bg-slate-800 overflow-hidden"><div className="h-full bg-fuchsia-500 rounded-full" style={{ width: `${compressionRatio * 100}%` }} /></div>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-center gap-1.5">
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-medium">{savings}% smaller</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-slate-800">
          <button onClick={onClose} className="flex items-center gap-1.5 text-xs px-4 py-2 rounded-lg bg-fuchsia-500 text-white hover:bg-fuchsia-600 transition-colors font-medium">
            <Check className="w-3.5 h-3.5" /> Apply settings
          </button>
        </div>
      </div>
    </div>
  );
}
