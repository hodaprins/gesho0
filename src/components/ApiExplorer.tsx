import { useState } from 'react';
import { Code2, X, Copy, Check, Lock } from 'lucide-react';
import { generateApiEndpoints } from '@/lib/analytics';

interface ApiExplorerProps {
  open: boolean;
  onClose: () => void;
  appType: string;
  screenCount: number;
}

const METHOD_COLORS: Record<string, string> = {
  GET: 'text-emerald-400 bg-emerald-500/10',
  POST: 'text-cyan-400 bg-cyan-500/10',
  PUT: 'text-amber-400 bg-amber-500/10',
  DELETE: 'text-red-400 bg-red-500/10',
};

export default function ApiExplorer({ open, onClose, appType, screenCount }: ApiExplorerProps) {
  const [selected, setSelected] = useState(0);
  const [copied, setCopied] = useState(false);

  if (!open) return null;

  const endpoints = generateApiEndpoints(appType, screenCount);
  const current = endpoints[selected];

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-3xl rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Code2 className="w-5 h-5 text-cyan-400" />
            <h3 className="text-sm font-semibold text-slate-100">API Explorer</h3>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          <div className="w-56 border-r border-slate-800 overflow-y-auto scrollbar-thin py-2">
            {endpoints.map((ep, i) => (
              <button
                key={i}
                onClick={() => setSelected(i)}
                className={`w-full text-left px-3 py-2 text-xs transition-colors flex items-center gap-2 ${
                  i === selected ? 'bg-slate-800 text-slate-100' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/30'
                }`}
              >
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${METHOD_COLORS[ep.method] ?? ''}`}>
                  {ep.method}
                </span>
                <span className="truncate font-mono">{ep.path.split('/').pop()}</span>
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto scrollbar-thin p-5 space-y-4">
            <div className="flex items-center gap-2">
              <span className={`text-xs font-bold px-2 py-1 rounded ${METHOD_COLORS[current.method] ?? ''}`}>
                {current.method}
              </span>
              <code className="text-sm text-slate-200 font-mono flex-1">{current.path}</code>
              <button onClick={() => handleCopy(current.path)} className="text-slate-500 hover:text-slate-300">
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500">Authentication:</span>
              {current.auth ? (
                <span className="flex items-center gap-1 text-amber-400">
                  <Lock className="w-3 h-3" /> Required (Bearer token)
                </span>
              ) : (
                <span className="text-emerald-400">Public endpoint</span>
              )}
            </div>

            <p className="text-sm text-slate-400">{current.description}</p>

            <div>
              <h4 className="text-xs text-slate-500 uppercase tracking-wider mb-2">Example Request</h4>
              <div className="rounded-xl bg-[#0d1117] border border-slate-800 p-4 overflow-auto scrollbar-thin">
                <pre className="text-xs font-mono text-slate-300 leading-relaxed">
{`fetch('${current.path}', {
  method: '${current.method}',
  headers: {
    'Content-Type': 'application/json',${current.auth ? `\n    'Authorization': 'Bearer <token>',` : ''}
  },${current.method !== 'GET' && current.method !== 'DELETE' ? `\n  body: JSON.stringify({\n    // your data here\n  }),` : ''}
})`}
                </pre>
              </div>
            </div>

            <div>
              <h4 className="text-xs text-slate-500 uppercase tracking-wider mb-2">Example Response</h4>
              <div className="rounded-xl bg-[#0d1117] border border-slate-800 p-4 overflow-auto scrollbar-thin">
                <pre className="text-xs font-mono text-slate-300 leading-relaxed">
{`{
  "status": "success",
  "data": {
    "id": "uuid-here",
    "created_at": "2026-07-22T12:00:00Z"
  },
  "error": null
}`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
