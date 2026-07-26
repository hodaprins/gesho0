import { Shield, X, ToggleLeft, ToggleRight } from 'lucide-react';
import { useState } from 'react';

export default function R8ProGuardConfig({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [obfuscate, setObfuscate] = useState(true);
  const [optimize, setOptimize] = useState(true);
  const [shrink, setShrink] = useState(true);
  if (!open) return null;

  const rules = `-allowaccessmodification\n-repackageclasses ''\n\n${obfuscate ? '-obfuscationdictionary obf.txt\n' : ''}${optimize ? '-optimization 5\n' : ''}${shrink ? '-keep class com.app.models.** { *; }\n-keepclassmembers enum * { public static **[] values(); }\n' : ''}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2"><Shield className="w-5 h-5 text-red-400" /><h3 className="text-sm font-semibold text-slate-100">R8 / ProGuard Config</h3></div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X className="w-5 h-5" /></button>
        </div>
        <div className="px-5 py-3 border-b border-slate-800 space-y-2">
          {[
            { label: 'Code Obfuscation', val: obfuscate, set: setObfuscate, desc: 'Rename classes/methods to obscure logic' },
            { label: 'Optimization', val: optimize, set: setOptimize, desc: 'Optimize bytecode for smaller/faster output' },
            { label: 'Resource Shrinking', val: shrink, set: setShrink, desc: 'Remove unused resources from APK' },
          ].map((o) => (
            <button key={o.label} onClick={() => o.set(!o.val)} className="w-full flex items-center justify-between rounded-lg p-2 hover:bg-slate-800/30">
              <div className="text-left"><p className="text-xs text-slate-200">{o.label}</p><p className="text-[10px] text-slate-500">{o.desc}</p></div>
              {o.val ? <ToggleRight className="w-6 h-6 text-emerald-400" /> : <ToggleLeft className="w-6 h-6 text-slate-600" />}
            </button>
          ))}
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-thin p-4">
          <p className="text-xs text-slate-500 mb-2">Generated proguard-rules.pro:</p>
          <pre className="text-xs font-mono text-emerald-400 bg-slate-950/50 rounded-lg p-3 overflow-auto whitespace-pre-wrap">{rules}</pre>
          <div className="mt-3 grid grid-cols-3 gap-2">
            <div className="rounded-lg bg-slate-800/50 p-2 text-center"><p className="text-sm font-bold text-emerald-400">{shrink ? '-34%' : '0%'}</p><p className="text-[10px] text-slate-500">Size Reduction</p></div>
            <div className="rounded-lg bg-slate-800/50 p-2 text-center"><p className="text-sm font-bold text-slate-200">{obfuscate ? 'Yes' : 'No'}</p><p className="text-[10px] text-slate-500">Obfuscated</p></div>
            <div className="rounded-lg bg-slate-800/50 p-2 text-center"><p className="text-sm font-bold text-slate-200">{optimize ? 'Level 5' : 'Off'}</p><p className="text-[10px] text-slate-500">Opt Level</p></div>
          </div>
        </div>
      </div>
    </div>
  );
}
