import { useState } from 'react';
import { Compass, X, ChevronRight, ChevronLeft, SkipForward, Sparkles, Palette, Database, Rocket } from 'lucide-react';

interface OnboardingTourProps {
  open: boolean;
  onClose: () => void;
}

const STEPS = [
  { title: 'Design Your App', desc: 'Use the design canvas to drag, drop, and arrange UI elements. Build screens visually with live preview.', icon: Palette, color: 'text-violet-400', bg: 'from-violet-500/20 to-violet-500/5' },
  { title: 'Connect Your Data', desc: 'Set up your database schema and connect screens to live data with Supabase. Tables, RLS, and auth handled for you.', icon: Database, color: 'text-cyan-400', bg: 'from-cyan-500/20 to-cyan-500/5' },
  { title: 'Generate with AI', desc: 'Ask the AI assistant to create screens, suggest improvements, or generate code for any platform instantly.', icon: Sparkles, color: 'text-amber-400', bg: 'from-amber-500/20 to-amber-500/5' },
  { title: 'Deploy & Ship', desc: 'Preview on real devices, run tests, and deploy to staging or production with a single click. Ship faster than ever.', icon: Rocket, color: 'text-emerald-400', bg: 'from-emerald-500/20 to-emerald-500/5' },
];

export default function OnboardingTour({ open, onClose }: OnboardingTourProps) {
  const [step, setStep] = useState(0);

  if (!open) return null;

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;
  const Icon = current.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-violet-400" />
            <h3 className="text-sm font-semibold text-slate-100">Welcome Tour</h3>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X className="w-5 h-5" /></button>
        </div>

        <div className={`relative flex flex-col items-center justify-center p-8 bg-gradient-to-b ${current.bg} min-h-[240px]`}>
          <div className="w-16 h-16 rounded-2xl bg-slate-900/60 border border-slate-700 flex items-center justify-center mb-4">
            <Icon className={`w-8 h-8 ${current.color}`} />
          </div>
          <h4 className="text-lg font-bold text-slate-100 mb-2">{current.title}</h4>
          <p className="text-sm text-slate-400 text-center max-w-sm leading-relaxed">{current.desc}</p>
          <span className="absolute top-4 right-5 text-[11px] text-slate-500 font-mono">{step + 1} / {STEPS.length}</span>
        </div>

        <div className="px-5 py-4 border-t border-slate-800">
          <div className="flex items-center justify-center gap-2 mb-4">
            {STEPS.map((_, i) => (
              <button
                key={i}
                onClick={() => setStep(i)}
                className={`h-1.5 rounded-full transition-all ${i === step ? 'w-6 bg-violet-400' : 'w-1.5 bg-slate-700 hover:bg-slate-600'}`}
              />
            ))}
          </div>
          <div className="flex items-center justify-between">
            <button
              onClick={onClose}
              className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-300 transition-colors"
            >
              <SkipForward className="w-3.5 h-3.5" /> Skip tour
            </button>
            <div className="flex items-center gap-2">
              {step > 0 && (
                <button
                  onClick={() => setStep(step - 1)}
                  className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg border border-slate-800 text-slate-300 hover:bg-slate-800 transition-colors"
                >
                  <ChevronLeft className="w-3.5 h-3.5" /> Back
                </button>
              )}
              <button
                onClick={() => (isLast ? onClose() : setStep(step + 1))}
                className="flex items-center gap-1 text-xs px-4 py-1.5 rounded-lg bg-violet-500 text-white hover:bg-violet-600 transition-colors font-medium"
              >
                {isLast ? 'Get started' : 'Next'} <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
