import { useState } from 'react';
import { Radio, X, ArrowUp, ArrowDown, ChevronRight, Code2 } from 'lucide-react';

interface WebSocketEventDesignerProps {
  open: boolean;
  onClose: () => void;
}

type Direction = 'client-to-server' | 'server-to-client';

interface WsEvent {
  name: string;
  direction: Direction;
  payload: { field: string; type: string }[];
}

const EVENTS: WsEvent[] = [
  { name: 'message.send', direction: 'client-to-server', payload: [
    { field: 'id', type: 'string' }, { field: 'text', type: 'string' }, { field: 'channelId', type: 'string' },
  ]},
  { name: 'message.new', direction: 'server-to-client', payload: [
    { field: 'id', type: 'string' }, { field: 'text', type: 'string' }, { field: 'author', type: 'User' }, { field: 'ts', type: 'number' },
  ]},
  { name: 'typing.start', direction: 'client-to-server', payload: [
    { field: 'channelId', type: 'string' }, { field: 'userId', type: 'string' },
  ]},
  { name: 'presence.update', direction: 'server-to-client', payload: [
    { field: 'userId', type: 'string' }, { field: 'status', type: "'online' | 'away' | 'offline'" },
  ]},
  { name: 'reaction.add', direction: 'client-to-server', payload: [
    { field: 'messageId', type: 'string' }, { field: 'emoji', type: 'string' },
  ]},
];

export default function WebSocketEventDesigner({ open, onClose }: WebSocketEventDesignerProps) {
  const [expanded, setExpanded] = useState<string | null>('message.new');
  if (!open) return null;
  const c2s = EVENTS.filter((e) => e.direction === 'client-to-server').length;
  const s2c = EVENTS.filter((e) => e.direction === 'server-to-client').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-semibold text-slate-100">WebSocket Event Designer</h3>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X className="w-5 h-5" /></button>
        </div>

        <div className="grid grid-cols-3 gap-2 px-5 py-3 border-b border-slate-800">
          <div className="rounded-lg bg-slate-800/50 p-2 text-center"><p className="text-lg font-bold text-slate-100">{EVENTS.length}</p><p className="text-[10px] text-slate-500">Events</p></div>
          <div className="rounded-lg bg-slate-800/50 p-2 text-center flex flex-col items-center"><ArrowUp className="w-3.5 h-3.5 text-cyan-400" /><p className="text-sm font-bold text-cyan-400">{c2s}</p><p className="text-[10px] text-slate-500">Client→Server</p></div>
          <div className="rounded-lg bg-slate-800/50 p-2 text-center flex flex-col items-center"><ArrowDown className="w-3.5 h-3.5 text-violet-400" /><p className="text-sm font-bold text-violet-400">{s2c}</p><p className="text-[10px] text-slate-500">Server→Client</p></div>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-2">
          {EVENTS.map((ev) => {
            const open = expanded === ev.name;
            const isC2S = ev.direction === 'client-to-server';
            return (
              <div key={ev.name} className="rounded-xl border border-slate-800 bg-slate-800/30 overflow-hidden">
                <button onClick={() => setExpanded(open ? null : ev.name)} className="w-full flex items-center justify-between p-3 hover:bg-slate-800/50 transition-colors">
                  <div className="flex items-center gap-2 min-w-0">
                    <ChevronRight className={`w-4 h-4 text-slate-500 shrink-0 transition-transform ${open ? 'rotate-90' : ''}`} />
                    {isC2S ? <ArrowUp className="w-3.5 h-3.5 text-cyan-400 shrink-0" /> : <ArrowDown className="w-3.5 h-3.5 text-violet-400 shrink-0" />}
                    <span className="text-xs font-mono font-medium text-slate-200 truncate">{ev.name}</span>
                  </div>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full shrink-0 ${isC2S ? 'bg-cyan-500/15 text-cyan-400' : 'bg-violet-500/15 text-violet-400'}`}>
                    {isC2S ? 'C→S' : 'S→C'}
                  </span>
                </button>
                {open && (
                  <div className="border-t border-slate-800 p-3 bg-slate-950/40">
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1"><Code2 className="w-3 h-3" />Payload schema</p>
                    <div className="space-y-1">
                      {ev.payload.map((p) => (
                        <div key={p.field} className="flex items-center justify-between rounded bg-slate-900/60 px-2 py-1">
                          <span className="text-[11px] font-mono text-slate-300">{p.field}</span>
                          <span className="text-[11px] font-mono text-amber-400">{p.type}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
