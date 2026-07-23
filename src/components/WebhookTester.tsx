import { useState } from 'react';
import { Webhook, X, Send, Check, AlertTriangle, Loader2 } from 'lucide-react';

interface WebhookTesterProps {
  open: boolean;
  onClose: () => void;
}

export default function WebhookTester({ open, onClose }: WebhookTesterProps) {
  const [url, setUrl] = useState('https://api.example.com/hooks/order');
  const [method, setMethod] = useState('POST');
  const [body, setBody] = useState('{\n  "event": "order.created",\n  "data": {\n    "id": "ord-001",\n    "total": 99.99\n  }\n}');
  const [response, setResponse] = useState<{ status: number; body: string; time: number } | null>(null);
  const [sending, setSending] = useState(false);
  if (!open) return null;

  const send = () => {
    setSending(true);
    setResponse(null);
    setTimeout(() => {
      setResponse({ status: 200, body: '{\n  "success": true,\n  "message": "Webhook received",\n  "event_id": "evt_8a3f9c2d"\n}', time: 142 });
      setSending(false);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2"><Webhook className="w-5 h-5 text-cyan-400" /><h3 className="text-sm font-semibold text-slate-100">Webhook Tester</h3></div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X className="w-5 h-5" /></button>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-3">
          <div className="flex items-center gap-2">
            <select value={method} onChange={(e) => setMethod(e.target.value)} className="rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-xs text-slate-200 focus:outline-none font-mono">
              {['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].map((m) => <option key={m}>{m}</option>)}
            </select>
            <input value={url} onChange={(e) => setUrl(e.target.value)} className="flex-1 rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none" />
            <button onClick={send} disabled={sending} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-900 text-xs font-semibold disabled:opacity-40">{sending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />} Send</button>
          </div>

          <div>
            <label className="text-xs text-slate-500 mb-1 block">Request Body</label>
            <textarea value={body} onChange={(e) => setBody(e.target.value)} spellCheck={false} className="w-full h-32 rounded-lg bg-[#0d1117] border border-slate-800 px-3 py-2 text-xs font-mono text-slate-300 resize-none focus:outline-none scrollbar-thin" />
          </div>

          {response && (
            <div>
              <div className="flex items-center gap-2 mb-1">
                <label className="text-xs text-slate-500">Response</label>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${response.status >= 200 && response.status < 300 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>{response.status}</span>
                <span className="text-[10px] text-slate-600 font-mono">{response.time}ms</span>
                {response.status >= 200 && response.status < 300 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <AlertTriangle className="w-3.5 h-3.5 text-red-400" />}
              </div>
              <pre className="rounded-lg bg-[#0d1117] border border-slate-800 p-3 text-xs font-mono text-slate-300 overflow-auto scrollbar-thin">{response.body}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
