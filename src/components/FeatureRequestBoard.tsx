import { Lightbulb, X } from 'lucide-react';

interface FeatureCard {
  id: string;
  title: string;
  votes: number;
}

interface Column {
  key: string;
  title: string;
  accent: string;
  cards: FeatureCard[];
}

const COLUMNS: Column[] = [
  {
    key: 'requested',
    title: 'Requested',
    accent: 'text-slate-400',
    cards: [
      { id: '1', title: 'Real-time multi-cursor editing', votes: 142 },
      { id: '2', title: 'Version history timeline', votes: 89 },
      { id: '3', title: 'Custom font uploader', votes: 34 },
    ],
  },
  {
    key: 'review',
    title: 'Under Review',
    accent: 'text-amber-400',
    cards: [
      { id: '4', title: 'AI component suggestions', votes: 203 },
      { id: '5', title: 'Figma plugin bridge', votes: 76 },
    ],
  },
  {
    key: 'planned',
    title: 'Planned',
    accent: 'text-indigo-400',
    cards: [
      { id: '6', title: 'Dark mode for preview', votes: 118 },
      { id: '7', title: 'Export to React Native', votes: 64 },
    ],
  },
  {
    key: 'shipped',
    title: 'Shipped',
    accent: 'text-emerald-400',
    cards: [
      { id: '8', title: 'Keyboard shortcut palette', votes: 95 },
    ],
  },
];

interface FeatureRequestBoardProps {
  open: boolean;
  onClose: () => void;
}

export function FeatureRequestBoard({ open, onClose }: FeatureRequestBoardProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg max-h-[85vh] flex flex-col rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/15 text-amber-400">
              <Lightbulb className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-100">Feature Requests</h2>
              <p className="text-xs text-slate-400">Community-driven roadmap board</p>
            </div>
          </div>
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors" aria-label="Close">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-x-auto overflow-y-hidden p-4">
          <div className="flex gap-3 h-full">
            {COLUMNS.map((col) => (
              <div key={col.key} className="flex w-44 shrink-0 flex-col rounded-xl border border-slate-800 bg-slate-800/30">
                <div className="flex items-center justify-between border-b border-slate-800 px-3 py-2">
                  <span className={`text-[10px] font-semibold uppercase tracking-wide ${col.accent}`}>{col.title}</span>
                  <span className="rounded-full bg-slate-700/60 px-1.5 text-[10px] text-slate-400">{col.cards.length}</span>
                </div>
                <div className="flex-1 space-y-2 overflow-y-auto p-2">
                  {col.cards.map((card) => (
                    <div key={card.id} className="rounded-lg border border-slate-800 bg-slate-900/60 p-2.5">
                      <p className="text-xs leading-snug text-slate-200">{card.title}</p>
                      <div className="mt-2 flex items-center gap-1 text-slate-500">
                        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M7 11l5-5 5 5M7 18l5-5 5 5" />
                        </svg>
                        <span className="text-[10px] font-medium text-slate-400">{card.votes}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
