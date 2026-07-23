import { Settings2, X, Save, RotateCcw } from 'lucide-react';
import { useState } from 'react';

interface AppConfigEditorProps {
  open: boolean;
  onClose: () => void;
  appName: string;
}

export default function AppConfigEditor({ open, onClose, appName }: AppConfigEditorProps) {
  const [config, setConfig] = useState(`{
  "app": {
    "name": "${appName}",
    "version": "1.0.0",
    "minApiVersion": "1.0.0"
  },
  "features": {
    "darkMode": true,
    "analytics": true,
    "pushNotifications": false,
    "offlineMode": true
  },
  "network": {
    "apiBaseUrl": "https://api.appforge.dev",
    "timeout": 30000,
    "retryAttempts": 3
  },
  "cache": {
    "defaultTtl": 300,
    "maxEntries": 1000
  },
  "auth": {
    "sessionTimeout": 3600,
    "refreshTokenEnabled": true
  }
}`);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-fade-in-up max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2"><Settings2 className="w-5 h-5 text-cyan-400" /><h3 className="text-sm font-semibold text-slate-100">App Config</h3></div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X className="w-5 h-5" /></button>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin p-4">
          <textarea value={config} onChange={(e) => setConfig(e.target.value)} spellCheck={false} className="w-full h-96 rounded-xl bg-[#0d1117] border border-slate-800 px-4 py-3 text-xs font-mono text-slate-300 leading-relaxed resize-none focus:outline-none focus:border-cyan-500 scrollbar-thin" />
        </div>

        <div className="flex items-center gap-2 px-5 py-3 border-t border-slate-800">
          <button className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-900 text-xs font-semibold"><Save className="w-3.5 h-3.5" /> Save config</button>
          <button className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-medium hover:bg-slate-700"><RotateCcw className="w-3.5 h-3.5" /> Reset</button>
          <span className="text-xs text-emerald-400 ml-auto">Valid JSON</span>
        </div>
      </div>
    </div>
  );
}
