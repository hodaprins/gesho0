import { Network, X, ArrowRight, Copy, Check } from 'lucide-react';
import { useState } from 'react';

const STREAMING = [
  { id: 'unary', name: 'Unary', desc: 'Single request → single response' },
  { id: 'server', name: 'Server Streaming', desc: 'One request → stream of responses' },
  { id: 'client', name: 'Client Streaming', desc: 'Stream of requests → one response' },
  { id: 'bidi', name: 'Bidirectional', desc: 'Stream both directions simultaneously' },
];

export default function gRPCServiceBuilder({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [streamType, setStreamType] = useState('unary');
  const [copied, setCopied] = useState(false);
  if (!open) return null;

  const proto = `syntax = "proto3";\n\npackage app.v1;\n\nservice UserService {\n  rpc GetUser(GetUserRequest) returns (User);\n  rpc StreamUsers(StreamRequest) returns (stream User);\n}\n\nmessage User {\n  string id = 1;\n  string name = 2;\n  string email = 3;\n}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2"><Network className="w-5 h-5 text-blue-400" /><h3 className="text-sm font-semibold text-slate-100">gRPC Service Builder</h3></div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X className="w-5 h-5" /></button>
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-4">
          <div><h4 className="text-xs text-slate-500 uppercase tracking-wider mb-2">Streaming Type</h4><div className="grid grid-cols-2 gap-2">{STREAMING.map(s => <button key={s.id} onClick={() => setStreamType(s.id)} className={`rounded-xl border p-3 text-left transition-colors ${streamType === s.id ? 'border-blue-500/30 bg-blue-500/5' : 'border-slate-800 bg-slate-950/40'}`}><p className="text-xs text-slate-200">{s.name}</p><p className="text-[10px] text-slate-500">{s.desc}</p></button>)}</div></div>
          <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3">
            <div className="flex items-center justify-between mb-2"><h4 className="text-xs text-blue-400 font-medium">Proto File</h4><button onClick={() => { navigator.clipboard?.writeText(proto); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="text-xs text-slate-400 flex items-center gap-1">{copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />} Copy</button></div>
            <pre className="text-[10px] font-mono text-blue-400 whitespace-pre-wrap">{proto}</pre>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3"><h4 className="text-xs text-blue-400 font-medium mb-1">Generated Stub</h4><div className="flex items-center gap-2 text-[10px] text-slate-400"><span className="text-slate-300">UserServiceClient</span><ArrowRight className="w-3 h-3" /><code className="font-mono text-blue-400">.getUser(req)</code></div></div>
        </div>
      </div>
    </div>
  );
}
