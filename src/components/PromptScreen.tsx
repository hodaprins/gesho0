import { useState, useRef, useCallback } from 'react';
import {
  Sparkles,
  Apple,
  Smartphone,
  Bot,
  ArrowRight,
  Loader2,
  AlertCircle,
  PenLine,
  LayoutGrid,
  CheckSquare,
  ShoppingCart,
  MessageCircle,
  Dumbbell,
  LineChart,
  ChefHat,
  type LucideIcon,
} from 'lucide-react';

type Mode = 'prompt' | 'templates';
type Platform = 'ios' | 'android' | 'both';

interface PromptScreenProps {
  onStart: (prompt: string, platform: string) => Promise<void>;
  recentProjectName?: string;
}

interface Template {
  id: string;
  name: string;
  description: string;
  prompt: string;
  icon: LucideIcon;
  gradient: string;
  glow: string;
}

interface PlatformOption {
  id: Platform;
  label: string;
  icon: LucideIcon;
}

const TEMPLATES: Template[] = [
  {
    id: 'task-manager',
    name: 'Task Manager',
    description: 'Boards, reminders, and subtasks with drag-and-drop.',
    prompt:
      'A task manager app with kanban boards, due dates, reminders, and subtasks. Support drag-and-drop reordering and offline sync.',
    icon: CheckSquare,
    gradient: 'from-emerald-400/20 to-teal-500/10',
    glow: 'group-hover:shadow-emerald-500/20',
  },
  {
    id: 'ecommerce',
    name: 'E-commerce',
    description: 'Product catalog, cart, and one-tap checkout.',
    prompt:
      'An e-commerce app with a product catalog, search and filters, shopping cart, saved items, and a smooth checkout flow with order tracking.',
    icon: ShoppingCart,
    gradient: 'from-cyan-400/20 to-sky-500/10',
    glow: 'group-hover:shadow-cyan-500/20',
  },
  {
    id: 'social-feed',
    name: 'Social Feed',
    description: 'Infinite feed, posts, likes, and comments.',
    prompt:
      'A social feed app with an infinite-scroll timeline, post creation with images, likes, comments, and follow system with real-time updates.',
    icon: MessageCircle,
    gradient: 'from-violet-400/20 to-fuchsia-500/10',
    glow: 'group-hover:shadow-violet-500/20',
  },
  {
    id: 'fitness-tracker',
    name: 'Fitness Tracker',
    description: 'Workouts, streaks, and progress charts.',
    prompt:
      'A fitness tracker app with workout plans, exercise logging, streaks, calorie tracking, and weekly progress charts with goal setting.',
    icon: Dumbbell,
    gradient: 'from-orange-400/20 to-rose-500/10',
    glow: 'group-hover:shadow-orange-500/20',
  },
  {
    id: 'finance-dashboard',
    name: 'Finance Dashboard',
    description: 'Accounts, budgets, and spending insights.',
    prompt:
      'A personal finance dashboard with linked accounts, budget categories, transaction history, spending insights, and monthly reports.',
    icon: LineChart,
    gradient: 'from-emerald-400/20 to-cyan-500/10',
    glow: 'group-hover:shadow-emerald-500/20',
  },
  {
    id: 'recipe-app',
    name: 'Recipe App',
    description: 'Search, save, and cook with step timers.',
    prompt:
      'A recipe app with search by ingredient, curated collections, saved recipes, step-by-step cooking mode with timers, and shopping list generation.',
    icon: ChefHat,
    gradient: 'from-amber-400/20 to-orange-500/10',
    glow: 'group-hover:shadow-amber-500/20',
  },
];

const EXAMPLE_PROMPTS = [
  'A habit tracker with streaks and daily reminders',
  'A meditation app with guided sessions and progress',
  'A budgeting app that splits expenses with friends',
  'A recipe finder by ingredients I already have',
  'A workout planner that adapts to my goals',
  'A travel journal with maps and photo memories',
];

const PLATFORM_OPTIONS: PlatformOption[] = [
  { id: 'ios', label: 'iOS', icon: Apple },
  { id: 'android', label: 'Android', icon: Smartphone },
  { id: 'both', label: 'Both', icon: Bot },
];

