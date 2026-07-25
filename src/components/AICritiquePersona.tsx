import { useState, useEffect } from 'react';
import { Brain, X, Send, User, Loader2, RotateCcw } from 'lucide-react';

interface CritiquePersona {
  id: string;
  name: string;
  emoji: string;
  age: number;
  techLevel: 'low' | 'medium' | 'high';
  background: string;
  avatar: string;
}

interface CritiqueMessage {
  persona: string;
  text: string;
  sentiment: 'positive' | 'neutral' | 'negative';
}

const PERSONAS: CritiquePersona[] = [
  { id: 'grandma', name: 'Grandma Helen', emoji: '👵', age: 72, techLevel: 'low', background: 'Rarely uses phones, needs large text and clear buttons', avatar: 'https://images.pexels.com/photos/3760263/pexels-photo-3760263.jpeg?auto=compress&cs=tinysrgb&w=80' },
  { id: 'teen', name: 'Teen Alex', emoji: '🧑', age: 16, techLevel: 'high', background: 'Power user, expects TikTok-level speed and animations', avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=80' },
  { id: 'exec', name: 'CEO Marcus', emoji: '👨', age: 45, techLevel: 'medium', background: 'Busy executive, values efficiency and data over design', avatar: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=80' },
  { id: 'blind', name: 'Sara (Visual Impairment)', emoji: '👩', age: 30, techLevel: 'high', background: 'Uses screen reader, relies on VoiceOver/TalkBack', avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=80' },
  { id: 'nonnative', name: 'Chen (ESL)', emoji: '🧔', age: 28, techLevel: 'medium', background: 'Non-native English speaker, needs simple language', avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=80' },
  { id: 'power', name: 'Dev Sam', emoji: '👨‍💻', age: 26, techLevel: 'high', background: 'Developer who notices every bug and slow animation', avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=80' },
  { id: 'impatient', name: 'Rush Rita', emoji: '🏃‍♀', age: 35, techLevel: 'medium', background: 'Always in a hurry, will abandon if it takes 3 extra taps', avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=80' },
];

const SAMPLE_CRITIQUES: Record<string, CritiqueMessage[]> = {
  grandma: [
    { persona: 'grandma', text: 'The text is too small! I can barely read the labels on the buttons.', sentiment: 'negative' },
    { persona: 'grandma', text: 'I like that the main button is big and colorful though. That helps.', sentiment: 'positive' },
    { persona: 'grandma', text: 'Too many options on one screen. My eyes get confused. Could you simplify?', sentiment: 'negative' },
  ],
  teen: [
    { persona: 'teen', text: 'No animations? Feels dead. Add some transitions and haptic feedback!', sentiment: 'negative' },
    { persona: 'teen', text: 'The dark mode looks sick. Instant vibes.', sentiment: 'positive' },
    { persona: 'teen', text: 'Loading takes forever. I already closed it and opened TikTok.', sentiment: 'negative' },
  ],
  exec: [
    { persona: 'exec', text: 'Where are the metrics? I need to see numbers within 2 taps.', sentiment: 'negative' },
    { persona: 'exec', text: 'Clean layout. No fluff. I appreciate the direct approach.', sentiment: 'positive' },
    { persona: 'exec', text: 'The settings menu is buried 4 levels deep. Unacceptable for daily use.', sentiment: 'negative' },
  ],
  blind: [
    { persona: 'blind', text: 'Three buttons have no aria-label. VoiceOver reads them as "button, button, button".', sentiment: 'negative' },
    { persona: 'blind', text: 'The form has proper labels. Thank you for that!', sentiment: 'positive' },
    { persona: 'blind', text: 'Focus order jumps around randomly when I swipe. Needs fixing.', sentiment: 'negative' },
  ],
  nonnative: [
    { persona: 'nonnative', text: 'Some words are very difficult. "Expedite" - what means? Use simple words please.', sentiment: 'negative' },
    { persona: 'nonnative', text: 'Icons help me understand. The shopping cart icon is universal.', sentiment: 'positive' },
  ],
  power: [
    { persona: 'power', text: 'The API calls are not batched. I can see 12 separate requests on screen load.', sentiment: 'negative' },
    { persona: 'power', text: 'No offline caching? This will break on a train. Add AsyncStorage.', sentiment: 'negative' },
    { persona: 'power', text: 'TypeScript is well-typed. Good job on the interfaces.', sentiment: 'positive' },
  ],
  impatient: [
    { persona: 'impatient', text: 'Why do I need to confirm TWICE before deleting? One warning is enough!', sentiment: 'negative' },
    { persona: 'impatient', text: 'The checkout is 5 steps. Amazon does it in 1. Cut it down.', sentiment: 'negative' },
    { persona: 'impatient', text: 'Search bar is right at the top. Good - I found what I needed fast.', sentiment: 'positive' },
  ],
};

interface AICritiquePersonaProps {
  open: boolean;
  onClose: () => void;
  appName: string;
  regions: { id: string; region_name: string; region_type: string }[];
}

export default function AICritiquePersona({ open, onClose, appName, regions }: AICritiquePersonaProps) {
  const [activePersona, setActivePersona] = useState(0);
  const [messages, setMessages] = useState<CritiqueMessage[]>([]);
  const [generating, setGenerating] = useState(false);
  const [selectedScreen, setSelectedScreen] = useState(0);

  useEffect(() => {
    if (open && messages.length === 0) generate();
  }, [open]);

  if (!open) return null;

  const generate = () => {
    setGenerating(true);
    setMessages([]);
    setTimeout(() => {
      const persona = PERSONAS[activePersona];
      setMessages(SAMPLE_CRITIQUES[persona.id] ?? [{ persona: persona.id, text: 'I need more time to analyze this app.', sentiment: 'neutral' }]);
      setGenerating(false);
    }, 1500);
  };

  const persona = PERSONAS[activePersona];
  const positive = messages.filter((m) => m.sentiment === 'positive').length;
  const negative = messages.filter((m) => m.sentiment === 'negative').length;
  const score = messages.length > 0 ? Math.round((positive / messages.length) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2"><Brain className="w-5 h-5 text-purple-400" /><h3 className="text-sm font-semibold text-slate-100">AI App Critique</h3><span className="text-xs text-slate-500">{appName}</span></div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X className="w-5 h-5" /></button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          <div className="w-48 border-r border-slate-800 overflow-y-auto scrollbar-thin py-2 shrink-0">
            {PERSONAS.map((p, i) => (
              <button key={p.id} onClick={() => { setActivePersona(i); setMessages([]); }} className={`w-full flex items-center gap-2 px-3 py-2 text-left transition-colors ${i === activePersona ? 'bg-slate-800' : 'hover:bg-slate-800/30'}`}>
                <img src={p.avatar} alt={p.name} className="w-8 h-8 rounded-full object-cover" />
                <div className="min-w-0"><p className="text-xs font-medium text-slate-200 truncate">{p.name}</p><p className="text-[9px] text-slate-500">{p.age}y · {p.techLevel} tech</p></div>
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-3">
            <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3">
              <div className="flex items-center gap-2 mb-1"><span className="text-lg">{persona.emoji}</span><p className="text-sm font-medium text-slate-200">{persona.name}</p></div>
              <p className="text-xs text-slate-500">{persona.background}</p>
            </div>

            <select value={selectedScreen} onChange={(e) => setSelectedScreen(Number(e.target.value))} className="w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-xs text-slate-200">
              {regions.map((r, i) => <option key={r.id} value={i}>Analyzing: {r.region_name}</option>)}
            </select>

            {generating ? (
              <div className="flex flex-col items-center justify-center py-12 gap-2"><Loader2 className="w-8 h-8 text-purple-400 animate-spin" /><p className="text-xs text-slate-500">{persona.name} is using your app...</p></div>
            ) : (
              <>
                <div className="space-y-2">
                  {messages.map((m, i) => (
                    <div key={i} className={`flex items-start gap-2 animate-fade-in-up ${m.sentiment === 'positive' ? '' : ''}`} style={{ animationDelay: `${i * 100}ms` }}>
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0 ${m.sentiment === 'positive' ? 'bg-emerald-500/20' : m.sentiment === 'negative' ? 'bg-red-500/20' : 'bg-slate-700'}`}>{persona.emoji}</div>
                      <div className={`flex-1 rounded-xl p-3 text-xs ${m.sentiment === 'positive' ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-200' : m.sentiment === 'negative' ? 'bg-red-500/10 border border-red-500/20 text-red-200' : 'bg-slate-800 text-slate-300'}`}>{m.text}</div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2">
                  <div className="rounded-lg bg-emerald-500/10 p-2 text-center"><p className="text-lg font-bold text-emerald-400">{positive}</p><p className="text-[10px] text-slate-500">Positive</p></div>
                  <div className="rounded-lg bg-red-500/10 p-2 text-center"><p className="text-lg font-bold text-red-400">{negative}</p><p className="text-[10px] text-slate-500">Negative</p></div>
                  <div className="rounded-lg bg-slate-800 p-2 text-center"><p className="text-lg font-bold text-slate-100">{score}%</p><p className="text-[10px] text-slate-500">Score</p></div>
                </div>
              </>
            )}

            <button onClick={generate} disabled={generating} className="w-full inline-flex items-center justify-center gap-1.5 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-medium hover:bg-slate-700 disabled:opacity-40"><RotateCcw className="w-3.5 h-3.5" /> Regenerate critique</button>
          </div>
        </div>
      </div>
    </div>
  );
}
