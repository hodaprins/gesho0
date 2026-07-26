import { Cloud, X, MapPin } from 'lucide-react';
import { useState } from 'react';

const SERVICES = [
  { id: 'auth', name: 'Cognito Auth', desc: 'User pools & identity pools' },
  { id: 'api', name: 'AppSync API', desc: 'GraphQL managed API' },
  { id: 'storage', name: 'S3 Storage', desc: 'File storage with CDN' },
  { id: 'functions', name: 'Lambda Functions', desc: 'Serverless compute' },
  { id: 'analytics', name: 'Pinpoint Analytics', desc: 'User analytics' },
  { id: 'push', name: 'Pinpoint Push', desc: 'Push notifications' },
];

const REGIONS = ['us-east-1', 'us-west-2', 'eu-west-1', 'ap-southeast-1', 'ap-northeast-1'];

export default function AWSAmplifySetup({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [region, setRegion] = useState('us-east-1');
  const [enabled, setEnabled] = useState<Record<string, boolean>>({ auth: true, api: true, storage: true, functions: false, analytics: false, push: false });
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2"><Cloud className="w-5 h-5 text-orange-400" /><h3 className="text-sm font-semibold text-slate-100">AWS Amplify Setup</h3></div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X className="w-5 h-5" /></button>
        </div>
        <div className="px-5 py-2 border-b border-slate-800">
          <div className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-slate-500" /><select value={region} onChange={(e) => setRegion(e.target.value)} className="rounded-lg bg-slate-800 border border-slate-700 px-2 py-1 text-xs text-slate-200">{REGIONS.map(r => <option key={r}>{r}</option>)}</select></div>
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-2">
          {SERVICES.map(s => (
            <button key={s.id} onClick={() => setEnabled(p => ({ ...p, [s.id]: !p[s.id] }))} className="w-full flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/40 p-3">
              <div><p className="text-sm text-slate-200">{s.name}</p><p className="text-[10px] text-slate-500">{s.desc}</p></div>
              <div className={`w-10 h-5 rounded-full p-0.5 transition-colors ${enabled[s.id] ? 'bg-orange-500' : 'bg-slate-700'}`}><div className={`w-4 h-4 rounded-full bg-white transition-transform ${enabled[s.id] ? 'translate-x-5' : ''}`} /></div>
            </button>
          ))}
          <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3 mt-3"><h4 className="text-xs text-orange-400 font-medium mb-1">amplify init</h4><pre className="text-[10px] font-mono text-slate-300 whitespace-pre-wrap">{`? Enter a name: myapp\n? Initialize: amplify-js\n? Region: ${region}\n? Authentication: ${enabled.auth ? 'enabled' : 'disabled'}\n? API: ${enabled.api ? 'GraphQL' : 'disabled'}`}</pre></div>
        </div>
      </div>
    </div>
  );
}
