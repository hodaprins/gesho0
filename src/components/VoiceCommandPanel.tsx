import { useState, useEffect } from 'react';
import { Mic, MicOff, X, Sparkles, Volume2 } from 'lucide-react';

interface VoiceCommandPanelProps {
  open: boolean;
  onClose: () => void;
}

const SUGGESTIONS = [
  'Add login screen',
  'Change color to blue',
  'Add navigation bar',
  'Create a settings page',
  'Add a profile avatar',
];

export default function VoiceCommandPanel({ open, onClose }: VoiceCommandPanelProps) {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [bars, setBars] = useState<number[]>(Array(24).fill(4));

  useEffect(() => {
    if (!listening) return;
    const interval = setInterval(() => {
      setBars((prev) => prev.map(() => 4 + Math.random() * 28));
    }, 120);
    const phrases = ['Add', 'Add a', 'Add a login', 'Add a login screen', 'Add a login screen with email and password'];
    let idx = 0;
    const tInterval = setInterval(() => {
      if (idx < phrases.length) {
        setTranscript(phrases[idx]);
        idx++;
      }
    }, 600);
    return () => {
      clearInterval(interval);
      clearInterval(tInterval);
    };
  }, [listening]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Mic className="w-5 h-5 text-rose-400" />
            <h3 className="text-sm font-semibold text-slate-100">Voice Commands</h3>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-6 flex flex-col items-center gap-4">
          <div className="relative">
            <button
              onClick={() => { setListening(!listening); if (!listening) setTranscript(''); }}
              className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${listening ? 'bg-rose-500 shadow-[0_0_30px_rgba(244,63,94,0.5)]' : 'bg-slate-800 hover:bg-slate-700'}`}
            >
              {listening ? <Mic className="w-8 h-8 text-white" /> : <MicOff className="w-8 h-8 text-slate-400" />}
            </button>
            {listening && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 animate-ping" />
            )}
          </div>

          <div className="flex items-end justify-center gap-1 h-10 w-full max-w-xs">
            {bars.map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-full transition-all duration-100"
                style={{ height: listening ? `${h}px` : '4px', background: listening ? 'linear-gradient(to top, #f43f5e, #fb7185)' : '#334155' }}
              />
            ))}
          </div>

          <div className="w-full rounded-xl border border-slate-800 bg-slate-950/50 p-4 min-h-[72px] flex items-center justify-center">
            {transcript ? (
              <p className="text-sm text-slate-200 text-center flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-rose-400" /> {transcript}
              </p>
            ) : (
              <p className="text-xs text-slate-500 text-center">{listening ? 'Listening...' : 'Tap the mic and speak a command'}</p>
            )}
          </div>
        </div>

        <div className="px-5 pb-5">
          <div className="flex items-center gap-1.5 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-xs font-medium text-slate-300">Try saying</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => setTranscript(s)}
                className="text-[11px] px-3 py-1.5 rounded-full border border-slate-800 bg-slate-950/40 text-slate-400 hover:text-slate-200 hover:border-rose-500/40 transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
