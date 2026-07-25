import { Users2, X } from 'lucide-react';

interface Collaborator {
  id: string;
  name: string;
  initials: string;
  editing: string;
  color: string;
  online: boolean;
}

const COLLABORATORS: Collaborator[] = [
  { id: '1', name: 'Sarah Chen', initials: 'SC', editing: 'Login Screen', color: '#f472b6', online: true },
  { id: '2', name: 'Marcus Reyes', initials: 'MR', editing: 'Dashboard Layout', color: '#60a5fa', online: true },
  { id: '3', name: 'Priya Patel', initials: 'PP', editing: 'Settings Page', color: '#34d399', online: true },
  { id: '4', name: 'James Okoro', initials: 'JO', editing: 'Onboarding Flow', color: '#fbbf24', online: true },
];

interface CollaborativeEditingPanelProps {
  open: boolean;
  onClose: () => void;
}

export function CollaborativeEditingPanel({ open, onClose }: CollaborativeEditingPanelProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg max-h-[85vh] flex flex-col rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500/15 text-indigo-400">
              <Users2 className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-100">Active Collaborators</h2>
              <p className="text-xs text-slate-400">{COLLABORATORS.length} online now</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {COLLABORATORS.map((user) => (
            <div
              key={user.id}
              className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-800/40 p-3"
            >
              <div className="relative shrink-0">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold text-white"
                  style={{ backgroundColor: user.color }}
                >
                  {user.initials}
                </div>
                <span
                  className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-slate-900 ${
                    user.online ? 'bg-emerald-400' : 'bg-slate-500'
                  }`}
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-slate-100">{user.name}</p>
                <div className="mt-1 flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 rounded-full ring-2 ring-slate-900"
                    style={{ backgroundColor: user.color }}
                  />
                  <span className="truncate text-xs text-slate-400">
                    Editing <span className="font-medium text-slate-300">{user.editing}</span>
                  </span>
                </div>
              </div>
              <span className="shrink-0 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-400">
                Live
              </span>
            </div>
          ))}

          <div className="rounded-xl border border-dashed border-slate-700 p-3 text-center">
            <p className="text-xs text-slate-400">
              Cursor colors are unique per collaborator to avoid conflicts.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
