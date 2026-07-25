import { GitPullRequest, X } from 'lucide-react';
import { useState } from 'react';

interface PullRequest {
  id: string;
  title: string;
  author: string;
  initials: string;
  color: string;
  reviewer: string;
  status: 'open' | 'approved' | 'changes';
}

const REVIEWERS = ['Unassigned', 'Sarah Chen', 'Marcus Reyes', 'Priya Patel', 'James Okoro'];

const STATUS_STYLES: Record<string, string> = {
  open: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
  approved: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  changes: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
};

const INITIAL_PRS: PullRequest[] = [
  { id: '1', title: 'Refactor auth middleware', author: 'James Okoro', initials: 'JO', color: '#fbbf24', reviewer: 'Unassigned', status: 'open' },
  { id: '2', title: 'Add CSV export endpoint', author: 'Sarah Chen', initials: 'SC', color: '#f472b6', reviewer: 'Marcus Reyes', status: 'changes' },
  { id: '3', title: 'Fix mobile sidebar overlap', author: 'Priya Patel', initials: 'PP', color: '#34d399', reviewer: 'Sarah Chen', status: 'approved' },
];

interface CodeReviewAssignmentProps {
  open: boolean;
  onClose: () => void;
}

export function CodeReviewAssignment({ open, onClose }: CodeReviewAssignmentProps) {
  const [prs, setPrs] = useState<PullRequest[]>(INITIAL_PRS);

  if (!open) return null;

  const setReviewer = (id: string, reviewer: string) => {
    setPrs((prev) => prev.map((p) => (p.id === id ? { ...p, reviewer } : p)));
  };

  const unassigned = prs.filter((p) => p.reviewer === 'Unassigned').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg max-h-[85vh] flex flex-col rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-500/15 text-violet-400">
              <GitPullRequest className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-100">Code Review Assignments</h2>
              <p className="text-xs text-slate-400">{prs.length} open PRs · {unassigned} need a reviewer</p>
            </div>
          </div>
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors" aria-label="Close">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {unassigned > 0 && (
            <div className="flex items-center gap-2 rounded-xl border border-violet-500/20 bg-violet-500/10 px-3 py-2">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-violet-400" />
              <span className="text-xs text-violet-300">
                Suggestion: assign James Okoro to PR #{prs.find((p) => p.reviewer === 'Unassigned')?.id} — he recently touched related files.
              </span>
            </div>
          )}

          {prs.map((pr) => (
            <div key={pr.id} className="rounded-xl border border-slate-800 bg-slate-800/40 p-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white" style={{ backgroundColor: pr.color }}>
                    {pr.initials}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-xs font-medium text-slate-100">{pr.title}</p>
                    <p className="text-[10px] text-slate-500">by {pr.author}</p>
                  </div>
                </div>
                <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-medium capitalize ${STATUS_STYLES[pr.status]}`}>
                  {pr.status}
                </span>
              </div>
              <div className="mt-2.5 flex items-center gap-2">
                <span className="text-[10px] text-slate-500">Reviewer</span>
                <select
                  value={pr.reviewer}
                  onChange={(e) => setReviewer(pr.id, e.target.value)}
                  className="flex-1 rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-[11px] text-slate-200 focus:border-violet-500/50 focus:outline-none"
                >
                  {REVIEWERS.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
