import { MapPin, X } from 'lucide-react';

interface RoadmapItem {
  id: string;
  title: string;
  tag: string;
}

interface Lane {
  key: string;
  title: string;
  color: string;
  items: RoadmapItem[];
}

const QUARTERS = ['Q1', 'Q2', 'Q3', 'Q4'];

const LANES: Lane[] = [
  {
    key: 'now',
    title: 'Now',
    color: 'border-emerald-500/40 bg-emerald-500/5',
    items: [
      { id: '1', title: 'Real-time collaboration', tag: 'In Progress' },
      { id: '2', title: 'Component library 2.0', tag: 'In Progress' },
    ],
  },
  {
    key: 'next',
    title: 'Next',
    color: 'border-indigo-500/40 bg-indigo-500/5',
    items: [
      { id: '3', title: 'AI design suggestions', tag: 'Designing' },
      { id: '4', title: 'Version history', tag: 'Scoped' },
      { id: '5', title: 'Export to code', tag: 'Scoped' },
    ],
  },
  {
    key: 'later',
    title: 'Later',
    color: 'border-slate-600/40 bg-slate-700/10',
    items: [
      { id: '6', title: 'Mobile companion app', tag: 'Research' },
      { id: '7', title: 'Marketplace plugins', tag: 'Research' },
    ],
  },
];

interface InteractiveRoadmapProps {
  open: boolean;
  onClose: () => void;
}

export function InteractiveRoadmap({ open, onClose }: InteractiveRoadmapProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg max-h-[85vh] flex flex-col rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-rose-500/15 text-rose-400">
              <MapPin className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-100">Product Roadmap</h2>
              <p className="text-xs text-slate-400">Now · Next · Later across {QUARTERS.join(' / ')}</p>
            </div>
          </div>
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors" aria-label="Close">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="border-b border-slate-800 px-5 py-2.5">
          <div className="flex items-center justify-between">
            {QUARTERS.map((q) => (
              <span key={q} className="text-[10px] font-medium uppercase tracking-wide text-slate-500">{q} 2025</span>
            ))}
          </div>
          <div className="mt-1.5 h-1 rounded-full bg-gradient-to-r from-emerald-500/60 via-indigo-500/40 to-slate-600/40" />
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {LANES.map((lane) => (
            <div key={lane.key}>
              <div className="mb-2 flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-200">{lane.title}</span>
                <span className="text-[10px] text-slate-500">{lane.items.length} items</span>
              </div>
              <div className={`space-y-2 rounded-xl border p-3 ${lane.color}`}>
                {lane.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between rounded-lg bg-slate-900/50 px-3 py-2">
                    <span className="text-xs text-slate-200">{item.title}</span>
                    <span className="shrink-0 rounded-full bg-slate-700/50 px-2 py-0.5 text-[9px] text-slate-400">{item.tag}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
