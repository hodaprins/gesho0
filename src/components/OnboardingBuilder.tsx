import { useState } from 'react';
import { X, Eye, EyeOff, Plus, Trash2, ArrowRight } from 'lucide-react';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: string;
}

interface OnboardingBuilderProps {
  open: boolean;
  onClose: () => void;
  appName: string;
}

const ICON_OPTIONS = ['Sparkles', 'Heart', 'Bell', 'Search', 'User', 'Zap', 'Star', 'Gift'];

export default function OnboardingBuilder({ open, onClose, appName }: OnboardingBuilderProps) {
  const [steps, setSteps] = useState<OnboardingStep[]>([
    { id: '1', title: `Welcome to ${appName}`, description: 'Let\'s get you started in seconds', icon: 'Sparkles' },
    { id: '2', title: 'Discover features', description: 'Explore everything the app has to offer', icon: 'Search' },
    { id: '3', title: 'Stay notified', description: 'Never miss an important update', icon: 'Bell' },
  ]);
  const [preview, setPreview] = useState(true);

  if (!open) return null;

  const addStep = () => {
    setSteps((prev) => [...prev, { id: crypto.randomUUID(), title: 'New step', description: 'Describe this step', icon: 'Star' }]);
  };
  const removeStep = (id: string) => setSteps((prev) => prev.filter((s) => s.id !== id));
  const updateStep = (id: string, key: keyof OnboardingStep, value: string) => {
    setSteps((prev) => prev.map((s) => (s.id === id ? { ...s, [key]: value } : s)));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-3xl rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <h3 className="text-sm font-semibold text-slate-100">Onboarding Flow Builder</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPreview(!preview)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs hover:bg-slate-700 transition-colors"
            >
              {preview ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              {preview ? 'Hide preview' : 'Show preview'}
            </button>
            <button onClick={onClose} className="text-slate-500 hover:text-slate-300">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          <div className="w-1/2 border-r border-slate-800 overflow-y-auto scrollbar-thin p-4 space-y-3">
            {steps.map((step, i) => (
              <div key={step.id} className="rounded-xl border border-slate-800 bg-slate-950/50 p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400">Step {i + 1}</span>
                  <button onClick={() => removeStep(step.id)} className="text-slate-600 hover:text-red-400 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <input
                  value={step.title}
                  onChange={(e) => updateStep(step.id, 'title', e.target.value)}
                  className="w-full rounded-lg bg-slate-800 border border-slate-700 px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-slate-600"
                  placeholder="Step title"
                />
                <input
                  value={step.description}
                  onChange={(e) => updateStep(step.id, 'description', e.target.value)}
                  className="w-full rounded-lg bg-slate-800 border border-slate-700 px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-slate-600"
                  placeholder="Step description"
                />
                <div className="flex items-center gap-1 flex-wrap">
                  {ICON_OPTIONS.map((icon) => (
                    <button
                      key={icon}
                      onClick={() => updateStep(step.id, 'icon', icon)}
                      className={`text-[10px] px-1.5 py-0.5 rounded transition-colors ${
                        step.icon === icon ? 'bg-cyan-500/20 text-cyan-400' : 'bg-slate-800 text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>
            ))}
            <button
              onClick={addStep}
              className="w-full rounded-xl border-2 border-dashed border-slate-700 py-2.5 text-xs text-slate-500 hover:text-slate-300 hover:border-slate-600 transition-colors flex items-center justify-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              Add step
            </button>
          </div>

          {preview && (
            <div className="w-1/2 flex items-center justify-center bg-gradient-to-b from-slate-950 to-slate-900 p-6">
              <div className="w-full max-w-[240px]">
                <div className="rounded-2xl bg-white p-6 text-center shadow-2xl">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-500 mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">{steps[0]?.icon.charAt(0) ?? 'S'}</span>
                  </div>
                  <h4 className="text-base font-bold text-slate-800 mb-2">{steps[0]?.title ?? 'Welcome'}</h4>
                  <p className="text-xs text-slate-500 mb-4">{steps[0]?.description ?? 'Description'}</p>
                  <div className="flex items-center justify-center gap-1 mb-4">
                    {steps.map((_, i) => (
                      <span key={i} className={`h-1.5 rounded-full transition-all ${i === 0 ? 'w-6 bg-emerald-500' : 'w-1.5 bg-slate-300'}`} />
                    ))}
                  </div>
                  <button className="w-full rounded-xl py-2.5 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white text-sm font-semibold inline-flex items-center justify-center gap-1.5">
                    Next <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button className="text-xs text-slate-400 mt-2">Skip</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
