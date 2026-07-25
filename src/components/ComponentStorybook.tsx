import { BookOpen, X, Check, AlertCircle, Loader2 } from 'lucide-react';
import { useState } from 'react';

interface Story {
  id: string;
  name: string;
  state: 'default' | 'empty' | 'loading' | 'error' | 'success' | 'disabled';
  preview: string;
}

const STATES: Story['state'][] = ['default', 'empty', 'loading', 'error', 'success', 'disabled'];

const COMPONENTS = ['Button', 'Input', 'Card', 'List', 'Avatar', 'Badge', 'Modal', 'Alert'];

const STATE_META: Record<string, { color: string; icon: React.ReactNode; desc: string }> = {
  default: { color: 'bg-slate-800 text-slate-300', icon: <Check className="w-3 h-3" />, desc: 'Normal state' },
  empty: { color: 'bg-slate-700 text-slate-400', icon: <AlertCircle className="w-3 h-3" />, desc: 'No data' },
  loading: { color: 'bg-cyan-500/20 text-cyan-400', icon: <Loader2 className="w-3 h-3 animate-spin" />, desc: 'Fetching data' },
  error: { color: 'bg-red-500/20 text-red-400', icon: <AlertCircle className="w-3 h-3" />, desc: 'Something went wrong' },
  success: { color: 'bg-emerald-500/20 text-emerald-400', icon: <Check className="w-3 h-3" />, desc: 'Completed' },
  disabled: { color: 'bg-slate-700 text-slate-600', icon: <Check className="w-3 h-3" />, desc: 'Not interactive' },
};

interface ComponentStorybookProps {
  open: boolean;
  onClose: () => void;
}

export default function ComponentStorybook({ open, onClose }: ComponentStorybookProps) {
  const [selected, setSelected] = useState('Button');
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2"><BookOpen className="w-5 h-5 text-cyan-400" /><h3 className="text-sm font-semibold text-slate-100">Component Storybook</h3></div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X className="w-5 h-5" /></button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          <div className="w-40 border-r border-slate-800 overflow-y-auto scrollbar-thin py-2 shrink-0">
            {COMPONENTS.map((c) => <button key={c} onClick={() => setSelected(c)} className={`w-full text-left px-3 py-2 text-xs transition-colors ${selected === c ? 'bg-slate-800 text-slate-100' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/30'}`}>{c}</button>)}
          </div>

          <div className="flex-1 overflow-y-auto scrollbar-thin p-4">
            <p className="text-sm font-medium text-slate-200 mb-3">{selected} — All States</p>
            <div className="grid grid-cols-2 gap-3">
              {STATES.map((state) => (
                <div key={state} className="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
                  <div className="flex items-center gap-2 mb-3"><span className={`text-[10px] px-1.5 py-0.5 rounded-full flex items-center gap-1 ${STATE_META[state].color}`}>{STATE_META[state].icon}{state}</span></div>
                  <div className="flex items-center justify-center py-4">
                    {selected === 'Button' && <button disabled={state === 'disabled' || state === 'loading'} className={`px-4 py-2 rounded-lg text-sm font-medium ${state === 'error' ? 'bg-red-500 text-white' : state === 'success' ? 'bg-emerald-500 text-white' : state === 'disabled' ? 'bg-slate-700 text-slate-500' : 'bg-cyan-500 text-white'} ${state === 'loading' ? 'opacity-60' : ''}`}>{state === 'loading' ? 'Loading...' : state === 'error' ? 'Error' : state === 'success' ? 'Success!' : state === 'empty' ? 'No Data' : state === 'disabled' ? 'Disabled' : 'Click Me'}</button>}
                    {selected === 'Input' && <input disabled={state === 'disabled'} placeholder={state === 'empty' ? 'Empty...' : state === 'error' ? 'Invalid input' : state === 'loading' ? 'Loading...' : 'Type here...'} className={`px-3 py-2 rounded-lg text-sm bg-slate-800 border ${state === 'error' ? 'border-red-500' : 'border-slate-700'} text-slate-200 ${state === 'disabled' ? 'opacity-50' : ''}`} />}
                    {selected === 'Card' && <div className={`w-full rounded-lg border p-3 ${state === 'error' ? 'border-red-500/50 bg-red-500/5' : state === 'success' ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-slate-700 bg-slate-800'} ${state === 'disabled' ? 'opacity-50' : ''}`}><div className="h-2 bg-slate-600 rounded w-3/4 mb-1" /><div className="h-2 bg-slate-700 rounded w-1/2" /></div>}
                    {!['Button', 'Input', 'Card'].includes(selected) && <div className={`text-sm ${state === 'disabled' ? 'text-slate-600' : 'text-slate-400'}`}>{selected} ({state})</div>}
                  </div>
                  <p className="text-[10px] text-slate-600 text-center">{STATE_META[state].desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
