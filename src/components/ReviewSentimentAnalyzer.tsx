import { MessageSquare, X, ThumbsUp, ThumbsDown, Minus, Sparkles } from 'lucide-react';
import { useState } from 'react';

interface ReviewSentimentAnalyzerProps {
  open: boolean;
  onClose: () => void;
}

const SENTIMENT = { positive: 68, negative: 19, neutral: 13 };
const TOPICS = [
  { id: crypto.randomUUID(), label: 'Onboarding', mentions: 142, sentiment: 'positive' },
  { id: crypto.randomUUID(), label: 'Performance', mentions: 98, sentiment: 'negative' },
  { id: crypto.randomUUID(), label: 'Pricing', mentions: 76, sentiment: 'neutral' },
  { id: crypto.randomUUID(), label: 'Design', mentions: 64, sentiment: 'positive' },
  { id: crypto.randomUUID(), label: 'Sync bugs', mentions: 41, sentiment: 'negative' },
];
const TIMELINE = [55, 60, 58, 64, 67, 72, 68, 74, 78, 75, 80, 68];

export default function ReviewSentimentAnalyzer({ open, onClose }: ReviewSentimentAnalyzerProps) {
  const [activeTopic, setActiveTopic] = useState(TOPICS[0].id);

  if (!open) return null;

  const sentColor = (s: string) => s === 'positive' ? 'text-emerald-400 bg-emerald-500/15' : s === 'negative' ? 'text-rose-400 bg-rose-500/15' : 'text-slate-400 bg-slate-700/40';
  const sentIcon = (s: string) => s === 'positive' ? <ThumbsUp className="w-3 h-3" /> : s === 'negative' ? <ThumbsDown className="w-3 h-3" /> : <Minus className="w-3 h-3" />;

  const maxTopic = Math.max(...TOPICS.map((t) => t.mentions));
  const maxTl = Math.max(...TIMELINE);
  const minTl = Math.min(...TIMELINE);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2"><MessageSquare className="w-5 h-5 text-violet-400" /><h3 className="text-sm font-semibold text-slate-100">Review Sentiment Analyzer</h3></div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X className="w-5 h-5" /></button>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin p-5 space-y-4">
          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3 text-center"><ThumbsUp className="w-4 h-4 text-emerald-400 mx-auto mb-1" /><p className="text-xl font-bold text-emerald-400">{SENTIMENT.positive}%</p><p className="text-[10px] text-slate-500">Positive</p></div>
            <div className="rounded-xl border border-slate-700 bg-slate-800/30 p-3 text-center"><Minus className="w-4 h-4 text-slate-400 mx-auto mb-1" /><p className="text-xl font-bold text-slate-300">{SENTIMENT.neutral}%</p><p className="text-[10px] text-slate-500">Neutral</p></div>
            <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-3 text-center"><ThumbsDown className="w-4 h-4 text-rose-400 mx-auto mb-1" /><p className="text-xl font-bold text-rose-400">{SENTIMENT.negative}%</p><p className="text-[10px] text-slate-500">Negative</p></div>
          </div>

          <div>
            <h4 className="text-xs text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5"><Sparkles className="w-3 h-3" /> Topic Extraction</h4>
            <div className="space-y-1.5">
              {TOPICS.map((t) => (
                <button key={t.id} onClick={() => setActiveTopic(t.id)} className={`w-full rounded-lg border p-2.5 text-left transition-colors ${activeTopic === t.id ? 'border-violet-500/50 bg-violet-500/10' : 'border-slate-800 bg-slate-950/40 hover:bg-slate-800/30'}`}>
                  <div className="flex items-center justify-between mb-1.5"><span className="text-xs font-medium text-slate-200">{t.label}</span><span className={`text-[9px] px-1.5 py-0.5 rounded-full flex items-center gap-1 ${sentColor(t.sentiment)}`}>{sentIcon(t.sentiment)} {t.sentiment}</span></div>
                  <div className="flex items-center gap-2"><div className="flex-1 h-1.5 rounded-full bg-slate-800 overflow-hidden"><div className="h-full rounded-full bg-violet-500" style={{ width: `${(t.mentions / maxTopic) * 100}%` }} /></div><span className="text-[10px] font-mono text-slate-500 w-8 text-right">{t.mentions}</span></div>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
            <h4 className="text-xs text-slate-500 uppercase tracking-wider mb-3">Sentiment Timeline (12 weeks)</h4>
            <svg width="100%" viewBox="0 0 480 120">
              <defs><linearGradient id="sentGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.3" /><stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" /></linearGradient></defs>
              <line x1="0" x2="480" y1="50" y2="50" stroke="#1e293b" strokeDasharray="4 4" />
              <text x="2" y="48" fontSize="8" fill="#475569">100%</text>
              {TIMELINE.map((v, i) => {
                const x = (i / (TIMELINE.length - 1)) * 460 + 10;
                const y = 110 - ((v - minTl) / (maxTl - minTl)) * 80;
                return <circle key={i} cx={x} cy={y} r="3" fill={v >= 70 ? '#10b981' : v >= 55 ? '#f59e0b' : '#ef4444'} />;
              })}
              {(() => {
                const pts = TIMELINE.map((v, i) => { const x = (i / (TIMELINE.length - 1)) * 460 + 10; const y = 110 - ((v - minTl) / (maxTl - minTl)) * 80; return `${x},${y}`; });
                return <><polyline points={pts.join(' ')} fill="none" stroke="#8b5cf6" strokeWidth="2" /><polygon points={`${pts.join(' ')} 470,110 10,110`} fill="url(#sentGrad)" /></>;
              })()}
            </svg>
            <div className="flex justify-between text-[9px] text-slate-600 mt-1"><span>W1</span><span>W6</span><span>W12</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
