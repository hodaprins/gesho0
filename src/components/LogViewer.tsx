import { useState } from 'react';
import { Terminal, X, Search, ChevronDown, ChevronRight } from 'lucide-react';

interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'debug';
  source: string;
  message: string;
}

const LOGS: LogEntry[] = [
  { id: '1', timestamp: '2026-07-23 14:32:01', level: 'info', source: 'api', message: 'GET /api/users - 200 (12ms)' },
  { id: '2', timestamp: '2026-07-23 14:32:05', level: 'info', source: 'auth', message: 'User session validated: uid=a1b2c3' },
  { id: '3', timestamp: '2026-07-23 14:32:10', level: 'warn', source: 'cache', message: 'Cache miss for key: user_profile_a1b2c3' },
  { id: '4', timestamp: '2026-07-23 14:32:15', level: 'error', source: 'api', message: 'POST /api/orders - 500: Database connection timeout' },
  { id: '5', timestamp: '2026-07-23 14:32:18', level: 'debug', source: 'db', message: 'Query: SELECT * FROM orders WHERE user_id = $1' },
  { id: '6', timestamp: '2026-07-23 14:32:22', level: 'info', source: 'api', message: 'GET /api/products - 200 (8ms)' },
  { id: '7', timestamp: '2026-07-23 14:32:30', level: 'warn', source: 'auth', message: 'Rate limit warning: 80/100 requests for uid=d4e5f6' },
  { id: '8', timestamp: '2026-07-23 14:32:35', level: 'error', source: 'webhook', message: 'Webhook delivery failed: https://api.example.com/hooks/order (timeout)' },
  { id: '9', timestamp: '2026-07-23 14:32:40', level: 'info', source: 'deploy', message: 'Build completed successfully in 42s' },
  { id: '10', timestamp: '2026-07-23 14:32:45', level: 'debug', source: 'cache', message: 'Cache set: user_profile_a1b2c3 (TTL: 300s)' },
];

const LEVEL_COLORS: Record<string, string> = { info: 'text-cyan-400', warn: 'text-amber-400', error: 'text-red-400', debug: 'text-slate-500' };

interface LogViewerProps {
  open: boolean;
  onClose: () => void;
}

export default function LogViewer({ open, onClose }: LogViewerProps) {
  const [search, setSearch] = useState('');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [expanded, setExpanded] = useState<string | null>(null);
  if (!open) return null;

  const filtered = LOGS.filter((l) => (levelFilter === 'all' || l.level === levelFilter) && (l.message.toLowerCase().includes(search.toLowerCase()) || l.source.includes(search.toLowerCase())));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2"><Terminal className="w-5 h-5 text-cyan-400" /><h3 className="text-sm font-semibold text-slate-100">Log Viewer</h3><span className="text-xs text-slate-500">{filtered.length} entries</span></div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X className="w-5 h-5" /></button>
        </div>

        <div className="flex items-center gap-2 px-5 py-2 border-b border-slate-800">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search logs..." className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs text-slate-200 focus:outline-none" />
          </div>
          {['all', 'info', 'warn', 'error', 'debug'].map((l) => <button key={l} onClick={() => setLevelFilter(l)} className={`text-xs px-2 py-1 rounded-full capitalize ${levelFilter === l ? 'bg-slate-800 text-slate-100' : 'text-slate-500'}`}>{l}</button>)}
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin font-mono text-xs">
          {filtered.map((log) => (
            <div key={log.id} className="border-b border-slate-800/30">
              <button onClick={() => setExpanded(expanded === log.id ? null : log.id)} className="w-full flex items-center gap-2 px-4 py-1.5 hover:bg-slate-800/20 transition-colors text-left">
                {expanded === log.id ? <ChevronDown className="w-3 h-3 text-slate-600 shrink-0" /> : <ChevronRight className="w-3 h-3 text-slate-600 shrink-0" />}
                <span className="text-slate-600 shrink-0">{log.timestamp}</span>
                <span className={`shrink-0 uppercase font-bold w-10 ${LEVEL_COLORS[log.level]}`}>{log.level}</span>
                <span className="text-slate-500 shrink-0 w-16">[{log.source}]</span>
                <span className="text-slate-300 truncate">{log.message}</span>
              </button>
              {expanded === log.id && (
                <div className="px-8 py-2 bg-slate-950/40 text-slate-500">
                  <p>Full message: {log.message}</p>
                  <p>Source: {log.source}</p>
                  <p>Level: {log.level}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
