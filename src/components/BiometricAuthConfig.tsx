import { Fingerprint, X, ShieldCheck, ArrowRight } from 'lucide-react';
import { useState } from 'react';

export default function BiometricAuthConfig({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [title, setTitle] = useState('Verify Identity');
  const [subtitle, setSubtitle] = useState('Use your biometric to continue');
  const [fallback, setFallback] = useState(true);
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2"><Fingerprint className="w-5 h-5 text-cyan-400" /><h3 className="text-sm font-semibold text-slate-100">Biometric Auth Config</h3></div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X className="w-5 h-5" /></button>
        </div>
        <div className="flex flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-3">
            <div><label className="text-xs text-slate-500 mb-1 block">Prompt Title</label><input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-xs text-slate-200" /></div>
            <div><label className="text-xs text-slate-500 mb-1 block">Prompt Subtitle</label><input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} className="w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-xs text-slate-200" /></div>
            <button onClick={() => setFallback(!fallback)} className="w-full flex items-center justify-between rounded-lg p-2 hover:bg-slate-800/30"><span className="text-xs text-slate-200">Allow passcode fallback</span><span className={`text-xs ${fallback ? 'text-emerald-400' : 'text-slate-600'}`}>{fallback ? 'ON' : 'OFF'}</span></button>
            <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3">
              <h4 className="text-xs text-slate-500 uppercase tracking-wider mb-2">Auth Flow</h4>
              <div className="space-y-2">
                {[{ t: 'Check biometric availability', s: 'BiometricManager.canAuthenticate()' }, { t: 'Create BiometricPrompt', s: 'BiometricPrompt(activity, executor, callback)' }, { t: 'Build prompt info', s: 'PromptInfo.Builder().setTitle()' }, { t: 'Authenticate', s: 'biometricPrompt.authenticate(promptInfo)' }].map((step, i) => (
                  <div key={i} className="flex items-start gap-2"><span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-[10px] font-bold shrink-0">{i + 1}</span><div><p className="text-xs text-slate-300">{step.t}</p><code className="text-[10px] text-slate-500 font-mono">{step.s}</code></div></div>
                ))}
              </div>
            </div>
          </div>
          <div className="w-52 border-l border-slate-800 p-4 flex flex-col justify-center">
            <div className="rounded-2xl bg-slate-800/50 p-4 text-center space-y-3">
              <p className="text-xs font-semibold text-slate-200">{title}</p>
              <p className="text-[10px] text-slate-500">{subtitle}</p>
              <div className="w-16 h-16 rounded-full bg-cyan-500/20 flex items-center justify-center mx-auto"><Fingerprint className="w-8 h-8 text-cyan-400" /></div>
              <button className="w-full py-1.5 rounded-lg bg-cyan-500 text-white text-xs font-medium">Authenticate</button>
              {fallback && <button className="w-full py-1.5 rounded-lg bg-slate-700 text-slate-300 text-xs">Use Passcode</button>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