export default function PromptScreen({ onStart, recentProjectName }: PromptScreenProps) {
  const [mode, setMode] = useState<Mode>('prompt');
  const [prompt, setPrompt] = useState('');
  const [platform, setPlatform] = useState<Platform>('both');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleBuild = useCallback(async () => {
    const trimmed = prompt.trim();
    if (!trimmed) {
      setError('Describe your app so AppForge knows what to build.');
      textareaRef.current?.focus();
      return;
    }
    if (loading) return;
    setError(null);
    setLoading(true);
    try {
      await onStart(trimmed, platform);
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : 'Something went wrong while starting your build. Please try again.'
      );
      setLoading(false);
    }
  }, [prompt, platform, loading, onStart]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      void handleBuild();
    }
  };

  const useTemplate = (tpl: Template) => {
    setPrompt(tpl.prompt);
    setMode('prompt');
    setError(null);
    requestAnimationFrame(() => textareaRef.current?.focus());
  };

  const applyExample = (example: string) => {
    setPrompt(example);
    setError(null);
    textareaRef.current?.focus();
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-slate-950 text-slate-100">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-[34rem] w-[34rem] rounded-full bg-emerald-500/10 blur-[120px] animate-fade-in" />
        <div className="absolute -right-40 top-20 h-[30rem] w-[30rem] rounded-full bg-cyan-500/10 blur-[120px] animate-fade-in" />
        <div className="absolute bottom-[-12rem] left-1/3 h-[28rem] w-[28rem] rounded-full bg-teal-500/[0.07] blur-[120px]" />
        <div
          className="absolute inset-0 opacity-[0.18]"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(148,163,184,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,0.08) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
            maskImage: 'radial-gradient(ellipse 80% 60% at 50% 35%, black 40%, transparent 100%)',
            WebkitMaskImage:
              'radial-gradient(ellipse 80% 60% at 50% 35%, black 40%, transparent 100%)',
          }}
        />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-5xl flex-col px-5 py-8 sm:px-8 sm:py-12">
        {/* Header / brand */}
        <header className="flex items-center justify-between gap-4 animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 shadow-lg shadow-emerald-500/30">
              <Sparkles className="h-5 w-5 text-slate-950" strokeWidth={2.5} />
            </div>
            <div className="leading-tight">
              <div className="text-base font-semibold tracking-tight text-white">
                AppForge
              </div>
              <div className="text-[11px] font-medium uppercase tracking-[0.16em] text-emerald-300/70">
                AI App Builder · iOS · Android · Web
              </div>
            </div>
          </div>

          {recentProjectName && (
            <div className="hidden items-center gap-2 rounded-full border border-slate-700/60 bg-slate-900/60 px-3 py-1.5 text-xs text-slate-300 backdrop-blur sm:flex animate-slide-in-right">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px] shadow-emerald-400/60" />
              <span className="text-slate-400">Recent:</span>
              <span className="max-w-[12rem] truncate font-medium text-slate-200">
                {recentProjectName}
              </span>
            </div>
          )}
        </header>

        {/* Hero */}
        <section className="mt-12 flex flex-col items-center text-center sm:mt-20 animate-fade-in-up">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/5 px-3.5 py-1.5 text-xs font-medium text-emerald-300 backdrop-blur">
            <Sparkles className="h-3.5 w-3.5" />
            Powered by autonomous build agents
          </div>
          <h1 className="max-w-3xl text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-5xl md:text-6xl">
            Describe your app.
            <br />
            <span className="bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-300 bg-clip-text text-transparent">
              Watch it build itself.
            </span>
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-400 sm:text-lg">
            AppForge turns a single prompt into a production-ready app — screens,
            data models, and logic assembled by AI in minutes, across iOS,
            Android, and the web.
          </p>
        </section>

        {/* Builder card */}
        <section className="mt-10 w-full animate-scale-in sm:mt-12">
          <div className="relative mx-auto w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-700/50 bg-slate-900/60 shadow-2xl shadow-black/40 backdrop-blur-xl">
            <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent" />

            {/* Mode toggle */}
            <div className="flex items-center gap-1 border-b border-slate-700/50 p-1.5">
              <ToggleButton
                active={mode === 'prompt'}
                onClick={() => setMode('prompt')}
                icon={PenLine}
                label="Write Prompt"
              />
              <ToggleButton
                active={mode === 'templates'}
                onClick={() => setMode('templates')}
                icon={LayoutGrid}
                label="Templates"
              />
            </div>

            {/* Prompt mode */}
            {mode === 'prompt' && (
              <div className="animate-fade-in p-5 sm:p-6">
                <label htmlFor="appforge-prompt" className="sr-only">
                  Describe your app
                </label>
                <textarea
                  id="appforge-prompt"
                  ref={textareaRef}
                  value={prompt}
                  onChange={(e) => {
                    setPrompt(e.target.value);
                    if (error) setError(null);
                  }}
                  onKeyDown={handleKeyDown}
                  rows={5}
                  placeholder="e.g. A habit tracker with daily streaks, reminders, and a weekly progress chart…"
                  className="scrollbar-thin w-full resize-none rounded-xl border border-slate-700/60 bg-slate-950/60 px-4 py-3.5 text-sm leading-relaxed text-slate-100 placeholder:text-slate-600 transition focus:border-emerald-400/60 focus:outline-none focus:ring-2 focus:ring-emerald-400/20"
                />

                {/* Example chips */}
                <div className="mt-3 flex flex-wrap gap-2">
                  {EXAMPLE_PROMPTS.map((example) => (
                    <button
                      key={example}
                      type="button"
                      onClick={() => applyExample(example)}
                      disabled={loading}
                      className="rounded-full border border-slate-700/60 bg-slate-800/40 px-3 py-1.5 text-xs text-slate-400 transition hover:border-emerald-400/40 hover:bg-emerald-400/5 hover:text-emerald-200 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {example}
                    </button>
                  ))}
                </div>

                {/* Platform selector */}
                <div className="mt-5">
                  <div className="mb-2 text-xs font-medium uppercase tracking-wider text-slate-500">
                    Target platform
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {PLATFORM_OPTIONS.map((opt) => {
                      const active = platform === opt.id;
                      const Icon = opt.icon;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => setPlatform(opt.id)}
                          disabled={loading}
                          className={[
                            'group flex items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-60',
                            active
                              ? 'border-emerald-400/60 bg-emerald-400/10 text-emerald-200 shadow-[0_0_20px_-6px] shadow-emerald-400/40'
                              : 'border-slate-700/60 bg-slate-950/40 text-slate-400 hover:border-slate-600 hover:text-slate-200',
                          ].join(' ')}
                        >
                          <Icon className="h-4 w-4" />
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <BuildButton loading={loading} onClick={handleBuild} disabled={loading} />
              </div>
            )}

            {/* Templates mode */}
            {mode === 'templates' && (
              <div className="animate-fade-in p-5 sm:p-6">
                <p className="mb-4 text-sm text-slate-400">
                  Start from a template — you can tweak the prompt before
                  building.
                </p>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {TEMPLATES.map((tpl) => {
                    const Icon = tpl.icon;
                    return (
                      <button
                        key={tpl.id}
                        type="button"
                        onClick={() => useTemplate(tpl)}
                        disabled={loading}
                        className={[
                          'group relative flex flex-col gap-3 overflow-hidden rounded-xl border border-slate-700/60 bg-slate-950/40 p-4 text-left transition hover:-translate-y-0.5 hover:border-slate-600 disabled:cursor-not-allowed disabled:opacity-60',
                          tpl.glow,
                        ].join(' ')}
                      >
                        <div
                          className={`absolute inset-0 bg-gradient-to-br ${tpl.gradient} opacity-60 transition group-hover:opacity-100`}
                        />
                        <div className="relative flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-700/60 bg-slate-900/80 text-slate-200 transition group-hover:text-white">
                            <Icon className="h-4.5 w-4.5" />
                          </div>
                          <div className="text-sm font-semibold text-white">
                            {tpl.name}
                          </div>
                          <ArrowRight className="ml-auto h-4 w-4 -translate-x-1 text-slate-500 opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100" />
                        </div>
                        <p className="relative text-xs leading-relaxed text-slate-400">
                          {tpl.description}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="animate-fade-in-up border-t border-rose-500/20 bg-rose-500/5 px-5 py-3 sm:px-6">
                <div className="flex items-start gap-2.5 text-sm text-rose-300">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              </div>
            )}
          </div>

          {/* Helper line */}
          <p className="mt-4 text-center text-xs text-slate-600">
            Press{' '}
            <kbd className="rounded border border-slate-700 bg-slate-800/60 px-1.5 py-0.5 font-mono text-[10px] text-slate-400">
              ⌘
            </kbd>{' '}
            +{' '}
            <kbd className="rounded border border-slate-700 bg-slate-800/60 px-1.5 py-0.5 font-mono text-[10px] text-slate-400">
              Enter
            </kbd>{' '}
            to build · No credit card required
          </p>
        </section>

        {/* Footer */}
        <footer className="mt-auto pt-12 text-center text-xs text-slate-600">
          <p>© {new Date().getFullYear()} AppForge · Built with autonomous AI</p>
        </footer>
      </div>
    </div>
  );
}

/* ---------- Sub-components ---------- */

function ToggleButton({
  active,
  onClick,
  icon: Icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: LucideIcon;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition',
        active
          ? 'bg-slate-800/80 text-white shadow-sm'
          : 'text-slate-400 hover:text-slate-200',
      ].join(' ')}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );
}

function BuildButton({
  loading,
  onClick,
  disabled,
}: {
  loading: boolean;
  onClick: () => void;
  disabled: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="group relative mt-5 flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-500 px-5 py-3.5 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/25 transition hover:shadow-emerald-500/40 hover:brightness-110 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-80 disabled:hover:brightness-100"
    >
      <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
      {loading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Starting...
        </>
      ) : (
        <>
          <Sparkles className="h-4 w-4" />
          Build app
          <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
        </>
      )}
    </button>
  );
}
