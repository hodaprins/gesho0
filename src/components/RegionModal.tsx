import { useState } from 'react';
import { X, Sparkles, Loader2, Check, AlertCircle, Wand2 } from 'lucide-react';
import type { AppRegion } from '@/types/builder';

interface RegionModalProps {
  region: AppRegion | null;
  onClose: () => void;
  onComplete: (regionId: string) => void;
}

const COMPLETION_STEPS = [
  'Analyzing missing elements...',
  'Generating component code...',
  'Wiring data bindings...',
  'Applying design system...',
  'Validating region...',
  'Region completed.',
];

export default function RegionModal({ region, onClose, onComplete }: RegionModalProps) {
  const [phase, setPhase] = useState<'detail' | 'building'>('detail');
  const [stepIdx, setStepIdx] = useState(0);

  if (!region) return null;

  const handleBuild = () => {
    setPhase('building');
    setStepIdx(0);

    COMPLETION_STEPS.forEach((_, i) => {
      setTimeout(() => {
        setStepIdx(i);
        if (i === COMPLETION_STEPS.length - 1) {
          setTimeout(() => {
            onComplete(region.id);
            setPhase('detail');
            setStepIdx(0);
            onClose();
          }, 600);
        }
      }, i * 700);
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={phase === 'detail' ? onClose : undefined}
      />

      <div className="relative w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
              <AlertCircle className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-100">Incomplete region</h3>
              <p className="text-xs text-slate-500">{region.region_name}</p>
            </div>
          </div>
          {phase === 'detail' && (
            <button
              onClick={onClose}
              className="text-slate-500 hover:text-slate-300 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="p-5">
          {phase === 'detail' ? (
            <>
              <div className="rounded-xl bg-slate-800/50 p-4 mb-4">
                <p className="text-xs uppercase tracking-wider text-slate-500 mb-1">Region type</p>
                <p className="text-sm text-slate-200 capitalize">{region.region_type}</p>
              </div>

              <div className="rounded-xl bg-slate-800/50 p-4 mb-4">
                <p className="text-xs uppercase tracking-wider text-slate-500 mb-1">What's missing</p>
                <p className="text-sm text-slate-300 leading-relaxed">{region.description}</p>
              </div>

              <div className="rounded-xl bg-slate-800/50 p-4 mb-5">
                <p className="text-xs uppercase tracking-wider text-slate-500 mb-2">Current elements</p>
                <div className="space-y-1">
                  {region.spec.elements.map((el, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-400">
                      <div className="w-1 h-1 rounded-full bg-slate-600" />
                      <span className="capitalize">{el.kind}</span>
                      {el.label && <span className="text-slate-500">— {el.label}</span>}
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={handleBuild}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-900 font-semibold text-sm transition-all hover:shadow-lg hover:shadow-emerald-500/25 hover:scale-[1.01] active:scale-95"
              >
                <Wand2 className="w-4 h-4" />
                Complete this region
              </button>
            </>
          ) : (
            <div className="space-y-3 py-2">
              {COMPLETION_STEPS.map((step, i) => {
                const done = i < stepIdx;
                const active = i === stepIdx;
                return (
                  <div
                    key={i}
                    className={`flex items-center gap-3 transition-all ${
                      done || active ? 'opacity-100' : 'opacity-30'
                    }`}
                  >
                    <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0">
                      {done ? (
                        <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
                          <Check className="w-3 h-3 text-emerald-400" />
                        </div>
                      ) : active ? (
                        <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center">
                          <Sparkles className="w-3 h-3 text-slate-600" />
                        </div>
                      )}
                    </div>
                    <span
                      className={`text-sm ${
                        done ? 'text-slate-400' : active ? 'text-slate-100' : 'text-slate-600'
                      }`}
                    >
                      {step}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
