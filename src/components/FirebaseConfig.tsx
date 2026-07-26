import { Flame, X, ToggleLeft, ToggleRight, Copy, Check } from 'lucide-react';
import { useState } from 'react';

const SERVICES = [
  { id: 'auth', name: 'Authentication', desc: 'Email, phone, social login' },
  { id: 'firestore', name: 'Firestore', desc: 'Real-time NoSQL database' },
  { id: 'storage', name: 'Storage', desc: 'File uploads & CDN' },
  { id: 'functions', name: 'Cloud Functions', desc: 'Serverless backend' },
  { id: 'messaging', name: 'FCM Messaging', desc: 'Push notifications' },
  { id: 'analytics', name: 'Analytics', desc: 'User behavior tracking' },
];

export default function FirebaseConfig({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [enabled, setEnabled] = useState<Record<string, boolean>>({ auth: true, firestore: true, storage: false, functions: true, messaging: false, analytics: true });
  const [copied, setCopied] = useState(false);
  if (!open) return null;

  const config = `const firebaseConfig = {\n  apiKey: "AIzaXXX...",\n  authDomain: "app.firebaseapp.com",\n  projectId: "app",\n  storageBucket: "app.appspot.com",\n  messagingSenderId: "123456789",\n  appId: "1:123:web:abc"\n};`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2"><Flame className="w-5 h-5 text-orange-400" /><h3 className="text-sm font-semibold text-slate-100">Firebase Configuration</h3></div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X className="w-5 h-5" /></button>
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-2">
          {SERVICES.map(s => (
            <button key={s.id} onClick={() => setEnabled(p => ({ ...p, [s.id]: !p[s.id] }))} className="w-full flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/40 p-3">
              <div><p className="text-sm text-slate-200">{s.name}</p><p className="text-[10px] text-slate-500">{s.desc}</p></div>
              {enabled[s.id] ? <ToggleRight className="w-6 h-6 text-orange-400" /> : <ToggleLeft className="w-6 h-6 text-slate-600" />}
            </button>
          ))}
          <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3 mt-3">
            <div className="flex items-center justify-between mb-2"><h4 className="text-xs text-orange-400 font-medium">Config Snippet</h4><button onClick={() => { navigator.clipboard?.writeText(config); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="text-xs text-slate-400 flex items-center gap-1">{copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />} Copy</button></div>
            <pre className="text-[10px] font-mono text-slate-300 whitespace-pre-wrap">{config}</pre>
          </div>
          <div className="grid grid-cols-3 gap-2 pt-2"><div className="rounded-lg bg-slate-800/50 p-2 text-center"><p className="text-sm font-bold text-orange-400">{Object.values(enabled).filter(Boolean).length}</p><p className="text-[10px] text-slate-500">Services</p></div><div className="rounded-lg bg-slate-800/50 p-2 text-center"><p className="text-sm font-bold text-slate-200">v12</p><p className="text-[10px] text-slate-500">SDK</p></div><div className="rounded-lg bg-slate-800/50 p-2 text-center"><p className="text-sm font-bold text-emerald-400">Free</p><p className="text-[10px] text-slate-500">Tier</p></div></div>
        </div>
      </div>
    </div>
  );
}
