import { ScanFace, X, ShieldCheck, AlertTriangle } from 'lucide-react';
import { useState } from 'react';

export default function FaceIDConfig({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [fallback, setFallback] = useState(true);
  const [biometryOnly, setBiometryOnly] = useState(false);
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2"><ScanFace className="w-5 h-5 text-blue-400" /><h3 className="text-sm font-semibold text-slate-100">Face ID Configuration</h3></div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X className="w-5 h-5" /></button>
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-4">
          <div className="flex justify-center">
            <div className="w-32 h-32 rounded-2xl bg-slate-800/50 flex items-center justify-center"><ScanFace className="w-16 h-16 text-blue-400" /></div>
          </div>
          <div className="space-y-2">
            <button onClick={() => setFallback(!fallback)} className="w-full flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950/40 p-3"><div><p className="text-xs text-slate-200">Passcode Fallback</p><p className="text-[10px] text-slate-500">Allow device passcode if Face ID unavailable</p></div><span className={`text-xs font-medium ${fallback ? 'text-emerald-400' : 'text-slate-600'}`}>{fallback ? 'ON' : 'OFF'}</span></button>
            <button onClick={() => setBiometryOnly(!biometryOnly)} className="w-full flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950/40 p-3"><div><p className="text-xs text-slate-200">Biometry Only</p><p className="text-[10px] text-slate-500">Reject passcode fallback entirely</p></div><span className={`text-xs font-medium ${biometryOnly ? 'text-emerald-400' : 'text-slate-600'}`}>{biometryOnly ? 'ON' : 'OFF'}</span></button>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3">
            <h4 className="text-xs text-blue-400 font-medium mb-2">Auth Flow</h4>
            <div className="space-y-1.5">
              {[{ t: 'Check availability', c: 'LAContext.canEvaluatePolicy(.deviceOwnerAuthentication)' }, { t: 'Evaluate policy', c: 'evaluatePolicy(.deviceOwnerAuthenticationWithBiometrics)' }, { t: 'Handle result', c: 'success → unlock | failure → fallback' }].map((s, i) => <div key={i} className="flex items-start gap-2"><span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-[10px] font-bold shrink-0">{i + 1}</span><div><p className="text-xs text-slate-300">{s.t}</p><code className="text-[10px] text-slate-500 font-mono">{s.c}</code></div></div>)}
            </div>
          </div>
          <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 flex items-center gap-2"><AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" /><p className="text-[10px] text-slate-400">PrivateCredentialUsage entitlement required for Face ID.</p></div>
        </div>
      </div>
    </div>
  );
}
