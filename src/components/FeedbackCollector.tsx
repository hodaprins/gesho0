import { MessageCircle, X, Star } from 'lucide-react';
import { useState } from 'react';

interface FeedbackItem {
  id: string;
  author: string;
  rating: number;
  category: string;
  comment: string;
}

const CATEGORIES = ['General', 'Usability', 'Performance', 'Design', 'Feature Request'];

const INITIAL_FEEDBACK: FeedbackItem[] = [
  { id: '1', author: 'Sarah C.', rating: 4, category: 'Usability', comment: 'The drag-and-drop builder is intuitive but could use keyboard shortcuts.' },
  { id: '2', author: 'Marcus R.', rating: 5, category: 'Design', comment: 'Love the new dark theme — much easier on the eyes for long sessions.' },
  { id: '3', author: 'Priya P.', rating: 3, category: 'Performance', comment: 'Loading times spike when the project has 20+ screens.' },
];

interface FeedbackCollectorProps {
  open: boolean;
  onClose: () => void;
}

export function FeedbackCollector({ open, onClose }: FeedbackCollectorProps) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [items, setItems] = useState<FeedbackItem[]>(INITIAL_FEEDBACK);

  if (!open) return null;

  const submit = () => {
    if (!comment.trim() || rating === 0) return;
    setItems((prev) => [
      { id: String(prev.length + 1), author: 'You', rating, category, comment: comment.trim() },
      ...prev,
    ]);
    setComment('');
    setRating(0);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg max-h-[85vh] flex flex-col rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-500/15 text-cyan-400">
              <MessageCircle className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-100">Stakeholder Feedback</h2>
              <p className="text-xs text-slate-400">{items.length} responses collected</p>
            </div>
          </div>
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors" aria-label="Close">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          <div className="rounded-xl border border-slate-800 bg-slate-800/40 p-4 space-y-3">
            <div>
              <label className="text-xs font-medium text-slate-300">Rating</label>
              <div className="mt-1.5 flex gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    onMouseEnter={() => setHover(n)}
                    onMouseLeave={() => setHover(0)}
                    onClick={() => setRating(n)}
                    className="transition-transform hover:scale-110"
                    aria-label={`Rate ${n} stars`}
                  >
                    <Star
                      className={`h-6 w-6 ${(hover || rating) >= n ? 'fill-amber-400 text-amber-400' : 'text-slate-600'}`}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-slate-300">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-100 focus:border-cyan-500/50 focus:outline-none"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-end">
                <button onClick={submit} className="w-full rounded-lg bg-cyan-500/90 px-3 py-2 text-xs font-medium text-white hover:bg-cyan-500 transition-colors">
                  Submit Feedback
                </button>
              </div>
            </div>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your thoughts..."
              rows={2}
              className="w-full resize-none rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:border-cyan-500/50 focus:outline-none"
            />
          </div>

          {items.map((item) => (
            <div key={item.id} className="rounded-xl border border-slate-800 bg-slate-800/40 p-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-100">{item.author}</span>
                <span className="rounded-full bg-slate-700/60 px-2 py-0.5 text-[10px] text-slate-300">{item.category}</span>
              </div>
              <div className="mt-1 flex gap-0.5">
                {[1, 2, 3, 4, 5].map((n) => (
                  <Star key={n} className={`h-3.5 w-3.5 ${item.rating >= n ? 'fill-amber-400 text-amber-400' : 'text-slate-600'}`} />
                ))}
              </div>
              <p className="mt-1.5 text-xs text-slate-400">{item.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
