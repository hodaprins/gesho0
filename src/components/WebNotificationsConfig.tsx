import { Bell, X, Smartphone, Volume2, BellOff } from 'lucide-react';
import { useState } from 'react';

export default function WebNotificationsConfig({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [title, setTitle] = useState('New Message');
  const [body, setBody] = useState('You have a new message from John');
  const [silent, setSilent] = useState(false);
  const [vibrate, setVibrate] = useState(true);
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2"><Bell className="w-5 h-5 text-amber-400" /><h3 className="text-sm font-semibold text-slate-100">Web Notifications</h3></div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X className="w-5 h-5" /></button>
        </div>
        <div className="flex flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-3">
            <div><label className="text-xs text-slate-500 mb-1 block">Title</label><input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-xs text-slate-200" /></div>
            <div><label className="text-xs text-slate-500 mb-1 block">Body</label><input value={body} onChange={(e) => setBody(e.target.value)} className="w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-xs text-slate-200" /></div>
            <button onClick={() => setSilent(!silent)} className="w-full flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950/40 p-3"><div className="flex items-center gap-2">{silent ? <BellOff className="w-3.5 h-3.5 text-slate-500" /> : <Bell className="w-3.5 h-3.5 text-amber-400" />}<span className="text-xs text-slate-200">Silent (no sound)</span></div><span className={`text-xs ${silent ? 'text-emerald-400' : 'text-slate-600'}`}>{silent ? 'ON' : 'OFF'}</span></button>
            <button onClick={() => setVibrate(!vibrate)} className="w-full flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950/40 p-3"><div className="flex items-center gap-2"><Volume2 className="w-3.5 h-3.5 text-amber-400" /><span className="text-xs text-slate-200">Vibration pattern</span></div><span className={`text-xs ${vibrate ? 'text-emerald-400' : 'text-slate-600'}`}>{vibrate ? '[200, 100, 200]' : 'OFF'}</span></button>
            <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3">
              <h4 className="text-xs text-amber-400 font-medium mb-1">Actions</h4>
              <div className="flex gap-1.5"><span className="text-[10px] px-2 py-1 rounded-full bg-slate-800 text-slate-400">Reply</span><span className="text-[10px] px-2 py-1 rounded-full bg-slate-800 text-slate-400">Archive</span><span className="text-[10px] px-2 py-1 rounded-full bg-slate-800 text-slate-400">Mark Read</span></div>
            </div>
          </div>
          <div className="w-44 border-l border-slate-800 p-3 flex flex-col justify-center shrink-0">
            <div className="rounded-2xl bg-slate-800/80 p-3 shadow-xl"><div className="flex items-start gap-2"><div className="w-8 h-8 rounded-lg bg-amber-500/30 flex items-center justify-center shrink-0"><Smartphone className="w-4 h-4 text-amber-400" /></div><div><p className="text-xs font-semibold text-white">{title}</p><p className="text-[10px] text-slate-300">{body}</p></div></div><div className="flex gap-1 mt-2"><button className="flex-1 text-[9px] py-1 rounded bg-slate-700 text-white">Reply</button><button className="flex-1 text-[9px] py-1 rounded bg-slate-700 text-white">Dismiss</button></div></div>
            <p className="text-[9px] text-slate-500 text-center mt-2">Preview</p>
          </div>
        </div>
      </div>
    </div>
  );
}
