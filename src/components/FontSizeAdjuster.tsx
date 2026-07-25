import { Type, X, RotateCcw } from 'lucide-react';
import { useState } from 'react';

export function FontSizeAdjuster({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [size, setSize] = useState(100);

  if (!open) return null;

  const scale = size / 100;
  const label =
    size < 90 ? 'Small' : size < 100 ? 'Slightly Small' : size === 100 ? 'Default' : size <= 120 ? 'Large' : 'Extra Large';

  const previewTexts = [
    { label: 'Heading', cls: 'font-bold', factor: 1.75 },
    { label: 'Body', cls: 'font-normal', factor: 1 },
    { label: 'Caption', cls: 'font-medium', factor: 0.75 },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
          <div className="flex items-center gap-3">
            <Type className="h-5 w-5 text-indigo-400" />
            <h2 className="text-lg font-semibold text-white">Font Size</h2>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-6 py-5">
          <div className="mb-4 flex items-end justify-between">
            <div>
              <span className="text-sm text-slate-400">Current scale</span>
              <p className="text-2xl font-bold text-white">{size}%</p>
            </div>
            <div className="text-right">
              <span className="text-sm text-slate-400">Preset</span>
              <p className="text-sm font-semibold text-indigo-400">{label}</p>
            </div>
          </div>

          <div className="mb-2 flex justify-between text-xs text-slate-500">
            <span>80%</span>
            <span>100%</span>
            <span>125%</span>
            <span>150%</span>
          </div>
          <input
            type="range"
            min={80}
            max={150}
            step={5}
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
            className="w-full accent-indigo-500 cursor-pointer"
          />

          <div className="mt-6 rounded-xl bg-slate-800/50 border border-slate-800 p-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Preview</p>
            <div className="space-y-2">
              {previewTexts.map((t) => (
                <div key={t.label} className="flex items-baseline gap-3">
                  <span className="w-16 flex-shrink-0 text-xs text-slate-500">{t.label}</span>
                  <span
                    className={`${t.cls} text-white`}
                    style={{ fontSize: `${16 * scale * t.factor}px` }}
                  >
                    The quick brown fox jumps
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <button
              onClick={() => setSize(100)}
              className="flex items-center gap-1.5 rounded-lg bg-slate-800 px-3 py-2 text-sm font-medium text-slate-300 hover:bg-slate-700"
            >
              <RotateCcw className="h-4 w-4" /> Reset
            </button>
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t border-slate-800 px-6 py-3">
          <button onClick={onClose} className="rounded-lg px-4 py-1.5 text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white">
            Cancel
          </button>
          <button
            onClick={onClose}
            className="rounded-lg bg-indigo-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-indigo-500"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}

export default FontSizeAdjuster;
