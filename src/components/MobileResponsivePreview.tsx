import { Smartphone, X, Tablet, RotateCw, Monitor } from 'lucide-react';
import { useState } from 'react';

type Device = 'phone' | 'tablet';

export function MobileResponsivePreview({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [device, setDevice] = useState<Device>('phone');
  const [rotated, setRotated] = useState(false);

  if (!open) return null;

  const isPhone = device === 'phone';
  const dims = isPhone
    ? { w: rotated ? 375 : 260, h: rotated ? 260 : 375 }
    : { w: rotated ? 540 : 400, h: rotated ? 400 : 540 };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
          <div className="flex items-center gap-3">
            <Smartphone className="h-5 w-5 text-indigo-400" />
            <h2 className="text-lg font-semibold text-white">Responsive Preview</h2>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-3">
          <div className="flex gap-1 rounded-lg bg-slate-800 p-1">
            <button
              onClick={() => setDevice('phone')}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition ${
                isPhone ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone className="h-4 w-4" /> Phone
            </button>
            <button
              onClick={() => setDevice('tablet')}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition ${
                !isPhone ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Tablet className="h-4 w-4" /> Tablet
            </button>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500">
              {isPhone ? '375 × 812' : '834 × 1112'}
            </span>
            <button
              onClick={() => setRotated((r) => !r)}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
              title="Rotate device"
            >
              <RotateCw className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-center bg-slate-950/50 px-6 py-8 min-h-[480px]">
          <div
            className="relative rounded-[2rem] border-4 border-slate-700 bg-black shadow-xl transition-all duration-300"
            style={{ width: dims.w, height: dims.h }}
          >
            <div className="absolute top-2 left-1/2 z-10 h-1.5 w-12 -translate-x-1/2 rounded-full bg-slate-700" />
            <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-[1.7rem] bg-slate-900 p-4">
              <div className="w-full space-y-2">
                <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                  <div className="h-7 w-7 rounded-lg bg-indigo-600" />
                  <div className="space-y-1">
                    <div className="h-2 w-24 rounded bg-slate-700" />
                    <div className="h-1.5 w-16 rounded bg-slate-800" />
                  </div>
                </div>
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className="flex gap-2 rounded-lg bg-slate-800/60 p-2">
                    <div className="h-10 w-10 flex-shrink-0 rounded-md bg-slate-700" />
                    <div className="flex-1 space-y-1.5 pt-0.5">
                      <div className="h-2 w-3/4 rounded bg-slate-700" />
                      <div className="h-1.5 w-full rounded bg-slate-800" />
                      <div className="h-1.5 w-1/2 rounded bg-slate-800" />
                    </div>
                  </div>
                ))}
                <div className="flex justify-around rounded-lg bg-slate-800/80 py-2">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className={`h-5 w-5 rounded ${i === 0 ? 'bg-indigo-500' : 'bg-slate-700'}`} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-slate-800 px-6 py-3">
          <span className="flex items-center gap-1.5 text-xs text-slate-500">
            <Monitor className="h-3.5 w-3.5" /> Live preview
          </span>
          <button onClick={onClose} className="rounded-lg bg-indigo-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-indigo-500">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default MobileResponsivePreview;
