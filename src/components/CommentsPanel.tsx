import { useState } from 'react';
import { MessageSquare, X, Send, Pin, Trash2, Plus } from 'lucide-react';
import type { AppRegion } from '@/types/builder';

interface Comment {
  id: string;
  regionId: string;
  regionName: string;
  text: string;
  author: string;
  timestamp: string;
  pinned: boolean;
}

interface CommentsPanelProps {
  open: boolean;
  onClose: () => void;
  regions: AppRegion[];
}

export default function CommentsPanel({ open, onClose, regions }: CommentsPanelProps) {
  const [comments, setComments] = useState<Comment[]>([
    { id: '1', regionId: regions[0]?.id ?? '', regionName: regions[0]?.region_name ?? 'Home', text: 'The header should be larger', author: 'You', timestamp: '2m ago', pinned: true },
    { id: '2', regionId: regions[1]?.id ?? '', regionName: regions[1]?.region_name ?? 'Settings', text: 'Add a logout button here', author: 'You', timestamp: '10m ago', pinned: false },
  ]);
  const [input, setInput] = useState('');
  const [selectedRegion, setSelectedRegion] = useState(regions[0]?.id ?? '');

  if (!open) return null;

  const addComment = () => {
    if (!input.trim()) return;
    const region = regions.find((r) => r.id === selectedRegion);
    setComments((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        regionId: selectedRegion,
        regionName: region?.region_name ?? 'Unknown',
        text: input.trim(),
        author: 'You',
        timestamp: 'Just now',
        pinned: false,
      },
    ]);
    setInput('');
  };

  const togglePin = (id: string) => {
    setComments((prev) => prev.map((c) => (c.id === id ? { ...c, pinned: !c.pinned } : c)));
  };

  const deleteComment = (id: string) => {
    setComments((prev) => prev.filter((c) => c.id !== id));
  };

  const sorted = [...comments].sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-cyan-400" />
            <h3 className="text-sm font-semibold text-slate-100">Comments</h3>
            <span className="text-xs text-slate-500">{comments.length}</span>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-2">
          {sorted.map((comment) => (
            <div
              key={comment.id}
              className={`rounded-xl border p-3 ${comment.pinned ? 'border-amber-500/30 bg-amber-500/5' : 'border-slate-800 bg-slate-950/40'}`}
            >
              <div className="flex items-start gap-2">
                <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-300 shrink-0">
                  {comment.author.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-xs font-semibold text-slate-200">{comment.author}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">{comment.regionName}</span>
                    <span className="text-[10px] text-slate-600 ml-auto">{comment.timestamp}</span>
                  </div>
                  <p className="text-xs text-slate-300">{comment.text}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => togglePin(comment.id)}
                      className={`text-[10px] inline-flex items-center gap-1 transition-colors ${
                        comment.pinned ? 'text-amber-400' : 'text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      <Pin className="w-3 h-3" />
                      {comment.pinned ? 'Pinned' : 'Pin'}
                    </button>
                    <button
                      onClick={() => deleteComment(comment.id)}
                      className="text-[10px] inline-flex items-center gap-1 text-slate-500 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-3 border-t border-slate-800 space-y-2">
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="w-full rounded-lg bg-slate-800 border border-slate-700 text-xs text-slate-200 px-2.5 py-1.5 focus:outline-none"
          >
            {regions.map((r) => (
              <option key={r.id} value={r.id}>{r.region_name}</option>
            ))}
          </select>
          <div className="flex items-center gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addComment()}
              placeholder="Add a comment..."
              className="flex-1 rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-slate-600"
            />
            <button
              onClick={addComment}
              disabled={!input.trim()}
              className="text-slate-400 hover:text-emerald-400 disabled:opacity-30 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
