import { useEffect, useState } from 'react';
import { Plus, FolderOpen, Calendar, Sparkles, ArrowRight } from 'lucide-react';
import type { Project } from '@/lib/types';
import { supabase } from '@/lib/supabase';

interface ProjectDashboardProps {
  onOpen: (project: Project) => void;
  onNew: () => void;
}

const STATUS_STYLES: Record<string, string> = {
  draft: 'bg-slate-700/50 text-slate-300 ring-slate-600/40',
  building: 'bg-amber-500/10 text-amber-300 ring-amber-500/30',
  ready: 'bg-emerald-500/10 text-emerald-300 ring-emerald-500/30',
  deployed: 'bg-sky-500/10 text-sky-300 ring-sky-500/30',
  error: 'bg-rose-500/10 text-rose-300 ring-rose-500/30',
};

const APP_TYPE_STYLES: Record<string, string> = {
  web: 'bg-violet-500/10 text-violet-300 ring-violet-500/30',
  mobile: 'bg-sky-500/10 text-sky-300 ring-sky-500/30',
  desktop: 'bg-teal-500/10 text-teal-300 ring-teal-500/30',
  api: 'bg-fuchsia-500/10 text-fuchsia-300 ring-fuchsia-500/30',
};

const SKELETON_COUNT = 6;

export default function ProjectDashboard({ onOpen, onNew }: ProjectDashboardProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error: fetchError } = await supabase
          .from('projects')
          .select('*')
          .order('created_at', { ascending: false });
        if (fetchError) throw fetchError;
        if (!cancelled) setProjects((data ?? []) as Project[]);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load projects');
          setProjects([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const statusBadge = (status: string) => {
    const label = status.charAt(0).toUpperCase() + status.slice(1);
    const cls = STATUS_STYLES[status] ?? 'bg-slate-700/50 text-slate-300 ring-slate-600/40';
    return (
      <span
        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${cls}`}
      >
        {label}
      </span>
    );
  };

  const appTypeBadge = (appType: string) => {
    const label = appType.charAt(0).toUpperCase() + appType.slice(1);
    const cls = APP_TYPE_STYLES[appType] ?? 'bg-slate-700/50 text-slate-300 ring-slate-600/40';
    return (
      <span
        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${cls}`}
      >
        {label}
      </span>
    );
  };

  const formatDate = (iso: string) => {
    try {
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }).format(new Date(iso));
    } catch {
      return '—';
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 shadow-lg shadow-violet-500/20">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">
                Projects
              </h1>
              <p className="text-sm text-slate-400">
                Build, manage, and ship your AI apps
              </p>
            </div>
          </div>
          <button
            onClick={onNew}
            className="group inline-flex items-center justify-center gap-2 rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-violet-600/20 transition-all hover:bg-violet-500 hover:shadow-violet-500/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 active:scale-[0.98]"
          >
            <Plus className="h-4 w-4 transition-transform group-hover:rotate-90" />
            New Project
          </button>
        </header>

        {/* Error state */}
        {error && !loading && (
          <div className="mb-6 rounded-lg border border-rose-500/30 bg-rose-500/5 px-4 py-3 text-sm text-rose-300">
            {error}
          </div>
        )}

        {/* Loading skeletons */}
        {loading && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
              <div
                key={i}
                className="rounded-xl border border-slate-800 bg-slate-900/60 p-5"
                style={{ animation: `pulse-soft 1.5s ease-in-out ${i * 0.08}s infinite` }}
              >
                <div className="h-4 w-2/3 rounded bg-slate-700/60" />
                <div className="mt-4 flex gap-2">
                  <div className="h-5 w-16 rounded-full bg-slate-700/50" />
                  <div className="h-5 w-16 rounded-full bg-slate-700/50" />
                </div>
                <div className="mt-6 h-3 w-1/3 rounded bg-slate-700/40" />
                <div className="mt-5 h-9 w-full rounded-lg bg-slate-700/40" />
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && projects.length === 0 && !error && (
          <div className="flex min-h-[50vh] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/30 px-6 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-800/80 ring-1 ring-slate-700">
              <FolderOpen className="h-8 w-8 text-slate-500" />
            </div>
            <h2 className="mt-5 text-lg font-semibold text-white">No projects yet</h2>
            <p className="mt-1.5 max-w-sm text-sm text-slate-400">
              Start building something amazing. Your AI-generated apps will appear here.
            </p>
            <button
              onClick={onNew}
              className="group mt-6 inline-flex items-center justify-center gap-2 rounded-lg bg-violet-600 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-violet-600/20 transition-all hover:bg-violet-500 hover:shadow-violet-500/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 active:scale-[0.98]"
            >
              <Plus className="h-4 w-4 transition-transform group-hover:rotate-90" />
              Create your first app
            </button>
          </div>
        )}

        {/* Project grid */}
        {!loading && projects.length > 0 && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project, i) => (
              <article
                key={project.id}
                onClick={() => onOpen(project)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onOpen(project);
                  }
                }}
                style={{ animation: `fade-in-up 0.4s ease-out ${i * 0.05}s both` }}
                className="group relative cursor-pointer overflow-hidden rounded-xl border border-slate-800 bg-slate-900/60 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-violet-500/40 hover:bg-slate-900 hover:shadow-xl hover:shadow-violet-500/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
              >
                {/* Accent gradient on hover */}
                <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-violet-500/0 to-fuchsia-500/0 opacity-0 transition-opacity duration-300 group-hover:from-violet-500/5 group-hover:to-fuchsia-500/5 group-hover:opacity-100" />

                <div className="flex items-start justify-between gap-3">
                  <h3 className="line-clamp-1 text-base font-semibold text-white">
                    {project.name}
                  </h3>
                  <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-slate-500 transition-all duration-300 group-hover:translate-x-1 group-hover:text-violet-400" />
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  {appTypeBadge(project.app_type)}
                  {statusBadge(project.status)}
                </div>

                <div className="mt-6 flex items-center gap-1.5 text-xs text-slate-500">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>{formatDate(project.created_at)}</span>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpen(project);
                  }}
                  className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-2 text-sm font-medium text-slate-300 transition-all hover:border-violet-500/40 hover:bg-violet-600/10 hover:text-violet-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
                >
                  Open
                  <ArrowRight className="h-4 w-4" />
                </button>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
