import { useState } from 'react';
import {
  Smartphone,
  Apple,
  Bot,
  Sparkles,
  ArrowRight,
  Loader2,
  AlertCircle,
  LayoutGrid,
  PenLine,
} from 'lucide-react';
import type { Platform, ProjectTemplate } from '@/types/builder';
import TemplatesGallery from '@/components/TemplatesGallery';

interface PromptScreenProps {
  onStart: (prompt: string, platform: Platform) => Promise<void>;
  recentProjectName?: string;
}

const EXAMPLES = [
  'A fitness tracking app with workout logs and calorie counting',
  'A todo app with categories, reminders, and dark mode',
  'An e-commerce store for handmade jewelry with Stripe payments',
  'A recipe app with search and cooking timers',
  'A budget tracker with expense categories and charts',
];

export default function PromptScreen({ onStart, recentProjectName }: PromptScreenProps) {
  const [prompt, setPrompt] = useState('');
  const [platform, setPlatform] = useState<Platform>('both');
  const [building, setBuilding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<'prompt' | 'templates'>('prompt');

  const handleStart = async () => {
    if (prompt.trim().length < 5) return;
    setBuilding(true);
    setError(null);
    try {
      await onStart(prompt.trim(), platform);
    } catch (err) {
      setBuilding(false);
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    }
  };

  const handleTemplateSelect = (template: ProjectTemplate) => {
    setPrompt(template.prompt);
    setMode('prompt');
  };

  const canStart = prompt.trim().length >= 5;

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-16">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Sparkles className="w-6 h-6 text-slate-900" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">AppForge</h1>
            <p className="text-xs text-slate-400">AI App Builder · iOS · Android · Web</p>
          </div>
        </div>

        <h2 className="text-4xl md:text-5xl font-extrabold text-center max-w-2xl mb-3 tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
          Describe your app.
          <br />
          Watch it build itself.
        </h2>
        <p className="text-slate-400 text-center max-w-lg mb-8 text-base">
          Write a prompt, pick a platform, and see your app assembled live —
          screen by screen, with real-time build logs, code generation, and quality audit.
        </p>

        {/* Mode toggle */}
        <div className="flex items-center gap-1.5 rounded-xl bg-slate-900 border border-slate-800 p-1 mb-6">
          <button
            onClick={() => setMode('prompt')}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              mode === 'prompt' ? 'bg-slate-800 text-slate-100' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <PenLine className="w-4 h-4" />
            Write Prompt
          </button>
          <button
            onClick={() => setMode('templates')}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              mode === 'templates' ? 'bg-slate-800 text-slate-100' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            Templates
          </button>
        </div>

        <div className="w-full max-w-3xl">
          {mode === 'prompt' ? (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm p-5 shadow-2xl">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleStart();
                }}
                placeholder="e.g. A task manager app with categories, reminders, and user accounts..."
                className="w-full h-28 bg-transparent text-slate-100 placeholder:text-slate-500 text-base resize-none focus:outline-none scrollbar-thin"
                disabled={building}
              />

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-800">
                <div className="flex items-center gap-1.5">
                  <PlatformButton
                    label="iOS"
                    icon={<Apple className="w-4 h-4" />}
                    active={platform === 'ios' || platform === 'both'}
                    onClick={() => setPlatform('ios')}
                  />
                  <PlatformButton
                    label="Android"
                    icon={<Smartphone className="w-4 h-4" />}
                    active={platform === 'android' || platform === 'both'}
                    onClick={() => setPlatform('android')}
                  />
                  <PlatformButton
                    label="Both"
                    icon={<Bot className="w-4 h-4" />}
                    active={platform === 'both'}
                    onClick={() => setPlatform('both')}
                  />
                </div>

                <button
                  onClick={handleStart}
                  disabled={!canStart || building}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-900 font-semibold text-sm transition-all hover:shadow-lg hover:shadow-emerald-500/25 disabled:opacity-40 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-95"
                >
                  {building ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Starting...
                    </>
                  ) : (
                    <>
                      Build app
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

              {error && (
                <div className="mt-3 flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-400">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <p className="text-xs text-slate-500 mt-3 text-center">
                Press ⌘/Ctrl + Enter to start
              </p>

              <div className="mt-5">
                <p className="text-xs uppercase tracking-wider text-slate-500 mb-2 text-center">
                  Try an example
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {EXAMPLES.map((ex) => (
                    <button
                      key={ex}
                      onClick={() => setPrompt(ex)}
                      disabled={building}
                      className="text-xs px-3 py-1.5 rounded-full border border-slate-800 bg-slate-900/40 text-slate-400 hover:text-slate-200 hover:border-slate-700 transition-colors"
                    >
                      {ex.length > 42 ? ex.slice(0, 42) + '...' : ex}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm p-5 shadow-2xl">
              <p className="text-sm text-slate-400 mb-4 text-center">
                Pick a template to pre-fill your prompt — you can customize it after.
              </p>
              <TemplatesGallery onSelect={handleTemplateSelect} />
              {prompt && (
                <div className="mt-4 pt-4 border-t border-slate-800 flex items-center gap-2">
                  <span className="text-xs text-slate-500 flex-1 truncate">Selected: {prompt}</span>
                  <button
                    onClick={() => setMode('prompt')}
                    className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 transition-colors"
                  >
                    Use this prompt →
                  </button>
                </div>
              )}
            </div>
          )}

          {recentProjectName && (
            <div className="mt-6 text-center">
              <span className="text-xs text-slate-500">Recent: </span>
              <span className="text-xs text-emerald-400 font-medium">{recentProjectName}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function PlatformButton({
  label,
  icon,
  active,
  onClick,
}: {
  label: string;
  icon: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
        active
          ? 'bg-slate-800 text-slate-100'
          : 'text-slate-500 hover:text-slate-300'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
