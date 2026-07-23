import { useState, useMemo } from 'react';
import { Database, X, Search, RefreshCw, Play } from 'lucide-react';

interface DataExplorerProps {
  open: boolean;
  onClose: () => void;
}

const TABLES = ['users', 'orders', 'products', 'sessions', 'analytics_events'];
const SAMPLE_DATA: Record<string, Record<string, string>[]> = {
  users: [
    { id: 'a1b2c3', email: 'john@example.com', name: 'John Doe', created_at: '2026-07-22 10:00' },
    { id: 'd4e5f6', email: 'jane@example.com', name: 'Jane Smith', created_at: '2026-07-22 11:30' },
    { id: 'g7h8i9', email: 'bob@example.com', name: 'Bob Wilson', created_at: '2026-07-21 14:20' },
    { id: 'j0k1l2', email: 'alice@example.com', name: 'Alice Brown', created_at: '2026-07-20 09:15' },
  ],
  orders: [
    { id: 'ord-001', user_id: 'a1b2c3', total: '$99.99', status: 'completed', created_at: '2026-07-22 12:00' },
    { id: 'ord-002', user_id: 'd4e5f6', total: '$45.50', status: 'pending', created_at: '2026-07-22 13:00' },
    { id: 'ord-003', user_id: 'g7h8i9', total: '$120.00', status: 'completed', created_at: '2026-07-21 16:00' },
  ],
  products: [
    { id: 'prod-1', name: 'Wireless Headphones', price: '$99.99', stock: '42' },
    { id: 'prod-2', name: 'Phone Case', price: '$24.99', stock: '120' },
    { id: 'prod-3', name: 'USB Cable', price: '$12.99', stock: '300' },
  ],
  sessions: [
    { id: 'sess-1', user_id: 'a1b2c3', device: 'iOS', duration: '5m 30s', created_at: '2026-07-22 10:00' },
    { id: 'sess-2', user_id: 'd4e5f6', device: 'Android', duration: '12m 15s', created_at: '2026-07-22 11:30' },
  ],
  analytics_events: [
    { id: 'evt-1', event: 'screen_view', screen: 'Home', user_id: 'a1b2c3', timestamp: '2026-07-22 10:01' },
    { id: 'evt-2', event: 'button_tap', screen: 'Settings', user_id: 'a1b2c3', timestamp: '2026-07-22 10:05' },
    { id: 'evt-3', event: 'screen_view', screen: 'Profile', user_id: 'd4e5f6', timestamp: '2026-07-22 11:35' },
  ],
};

export default function DataExplorer({ open, onClose }: DataExplorerProps) {
  const [table, setTable] = useState('users');
  const [query, setQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const data = useMemo(() => {
    const rows = SAMPLE_DATA[table] ?? [];
    if (!query.trim()) return rows;
    return rows.filter((r) => Object.values(r).some((v) => v.toLowerCase().includes(query.toLowerCase())));
  }, [table, query]);

  if (!open) return null;

  const columns = data[0] ? Object.keys(data[0]) : [];

  const refresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-3xl rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-cyan-400" />
            <h3 className="text-sm font-semibold text-slate-100">Data Explorer</h3>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X className="w-5 h-5" /></button>
        </div>

        <div className="flex items-center gap-2 px-5 py-3 border-b border-slate-800">
          <div className="flex items-center gap-1">
            {TABLES.map((t) => (
              <button key={t} onClick={() => { setTable(t); setQuery(''); }} className={`text-xs px-2.5 py-1.5 rounded-lg font-mono transition-colors ${table === t ? 'bg-slate-800 text-cyan-400' : 'text-slate-500 hover:text-slate-300'}`}>{t}</button>
            ))}
          </div>
          <div className="flex-1" />
          <button onClick={refresh} className="text-slate-400 hover:text-slate-200"><RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} /></button>
        </div>

        <div className="px-5 py-2 border-b border-slate-800">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Filter rows..." className="w-full pl-8 pr-4 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none" />
          </div>
        </div>

        <div className="flex-1 overflow-auto scrollbar-thin">
          {data.length === 0 ? (
            <div className="text-center py-12 text-sm text-slate-500">No rows found</div>
          ) : (
            <table className="w-full text-xs">
              <thead className="sticky top-0 bg-slate-900 z-10">
                <tr className="border-b border-slate-800">
                  {columns.map((col) => <th key={col} className="text-left px-3 py-2 text-slate-500 font-mono font-medium">{col}</th>)}
                </tr>
              </thead>
              <tbody>
                {data.map((row, i) => (
                  <tr key={i} className="border-b border-slate-800/50 hover:bg-slate-800/20">
                    {columns.map((col) => <td key={col} className="px-3 py-2 text-slate-300 font-mono">{row[col]}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="flex items-center justify-between px-5 py-2 border-t border-slate-800">
          <span className="text-xs text-slate-500">{data.length} rows</span>
          <div className="flex items-center gap-2">
            <code className="text-[10px] text-slate-600 font-mono">SELECT * FROM {table}{query ? ` WHERE ...` : ''}</code>
            <button className="inline-flex items-center gap-1 px-2 py-1 rounded bg-slate-800 text-slate-400 text-[10px] hover:bg-slate-700"><Play className="w-2.5 h-2.5" />Run</button>
          </div>
        </div>
      </div>
    </div>
  );
}
