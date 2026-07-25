import { MonitorDot, X, Gauge, Layers } from 'lucide-react';
import { useState } from 'react';

export function RetinaDisplaySettings({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [scale, setScale] = useState(100);
  const [density, setDensity] = useState(2);
  const [sharpness, setSharpness] = useState(60);

  if (!open) return null;

  const quality =
    scale >= 125 && density >= 3 && sharpness >= 70
      ? { label: 'Ultra', color: 'text-emerald-400', pct: 100 }
      : scale >= 100 && density >= 2 && sharpness >= 50
      ? { label: 'High', color: 'text-indigo-400', pct: 75 }
      : scale >= 80 && density >= 1
      ? { label: 'Standard', color: 'text-amber-400', pct: 50 }
      : { label: 'Low', color: 'text-rose-400', pct: 25 };

  const Slider = ({
    icon: Icon, label, value, min, max, step, unit, onChange,
  }: { icon: typeof Gauge; label: string; value: number; min: number; max: number; step: number; unit: string; onChange: (v: number) => void }) => (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <span className="flex items-center gap-2 text-sm font-medium text-slate-200">
          <Icon className="h-4 w-4 text-slate-400" /> {label}
        </span>
        <span className="text-sm font-semibold text-indigo-400">{value}{unit}</span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-indigo-500 cursor-pointer"
      />
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
          <div className="flex items-center gap-3">
            <MonitorDot className="h-5 w-5 text-indigo-400" />
            <h2 className="text-lg font-semibold text-white">Display Settings</h2>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">
          <Slider icon={Layers} label="Resolution Scale" value={scale} min={50} max={200} step={5} unit="%" onChange={setScale} />
          <Slider icon={MonitorDot} label="Pixel Density" value={density} min={1} max={4} step={1} unit="x" onChange={setDensity} />
          <Slider icon={Gauge} label="Sharpness" value={sharpness} min={0} max={100} step={5} unit="%" onChange={setSharpness} />

          <div className="rounded-xl border border-slate-800 bg-slate-800/40 p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Render Quality</span>
              <span className={`text-sm font-bold ${quality.color}`}>{quality.label}</span>
            </div>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-700">
              <div
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-emerald-400 transition-all duration-300"
                style={{ width: `${quality.pct}%` }}
              />
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-800/40 p-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">Preview</p>
            <div className="flex items-center gap-4">
              <div
                className="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600"
                style={{ transform: `scale(${scale / 100})` }}
              >
                <MonitorDot className="h-7 w-7 text-white" style={{ strokeWidth: 4 - sharpness / 50 }} />
              </div>
              <div className="text-xs text-slate-400 space-y-0.5">
                <p>Effective resolution: {Math.round(2560 * (scale / 100))} × {Math.round(1600 * (scale / 100))}</p>
                <p>Density: {density}x retina ({density >= 2 ? 'HiDPI' : 'standard'})</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t border-slate-800 px-6 py-3">
          <button onClick={onClose} className="rounded-lg px-4 py-1.5 text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white">
            Cancel
          </button>
          <button onClick={onClose} className="rounded-lg bg-indigo-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-indigo-500">
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}

export default RetinaDisplaySettings;
