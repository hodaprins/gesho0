import { useState } from 'react';
import { Zap, X, Webhook, CalendarClock, Globe, ArrowRight, Code2 } from 'lucide-react';

interface EdgeFunctionVisualBuilderProps {
  open: boolean;
  onClose: () => void;
}

type TriggerType = 'http' | 'cron' | 'webhook';

interface FlowNode {
  icon: typeof Zap;
  label: string;
  sub: string;
  color: string;
}

const TRIGGERS: { id: TriggerType; label: string; icon: typeof Zap; color: string }[] = [
  { id: 'http', label: 'HTTP', icon: Globe, color: 'text-cyan-400 border-cyan-500/40' },
  { id: 'cron', label: 'Cron', icon: CalendarClock, color: 'text-amber-400 border-amber-500/40' },
  { id: 'webhook', label: 'Webhook', icon: Webhook, color: 'text-violet-400 border-violet-500/40' },
];

const FLOW: FlowNode[] = [
  { icon: Globe, label: 'Trigger', sub: 'Incoming request', color: 'text-cyan-400' },
  { icon: Code2, label: 'Handler', sub: 'Deno runtime', color: 'text-emerald-400' },
  { icon: Zap, label: 'Response', sub: 'Edge JSON', color: 'text-amber-400' },
];

const CODE_PREVIEW: Record<TriggerType, string> = {
  http: `Deno.serve(async (req) => {\n  const data = await req.json();\n  return new Response(JSON.stringify(data));\n});`,
  cron: `Deno.cron("sync", "*/15 * * * *", async () => {\n  await syncDatabase();\n});`,
  webhook: `Deno.serve(async (req) => {\n  const event = await req.json();\n  await processWebhook(event);\n  return new Response("ok");\n});`,
};

export default function EdgeFunctionVisualBuilder({ open, onClose }: EdgeFunctionVisualBuilderProps) {
  const [trigger, setTrigger] = useState<TriggerType>('http');
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-semibold text-slate-100">Edge Function Visual Builder</h3>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X className="w-5 h-5" /></button>
        </div>

        <div className="px-5 py-4 border-b border-slate-800">
          <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-2">Trigger type</p>
          <div className="grid grid-cols-3 gap-2">
            {TRIGGERS.map((t) => (
              <button key={t.id} onClick={() => setTrigger(t.id)}
                className={`rounded-xl border bg-slate-800/40 p-3 flex flex-col items-center gap-1 transition-all ${t.color} ${trigger === t.id ? 'ring-2 ring-cyan-500/30' : 'hover:border-slate-600'}`}>
                <t.icon className="w-5 h-5" />
                <span className="text-xs font-semibold text-slate-200">{t.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="px-5 py-4 border-b border-slate-800">
          <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-3">Flow</p>
          <div className="flex items-center gap-2">
            {FLOW.map((node, i) => (
              <div key={node.label} className="flex items-center gap-2 flex-1">
                <div className="flex-1 rounded-xl border border-slate-800 bg-slate-800/40 p-3 text-center">
                  <node.icon className={`w-5 h-5 mx-auto mb-1 ${node.color}`} />
                  <p className="text-xs font-semibold text-slate-200">{node.label}</p>
                  <p className="text-[10px] text-slate-500">{node.sub}</p>
                </div>
                {i < FLOW.length - 1 && <ArrowRight className="w-4 h-4 text-slate-600 shrink-0" />}
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-3">
          <div className="rounded-xl border border-slate-800 bg-slate-800/30 p-3">
            <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-2">Input schema</p>
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded bg-slate-900/60 px-2 py-1.5"><span className="text-[11px] font-mono text-slate-300">userId</span><span className="text-[11px] font-mono text-amber-400 ml-2">string</span></div>
              <div className="rounded bg-slate-900/60 px-2 py-1.5"><span className="text-[11px] font-mono text-slate-300">action</span><span className="text-[11px] font-mono text-amber-400 ml-2">enum</span></div>
            </div>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-800/30 p-3">
            <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-2">Output schema</p>
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded bg-slate-900/60 px-2 py-1.5"><span className="text-[11px] font-mono text-slate-300">success</span><span className="text-[11px] font-mono text-emerald-400 ml-2">boolean</span></div>
              <div className="rounded bg-slate-900/60 px-2 py-1.5"><span className="text-[11px] font-mono text-slate-300">data</span><span className="text-[11px] font-mono text-cyan-400 ml-2">object</span></div>
            </div>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-3 overflow-x-auto">
            <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-2">Code preview</p>
            <pre className="text-[11px] font-mono text-slate-300 leading-relaxed whitespace-pre">{CODE_PREVIEW[trigger]}</pre>
          </div>
        </div>
      </div>
    </div>
  );
}
