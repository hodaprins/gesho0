import { MessageSquarePlus, X } from 'lucide-react';
import { useState } from 'react';

interface ReviewComment {
  id: string;
  screen: string;
  author: string;
  initials: string;
  color: string;
  text: string;
  status: 'pending' | 'approved' | 'changes';
}

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  approved: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  changes: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
};

const INITIAL_COMMENTS: ReviewComment[] = [
  { id: '1', screen: 'Hero Section', author: 'Sarah Chen', initials: 'SC', color: '#f472b6', text: 'The CTA needs more contrast against the gradient.', status: 'changes' },
  { id: '2', screen: 'Pricing Card', author: 'Marcus Reyes', initials: 'MR', color: '#60a5fa', text: 'Typography hierarchy looks great here.', status: 'approved' },
  { id: '3', screen: 'Footer', author: 'Priya Patel', initials: 'PP', color: '#34d399', text: 'Can we add social proof badges?', status: 'pending' },
];

interface DesignReviewSystemProps {
  open: boolean;
  onClose: () => void;
}

export function DesignReviewSystem({ open, onClose }: DesignReviewSystemProps) {
  const [comments, setComments] = useState<ReviewComment[]>(INITIAL_COMMENTS);
  const [draft, setDraft] = useState('');

  if (!open) return null;

  const addComment = () => {
    if (!draft.trim()) return;
    setComments((prev) => [
      ...prev,
      {
        id: String(prev.length + 1),
        screen: 'Active Screen',
        author: 'You',
        initials: 'YO',
        color: '#a78bfa',
        text: draft.trim(),
        status: 'pending',
      },
    ]);
    setDraft('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg max-h-[85vh] flex flex-col rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-fuchsia-500/15 text-fuchsia-400">
              <MessageSquarePlus className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-100">Design Review</h2>
              <p className="text-xs text-slate-400">{comments.length} comments across screens</p>
            </div>
          </div>
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors" aria-label="Close">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {comments.map((c) => (
            <div key={c.id} className="rounded-xl border border-slate-800 bg-slate-800/40 p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-bold text-white" style={{ backgroundColor: c.color }}>
                    {c.initials}
                  </span>
                  <div>
                    <p className="text-xs font-medium text-slate-100">{c.author}</p>
                    <p className="text-[10px] text-slate-500">on {c.screen}</p>
                  </div>
                </div>
                <span className={`rounded-full border px-2 py-0.5 text-[10px] font-medium capitalize ${STATUS_STYLES[c.status]}`}>
                  {c.status}
                </span>
              </div>
              <p className="mt-2 text-xs text-slate-300">{c.text}</p>
            </div>
          ))}

          <div className="rounded-xl border border-slate-800 bg-slate-800/40 p-3">
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Add a review comment..."
              rows={2}
              className="w-full resize-none rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:border-fuchsia-500/50 focus:outline-none"
            />
            <div className="mt-2 flex justify-end">
              <button onClick={addComment} className="rounded-lg bg-fuchsia-500/90 px-3 py-1.5 text-xs font-medium text-white hover:bg-fuchsia-500 transition-colors">
                Add Comment
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
