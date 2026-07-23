import { useState } from 'react';
import { Webhook, X, Plus, Trash2, Copy, Check } from 'lucide-react';

interface Webhook {
  id: string;
  url: string;
  event: string;
  active: boolean;
  lastTriggered: string;
}

const INITIAL: Webhook[] = [
  { id: '1', url: 'https://api.example.com/hooks/order', event: 'order.created', active: true, lastTriggered: '2m ago' },
  { id: '2', url: 'https://api.example.com/hooks/user', event: 'user.signup', active: true, lastTriggered: '1h ago' },
  { id: '3', url: 'https://api.example.com/hooks/payment', event: 'payment.completed', active: false, lastTriggered: '3d ago' },
];

const EVENTS = ['order.created', 'user.signup', 'user.login', 'payment.completed', 'payment.failed', 'data.exported', 'app.deployed'];

interface WebhookManagerProps {
  open: boolean;
  onClose: () => void;
}

export default function WebhookManager({ open, onClose }: WebhookManagerProps) {
  const [hooks, setHooks] = useState<Webhook[]>(INITIAL);
  const [copied, setCopied] = useState(false);
  if (!open) return null;

  const toggle = (id: string) => setHooks((p) => p.map((h) => h.id === id ? { ...h, active: !h.active } : h));
  const remove = (id: string) => setHooks((p) => p.filter((h) => h.id !== id));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Webhook className="w-5 h-5 text-cyan-400" />
            <h3 className="text-sm font-semibold text-slate-100">Webhooks</h3>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X className="w-5 h-5" /></button>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-2">
          {hooks.map((hook) => (
            <div key={hook.id} className="group rounded-xl border border-slate-800 bg-slate-950/40 p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 font-mono">{hook.event}</span>
                <div className="flex items-center gap-1.5">
                  <button onClick={() => toggle(hook.id)} className={`relative w-8 h-4.5 rounded-full transition-colors ${hook.active ? 'bg-emerald-500' : 'bg-slate-700'}`} style={{ width: '32px', height: '18px' }}>
                    <span className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-transform ${hook.active ? 'translate-x-4' : 'translate-x-0.5'}`} />
                  </button>
                  <button onClick={() => remove(hook.id)} className="opacity-0 group-hover:opacity-100 text-slate-600 hover:text-red-400 transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <code className="flex-1 text-xs text-slate-400 font-mono truncate">{hook.url}</code>
                <button onClick={() => { navigator.clipboard.writeText(hook.url); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="text-slate-500 hover:text-slate-300">
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <p className="text-[10px] text-slate-600 mt-1">Last triggered: {hook.lastTriggered}</p>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 px-5 py-3 border-t border-slate-800">
          <button onClick={() => setHooks((p) => [...p, { id: crypto.randomUUID(), url: 'https://', event: EVENTS[0], active: true, lastTriggered: 'Never' }])}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-medium hover:bg-slate-700 transition-colors">
            <Plus className="w-3.5 h-3.5" /> Add webhook
          </button>
          <span className="text-xs text-slate-500">{hooks.filter(h => h.active).length} active</span>
        </div>
      </div>
    </div>
  );
}
