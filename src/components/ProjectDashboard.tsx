import { useState, useEffect, useCallback } from 'react';
import {
  Plus,
  Search,
  Clock,
  CheckCircle2,
  Loader2,
  Trash2,
  ArrowRight,
  Layers,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Project } from '@/types/builder';

interface DashboardProps {
  onOpen: (project: Project) => void;
  onNew: () => void;
}

export default function ProjectDashboard({ onOpen, onNew }: DashboardProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'completed' | 'building'>('all');

  const loadProjects = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) {
      setProjects(data as unknown as Project[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const handleDelete = async (id: string) => {
    await supabase.from('projects').delete().eq('id', id);
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  const filtered = projects.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || p.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">My Projects</h1>
            <p className="text-slate-400 text-sm mt-1">
              {projects.length} project{projects.length !== 1 ? 's' : ''} total
            </p>
          </div>
          <button
            onClick={onNew}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-900 font-semibold text-sm transition-all hover:shadow-lg hover:shadow-emerald-500/25 hover:scale-[1.02] active:scale-95"
          >
            <Plus className="w-4 h-4" />
            New App
          </button>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search projects..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-slate-700"
            />
          </div>
          <div className="flex items-center gap-1.5">
            {(['all', 'completed', 'building'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-2 rounded-lg text-xs font-medium capitalize transition-colors ${
                  filter === f
                    ? 'bg-slate-800 text-slate-100'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-2xl bg-slate-900 flex items-center justify-center mb-4">
              <Layers className="w-8 h-8 text-slate-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-300 mb-1">No projects yet</h3>
            <p className="text-sm text-slate-500 mb-4">Start by creating your first app</p>
            <button
              onClick={onNew}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 text-slate-200 text-sm font-medium hover:bg-slate-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Create app
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onOpen={() => onOpen(project)}
                onDelete={() => handleDelete(project.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ProjectCard({
  project,
  onOpen,
  onDelete,
}: {
  project: Project;
  onOpen: () => void;
  onDelete: () => void;
}) {
  const cs = project.config?.colorScheme;
  return (
    <div className="group relative rounded-2xl border border-slate-800 bg-slate-900/60 p-5 hover:border-slate-700 transition-all cursor-pointer animate-fade-in-up">
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shrink-0"
          style={{ background: cs ? `linear-gradient(135deg, ${cs.primary}, ${cs.secondary})` : 'linear-gradient(135deg, #0f766e, #14b8a6)' }}
        >
          {project.name.charAt(0).toUpperCase()}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400 transition-all p-1"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
      <h3 className="text-base font-semibold text-slate-100 mb-1 truncate">{project.name}</h3>
      <p className="text-xs text-slate-500 mb-3 line-clamp-2">{project.prompt}</p>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 capitalize">
          {project.app_type}
        </span>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 capitalize">
          {project.platform}
        </span>
      </div>
      <div className="flex items-center justify-between pt-3 border-t border-slate-800">
        <div className="flex items-center gap-1.5">
          {project.status === 'completed' ? (
            <span className="flex items-center gap-1 text-xs text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Completed
            </span>
          ) : project.status === 'building' ? (
            <span className="flex items-center gap-1 text-xs text-cyan-400">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Building
            </span>
          ) : (
            <span className="text-xs text-slate-500">{project.status}</span>
          )}
          <span className="text-xs text-slate-600 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {new Date(project.created_at).toLocaleDateString()}
          </span>
        </div>
        <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-slate-300 group-hover:translate-x-0.5 transition-all" />
      </div>
    </div>
  );
}
